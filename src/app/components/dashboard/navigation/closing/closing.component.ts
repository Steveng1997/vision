import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormControl, FormGroup } from '@angular/forms'
import Swal from 'sweetalert2'
import { ActivatedRoute, Router } from '@angular/router'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'

// Servicios
import { Service } from 'src/app/core/services/service'
import { ServiceManager } from 'src/app/core/services/manager'
import { ServiceClosing } from 'src/app/core/services/closing'
import { ServiceLiquidationTherapist } from 'src/app/core/services/therapistCloseouts'
import { ServiceLiquidationManager } from 'src/app/core/services/managerCloseouts'

// Model
import { ModelService } from 'src/app/core/models/service'
import { ModelClosing } from 'src/app/core/models/closing'

import moment from 'moment'

@Component({
  selector: 'app-closing',
  templateUrl: './closing.component.html',
  styleUrls: ['./closing.component.css']
})
export class ClosingComponent implements OnInit {

  dates: boolean = false
  loading: boolean = false
  deleteButton: boolean = false
  validationFilters: boolean = true
  CurrenDate = ""
  idSettled: number
  closingForm: boolean
  addForm: boolean
  editClosing: boolean
  filterByName: string
  filterByNumber: number
  filtredBusqueda: string
  unliquidatedService: any
  unliquidatedServiceByDistinct: any
  unliquidatedServiceByLiquidationTherapist: any
  close: any
  settledData: any
  settledDataServiceByDistinct: any
  settledDataServiceByLiquidationTherapist: any
  page!: number
  managerTitle = ""
  idCierre: string
  idLiquidation: any

  selected: boolean
  idUser: number

  currentDate = new Date().getTime()

  // Encargada
  manager: any
  administratorRole: boolean = false

  // Fecha
  fechaInicio: string
  fechaFinal: string

  // Operations

  totalCashPayment: number
  totalBizumPayment: number
  totalCardPayment: number
  totalTransactionPayment: number

  textTotalCashPayment: string
  textTotalBizumPayment: string
  textTotalCardPayment: string
  textTotalTransactionPayment: string

  totalCashIncome: number
  totalBizumIncome: number
  totalCardIncome: number
  totalTransactionIncome: number

  textTotalCashIncome: string
  textTotalBizumIncome: string
  textTotalCardIncome: string
  textTotalTransactionIncome: string

  totalsBoxCash: number
  totalsBoxBizum: number
  totalsBoxCard: number
  totalsBoxTransaction: number

  textTotalsBoxCash: string
  textTotalsBoxBizum: string
  textTotalsBoxCard: string
  textTotalsBoxTransaction: string

  totalPayment: number
  totalIncome: number
  totalBox: number

  textTotalIncome: string
  textTotalPayment: string
  textTotalBox: string

  closing: ModelClosing = {
    bizum: 0,
    createdDate: "",
    currentDate: "",
    efectivo: 0,
    encargada: "",
    desdeFecha: "",
    hastaFecha: "",
    desdeHora: "",
    hastaHora: new Date().toTimeString().substring(0, 5),
    id: 0,
    idUnico: "",
    idCierre: "",
    tarjeta: 0,
    total: 0,
    transaccion: 0,
    tratamiento: 0
  }

  services: ModelService = {
    idCierre: "",
  }

  formTemplate = new FormGroup({
    fechaInicio: new FormControl(''),
    FechaFin: new FormControl(''),
    terapeuta: new FormControl(''),
    encargada: new FormControl(''),
    busqueda: new FormControl(''),
  })

  constructor(
    public router: Router,
    public fb: FormBuilder,
    private activeRoute: ActivatedRoute,
    private modalService: NgbModal,
    public service: Service,
    public serviceManager: ServiceManager,
    public serviceClosing: ServiceClosing,
    public serviceLiquidationManager: ServiceLiquidationManager,
    public serviceLiquidationTherapist: ServiceLiquidationTherapist
  ) { }

  async ngOnInit(): Promise<void> {
    this.closingForm = true
    this.addForm = false
    this.selected = false
    this.editClosing = false
    this.dates = false
    this.deleteButton = false
    this.loading = true

    const params = this.activeRoute.snapshot['_urlSegment'].segments[1];
    this.idUser = Number(params.path)

    this.date()

    if (this.idUser) {
      this.validitingUser()
    }
  }

  async consultClosingByAdministrator() {
    this.serviceClosing.getAllCierre().subscribe(async (rp: any) => {
      this.close = rp

      this.closingForm = true
      this.validationFilters = true
      this.addForm = false
      this.editClosing = false
      this.selected = false
      this.dates = false
      this.closing.encargada = ""
    })
  }

  async consultClosingByManager() {
    this.serviceClosing.getByEncargada(this.closing.encargada).subscribe(async (rp) => {
      this.close = rp

      this.closingForm = true
      this.validationFilters = true
      this.addForm = false
      this.editClosing = false
      this.selected = false
      this.dates = false
      this.closing.encargada = ""
    })
  }

  async validitingUser() {
    this.serviceManager.getById(this.idUser).subscribe(async (rp) => {
      if (rp[0]['rol'] == 'administrador') {
        this.administratorRole = true
        this.loading = false
        this.GetAllManagers()
        this.getAllClosing()
      } else {
        this.manager = rp
        this.loading = false
        this.administratorRole = false
        this.closing.encargada = this.manager[0].nombre
        this.getClosing()
      }
    })
  }

  modalFiltres(modal) {
    this.modalService.open(modal, {
      centered: true,
      backdrop: 'static',
    })
  }

  date() {
    let date = new Date(), day = 0, month = 0, year = 0, convertMonth = '', convertDay = ''

    day = date.getDate()
    month = date.getMonth() + 1
    year = date.getFullYear()

    if (month > 0 && month < 10) {
      convertMonth = '0' + month
      this.CurrenDate = `${year}-${convertMonth}-${day}`
    } else {
      this.CurrenDate = `${year}-${month}-${day}`
    }

    if (day > 0 && day < 10) {
      convertDay = '0' + day
      this.CurrenDate = `${year}-${convertMonth}-${convertDay}`
    } else {
      this.CurrenDate = `${year}-${convertMonth}-${day}`
    }
  }

  convertToZero() {
    this.totalCashPayment = 0
    this.totalBizumPayment = 0
    this.totalCardPayment = 0
    this.totalTransactionPayment = 0
    this.totalCashIncome = 0
    this.totalBizumIncome = 0
    this.totalCardIncome = 0
    this.totalTransactionIncome = 0
    this.totalPayment = 0
    this.totalIncome = 0
    this.totalsBoxCash = 0
    this.totalsBoxBizum = 0
    this.totalsBoxCard = 0
    this.totalsBoxTransaction = 0
    this.totalBox = 0
  }

  validateNullData(arr2) {
    if (arr2.totalService == undefined) arr2.totalService = 0
    if (arr2.liquidation == undefined) arr2.liquidation = 0
    if (arr2.cashPayment == undefined) arr2.cashPayment = 0
    if (arr2.bizumPayment == undefined) arr2.bizumPayment = 0
    if (arr2.cardPayment == undefined) arr2.cardPayment = 0
    if (arr2.transactionPayment == undefined) arr2.transactionPayment = 0
    if (arr2.cashIncome == undefined) arr2.cashIncome = 0
    if (arr2.bizumIncome == undefined) arr2.bizumIncome = 0
    if (arr2.cardIncome == undefined) arr2.cardIncome = 0
    if (arr2.transactionIncome == undefined) arr2.transactionIncome = 0
  }

  filters() {
    this.filtredBusqueda = this.formTemplate.value.busqueda.replace(/(^\w{1})|(\s+\w{1})/g, letra => letra.toUpperCase())

    if (this.formTemplate.value.fechaInicio != "") {
      let fecha = ''
      fecha = this.formTemplate.value.fechaInicio
      this.fechaInicio = fecha
    }

    if (this.formTemplate.value.FechaFin != "") {
      let fechaFin = ''
      fechaFin = this.formTemplate.value.FechaFin
      this.fechaFinal = fechaFin
    }

    const managerCondition = serv => {
      return (this.closing.encargada) ? serv.encargada === this.closing.encargada : true
    }

    const conditionBetweenDates = serv => {
      if (this.fechaInicio === undefined && this.fechaFinal === undefined) return true
      if (this.fechaInicio === undefined && serv.fechaHoyInicio <= this.fechaFinal) return true
      if (this.fechaFinal === undefined && serv.fechaHoyInicio === this.fechaInicio) return true
      if (serv.fechaHoyInicio >= this.fechaInicio && serv.fechaHoyInicio <= this.fechaFinal) return true

      return false
    }

    const searchCondition = serv => {
      if (!this.filtredBusqueda) return true
      const criterio = this.filtredBusqueda
      return (serv.terapeuta.match(criterio)
        || serv.encargada.match(criterio)
        || serv.formaPago.match(criterio)
        || serv.fecha.match(criterio)
        || serv.cliente.match(criterio)) ? true : false
    }

    if (this.closing.encargada != "" ||
      this.formTemplate.value.fechaInicio || this.formTemplate.value.FechaFin != "") {
      this.idLiquidation = this.close.filter(serv => managerCondition(serv) &&
        searchCondition(serv) && conditionBetweenDates(serv))
    }
  }

  async OK() {
    this.modalService.dismissAll()

    await this.serviceManager.getById(this.idUser).subscribe(async (rp) => {
      if (rp[0]['rol'] == 'administrador') {
        if (this.closing.encargada != "" ||
          this.formTemplate.value.fechaInicio || this.formTemplate.value.FechaFin != "") {
          this.deleteButton = true
        } else {
          this.deleteButton = false
        }
      } else {
        this.deleteButton = false
      }
    })
  }

  getThoseThatNotLiquidated() {
    this.service.getByLiquidTerapFalse().subscribe((datoServicio) => {
      this.unliquidatedService = datoServicio
      return true
    })
    return false
  }

  async getClosing() {
    this.serviceClosing.getByEncargada(this.closing.encargada).subscribe(async (rp) => {
      this.close = rp
    })
  }

  async GetAllManagers() {
    this.serviceManager.getUsuarios().subscribe(async (datosEncargada: any) => {
      this.manager = datosEncargada
    })
  }

  async getAllClosing() {
    this.serviceClosing.getAllCierre().subscribe(async (datosEncargada: any) => {
      this.close = datosEncargada
    })
  }

  insertForm() {
    this.validationFilters = false

    if (this.administratorRole == true) {
      this.closing.encargada = ""
    } else {
      this.calculateServices()
    }

    this.closing.encargada = ""
    this.closingForm = false
    this.editClosing = false
    this.selected = false
    this.dates = false
    this.addForm = true
  }

  async dateExists() {
    let fromMonth = '', fromDay = '', fromYear = '', convertMonth = '', convertDay = '',
      untilMonth = 0, untilDay = 0, untilYear = 0, currentDate = new Date()

    await this.serviceClosing.getByEncargada(this.closing.encargada).subscribe(async (rp: any) => {
      if (rp.length > 0) {

        fromDay = rp[0]['hastaFecha'].substring(0, 2)
        fromMonth = rp[0]['hastaFecha'].substring(3, 5)
        fromYear = rp[0]['hastaFecha'].substring(6, 8)

        this.closing.desdeFecha = `${'20' + fromYear}-${fromMonth}-${fromDay}`
        this.closing.desdeHora = rp[0]['hastaHora']
        await this.inputDateAndTime()
      } else {
        await this.dateDoesNotExist()
      }
    })

    untilDay = currentDate.getDate()
    untilMonth = currentDate.getMonth() + 1
    untilYear = currentDate.getFullYear()

    if (untilMonth > 0 && untilMonth < 10) {
      convertMonth = '0' + untilMonth
      this.closing.hastaFecha = `${untilYear}-${convertMonth}-${untilDay}`
    } else {
      convertMonth = untilMonth.toString()
      this.closing.hastaFecha = `${untilYear}-${convertMonth}-${untilDay}`
    }

    if (untilDay > 0 && untilDay < 10) {
      convertDay = '0' + untilDay
      this.closing.hastaFecha = `${untilYear}-${convertMonth}-${convertDay}`
    } else {
      this.closing.hastaFecha = `${untilYear}-${convertMonth}-${untilDay}`
    }
  }

  async calculateServices() {

    if (this.closing.encargada != "") {
      this.loading = true
      this.getThoseThatNotLiquidated()

      this.service.getManagerClosing(this.closing.encargada).subscribe(async (resp: any) => {
        if (resp.length > 0) {

          this.selected = false
          this.dates = false
          await this.dateExists()

        } else {
          this.selected = false
          this.dates = false
          this.loading = false

          Swal.fire({
            icon: 'error', title: 'Oops...', text: 'No existe ningun servicio para liquidar', showConfirmButton: false, timer: 2500
          })
        }
      })
    }
    else {
      this.selected = false
      this.dates = false
    }
  }

  async inputDateAndTime() {
    let arr2
    this.service.getWithDistinctByManagerFechaHoraInicioFechaHoraFinClosing(this.closing.encargada, this.closing.desdeHora, this.closing.hastaHora, this.closing.desdeFecha, this.closing.hastaFecha).subscribe(async (rp: any) => {

      if (rp.length > 0) {
        this.unliquidatedService = rp

        this.service.getByManagerFechaHoraInicioFechaHoraFinClosing(this.closing.encargada, this.closing.desdeHora, this.closing.hastaHora,
          this.closing.desdeFecha, this.closing.hastaFecha).subscribe(async (rp: any) => {
            this.unliquidatedServiceByDistinct = rp

            this.serviceLiquidationTherapist.getByManagerFechaHoraInicioFechaHoraFinLiquidationTherapist(this.closing.encargada, this.closing.desdeHora, this.closing.hastaHora,
              this.closing.desdeFecha, this.closing.hastaFecha).subscribe(async (rp: any) => {

                this.unliquidatedServiceByLiquidationTherapist = rp

                for (let o = 0; o < this.unliquidatedService.length; o++) {
                  const servicios = this.unliquidatedServiceByDistinct.filter(therapist => therapist.terapeuta == this.unliquidatedService[o].terapeuta)
                  const totalServices = servicios.reduce((accumulator, serv) => {
                    return accumulator + serv.totalServicio
                  }, 0)

                  arr2 = [].concat(this.unliquidatedService);

                  if (rp[o].formaPago == "Efectivo") {
                    arr2[o].cashPayment = rp[o].importe
                    arr2[o].cashIncome = totalServices
                  }

                  if (rp[o].formaPago == "Bizum") {
                    arr2[o].bizumPayment = rp[o].importe
                    arr2[o].bizumIncome = totalServices
                  }

                  if (rp[o].formaPago == "Tarjeta") {
                    arr2[o].cardPayment = rp[o].importe
                    arr2[o].cardIncome = totalServices
                  }

                  if (rp[o].formaPago == "Trans") {
                    arr2[o].transactionPayment = rp[o].importe
                    arr2[o].transactionIncome = totalServices
                  }

                  arr2[o].totalService = totalServices
                  arr2[o].liquidation = rp[o].importe
                  arr2[o].payment = rp[o].formaPago
                  arr2[o].sinceDate = rp[o].desdeFechaLiquidado
                  arr2[o].sinceTime = rp[o].desdeHoraLiquidado
                  arr2[o].toDate = rp[o].hastaFechaLiquidado
                  arr2[o].untilTime = rp[o].hastaHoraLiquidado
                  arr2[o].treatment = rp[o].tratamiento

                  this.validateNullData(arr2[o])

                  arr2.push({
                    totalService: totalServices, liquidation: rp[o].importe, payment: rp[o].formaPago, sinceDate: rp[o].desdeFechaLiquidado, sinceTime: rp[o].desdeHoraLiquidado, toDate: rp[o].hastaFechaLiquidado, untilTime: rp[o].hastaHoraLiquidado, treatment: rp[o].tratamiento, cashPayment: rp[o].importe, bizumPayment: rp[o].importe, cardPayment: rp[o].importe, transactionPayment: rp[o].importe, cashIncome: totalServices, bizumIncome: totalServices, cardIncome: totalServices, transactionIncome: totalServices
                  })
                }

                arr2.pop();

                // Payment

                const totalCashPayment = arr2.map(({ cashPayment }) => cashPayment).reduce((acc, value) => acc + value, 0)
                this.totalCashPayment = totalCashPayment

                const totalBizumPayment = arr2.map(({ bizumPayment }) => bizumPayment).reduce((acc, value) => acc + value, 0)
                this.totalBizumPayment = totalBizumPayment

                const totalCardPayment = arr2.map(({ cardPayment }) => cardPayment).reduce((acc, value) => acc + value, 0)
                this.totalCardPayment = totalCardPayment

                const totalTransactionPayment = arr2.map(({ transactionPayment }) => transactionPayment).reduce((acc, value) => acc + value, 0)
                this.totalTransactionPayment = totalTransactionPayment

                this.totalPayment = totalCashPayment + totalBizumPayment + totalCardPayment + totalTransactionPayment

                // Income 

                const totalCashIncome = arr2.map(({ cashIncome }) => cashIncome).reduce((acc, value) => acc + value, 0)
                this.totalCashIncome = totalCashIncome

                const totalBizumIncome = arr2.map(({ bizumIncome }) => bizumIncome).reduce((acc, value) => acc + value, 0)
                this.totalBizumIncome = totalBizumIncome

                const totalCardIncome = arr2.map(({ cardIncome }) => cardIncome).reduce((acc, value) => acc + value, 0)
                this.totalCardIncome = totalCardIncome

                const totalTransactionIncome = arr2.map(({ transactionIncome }) => transactionIncome).reduce((acc, value) => acc + value, 0)
                this.totalTransactionIncome = totalTransactionIncome

                this.totalIncome = totalCashIncome + totalBizumIncome + totalCardIncome + totalTransactionIncome

                // Box

                this.totalsBoxCash = totalCashIncome - totalCashPayment
                this.totalsBoxBizum = totalBizumIncome - totalBizumPayment
                this.totalsBoxCard = totalCardIncome - totalCardPayment
                this.totalsBoxTransaction = totalTransactionIncome - totalTransactionPayment
                this.totalBox = this.totalsBoxCash + this.totalsBoxBizum + this.totalsBoxCard + this.totalsBoxTransaction
                this.closing.total = this.totalBox
                this.closing.efectivo = this.totalsBoxCash
                this.closing.bizum = this.totalsBoxBizum
                this.closing.tarjeta = this.totalsBoxCard
                this.closing.transaccion = this.totalsBoxTransaction

                this.thousandPoint()
                this.loading = false
                this.selected = true
                this.dates = true
              })
          })

        return true
      } else {
        this.unliquidatedService = rp
        this.loading = false
        this.dates = true

        Swal.fire({
          icon: 'error', title: 'Oops...', text: 'No hay ningun servicio con la fecha seleccionada', showConfirmButton: false, timer: 2500
        })

        return false
      }
    })
    return false
  }

  async dateDoesNotExist() {
    let año = "", mes = "", dia = ""

    await this.service.getEncargadaFechaAsc(this.closing.encargada).subscribe(async (rp) => {
      año = rp[0]['fechaHoyInicio'].substring(0, 4)
      mes = rp[0]['fechaHoyInicio'].substring(5, 7)
      dia = rp[0]['fechaHoyInicio'].substring(8, 10)
      this.closing.desdeFecha = `${año}-${mes}-${dia}`
      this.closing.desdeHora = rp[0]['horaStart']
      await this.inputDateAndTime()
    })
  }

  thousandPoint() {
    if (this.totalCashPayment > 999) {

      const coma = this.totalCashPayment.toString().indexOf(".") !== -1 ? true : false;
      const array = coma ? this.totalCashPayment.toString().split(".") : this.totalCashPayment.toString().split("");
      let integer = coma ? array[0].split("") : array;
      let subIndex = 1;

      for (let i = integer.length - 1; i >= 0; i--) {

        if (integer[i] !== "." && subIndex % 3 === 0 && i != 0) {

          integer.splice(i, 0, ".");
          subIndex++;

        } else {
          subIndex++;
        }
      }

      integer = [integer.toString().replace(/,/gi, "")]
      this.textTotalCashPayment = integer[0].toString()
    } else {
      this.textTotalCashPayment = this.totalCashPayment.toString()
    }

    if (this.totalBizumPayment > 999) {

      const coma = this.totalBizumPayment.toString().indexOf(".") !== -1 ? true : false;
      const array = coma ? this.totalBizumPayment.toString().split(".") : this.totalBizumPayment.toString().split("");
      let integer = coma ? array[0].split("") : array;
      let subIndex = 1;

      for (let i = integer.length - 1; i >= 0; i--) {

        if (integer[i] !== "." && subIndex % 3 === 0 && i != 0) {

          integer.splice(i, 0, ".");
          subIndex++;

        } else {
          subIndex++;
        }
      }

      integer = [integer.toString().replace(/,/gi, "")]
      this.textTotalBizumPayment = integer[0].toString()
    } else {
      this.textTotalBizumPayment = this.totalBizumPayment.toString()
    }

    if (this.totalCardPayment > 999) {

      const coma = this.totalCardPayment.toString().indexOf(".") !== -1 ? true : false;
      const array = coma ? this.totalCardPayment.toString().split(".") : this.totalCardPayment.toString().split("");
      let integer = coma ? array[0].split("") : array;
      let subIndex = 1;

      for (let i = integer.length - 1; i >= 0; i--) {

        if (integer[i] !== "." && subIndex % 3 === 0 && i != 0) {

          integer.splice(i, 0, ".");
          subIndex++;

        } else {
          subIndex++;
        }
      }

      integer = [integer.toString().replace(/,/gi, "")]
      this.textTotalCardPayment = integer[0].toString()
    } else {
      this.textTotalCardPayment = this.totalCardPayment.toString()
    }

    if (this.totalTransactionPayment > 999) {

      const coma = this.totalTransactionPayment.toString().indexOf(".") !== -1 ? true : false;
      const array = coma ? this.totalTransactionPayment.toString().split(".") : this.totalTransactionPayment.toString().split("");
      let integer = coma ? array[0].split("") : array;
      let subIndex = 1;

      for (let i = integer.length - 1; i >= 0; i--) {

        if (integer[i] !== "." && subIndex % 3 === 0 && i != 0) {

          integer.splice(i, 0, ".");
          subIndex++;

        } else {
          subIndex++;
        }
      }

      integer = [integer.toString().replace(/,/gi, "")]
      this.textTotalTransactionPayment = integer[0].toString()
    } else {
      this.textTotalTransactionPayment = this.totalTransactionPayment.toString()
    }

    if (this.totalCashIncome > 999) {

      const coma = this.totalCashIncome.toString().indexOf(".") !== -1 ? true : false;
      const array = coma ? this.totalCashIncome.toString().split(".") : this.totalCashIncome.toString().split("");
      let integer = coma ? array[0].split("") : array;
      let subIndex = 1;

      for (let i = integer.length - 1; i >= 0; i--) {

        if (integer[i] !== "." && subIndex % 3 === 0 && i != 0) {

          integer.splice(i, 0, ".");
          subIndex++;

        } else {
          subIndex++;
        }
      }

      integer = [integer.toString().replace(/,/gi, "")]
      this.textTotalCashIncome = integer[0].toString()
    } else {
      this.textTotalCashIncome = this.totalCashIncome.toString()
    }

    if (this.totalBizumIncome > 999) {

      const coma = this.totalBizumIncome.toString().indexOf(".") !== -1 ? true : false;
      const array = coma ? this.totalBizumIncome.toString().split(".") : this.totalBizumIncome.toString().split("");
      let integer = coma ? array[0].split("") : array;
      let subIndex = 1;

      for (let i = integer.length - 1; i >= 0; i--) {

        if (integer[i] !== "." && subIndex % 3 === 0 && i != 0) {

          integer.splice(i, 0, ".");
          subIndex++;

        } else {
          subIndex++;
        }
      }

      integer = [integer.toString().replace(/,/gi, "")]
      this.textTotalBizumIncome = integer[0].toString()
    } else {
      this.textTotalBizumIncome = this.totalBizumIncome.toString()
    }

    if (this.totalCardIncome > 999) {

      const coma = this.totalCardIncome.toString().indexOf(".") !== -1 ? true : false;
      const array = coma ? this.totalCardIncome.toString().split(".") : this.totalCardIncome.toString().split("");
      let integer = coma ? array[0].split("") : array;
      let subIndex = 1;

      for (let i = integer.length - 1; i >= 0; i--) {

        if (integer[i] !== "." && subIndex % 3 === 0 && i != 0) {

          integer.splice(i, 0, ".");
          subIndex++;

        } else {
          subIndex++;
        }
      }

      integer = [integer.toString().replace(/,/gi, "")]
      this.textTotalCardIncome = integer[0].toString()
    } else {
      this.textTotalCardIncome = this.totalCardIncome.toString()
    }

    if (this.totalTransactionIncome > 999) {

      const coma = this.totalTransactionIncome.toString().indexOf(".") !== -1 ? true : false;
      const array = coma ? this.totalTransactionIncome.toString().split(".") : this.totalTransactionIncome.toString().split("");
      let integer = coma ? array[0].split("") : array;
      let subIndex = 1;

      for (let i = integer.length - 1; i >= 0; i--) {

        if (integer[i] !== "." && subIndex % 3 === 0 && i != 0) {

          integer.splice(i, 0, ".");
          subIndex++;

        } else {
          subIndex++;
        }
      }

      integer = [integer.toString().replace(/,/gi, "")]
      this.textTotalTransactionIncome = integer[0].toString()
    } else {
      this.textTotalTransactionIncome = this.totalTransactionIncome.toString()
    }

    if (this.totalPayment > 999) {

      const coma = this.totalPayment.toString().indexOf(".") !== -1 ? true : false;
      const array = coma ? this.totalPayment.toString().split(".") : this.totalPayment.toString().split("");
      let integer = coma ? array[0].split("") : array;
      let subIndex = 1;

      for (let i = integer.length - 1; i >= 0; i--) {

        if (integer[i] !== "." && subIndex % 3 === 0 && i != 0) {

          integer.splice(i, 0, ".");
          subIndex++;

        } else {
          subIndex++;
        }
      }

      integer = [integer.toString().replace(/,/gi, "")]
      this.textTotalPayment = integer[0].toString()
    } else {
      this.textTotalPayment = this.totalPayment.toString()
    }

    if (this.totalIncome > 999) {

      const coma = this.totalIncome.toString().indexOf(".") !== -1 ? true : false;
      const array = coma ? this.totalIncome.toString().split(".") : this.totalIncome.toString().split("");
      let integer = coma ? array[0].split("") : array;
      let subIndex = 1;

      for (let i = integer.length - 1; i >= 0; i--) {

        if (integer[i] !== "." && subIndex % 3 === 0 && i != 0) {

          integer.splice(i, 0, ".");
          subIndex++;

        } else {
          subIndex++;
        }
      }

      integer = [integer.toString().replace(/,/gi, "")]
      this.textTotalIncome = integer[0].toString()
    } else {
      this.textTotalIncome = this.totalIncome.toString()
    }

    if (this.totalsBoxCash > 999) {

      const coma = this.totalsBoxCash.toString().indexOf(".") !== -1 ? true : false;
      const array = coma ? this.totalsBoxCash.toString().split(".") : this.totalsBoxCash.toString().split("");
      let integer = coma ? array[0].split("") : array;
      let subIndex = 1;

      for (let i = integer.length - 1; i >= 0; i--) {

        if (integer[i] !== "." && subIndex % 3 === 0 && i != 0) {

          integer.splice(i, 0, ".");
          subIndex++;

        } else {
          subIndex++;
        }
      }

      integer = [integer.toString().replace(/,/gi, "")]
      this.textTotalsBoxCash = integer[0].toString()
    } else {
      this.textTotalsBoxCash = this.totalsBoxCash.toString()
    }

    if (this.totalsBoxBizum > 999) {

      const coma = this.totalsBoxBizum.toString().indexOf(".") !== -1 ? true : false;
      const array = coma ? this.totalsBoxBizum.toString().split(".") : this.totalsBoxBizum.toString().split("");
      let integer = coma ? array[0].split("") : array;
      let subIndex = 1;

      for (let i = integer.length - 1; i >= 0; i--) {

        if (integer[i] !== "." && subIndex % 3 === 0 && i != 0) {

          integer.splice(i, 0, ".");
          subIndex++;

        } else {
          subIndex++;
        }
      }

      integer = [integer.toString().replace(/,/gi, "")]
      this.textTotalsBoxBizum = integer[0].toString()
    } else {
      this.textTotalsBoxBizum = this.totalsBoxBizum.toString()
    }

    if (this.totalsBoxCard > 999) {

      const coma = this.totalsBoxCard.toString().indexOf(".") !== -1 ? true : false;
      const array = coma ? this.totalsBoxCard.toString().split(".") : this.totalsBoxCard.toString().split("");
      let integer = coma ? array[0].split("") : array;
      let subIndex = 1;

      for (let i = integer.length - 1; i >= 0; i--) {

        if (integer[i] !== "." && subIndex % 3 === 0 && i != 0) {

          integer.splice(i, 0, ".");
          subIndex++;

        } else {
          subIndex++;
        }
      }

      integer = [integer.toString().replace(/,/gi, "")]
      this.textTotalsBoxCard = integer[0].toString()
    } else {
      this.textTotalsBoxCard = this.totalsBoxCard.toString()
    }

    if (this.totalsBoxTransaction > 999) {

      const coma = this.totalsBoxTransaction.toString().indexOf(".") !== -1 ? true : false;
      const array = coma ? this.totalsBoxTransaction.toString().split(".") : this.totalsBoxTransaction.toString().split("");
      let integer = coma ? array[0].split("") : array;
      let subIndex = 1;

      for (let i = integer.length - 1; i >= 0; i--) {

        if (integer[i] !== "." && subIndex % 3 === 0 && i != 0) {

          integer.splice(i, 0, ".");
          subIndex++;

        } else {
          subIndex++;
        }
      }

      integer = [integer.toString().replace(/,/gi, "")]
      this.textTotalsBoxTransaction = integer[0].toString()
    } else {
      this.textTotalsBoxTransaction = this.totalsBoxTransaction.toString()
    }

    if (this.totalBox > 999) {

      const coma = this.totalBox.toString().indexOf(".") !== -1 ? true : false;
      const array = coma ? this.totalBox.toString().split(".") : this.totalBox.toString().split("");
      let integer = coma ? array[0].split("") : array;
      let subIndex = 1;

      for (let i = integer.length - 1; i >= 0; i--) {

        if (integer[i] !== "." && subIndex % 3 === 0 && i != 0) {

          integer.splice(i, 0, ".");
          subIndex++;

        } else {
          subIndex++;
        }
      }

      integer = [integer.toString().replace(/,/gi, "")]
      this.textTotalBox = integer[0].toString()
    } else {
      this.textTotalBox = this.totalBox.toString()
    }
  }

  arrowLine1() {
    document.querySelector('.column').scrollLeft += 30;
    document.getElementById('arrowLine1').style.display = 'none'
  }

  arrowTable3Add() {
    document.querySelector('.column3').scrollLeft += 30;
    document.getElementById('arrowTable3Add').style.display = 'none'
  }

  // Edit

  goToEdit(id: number) {
    const params = this.activeRoute.snapshot['_urlSegment'].segments[1];
    this.idUser = Number(params.path)

    this.service.getById(id).subscribe((rp: any) => {
      if (rp.length > 0) this.router.navigate([`menu/${this.idUser}/nuevo-servicio/${rp[0]['id']}/true`])
    })
  }

  async dataFormEdit(idCierre: string, id: number) {
    let sinceDay = '', sinceMonth = '', sinceYear = '', untilDay = '', untilMonth = '', untilYear = ''

    this.loading = true
    this.validationFilters = false
    this.closingForm = false
    this.idSettled = id
    this.idCierre = idCierre

    this.serviceClosing.getIdCierre(idCierre).subscribe(async (rp) => {

      sinceDay = rp[0]['desdeFecha'].substring(0, 2)
      sinceMonth = rp[0]['desdeFecha'].substring(3, 5)
      sinceYear = rp[0]['desdeFecha'].substring(6, 8)
      this.closing.desdeFecha = `${'20' + sinceYear}-${sinceMonth}-${sinceDay}`

      untilDay = rp[0]['hastaFecha'].substring(0, 2)
      untilMonth = rp[0]['hastaFecha'].substring(3, 5)
      untilYear = rp[0]['hastaFecha'].substring(6, 8)
      this.closing.hastaFecha = `${'20' + untilYear}-${untilMonth}-${untilDay}`

      this.closing.desdeHora = rp[0]['desdeHora']
      this.closing.hastaHora = rp[0]['hastaHora']

      await this.sumTotal(idCierre)
    })
  }

  async sumTotal(idCierre: string) {
    let arr2
    this.service.getByIdCierreDistinct(idCierre).subscribe(async (rp: any) => {
      if (rp.length > 0) {
        this.settledData = rp;

        this.service.getByCierre(idCierre).subscribe(async (rp: any) => {
          this.settledDataServiceByDistinct = rp
          this.closing.encargada = rp[0]?.encargada

          this.serviceLiquidationTherapist.getByManagerFechaHoraInicioFechaHoraFinLiquidationTherapist(this.closing.encargada, this.closing.desdeHora, this.closing.hastaHora,
            this.closing.desdeFecha, this.closing.hastaFecha).subscribe(async (rp: any) => {

              this.settledDataServiceByLiquidationTherapist = rp

              for (let o = 0; o < this.settledData.length; o++) {
                const servicios = this.settledDataServiceByDistinct.filter(therapist => therapist.terapeuta == this.settledData[o].terapeuta)
                const totalServices = servicios.reduce((accumulator, serv) => {
                  return accumulator + serv.totalServicio
                }, 0)

                arr2 = [].concat(this.settledData);

                if (rp[o].formaPago == "Efectivo") {
                  arr2[o].cashPayment = rp[o].importe
                  arr2[o].cashIncome = totalServices
                }

                if (rp[o].formaPago == "Bizum") {
                  arr2[o].bizumPayment = rp[o].importe
                  arr2[o].bizumIncome = totalServices
                }

                if (rp[o].formaPago == "Tarjeta") {
                  arr2[o].cardPayment = rp[o].importe
                  arr2[o].cardIncome = totalServices
                }

                if (rp[o].formaPago == "Trans") {
                  arr2[o].transactionPayment = rp[o].importe
                  arr2[o].transactionIncome = totalServices
                }

                arr2[o].totalService = totalServices
                arr2[o].liquidation = rp[o].importe
                arr2[o].payment = rp[o].formaPago
                arr2[o].sinceDate = rp[o].desdeFechaLiquidado
                arr2[o].sinceTime = rp[o].desdeHoraLiquidado
                arr2[o].toDate = rp[o].hastaFechaLiquidado
                arr2[o].untilTime = rp[o].hastaHoraLiquidado
                arr2[o].treatment = rp[o].tratamiento

                this.validateNullData(arr2[o])

                arr2.push({
                  totalService: totalServices, liquidation: rp[o].importe, payment: rp[o].formaPago, sinceDate: rp[o].desdeFechaLiquidado, sinceTime: rp[o].desdeHoraLiquidado, toDate: rp[o].hastaFechaLiquidado, untilTime: rp[o].hastaHoraLiquidado, treatment: rp[o].tratamiento, cashPayment: rp[o].importe, bizumPayment: rp[o].importe, cardPayment: rp[o].importe, transactionPayment: rp[o].importe, cashIncome: totalServices, bizumIncome: totalServices, cardIncome: totalServices, transactionIncome: totalServices
                })
              }

              arr2.pop();

              // Payment

              const totalCashPayment = arr2.map(({ cashPayment }) => cashPayment).reduce((acc, value) => acc + value, 0)
              this.totalCashPayment = totalCashPayment

              const totalBizumPayment = arr2.map(({ bizumPayment }) => bizumPayment).reduce((acc, value) => acc + value, 0)
              this.totalBizumPayment = totalBizumPayment

              const totalCardPayment = arr2.map(({ cardPayment }) => cardPayment).reduce((acc, value) => acc + value, 0)
              this.totalCardPayment = totalCardPayment

              const totalTransactionPayment = arr2.map(({ transactionPayment }) => transactionPayment).reduce((acc, value) => acc + value, 0)
              this.totalTransactionPayment = totalTransactionPayment

              this.totalPayment = totalCashPayment + totalBizumPayment + totalCardPayment + totalTransactionPayment

              // Income 

              const totalCashIncome = arr2.map(({ cashIncome }) => cashIncome).reduce((acc, value) => acc + value, 0)
              this.totalCashIncome = totalCashIncome

              const totalBizumIncome = arr2.map(({ bizumIncome }) => bizumIncome).reduce((acc, value) => acc + value, 0)
              this.totalBizumIncome = totalBizumIncome

              const totalCardIncome = arr2.map(({ cardIncome }) => cardIncome).reduce((acc, value) => acc + value, 0)
              this.totalCardIncome = totalCardIncome

              const totalTransactionIncome = arr2.map(({ transactionIncome }) => transactionIncome).reduce((acc, value) => acc + value, 0)
              this.totalTransactionIncome = totalTransactionIncome

              this.totalIncome = totalCashIncome + totalBizumIncome + totalCardIncome + totalTransactionIncome

              // Box

              this.totalsBoxCash = totalCashIncome - totalCashPayment
              this.totalsBoxBizum = totalBizumIncome - totalBizumPayment
              this.totalsBoxCard = totalCardIncome - totalCardPayment
              this.totalsBoxTransaction = totalTransactionIncome - totalTransactionPayment
              this.totalBox = this.totalsBoxCash + this.totalsBoxBizum + this.totalsBoxCard + this.totalsBoxTransaction
              this.closing.total = this.totalBox
              this.closing.efectivo = this.totalsBoxCash
              this.closing.bizum = this.totalsBoxBizum
              this.closing.tarjeta = this.totalsBoxCard
              this.closing.transaccion = this.totalsBoxTransaction

              this.thousandPoint()
              this.loading = false
              this.selected = false
              this.dates = false
              this.editClosing = true
            })
        })

      } else {
        await this.serviceLiquidationManager.getIdEncarg(idCierre).subscribe(async (rp: any) => {
          this.managerTitle = rp[0]['encargada']
          this.convertToZero()
          this.loading = false
          this.closingForm = false
          this.editClosing = true
        })
      }
    })
  }

  formatDate() {
    let fromDay = '', fromMonth = '', fromYear = '', untilDay = '', untilMonth = '', untilYear = ''

    // From 

    fromDay = this.closing.desdeFecha.substring(8, 10)
    fromMonth = this.closing.desdeFecha.substring(5, 7)
    fromYear = this.closing.desdeFecha.substring(2, 4)

    this.closing.desdeFecha = `${fromDay}-${fromMonth}-${fromYear}`

    // Until

    untilDay = this.closing.hastaFecha.substring(8, 10)
    untilMonth = this.closing.hastaFecha.substring(5, 7)
    untilYear = this.closing.hastaFecha.substring(2, 4)

    this.closing.hastaFecha = `${untilDay}-${untilMonth}-${untilYear}`
  }

  async delete() {
    Swal.fire({
      title: '¿Deseas eliminar el registro?',
      text: "Una vez eliminados ya no se podrán recuperar",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Deseo eliminar!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.services.idCierre = ""
        this.services.cierre = false
        this.service.updateClosingByIdClosing(this.idCierre, this.services).subscribe(async (rp) => {
          this.serviceClosing.deleteClosing(this.idSettled).subscribe(async (rp) => {
            if (this.administratorRole == true) {
              await this.consultClosingByAdministrator()
            }
            else {
              await this.consultClosingByManager()
            }
          })
        })
      }
    })
  }

  // End edit

  save() {
    this.createUniqueId()
    this.closing.currentDate = this.currentDate.toString()
    this.formatDate()
    this.dateCurrentDay()

    if (this.closing.encargada != "") {

      this.serviceClosing.getByEncargada(this.closing.encargada).subscribe(async (rp: any) => {

        if (rp.length > 0) {

          for (let o = 0; o < this.unliquidatedServiceByDistinct.length; o++) {
            this.closing.tratamiento = this.unliquidatedServiceByDistinct.length
            this.service.updateCierre(this.unliquidatedServiceByDistinct[o]['id'], this.services).subscribe((dates) => { })
          }

          this.serviceClosing.settlementRecord(this.closing).subscribe((dates: any) => { })

          if (this.administratorRole == true) {
            await this.consultClosingByAdministrator()
          }
          else {
            await this.consultClosingByManager()
          }

          Swal.fire({
            position: 'top-end', icon: 'success', title: 'Insertado Correctamente!', showConfirmButton: false, timer: 2500
          })
        }

        if (rp.length == 0) {

          for (let o = 0; o < this.unliquidatedServiceByDistinct.length; o++) {
            this.closing.tratamiento = this.unliquidatedServiceByDistinct.length
            this.service.updateCierre(this.unliquidatedServiceByDistinct[o]['id'], this.services).subscribe((datos) => {
            })
          }

          this.serviceClosing.settlementRecord(this.closing).subscribe((datos) => { })
          this.convertToZero()

          if (this.administratorRole == true) {
            await this.consultClosingByAdministrator()
          }
          else {
            await this.consultClosingByManager()
          }

          Swal.fire({
            position: 'top-end', icon: 'success', title: 'Liquidado Correctamente!', showConfirmButton: false, timer: 2500
          })
        }
      })

    } else {
      Swal.fire({
        icon: 'error', title: 'Oops...', text: 'No hay ninguna encargada seleccionada', showConfirmButton: false, timer: 2500
      })
    }
  }

  async cancel() {
    this.validitingUser()
    this.closingForm = true
    this.validationFilters = true
    this.addForm = false
    this.editClosing = false
    this.selected = false
    this.dates = false
    this.closing.encargada = ""
  }

  createUniqueId() {
    var d = new Date().getTime()
    var uuid = 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = (d + Math.random() * 16) % 16 | 0
      d = Math.floor(d / 16)
      return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16)
    })

    this.services.idCierre = uuid
    this.closing.idUnico = uuid
    this.closing.idCierre = uuid
    return this.closing.idUnico
  }

  dateCurrentDay() {
    let date = new Date(), day = 0, month = 0, year = 0, convertMonth = '', convertDay = ''

    day = date.getDate()
    month = date.getMonth() + 1
    year = date.getFullYear()

    if (month > 0 && month < 10) {
      convertMonth = '0' + month
      this.closing.createdDate = `${year}-${convertMonth}-${day}`
    } else {
      convertMonth = month.toString()
      this.closing.createdDate = `${year}-${month}-${day}`
    }

    if (day > 0 && day < 10) {
      convertDay = '0' + day
      this.closing.createdDate = `${year}-${convertMonth}-${convertDay}`
    } else {
      this.closing.createdDate = `${year}-${convertMonth}-${day}`
    }
  }

  async deleteLiquidation() {
    this.serviceManager.getById(this.idUser).subscribe(async (rp) => {
      if (rp[0]['rol'] == 'administrador') {
        if (this.closing.encargada != "" ||
          this.formTemplate.value.fechaInicio || this.formTemplate.value.FechaFin != "") {
          Swal.fire({
            title: '¿Deseas eliminar el registro?',
            text: "Una vez eliminados ya no se podrán recuperar",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, Deseo eliminar!'
          }).then((result) => {
            if (result.isConfirmed) {
              Swal.fire({
                title: '¿Estas seguro de eliminar?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Si, Deseo eliminar!'
              }).then((result) => {
                if (result.isConfirmed) {
                  this.loading = true
                  this.idLiquidation.map(item => {
                    this.services.idCierre = ""
                    this.services.cierre = false
                    this.service.updateManagerSettlementManagerIdByManagerId(item['idTerapeuta'], this.services).subscribe(async (rp) => {
                      this.serviceLiquidationManager.deleteLiquidationTherapist(item['id']).subscribe(async (rp) => {
                        if (this.administratorRole == true) {
                          await this.consultClosingByAdministrator()
                        }
                        else {
                          await this.consultClosingByManager()
                        }
                        this.emptyValues()
                        this.loading = false
                        Swal.fire({ position: 'top-end', icon: 'success', title: '¡Eliminado Correctamente!', showConfirmButton: false, timer: 1500 })
                      })
                    })
                  })
                }
                else {
                  this.loading = false
                }
              })
            }
          })
        }
      }
    })
  }

  emptyValues() {
    this.closing.encargada = ""
    this.formTemplate.value.fechaInicio = ""
    this.formTemplate.value.FechaFin = ""
    this.formTemplate.value.busqueda = ""
  }
}