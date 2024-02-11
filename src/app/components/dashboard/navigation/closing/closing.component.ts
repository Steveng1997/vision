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
  dateTitle: boolean = false
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
  unliquidatedServiceByLiquidationTherapistDistinct: any
  unsettledServicesDirectTherapist: any
  unsettledServicesDirectTherapistDistinct: any
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

  // Table 2
  totalsBoxCash: number
  totalsBoxBizum: number
  totalsBoxCard: number
  totalsBoxTransaction: number

  totalBox: number
  totalServices: number
  totalLiquidation: number
  totalPayment: number

  textTotalsBoxCash: string
  textTotalsBoxBizum: string
  textTotalsBoxCard: string
  textTotalsBoxTransaction: string

  textTotalBox: string
  textTotalServices: string
  textTotalLiquidation: string
  textTotalPayment: string

  // Table 3
  totalCashTable3: number
  totalBizumTable3: number
  totalCardTable3: number
  totalTransTable3: number

  textTotalBizumTable3: string
  textTotalCashTable3: string
  textTotalCardTable3: string
  textTotalTransTable3: string

  // Table 4 

  totalCashTable4: number
  totalBizumTable4: number
  totalCardTable4: number
  totalTransactionTable4: number

  textTotalCashTable4: string
  textTotalBizumTable4: string
  textTotalCardTable4: string
  textTotalTransactionTable4: string

  // Table 5

  totalCashTable5: number
  totalBizumTable5: number
  totalCardTable5: number
  totalTransTable5: number

  textTotalCashTable5: string
  textTotalBizumTable5: string
  textTotalCardTable5: string
  textTotalTransTable5: string

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
    this.dateTitle = false
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
      this.dateTitle = false
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
      this.dateTitle = false
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
    // Table 2
    this.totalsBoxCash = 0
    this.totalsBoxBizum = 0
    this.totalsBoxCard = 0
    this.totalsBoxTransaction = 0

    this.totalBox = 0
    this.totalServices = 0
    this.totalLiquidation = 0
    this.totalPayment = 0

    // Table 3
    this.totalCashTable3 = 0
    this.totalBizumTable3 = 0
    this.totalCardTable3 = 0
    this.totalTransTable3 = 0

    // Table 4
    this.totalCashTable4 = 0
    this.totalBizumTable4 = 0
    this.totalCardTable4 = 0
    this.totalTransactionTable4 = 0

    // Table 5
    this.totalCashTable5 = 0
    this.totalBizumTable5 = 0
    this.totalCardTable5 = 0
    this.totalTransTable5 = 0
  }

  validateNullData() {
    if (this.totalCashTable3 == undefined) this.totalCashTable3 = 0
    if (this.totalBizumTable3 == undefined) this.totalBizumTable3 = 0
    if (this.totalCardTable3 == undefined) this.totalCardTable3 = 0
    if (this.totalTransTable3 == undefined) this.totalTransTable3 = 0
    if (this.totalServices == undefined) this.totalServices = 0

    if (this.totalCashTable4 == undefined) this.totalCashTable4 = 0
    if (this.totalBizumTable4 == undefined) this.totalBizumTable4 = 0
    if (this.totalCardTable4 == undefined) this.totalCardTable4 = 0
    if (this.totalTransactionTable4 == undefined) this.totalTransactionTable4 = 0
    if (this.totalLiquidation == undefined) this.totalLiquidation = 0

    if (this.totalCashTable5 == undefined) this.totalCashTable5 = 0
    if (this.totalBizumTable5 == undefined) this.totalBizumTable5 = 0
    if (this.totalCardTable5 == undefined) this.totalCardTable5 = 0
    if (this.totalTransTable5 == undefined) this.totalTransTable5 = 0
    if (this.totalPayment == undefined) this.totalPayment = 0
  }

  validateNullDataTable3(arrayTable3) {
    if (arrayTable3.totalCashTable3 == undefined) arrayTable3.totalCashTable3 = 0
    if (arrayTable3.totalBizumTable3 == undefined) arrayTable3.totalBizumTable3 = 0
    if (arrayTable3.totalCardTable3 == undefined) arrayTable3.totalCardTable3 = 0
    if (arrayTable3.totalTransTable3 == undefined) arrayTable3.totalTransTable3 = 0
  }

  validateNullDataTable4(arrayTable4) {
    if (arrayTable4.cashPayment == undefined) arrayTable4.cashPayment = 0
    if (arrayTable4.bizumPayment == undefined) arrayTable4.bizumPayment = 0
    if (arrayTable4.cardPayment == undefined) arrayTable4.cardPayment = 0
    if (arrayTable4.transactionPayment == undefined) arrayTable4.transactionPayment = 0
  }

  validateNullDataTable5(arrayTable5) {
    if (arrayTable5.totalCashTable5 == undefined) arrayTable5.totalCashTable5 = 0
    if (arrayTable5.totalBizumTable5 == undefined) arrayTable5.totalBizumTable5 = 0
    if (arrayTable5.totalCardTable5 == undefined) arrayTable5.totalCardTable5 = 0
    if (arrayTable5.totalTransTable5 == undefined) arrayTable5.totalTransTable5 = 0
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
    this.dateTitle = false
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
          this.dateTitle = false
          await this.dateExists()

        } else {
          this.selected = false
          this.dates = false
          this.dateTitle = false
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
      this.dateTitle = false
    }
  }

  async calculatedOperation() {
    this.validateNullData()
    this.totalsBoxCash = this.totalCashTable3 - this.totalCashTable4 + this.totalCashTable5
    this.closing.efectivo = this.totalsBoxCash
    this.totalsBoxBizum = this.totalBizumTable3 - this.totalBizumTable4 + this.totalBizumTable5
    this.closing.bizum = this.totalsBoxBizum
    this.totalsBoxCard = this.totalCardTable3 - this.totalCardTable4 + this.totalCardTable5
    this.closing.tarjeta = this.totalsBoxCard
    this.totalsBoxTransaction = this.totalTransTable3 + this.totalTransactionTable4 + this.totalTransTable5
    this.closing.transaccion = this.totalsBoxTransaction
    this.totalBox = this.totalsBoxCash + this.totalsBoxBizum + this.totalsBoxCard + this.totalsBoxTransaction
    this.closing.total = this.totalBox

    this.thousandPointTable2()
    this.selected = true
    this.dates = true
    this.dateTitle = true
    this.loading = false
  }

  async consultTable5() {
    let arrayTable5

    await this.service.getWithDistinctServicesByNumberTerap(this.closing.encargada, this.closing.desdeHora, this.closing.hastaHora,
      this.closing.desdeFecha, this.closing.hastaFecha).subscribe(async (rp: any) => {
        if (rp.length > 0) {
          this.unsettledServicesDirectTherapistDistinct = rp

          await this.service.getServicesByNumberTerap(this.closing.encargada, this.closing.desdeHora, this.closing.hastaHora,
            this.closing.desdeFecha, this.closing.hastaFecha).subscribe(async (rp: any) => {

              for (let e = 0; e < this.unsettledServicesDirectTherapistDistinct.length; e++) {

                const totalsCashTable5 = rp.reduce((accumulator, serv) => {
                  return accumulator + serv.valueEfectTerapeuta
                }, 0)

                const totalsBizumTable5 = rp.reduce((accumulator, serv) => {
                  return accumulator + serv.valueBizuTerapeuta
                }, 0)

                const totalsCardTable5 = rp.reduce((accumulator, serv) => {
                  return accumulator + serv.valueTarjeTerapeuta
                }, 0)

                const totalsTransTable5 = rp.reduce((accumulator, serv) => {
                  return accumulator + serv.valueTransTerapeuta
                }, 0)

                arrayTable5 = [].concat(this.unsettledServicesDirectTherapistDistinct);

                arrayTable5[e].totalCashTable5 = totalsCashTable5
                arrayTable5[e].totalBizumTable5 = totalsBizumTable5
                arrayTable5[e].totalCardTable5 = totalsCardTable5
                arrayTable5[e].totalTransTable5 = totalsTransTable5

                this.validateNullDataTable5(arrayTable5[e])

                arrayTable5.push({
                  totalCashTable5: totalsCashTable5,
                  totalBizumTable5: totalsBizumTable5,
                  totalCardTable5: totalsCardTable5,
                  totalTransTable5: totalsTransTable5
                })

                arrayTable5.pop();

                const totalCashTable5 = arrayTable5.map(({ totalCashTable5 }) => totalCashTable5).reduce((acc, value) => acc + value, 0)
                this.totalCashTable5 = totalCashTable5

                const totalBizumTable5 = arrayTable5.map(({ totalBizumTable5 }) => totalBizumTable5).reduce((acc, value) => acc + value, 0)
                this.totalBizumTable5 = totalBizumTable5

                const totalCardTable5 = arrayTable5.map(({ totalCardTable5 }) => totalCardTable5).reduce((acc, value) => acc + value, 0)
                this.totalCardTable5 = totalCardTable5

                const totalTransTable5 = arrayTable5.map(({ totalTransTable5 }) => totalTransTable5).reduce((acc, value) => acc + value, 0)
                this.totalTransTable5 = totalTransTable5

                this.totalPayment = totalCashTable5 + totalBizumTable5 + totalCardTable5 + totalTransTable5

                this.validateNullData()
                this.thousandPointTable5()
                await this.calculatedOperation()
              }
            })
        } else {
          arrayTable5 = [].concat(this.unsettledServicesDirectTherapistDistinct);
          this.validateNullData()
          this.thousandPointTable5()
          await this.calculatedOperation()
        }
      })
  }

  async ConsultTable4() {
    let arrayTable4

    await this.serviceLiquidationTherapist.getWithDistinctByManagerFechaHoraInicioFechaHoraFinLiquidationTherapist(this.closing.encargada, this.closing.desdeHora, this.closing.hastaHora, this.closing.desdeFecha, this.closing.hastaFecha).subscribe(async (rp: any) => {
      if (rp.length > 0) {
        this.unliquidatedServiceByLiquidationTherapistDistinct = rp

        await this.serviceLiquidationTherapist.getByManagerFechaHoraInicioFechaHoraFinLiquidationTherapist(this.closing.encargada, this.closing.desdeHora, this.closing.hastaHora,
          this.closing.desdeFecha, this.closing.hastaFecha).subscribe(async (rp: any) => {

            this.unliquidatedServiceByLiquidationTherapist = rp

            for (let i = 0; i < this.unliquidatedServiceByLiquidationTherapistDistinct.length; i++) {

              let cashPayment = 0, bizumPayment = 0, cardPayment = 0, transactionPayment = 0

              if (rp[i].formaPago == "Efectivo") {
                cashPayment = rp[i]['importe']
              }

              if (rp[i].formaPago == "Bizum") {
                bizumPayment = rp[i]['importe']
              }

              if (rp[i].formaPago == "Tarjeta") {
                cardPayment = rp[i]['importe']
              }
              if (rp[i].formaPago == "Trans") {
                transactionPayment = rp[i]['importe']
              }

              arrayTable4 = [].concat(this.unliquidatedServiceByLiquidationTherapistDistinct);

              arrayTable4[i].cashPayment = cashPayment
              arrayTable4[i].bizumPayment = bizumPayment
              arrayTable4[i].cardPayment = cardPayment
              arrayTable4[i].transactionPayment = transactionPayment

              this.validateNullDataTable4(arrayTable4[i])

              arrayTable4.push({
                cashPayment: cashPayment,
                bizumPayment: bizumPayment,
                cardPayment: cardPayment,
                transactionPayment: transactionPayment,
              })

              arrayTable4.pop();

              const totalCashPayment = arrayTable4.map(({ cashPayment }) => cashPayment).reduce((acc, value) => acc + value, 0)
              this.totalCashTable4 = totalCashPayment

              const totalBizumPayment = arrayTable4.map(({ bizumPayment }) => bizumPayment).reduce((acc, value) => acc + value, 0)
              this.totalBizumTable4 = totalBizumPayment

              const totalCardPayment = arrayTable4.map(({ cardPayment }) => cardPayment).reduce((acc, value) => acc + value, 0)
              this.totalCardTable4 = totalCardPayment

              const totalTransactionPayment = arrayTable4.map(({ transactionPayment }) => transactionPayment).reduce((acc, value) => acc + value, 0)
              this.totalTransactionTable4 = totalTransactionPayment

              this.totalLiquidation = totalCashPayment + totalBizumPayment + totalCardPayment + totalTransactionPayment

              this.validateNullData()
              this.thousandPointTable4()
              await this.consultTable5()
            }
          })
      } else {
        arrayTable4 = [].concat(this.unliquidatedServiceByLiquidationTherapistDistinct);
        this.validateNullData()
        this.thousandPointTable4()
        await this.consultTable5()
      }
    })
  }

  async inputDateAndTime() {
    let arrayTable3
    this.loading = true

    await this.service.getWithDistinctByManagerFechaHoraInicioFechaHoraFinClosing(this.closing.encargada, this.closing.desdeHora, this.closing.hastaHora, this.closing.desdeFecha, this.closing.hastaFecha).subscribe(async (rp: any) => {

      if (rp.length > 0) {
        this.unliquidatedService = rp

        await this.service.getByManagerFechaHoraInicioFechaHoraFinClosing(this.closing.encargada, this.closing.desdeHora, this.closing.hastaHora,
          this.closing.desdeFecha, this.closing.hastaFecha).subscribe(async (rp: any) => {
            this.unliquidatedServiceByDistinct = rp
            this.closing.tratamiento = rp.length

            for (let o = 0; o < this.unliquidatedService.length; o++) {

              await this.service.getByTherapistFechaHoraInicioFechaHoraFinClosing(this.unliquidatedService[o]['terapeuta'], this.closing.encargada, this.closing.desdeHora, this.closing.hastaHora,
                this.closing.desdeFecha, this.closing.hastaFecha).subscribe(async (rp: any) => {

                  const totalsCashTable3 = rp.reduce((accumulator, serv) => {
                    return accumulator + serv.valueEfectivo
                  }, 0)

                  const totalsBizumTable3 = rp.reduce((accumulator, serv) => {
                    return accumulator + serv.valueBizum
                  }, 0)

                  const totalsCardTable3 = rp.reduce((accumulator, serv) => {
                    return accumulator + serv.valueTarjeta
                  }, 0)

                  const totalsTransTable3 = rp.reduce((accumulator, serv) => {
                    return accumulator + serv.valueTrans
                  }, 0)

                  arrayTable3 = [].concat(this.unliquidatedService);

                  arrayTable3[o].totalCashTable3 = totalsCashTable3
                  arrayTable3[o].totalBizumTable3 = totalsBizumTable3
                  arrayTable3[o].totalCardTable3 = totalsCardTable3
                  arrayTable3[o].totalTransTable3 = totalsTransTable3

                  this.validateNullDataTable3(arrayTable3[o])

                  arrayTable3.push({
                    totalCashTable3: totalsCashTable3,
                    totalBizumTable3: totalsBizumTable3,
                    totalCardTable3: totalsCardTable3,
                    totalTransTable3: totalsTransTable3
                  })

                  arrayTable3.pop();

                  const totalCashTable3 = arrayTable3.map(({ totalCashTable3 }) => totalCashTable3).reduce((acc, value) => acc + value, 0)
                  this.totalCashTable3 = totalCashTable3

                  const totalBizumTable3 = arrayTable3.map(({ totalBizumTable3 }) => totalBizumTable3).reduce((acc, value) => acc + value, 0)
                  this.totalBizumTable3 = totalBizumTable3

                  const totalCardTable3 = arrayTable3.map(({ totalCardTable3 }) => totalCardTable3).reduce((acc, value) => acc + value, 0)
                  this.totalCardTable3 = totalCardTable3

                  const totalTransTable3 = arrayTable3.map(({ totalTransTable3 }) => totalTransTable3).reduce((acc, value) => acc + value, 0)
                  this.totalTransTable3 = totalTransTable3

                  this.totalServices = totalCashTable3 + totalBizumTable3 + totalCardTable3 + totalTransTable3

                  this.validateNullData()
                  this.thousandPointTable3()
                })
            }

            await this.ConsultTable4()
          })

      } else {
        this.unliquidatedService = rp
        this.loading = false
        this.dateTitle = false
        this.selected = false
        this.dates = true

        Swal.fire({
          icon: 'error', title: 'Oops...', text: 'No hay ningun servicio con la fecha seleccionada', showConfirmButton: false, timer: 2500
        })
      }
    })
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

  async thousandPointTable2() {
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

    if (this.totalServices > 999) {

      const coma = this.totalServices.toString().indexOf(".") !== -1 ? true : false;
      const array = coma ? this.totalServices.toString().split(".") : this.totalServices.toString().split("");
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
      this.textTotalServices = integer[0].toString()
    } else {
      this.textTotalServices = this.totalServices.toString()
    }

    if (this.totalLiquidation > 999) {

      const coma = this.totalLiquidation.toString().indexOf(".") !== -1 ? true : false;
      const array = coma ? this.totalLiquidation.toString().split(".") : this.totalLiquidation.toString().split("");
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
      this.textTotalLiquidation = integer[0].toString()
    } else {
      this.textTotalLiquidation = this.totalLiquidation.toString()
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
  }

  thousandPointTable3() {
    if (this.totalCashTable3 > 999) {

      const coma = this.totalCashTable3.toString().indexOf(".") !== -1 ? true : false;
      const array = coma ? this.totalCashTable3.toString().split(".") : this.totalCashTable3.toString().split("");
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
      this.textTotalCashTable3 = integer[0].toString()
    } else {
      this.textTotalCashTable3 = this.totalCashTable3.toString()
    }

    if (this.totalBizumTable3 > 999) {

      const coma = this.totalBizumTable3.toString().indexOf(".") !== -1 ? true : false;
      const array = coma ? this.totalBizumTable3.toString().split(".") : this.totalBizumTable3.toString().split("");
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
      this.textTotalBizumTable3 = integer[0].toString()
    } else {
      this.textTotalBizumTable3 = this.totalBizumTable3.toString()
    }

    if (this.totalCardTable3 > 999) {

      const coma = this.totalCardTable3.toString().indexOf(".") !== -1 ? true : false;
      const array = coma ? this.totalCardTable3.toString().split(".") : this.totalCardTable3.toString().split("");
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
      this.textTotalCardTable3 = integer[0].toString()
    } else {
      this.textTotalCardTable3 = this.totalCardTable3.toString()
    }

    if (this.totalTransTable3 > 999) {

      const coma = this.totalTransTable3.toString().indexOf(".") !== -1 ? true : false;
      const array = coma ? this.totalTransTable3.toString().split(".") : this.totalTransTable3.toString().split("");
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
      this.textTotalTransTable3 = integer[0].toString()
    } else {
      this.textTotalTransTable3 = this.totalTransTable3.toString()
    }
  }

  thousandPointTable4() {
    if (this.totalCashTable4 > 999) {

      const coma = this.totalCashTable4.toString().indexOf(".") !== -1 ? true : false;
      const array = coma ? this.totalCashTable4.toString().split(".") : this.totalCashTable4.toString().split("");
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
      this.textTotalCashTable4 = integer[0].toString()
    } else {
      this.textTotalCashTable4 = this.totalCashTable4.toString()
    }

    if (this.totalBizumTable4 > 999) {

      const coma = this.totalBizumTable4.toString().indexOf(".") !== -1 ? true : false;
      const array = coma ? this.totalBizumTable4.toString().split(".") : this.totalBizumTable4.toString().split("");
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
      this.textTotalBizumTable4 = integer[0].toString()
    } else {
      this.textTotalBizumTable4 = this.totalBizumTable4.toString()
    }

    if (this.totalCardTable4 > 999) {

      const coma = this.totalCardTable4.toString().indexOf(".") !== -1 ? true : false;
      const array = coma ? this.totalCardTable4.toString().split(".") : this.totalCardTable4.toString().split("");
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
      this.textTotalCardTable4 = integer[0].toString()
    } else {
      this.textTotalCardTable4 = this.totalCardTable4.toString()
    }

    if (this.totalTransactionTable4 > 999) {

      const coma = this.totalTransactionTable4.toString().indexOf(".") !== -1 ? true : false;
      const array = coma ? this.totalTransactionTable4.toString().split(".") : this.totalTransactionTable4.toString().split("");
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
      this.textTotalTransactionTable4 = integer[0].toString()
    } else {
      this.textTotalTransactionTable4 = this.totalTransactionTable4.toString()
    }
  }

  thousandPointTable5() {
    if (this.totalCashTable5 > 999) {

      const coma = this.totalCashTable5.toString().indexOf(".") !== -1 ? true : false;
      const array = coma ? this.totalCashTable5.toString().split(".") : this.totalCashTable5.toString().split("");
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
      this.textTotalCashTable5 = integer[0].toString()
    } else {
      this.textTotalCashTable5 = this.totalCashTable5.toString()
    }

    if (this.totalBizumTable5 > 999) {

      const coma = this.totalBizumTable5.toString().indexOf(".") !== -1 ? true : false;
      const array = coma ? this.totalBizumTable5.toString().split(".") : this.totalBizumTable5.toString().split("");
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
      this.textTotalBizumTable5 = integer[0].toString()
    } else {
      this.textTotalBizumTable5 = this.totalBizumTable5.toString()
    }

    if (this.totalCardTable5 > 999) {

      const coma = this.totalCardTable5.toString().indexOf(".") !== -1 ? true : false;
      const array = coma ? this.totalCardTable5.toString().split(".") : this.totalCardTable5.toString().split("");
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
      this.textTotalCardTable5 = integer[0].toString()
    } else {
      this.textTotalCardTable5 = this.totalCardTable5.toString()
    }

    if (this.totalTransTable5 > 999) {

      const coma = this.totalTransTable5.toString().indexOf(".") !== -1 ? true : false;
      const array = coma ? this.totalTransTable5.toString().split(".") : this.totalTransTable5.toString().split("");
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
      this.textTotalTransTable5 = integer[0].toString()
    } else {
      this.textTotalTransTable5 = this.totalTransTable5.toString()
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

  arrowTable4Add() {
    document.querySelector('.column4').scrollLeft += 30;
    document.getElementById('arrowTable4Add').style.display = 'none'
  }

  arrowTable5Add() {
    document.querySelector('.column5').scrollLeft += 30;
    document.getElementById('arrowTable5Add').style.display = 'none'
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
    let arrayTable3
    this.loading = true

    await this.service.getByIdCierreDistinct(idCierre).subscribe(async (rp: any) => {

      if (rp.length > 0) {
        this.unliquidatedService = rp

        await this.service.getByCierre(idCierre).subscribe(async (rp: any) => {
          this.unliquidatedServiceByDistinct = rp
          this.closing.tratamiento = rp.length
          this.closing.encargada = rp[0]['encargada']

          for (let o = 0; o < this.unliquidatedService.length; o++) {

            await this.service.getByTherapistFechaHoraInicioFechaHoraFinClosingTrue(this.unliquidatedService[o]['terapeuta'], this.closing.encargada, this.closing.desdeHora, this.closing.hastaHora,
              this.closing.desdeFecha, this.closing.hastaFecha).subscribe(async (rp: any) => {

                const totalsCashTable3 = rp.reduce((accumulator, serv) => {
                  return accumulator + serv.valueEfectivo
                }, 0)

                const totalsBizumTable3 = rp.reduce((accumulator, serv) => {
                  return accumulator + serv.valueBizum
                }, 0)

                const totalsCardTable3 = rp.reduce((accumulator, serv) => {
                  return accumulator + serv.valueTarjeta
                }, 0)

                const totalsTransTable3 = rp.reduce((accumulator, serv) => {
                  return accumulator + serv.valueTrans
                }, 0)

                arrayTable3 = [].concat(this.unliquidatedService);

                arrayTable3[o].totalCashTable3 = totalsCashTable3
                arrayTable3[o].totalBizumTable3 = totalsBizumTable3
                arrayTable3[o].totalCardTable3 = totalsCardTable3
                arrayTable3[o].totalTransTable3 = totalsTransTable3

                this.validateNullDataTable3(arrayTable3[o])

                arrayTable3.push({
                  totalCashTable3: totalsCashTable3,
                  totalBizumTable3: totalsBizumTable3,
                  totalCardTable3: totalsCardTable3,
                  totalTransTable3: totalsTransTable3
                })

                arrayTable3.pop();

                const totalCashTable3 = arrayTable3.map(({ totalCashTable3 }) => totalCashTable3).reduce((acc, value) => acc + value, 0)
                this.totalCashTable3 = totalCashTable3

                const totalBizumTable3 = arrayTable3.map(({ totalBizumTable3 }) => totalBizumTable3).reduce((acc, value) => acc + value, 0)
                this.totalBizumTable3 = totalBizumTable3

                const totalCardTable3 = arrayTable3.map(({ totalCardTable3 }) => totalCardTable3).reduce((acc, value) => acc + value, 0)
                this.totalCardTable3 = totalCardTable3

                const totalTransTable3 = arrayTable3.map(({ totalTransTable3 }) => totalTransTable3).reduce((acc, value) => acc + value, 0)
                this.totalTransTable3 = totalTransTable3

                this.totalServices = totalCashTable3 + totalBizumTable3 + totalCardTable3 + totalTransTable3

                this.validateNullData()
                this.thousandPointTable3()
              })
          }

          await this.ConsultTablesEdit()
        })

      } else {
        this.settledData = rp
        this.loading = false
        this.dateTitle = false
        this.selected = false
        this.editClosing = false
        this.dates = true

        Swal.fire({
          icon: 'error', title: 'Oops...', text: 'No hay ningun servicio con la fecha seleccionada', showConfirmButton: false, timer: 2500
        })
      }
    })
  }

  async ConsultTablesEdit() {
    let arrayTable4, arrayTable5
    // Table 4
    await this.serviceLiquidationTherapist.getWithDistinctByManagerFechaHoraInicioFechaHoraFinLiquidationTherapist(this.closing.encargada, this.closing.desdeHora, this.closing.hastaHora, this.closing.desdeFecha, this.closing.hastaFecha).subscribe(async (rp: any) => {
      this.unliquidatedServiceByLiquidationTherapistDistinct = rp

      await this.serviceLiquidationTherapist.getByManagerFechaHoraInicioFechaHoraFinLiquidationTherapist(this.closing.encargada, this.closing.desdeHora, this.closing.hastaHora,
        this.closing.desdeFecha, this.closing.hastaFecha).subscribe(async (rp: any) => {

          this.unliquidatedServiceByLiquidationTherapist = rp

          for (let i = 0; i < this.unliquidatedServiceByLiquidationTherapistDistinct.length; i++) {

            let cashPayment = 0, bizumPayment = 0, cardPayment = 0, transactionPayment = 0

            if (rp[i].formaPago == "Efectivo") {
              cashPayment = rp[i]['importe']
            }

            if (rp[i].formaPago == "Bizum") {
              bizumPayment = rp[i]['importe']
            }

            if (rp[i].formaPago == "Tarjeta") {
              cardPayment = rp[i]['importe']
            }
            if (rp[i].formaPago == "Trans") {
              transactionPayment = rp[i]['importe']
            }

            arrayTable4 = [].concat(this.unliquidatedServiceByLiquidationTherapistDistinct);

            arrayTable4[i].cashPayment = cashPayment
            arrayTable4[i].bizumPayment = bizumPayment
            arrayTable4[i].cardPayment = cardPayment
            arrayTable4[i].transactionPayment = transactionPayment

            this.validateNullDataTable4(arrayTable4[i])

            arrayTable4.push({
              cashPayment: cashPayment,
              bizumPayment: bizumPayment,
              cardPayment: cardPayment,
              transactionPayment: transactionPayment,
            })

            arrayTable4.pop();

            const totalCashPayment = arrayTable4.map(({ cashPayment }) => cashPayment).reduce((acc, value) => acc + value, 0)
            this.totalCashTable4 = totalCashPayment

            const totalBizumPayment = arrayTable4.map(({ bizumPayment }) => bizumPayment).reduce((acc, value) => acc + value, 0)
            this.totalBizumTable4 = totalBizumPayment

            const totalCardPayment = arrayTable4.map(({ cardPayment }) => cardPayment).reduce((acc, value) => acc + value, 0)
            this.totalCardTable4 = totalCardPayment

            const totalTransactionPayment = arrayTable4.map(({ transactionPayment }) => transactionPayment).reduce((acc, value) => acc + value, 0)
            this.totalTransactionTable4 = totalTransactionPayment

            this.totalLiquidation = totalCashPayment + totalBizumPayment + totalCardPayment + totalTransactionPayment

            this.validateNullData()
            this.thousandPointTable4()
          }
        })

      // Table 5
      await this.service.getWithDistinctServicesByNumberTerap(this.closing.encargada, this.closing.desdeHora, this.closing.hastaHora,
        this.closing.desdeFecha, this.closing.hastaFecha).subscribe(async (rp: any) => {
          if (rp.length > 0) {
            this.unsettledServicesDirectTherapistDistinct = rp

            await this.service.getServicesByNumberTerap(this.closing.encargada, this.closing.desdeHora, this.closing.hastaHora,
              this.closing.desdeFecha, this.closing.hastaFecha).subscribe(async (rp: any) => {

                for (let e = 0; e < this.unsettledServicesDirectTherapistDistinct.length; e++) {

                  const totalsCashTable5 = rp.reduce((accumulator, serv) => {
                    return accumulator + serv.valueEfectTerapeuta
                  }, 0)

                  const totalsBizumTable5 = rp.reduce((accumulator, serv) => {
                    return accumulator + serv.valueBizuTerapeuta
                  }, 0)

                  const totalsCardTable5 = rp.reduce((accumulator, serv) => {
                    return accumulator + serv.valueTarjeTerapeuta
                  }, 0)

                  const totalsTransTable5 = rp.reduce((accumulator, serv) => {
                    return accumulator + serv.valueTransTerapeuta
                  }, 0)

                  arrayTable5 = [].concat(this.unsettledServicesDirectTherapistDistinct);

                  arrayTable5[e].totalCashTable5 = totalsCashTable5
                  arrayTable5[e].totalBizumTable5 = totalsBizumTable5
                  arrayTable5[e].totalCardTable5 = totalsCardTable5
                  arrayTable5[e].totalTransTable5 = totalsTransTable5

                  this.validateNullDataTable5(arrayTable5[e])

                  arrayTable5.push({
                    totalCashTable5: totalsCashTable5,
                    totalBizumTable5: totalsBizumTable5,
                    totalCardTable5: totalsCardTable5,
                    totalTransTable5: totalsTransTable5
                  })

                  arrayTable5.pop();

                  const totalCashTable5 = arrayTable5.map(({ totalCashTable5 }) => totalCashTable5).reduce((acc, value) => acc + value, 0)
                  this.totalCashTable5 = totalCashTable5

                  const totalBizumTable5 = arrayTable5.map(({ totalBizumTable5 }) => totalBizumTable5).reduce((acc, value) => acc + value, 0)
                  this.totalBizumTable5 = totalBizumTable5

                  const totalCardTable5 = arrayTable5.map(({ totalCardTable5 }) => totalCardTable5).reduce((acc, value) => acc + value, 0)
                  this.totalCardTable5 = totalCardTable5

                  const totalTransTable5 = arrayTable5.map(({ totalTransTable5 }) => totalTransTable5).reduce((acc, value) => acc + value, 0)
                  this.totalTransTable5 = totalTransTable5

                  this.totalPayment = totalCashTable5 + totalBizumTable5 + totalCardTable5 + totalTransTable5

                  this.validateNullData()
                  this.thousandPointTable5()
                  await this.calculatedOperationEdit()
                }
              })
          } else {
            arrayTable5 = [].concat(this.unsettledServicesDirectTherapistDistinct);
            this.validateNullData()
            this.thousandPointTable5()
            await this.calculatedOperationEdit()
          }
        })
    })
  }

  async calculatedOperationEdit() {
    this.validateNullData()
    this.totalsBoxCash = this.totalCashTable3 - this.totalCashTable4 + this.totalCashTable5
    this.closing.efectivo = this.totalsBoxCash
    this.totalsBoxBizum = this.totalBizumTable3 - this.totalBizumTable4 + this.totalBizumTable5
    this.closing.bizum = this.totalsBoxBizum
    this.totalsBoxCard = this.totalCardTable3 - this.totalCardTable4 + this.totalCardTable5
    this.closing.tarjeta = this.totalsBoxCard
    this.totalsBoxTransaction = this.totalTransTable3 + this.totalTransactionTable4 + this.totalTransTable5
    this.closing.transaccion = this.totalsBoxTransaction
    this.totalBox = this.totalsBoxCash + this.totalsBoxBizum + this.totalsBoxCard + this.totalsBoxTransaction
    this.closing.total = this.totalBox

    this.thousandPointTable2()
    this.selected = false
    this.dates = false
    this.dateTitle = false
    this.editClosing = true
    this.loading = false
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

  async save() {
    this.createUniqueId()
    this.closing.currentDate = this.currentDate.toString()
    this.formatDate()
    this.dateCurrentDay()

    if (this.closing.encargada != "") {

      for (let o = 0; o < this.unliquidatedServiceByDistinct.length; o++) {
        this.services.cierre = true
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
    this.dateTitle = false
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