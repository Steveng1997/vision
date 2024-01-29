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
  page!: number
  managerTitle = ""
  idCierre: string
  idLiquidation: any

  fijoDia: number
  fixedTotalDay: number
  fixedDay: number
  letterFixedDay = ""
  totalFixedDay = ""

  // Encargada
  manager: any
  administratorRole: boolean = false
  managerName: any

  nameTherapist: any
  aqui: any

  // Fecha
  fechaInicio: string
  fechaFinal: string

  selected: boolean
  idUser: number

  // Servicios
  totalService: number
  totalTipValue: number
  totalManagerValue: number
  totalValueDrink: number
  totalValueDrinkTherap: number
  totalTobaccoValue: number
  totalValueVitamins: number
  totalValueOther: number

  // Comision
  serviceCommission: number
  commissionTip: number
  beverageCommission: number
  beverageTherapistCommission: number
  tobaccoCommission: number
  vitaminCommission: number
  commissionOthers: number
  sumCommission: number
  idUnico: string
  receivedManager: any

  // Comission
  totalCommission: number
  totalLiquidation: number

  // Thousand pount
  textTotalComission: string
  textTotalService: string
  textServiceComission: string
  textTotalTip2: string
  textComissionTip: string
  textValueDrink: string
  textValueDrinkTherap: string
  textBeverageCommission: string
  textbeverageTherapistCommission: string
  textTobaccoValue: string
  textTobaccoCommission: string
  textValueVitamins: string
  textVitaminCommission: string
  textValueOther: string
  textCommissionOthers: string
  textSumCommission: string
  textReceivedManager: string
  textTotalCommission: string
  textTotalCash: string
  textTotalBizum: string
  textTotalCard: string
  textTotalTransaction: string
  textTotalManagerPayment: string

  // Total Payment Method
  totalCash: number
  totalCard: number
  totalBizum: number
  totalTransaction: number
  totalTherapistPayment: number

  currentDate = new Date().getTime()

  closing: ModelClosing = {
    bizum: 0,
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
    this.thousandPount()

    if (this.idUser) {
      this.validitingUser()
    }
  }

  async validitingUser() {
    this.serviceManager.getById(this.idUser).subscribe(async (rp) => {
      if (rp[0]['rol'] == 'administrador') {
        this.administratorRole = true
        this.loading = false
        this.GetAllManagers()
      } else {
        this.manager = rp
        this.loading = false
        this.closing.encargada = this.manager[0].nombre
        this.getManager()
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
    this.totalService = 0
    this.totalTipValue = 0
    this.totalManagerValue = 0
    this.totalValueDrink = 0
    this.totalValueDrinkTherap = 0
    this.totalTobaccoValue = 0
    this.totalValueVitamins = 0
    this.totalValueOther = 0
    this.serviceCommission = 0
    this.commissionTip = 0
    this.beverageCommission = 0
    this.beverageTherapistCommission = 0
    this.tobaccoCommission = 0
    this.vitaminCommission = 0
    this.commissionOthers = 0
    this.sumCommission = 0
    this.receivedManager = 0
  }

  validateNullData() {
  }

  async thousandPount() {

    this.serviceManager.getById(this.idUser).subscribe((rp) => {
      if (rp[0]['rol'] == 'administrador') {

        this.serviceClosing.getAllCierre().subscribe((rp: any) => {
          this.close = rp
        })
      }
    })
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

  async getManager() {
    this.serviceLiquidationManager.getByEncargada(this.closing.encargada).subscribe(async (rp) => {
      this.close = rp
    })
  }

  async GetAllManagers() {
    this.serviceManager.getUsuarios().subscribe(async (datosEncargada: any) => {
      this.manager = datosEncargada
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

        fromDay = rp[0]['hastaFechaLiquidado'].substring(0, 2)
        fromMonth = rp[0]['hastaFechaLiquidado'].substring(3, 5)
        fromYear = rp[0]['hastaFechaLiquidado'].substring(6, 8)

        this.closing.desdeFecha = `${'20' + fromYear}-${fromMonth}-${fromDay}`
        this.closing.desdeFecha = rp[0]['hastaHoraLiquidado']
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

  pountFixedDay() {

  }

  async inputDateAndTime() {

    this.service.getWithDistinctByManagerFechaHoraInicioFechaHoraFinClosing(this.closing.encargada, this.closing.desdeHora, this.closing.hastaHora,
      this.closing.desdeFecha, this.closing.hastaFecha).subscribe(async (rp: any) => {

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
    
                    const arr2 = [].concat(this.unliquidatedService);
    
                    arr2[o].totalService = totalServices
                    arr2[o].liquidation = rp[o].importe
                    arr2[o].payment = rp[o].formaPago
                    arr2[o].sinceDate = rp[o].desdeFechaLiquidado
                    arr2[o].sinceTime = rp[o].desdeHoraLiquidado
                    arr2[o].toDate = rp[o].hastaFechaLiquidado
                    arr2[o].untilTime = rp[o].hastaHoraLiquidado
                    arr2[o].treatment = rp[o].tratamiento                    

                    arr2.push({ totalService: totalServices, liquidation: rp[o].importe, payment: rp[o].formaPago, sinceDate: rp[o].desdeFechaLiquidado,
                    sinceTime: rp[o].desdeHoraLiquidado, toDate:  rp[o].hastaFechaLiquidado, untilTime: rp[o].hastaHoraLiquidado, treatment: rp[o].tratamiento})
                  }
                })

              this.validateNullData()
              this.thousandPoint()
              this.loading = false
              this.selected = true
              this.dates = true
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

  calculateTheDays() {
    let day = '', convertDay = '', month = '', year = '', hour = new Date().toTimeString().substring(0, 8), dayEnd = '', monthEnd = '', yearEnd = ''

    dayEnd = this.closing.desdeFecha.substring(8, 10)
    monthEnd = this.closing.desdeFecha.substring(5, 7)
    yearEnd = this.closing.desdeFecha.substring(0, 4)

    var date1 = moment(`${yearEnd}-${monthEnd}-${dayEnd}`, "YYYY-MM-DD")

    // Date 2

    day = this.closing.hastaFecha.substring(8, 10)
    month = this.closing.hastaFecha.substring(5, 7)
    year = this.closing.hastaFecha.substring(0, 4)

    var date2 = moment(`${year}-${month}-${day}`, "YYYY-MM-DD")

    // this.fixedDay = date1.diff(date2, 'd')
    this.fixedDay = date2.diff(date1, 'days')
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

  convertToZeroEdit() {
  }

  async thousandPointEdit() {

  }

  goToEdit(id: number) {
    const params = this.activeRoute.snapshot['_urlSegment'].segments[1];
    this.idUser = Number(params.path)

    this.service.getById(id).subscribe((rp: any) => {
      if (rp.length > 0) this.router.navigate([`menu/${this.idUser}/nuevo-servicio/${rp[0]['id']}/true`])
    })
  }

  async dataFormEdit(idCierre: string, id: number) {
    this.loading = true
    this.validationFilters = false
    this.closingForm = false
    this.idSettled = id
    this.idCierre = idCierre

    this.serviceClosing.getIdCierre(idCierre).subscribe(async (datosManager) => {
      this.closing.desdeFecha = datosManager[0]['desdeFecha']
      this.closing.desdeHora = datosManager[0]['desdeHora']
      this.closing.hastaFecha = datosManager[0]['hastaFecha']
      this.closing.hastaHora = datosManager[0]['hastaHora']
    })

    await this.sumTotal(idCierre)
  }

  async sumTotal(idCierre: string) {
    this.service.getByIdEncarg(idCierre).subscribe(async (rp: any) => {
      if (rp.length > 0) {
        this.settledData = rp;
        this.managerTitle = rp[0]['encargada']

        // Filter by servicio
        const servicios = rp.filter(serv => serv)
        this.totalService = servicios.reduce((accumulator, serv) => {
          return accumulator + serv.servicio
        }, 0)

        // Filter by Propina
        const propinas = rp.filter(serv => serv)
        this.totalTipValue = propinas.reduce((accumulator, serv) => {
          return accumulator + serv.propina
        }, 0)

        // Filter by Pago
        const terapeuta = rp.filter(serv => serv)
        this.totalManagerValue = terapeuta.reduce((accumulator, serv) => {
          return accumulator + serv.numberEncarg
        }, 0)

        // Filter by Drink
        const bebida = rp.filter(serv => serv)
        this.totalValueDrink = bebida.reduce((accumulator, serv) => {
          return accumulator + serv.bebidas
        }, 0)

        // Filter by Drink
        const drinkTherap = rp.filter(serv => serv)
        this.totalValueDrinkTherap = drinkTherap.reduce((accumulator, serv) => {
          return accumulator + serv.bebidaTerap
        }, 0)

        // Filter by Tabaco
        const tabac = rp.filter(serv => serv)
        this.totalTobaccoValue = tabac.reduce((accumulator, serv) => {
          return accumulator + serv.tabaco
        }, 0)

        // Filter by Vitamina
        const vitamina = rp.filter(serv => serv)
        this.totalValueVitamins = vitamina.reduce((accumulator, serv) => {
          return accumulator + serv.vitaminas
        }, 0)

        // Filter by Vitamina
        const otroServicio = rp.filter(serv => serv)
        this.totalValueOther = otroServicio.reduce((accumulator, serv) => {
          return accumulator + serv.otros
        }, 0)

      } else {
        await this.serviceLiquidationManager.getIdEncarg(idCierre).subscribe(async (rp: any) => {
          this.managerTitle = rp[0]['encargada']
          this.convertToZeroEdit()
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
        this.service.updateManagerSettlementManagerIdByManagerId(this.idCierre, this.services).subscribe(async (rp) => {
          this.serviceLiquidationManager.deleteLiquidationTherapist(this.idSettled).subscribe(async (rp) => {
            this.validitingUser()
            this.closing.encargada = ""
            this.closingForm = true
            this.validationFilters = true
            this.addForm = false
            this.editClosing = false
            this.selected = false
            this.dates = false
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

    if (this.closing.encargada != "") {

      this.serviceLiquidationManager.getByEncargada(this.closing.encargada).subscribe(async (rp: any) => {

        if (rp.length > 0) {

          for (let o = 0; o < this.unliquidatedService.length; o++) {
            this.closing.tratamiento = this.unliquidatedService.length
            this.service.updateCierre(this.unliquidatedService[o]['id'], this.services).subscribe((dates) => { })
          }

          this.serviceClosing.settlementRecord(this.closing).subscribe((dates: any) => { })

          await this.validitingUser()
          this.thousandPount()
          this.closingForm = true
          this.validationFilters = true
          this.addForm = false
          this.editClosing = false
          this.selected = false
          this.dates = false
          this.closing.encargada = ""

          Swal.fire({
            position: 'top-end', icon: 'success', title: 'Insertado Correctamente!', showConfirmButton: false, timer: 2500
          })
        }

        if (rp.length == 0) {

          for (let o = 0; o < this.unliquidatedService.length; o++) {
            this.closing.tratamiento = this.unliquidatedService.length
            this.service.updateCierre(this.unliquidatedService[o]['id'], this.services).subscribe((datos) => {
            })
          }

          this.serviceClosing.settlementRecord(this.closing).subscribe((datos) => { })

          this.validitingUser()
          this.convertToZero()
          this.closingForm = true
          this.validationFilters = true
          this.addForm = false
          this.editClosing = false
          this.selected = false
          this.dates = false
          this.closing.encargada = ""

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
                        this.validitingUser()
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