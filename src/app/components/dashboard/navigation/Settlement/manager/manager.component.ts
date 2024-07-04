import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormControl, FormGroup } from '@angular/forms'
import Swal from 'sweetalert2'
import { ActivatedRoute, Router } from '@angular/router'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'

// Servicios
import { Service } from 'src/app/core/services/service'
import { ServiceManager } from 'src/app/core/services/manager'
import { ServiceLiquidationManager } from 'src/app/core/services/managerCloseouts'

// Model
import { LiquidationManager } from 'src/app/core/models/liquidationManager'
import { ModelService } from 'src/app/core/models/service'

import moment from 'moment'

@Component({
  selector: 'app-manager',
  templateUrl: './manager.component.html',
  styleUrls: ['./manager.component.css']
})
export class ManagerComponent implements OnInit {

  buttonSave: any
  dates: boolean = false
  loading: boolean = false
  deleteButton: boolean = false
  validationFilters: boolean = true
  CurrenDate = ""
  idSettled: number
  liquidationForm: boolean
  addForm: boolean
  editEncarg: boolean
  filterByName: string
  filterByNumber: number
  filtredBusqueda: string
  unliquidatedService: any
  liquidated: any
  settledData: any
  page!: number
  managerTitle = ""
  idManager: string
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

  // Fecha
  fechaInicio: string
  fechaFinal: string

  selected: boolean
  idUser: number

  company: string

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

  liquidationManager: LiquidationManager = {
    company: "",
    currentDate: "",
    desdeFechaLiquidado: "",
    desdeHoraLiquidado: "",
    encargada: "",
    fixedDay: 0,
    hastaFechaLiquidado: "",
    hastaHoraLiquidado: new Date().toTimeString().substring(0, 5),
    createdDate: "",
    id: 0,
    idUnico: "",
    idEncargada: "",
    importe: 0,
    tratamiento: 0,
  }

  services: ModelService = {
    idEncargada: "",
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
    public serviceLiquidationManager: ServiceLiquidationManager
  ) { }

  async ngOnInit(): Promise<void> {
    this.liquidationForm = true
    this.addForm = false
    this.selected = false
    this.editEncarg = false
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

  async consultLiquidationManagerByAdministrator() {

    this.serviceManager.getById(this.idUser).subscribe(async (rp: any) => {
      this.serviceLiquidationManager.getLiquidacionesEncargada(rp[0].company).subscribe(async (rp: any) => {
        this.liquidated = rp

        this.liquidationForm = true
        this.validationFilters = true
        this.addForm = false
        this.editEncarg = false
        this.selected = false
        this.dates = false
        this.liquidationManager.encargada = ""
      })
    })
  }

  async consultLiquidationManagerByManager() {
    this.serviceLiquidationManager.getByEncargada(this.liquidationManager.encargada).subscribe(async (rp) => {
      this.liquidated = rp

      this.liquidationForm = true
      this.validationFilters = true
      this.addForm = false
      this.editEncarg = false
      this.selected = false
      this.dates = false
      this.liquidationManager.encargada = ""
    })
  }

  async validitingUser() {
    this.serviceManager.getById(this.idUser).subscribe(async (rp) => {
      this.company = rp[0].company
      if (rp[0]['rol'] == 'administrador') {
        this.administratorRole = true
        this.loading = false
        this.GetAllManagers()
      } else {
        this.manager = rp
        this.loading = false
        this.administratorRole = false
        this.liquidationManager.encargada = this.manager[0].nombre
        this.liquidationManager.company = this.company
        this.getManager()
      }

      this.thousandPount()
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
    this.totalCommission = 0
  }

  validateNullData() {
    if (this.managerName?.['servicio'] == "") this.managerName['servicio'] = 0
    if (this.managerName?.['propina'] == "") this.managerName['propina'] = 0
    if (this.managerName?.['bebida'] == "") this.managerName['bebida'] = 0
    if (this.managerName?.['tabaco'] == "") this.managerName['tabaco'] = 0
    if (this.managerName?.['vitamina'] == "") this.managerName['vitamina'] = 0
    if (this.managerName?.['otros'] == "") this.managerName['otros'] = 0
    if (this.totalService == undefined) this.totalService = 0
    if (this.totalTipValue == undefined) this.totalTipValue = 0
    if (this.totalManagerValue == undefined) this.totalManagerValue = 0
    if (this.totalValueDrink == undefined) this.totalValueDrink = 0
    if (this.totalValueDrinkTherap == undefined) this.totalValueDrinkTherap = 0
    if (this.totalTobaccoValue == undefined) this.totalTobaccoValue = 0
    if (this.totalValueVitamins == undefined) this.totalValueVitamins = 0
    if (this.totalValueOther == undefined) this.totalValueOther = 0
    if (this.serviceCommission == undefined || Number.isNaN(this.serviceCommission)) this.serviceCommission = 0
    if (this.commissionTip == undefined || Number.isNaN(this.commissionTip)) this.commissionTip = 0
    if (this.beverageCommission == undefined || Number.isNaN(this.beverageCommission)) this.beverageCommission = 0
    if (this.beverageTherapistCommission == undefined || Number.isNaN(this.beverageTherapistCommission)) this.beverageTherapistCommission = 0
    if (this.tobaccoCommission == undefined || Number.isNaN(this.tobaccoCommission)) this.tobaccoCommission = 0
    if (this.vitaminCommission == undefined || Number.isNaN(this.vitaminCommission)) this.vitaminCommission = 0
    if (this.commissionOthers == undefined || Number.isNaN(this.commissionOthers)) this.commissionOthers = 0
    if (this.sumCommission == undefined || Number.isNaN(this.sumCommission)) this.sumCommission = 0
    if (this.totalCommission == undefined || Number.isNaN(this.totalCommission)) this.totalCommission = 0
    if (this.receivedManager == undefined || Number.isNaN(this.receivedManager)) this.receivedManager = 0
    if (this.totalCash == undefined) this.totalCash = 0
    if (this.totalBizum == undefined) this.totalBizum = 0
    if (this.totalCard == undefined) this.totalCard = 0
    if (this.totalTransaction == undefined) this.totalTransaction = 0
    if (this.totalTherapistPayment == undefined) this.totalTherapistPayment = 0
  }

  async thousandPount() {

    this.serviceManager.getById(this.idUser).subscribe((rp) => {
      if (rp[0]['rol'] == 'administrador') {

        this.serviceLiquidationManager.getLiquidacionesEncargada(this.company).subscribe((datoLiquidaciones: any) => {
          this.liquidated = datoLiquidaciones

          for (let o = 0; o < this.liquidated.length; o++) {
            if (this.liquidated[o].importe > 999) {

              const coma = this.liquidated[o].importe.toString().indexOf(".") !== -1 ? true : false;
              const array = coma ? this.liquidated[o].importe.toString().split(".") : this.liquidated[o].importe.toString().split("");
              let integer = coma ? array[o].split("") : array;
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
              this.liquidated[o]['importe'] = integer[0].toString()
            } else {
              this.liquidated[o]['importe'] = this.liquidated[o].importe.toString()
            }
          }
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
      return (this.liquidationManager.encargada) ? serv.encargada === this.liquidationManager.encargada : true
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

    if (this.liquidationManager.encargada != "" ||
      this.formTemplate.value.fechaInicio || this.formTemplate.value.FechaFin != "") {
      this.idLiquidation = this.liquidated.filter(serv => managerCondition(serv) &&
        searchCondition(serv) && conditionBetweenDates(serv))
    }
  }

  async OK() {
    this.modalService.dismissAll()

    await this.serviceManager.getById(this.idUser).subscribe(async (rp) => {
      if (rp[0]['rol'] == 'administrador') {
        if (this.liquidationManager.encargada != "" ||
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
    this.service.getByLiquidManagerFalse().subscribe((datoServicio) => {
      this.unliquidatedService = datoServicio
      return true
    })
    return false
  }

  async getManager() {
    this.serviceLiquidationManager.getByEncargada(this.liquidationManager.encargada).subscribe(async (rp) => {
      this.liquidated = rp
    })
  }

  async GetAllManagers() {
    this.serviceManager.getById(this.idUser).subscribe(async (rp: any) => {
      this.liquidationManager.company = rp[0].company
      this.serviceManager.getByCompany(rp[0].company).subscribe((datosEncargada: any) => {
        this.manager = datosEncargada
      })
    })
  }

  insertForm() {
    this.validationFilters = false

    if (this.administratorRole == true) {
      this.liquidationManager.encargada = ""
    } else {
      this.calculateServices()
    }

    this.liquidationManager.encargada = ""
    this.liquidationForm = false
    this.editEncarg = false
    this.selected = false
    this.dates = false
    this.addForm = true
  }

  notes(targetModal, modal) {
    var notaMensaje = []
    this.service.getById(targetModal).subscribe((datoServicio) => {
      notaMensaje = datoServicio[0]

      if (notaMensaje['nota'] != '')
        this.modalService.open(modal, {
          centered: true,
          backdrop: 'static',
        })
    })
  }

  async dateExists() {
    let fromMonth = '', fromDay = '', fromYear = '', convertMonth = '', convertDay = '',
      untilMonth = 0, untilDay = 0, untilYear = 0, currentDate = new Date()

    await this.serviceLiquidationManager.getByEncargada(this.liquidationManager.encargada).subscribe(async (rp: any) => {
      if (rp.length > 0) {

        fromDay = rp[0]['hastaFechaLiquidado'].substring(0, 2)
        fromMonth = rp[0]['hastaFechaLiquidado'].substring(3, 5)
        fromYear = rp[0]['hastaFechaLiquidado'].substring(6, 8)

        this.liquidationManager.desdeFechaLiquidado = `${'20' + fromYear}-${fromMonth}-${fromDay}`
        this.liquidationManager.desdeHoraLiquidado = rp[0]['hastaHoraLiquidado']
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
      this.liquidationManager.hastaFechaLiquidado = `${untilYear}-${convertMonth}-${untilDay}`
    } else {
      convertMonth = untilMonth.toString()
      this.liquidationManager.hastaFechaLiquidado = `${untilYear}-${convertMonth}-${untilDay}`
    }

    if (untilDay > 0 && untilDay < 10) {
      convertDay = '0' + untilDay
      this.liquidationManager.hastaFechaLiquidado = `${untilYear}-${convertMonth}-${convertDay}`
    } else {
      this.liquidationManager.hastaFechaLiquidado = `${untilYear}-${convertMonth}-${untilDay}`
    }
  }

  async calculateServices() {
    if (this.liquidationManager.encargada != "") {
      this.loading = true
      this.getThoseThatNotLiquidated()

      this.service.getByEncargada(this.liquidationManager.encargada).subscribe(async (resp: any) => {
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
    if (this.fixedTotalDay > 999) {

      const coma = this.fixedTotalDay.toString().indexOf(".") !== -1 ? true : false;
      const array = coma ? this.fixedTotalDay.toString().split(".") : this.fixedTotalDay.toString().split("");
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
      this.totalFixedDay = integer[0].toString()
    } else {
      this.totalFixedDay = this.fixedTotalDay.toString()
    }
  }

  async inputDateAndTime() {
    let comisiServicio = 0, comiPropina = 0, comiBebida = 0, comiBebidaTerap = 0, comiTabaco = 0, comiVitamina = 0, comiOtros = 0,
      sumComision = 0

    this.totalCommission = 0

    this.service.getByEncargadaFechaHoraInicioFechaHoraFin(this.liquidationManager.encargada,
      this.liquidationManager.desdeHoraLiquidado, this.liquidationManager.hastaHoraLiquidado,
      this.liquidationManager.desdeFechaLiquidado, this.liquidationManager.hastaFechaLiquidado, this.liquidationManager.company).subscribe(async (rp: any) => {

        if (rp.length > 0) {
          this.unliquidatedService = rp

          // Filter by servicio
          const servicios = this.unliquidatedService.filter(serv => serv)
          this.totalService = servicios.reduce((accumulator, serv) => {
            return accumulator + serv.servicio
          }, 0)

          // Filter by Propina
          const propinas = this.unliquidatedService.filter(serv => serv)
          this.totalTipValue = propinas.reduce((accumulator, serv) => {
            return accumulator + serv.propina
          }, 0)

          // Filter by Pago
          const terapeuta = this.unliquidatedService.filter(serv => serv)
          this.totalManagerValue = terapeuta.reduce((accumulator, serv) => {
            return accumulator + serv.numberEncarg
          }, 0)

          // Filter by Drink
          const bebida = this.unliquidatedService.filter(serv => serv)
          this.totalValueDrink = bebida.reduce((accumulator, serv) => {
            return accumulator + serv.bebidas
          }, 0)

          // Filter by Drink Therapist
          const drinkTherap = rp.filter(serv => serv)
          this.totalValueDrinkTherap = drinkTherap.reduce((accumulator, serv) => {
            return accumulator + serv.bebidaTerap
          }, 0)

          // Filter by Tabaco
          const tabac = this.unliquidatedService.filter(serv => serv)
          this.totalTobaccoValue = tabac.reduce((accumulator, serv) => {
            return accumulator + serv.tabaco
          }, 0)

          // Filter by Vitamina
          const vitamina = this.unliquidatedService.filter(serv => serv)
          this.totalValueVitamins = vitamina.reduce((accumulator, serv) => {
            return accumulator + serv.vitaminas
          }, 0)

          // Filter by Others
          const otroServicio = this.unliquidatedService.filter(serv => serv)
          this.totalValueOther = otroServicio.reduce((accumulator, serv) => {
            return accumulator + serv.otros
          }, 0)

          // Filter by totalCash
          const totalCashs = this.unliquidatedService.filter(serv => serv)
          this.totalCash = totalCashs.reduce((accumulator, serv) => {
            return accumulator + serv.valueEfectEncargada
          }, 0)

          // Filter by totalBizum
          const totalBizums = this.unliquidatedService.filter(serv => serv)
          this.totalBizum = totalBizums.reduce((accumulator, serv) => {
            return accumulator + serv.valueBizuEncargada
          }, 0)

          // Filter by totalCard
          const totalCards = this.unliquidatedService.filter(serv => serv)
          this.totalCard = totalCards.reduce((accumulator, serv) => {
            return accumulator + serv.valueTarjeEncargada
          }, 0)

          // Filter by totalTransaction
          const totalTransactions = this.unliquidatedService.filter(serv => serv)
          this.totalTransaction = totalTransactions.reduce((accumulator, serv) => {
            return accumulator + serv.valueTransEncargada
          }, 0)

          // Total therapist payment
          this.totalTherapistPayment = this.totalCash + this.totalCard + this.totalBizum + this.totalTransaction

          this.serviceManager.getEncargada(this.liquidationManager.encargada).subscribe((datosNameTerapeuta) => {
            this.managerName = datosNameTerapeuta[0]
            this.fijoDia = datosNameTerapeuta[0]['fijoDia']
            this.letterFixedDay = this.fijoDia.toString()

            // Comision
            comisiServicio = this.totalService / 100 * datosNameTerapeuta[0]['servicio']
            comiPropina = this.totalTipValue / 100 * datosNameTerapeuta[0]['propina']
            comiBebida = this.totalValueDrink / 100 * datosNameTerapeuta[0]['bebida']
            comiBebidaTerap = this.totalValueDrinkTherap / 100 * datosNameTerapeuta[0]['bebidaTerap']
            comiTabaco = this.totalTobaccoValue / 100 * datosNameTerapeuta[0]['tabaco']
            comiVitamina = this.totalValueVitamins / 100 * datosNameTerapeuta[0]['vitamina']
            comiOtros = this.totalValueOther / 100 * datosNameTerapeuta[0]['otros']

            // Conversion decimal
            this.serviceCommission = Math.ceil(comisiServicio)
            this.commissionTip = Math.ceil(comiPropina)
            this.beverageCommission = Math.ceil(comiBebida)
            this.beverageTherapistCommission = Math.ceil(comiBebidaTerap)
            this.tobaccoCommission = Math.ceil(comiTabaco)
            this.vitaminCommission = Math.ceil(comiVitamina)
            this.commissionOthers = Math.ceil(comiOtros)

            sumComision = Number(this.serviceCommission) + Number(this.commissionTip) +
              Number(this.beverageCommission) + + Number(this.beverageTherapistCommission) + Number(this.tobaccoCommission) +
              Number(this.vitaminCommission) + Number(this.commissionOthers)

            if (this.sumCommission != 0 || this.sumCommission != undefined) {
              this.sumCommission = Math.ceil(sumComision)
            }

            this.calculateTheDays()
            this.fixedTotalDay = this.fixedDay * this.fijoDia
            this.pountFixedDay()

            // Recibido
            this.receivedManager = this.totalManagerValue
            this.totalCommission = Math.ceil(this.sumCommission) + this.fixedTotalDay - Number(this.receivedManager)
            this.liquidationManager.importe = this.totalCommission

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
          this.textTotalComission = '0'

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

    dayEnd = this.liquidationManager.desdeFechaLiquidado.substring(8, 10)
    monthEnd = this.liquidationManager.desdeFechaLiquidado.substring(5, 7)
    yearEnd = this.liquidationManager.desdeFechaLiquidado.substring(0, 4)

    var date1 = moment(`${yearEnd}-${monthEnd}-${dayEnd}`, "YYYY-MM-DD")

    // Date 2

    day = this.liquidationManager.hastaFechaLiquidado.substring(8, 10)
    month = this.liquidationManager.hastaFechaLiquidado.substring(5, 7)
    year = this.liquidationManager.hastaFechaLiquidado.substring(0, 4)

    var date2 = moment(`${year}-${month}-${day}`, "YYYY-MM-DD")

    // this.fixedDay = date1.diff(date2, 'd')
    this.fixedDay = date2.diff(date1, 'days')
  }

  async dateDoesNotExist() {
    let año = "", mes = "", dia = ""

    await this.service.getEncargadaFechaAsc(this.liquidationManager.encargada).subscribe(async (rp) => {
      año = rp[0]['fechaHoyInicio'].substring(0, 4)
      mes = rp[0]['fechaHoyInicio'].substring(5, 7)
      dia = rp[0]['fechaHoyInicio'].substring(8, 10)
      this.liquidationManager.desdeFechaLiquidado = `${año}-${mes}-${dia}`
      this.liquidationManager.desdeHoraLiquidado = rp[0]['horaStart']
      await this.inputDateAndTime()
    })
  }

  thousandPoint() {
    if (this.totalCommission > 999) {

      const coma = this.totalCommission.toString().indexOf(".") !== -1 ? true : false;
      const array = coma ? this.totalCommission.toString().split(".") : this.totalCommission.toString().split("");
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
      this.textTotalComission = integer[0].toString()
    } else {
      this.textTotalComission = this.totalCommission.toString()
    }

    for (let o = 0; o < this.unliquidatedService?.length; o++) {
      if (this.unliquidatedService[o]?.servicio > 999) {

        const coma = this.unliquidatedService[o]?.servicio.toString().indexOf(".") !== -1 ? true : false;
        const array = coma ? this.unliquidatedService[o]?.servicio.toString().split(".") : this.unliquidatedService[o]?.servicio.toString().split("");
        let integer = coma ? array[o].split("") : array;
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
        this.unliquidatedService[o]['servicio'] = integer[0].toString()
      } else {
        this.unliquidatedService[o]['servicio'] = this.unliquidatedService[o]?.servicio
      }

      if (this.unliquidatedService[o]?.propina > 999) {

        const coma = this.unliquidatedService[o]?.propina.toString().indexOf(".") !== -1 ? true : false;
        const array = coma ? this.unliquidatedService[o]?.propina.toString().split(".") : this.unliquidatedService[o]?.propina.toString().split("");
        let integer = coma ? array[o].split("") : array;
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
        this.unliquidatedService[o]['propina'] = integer[0].toString()
      } else {
        this.unliquidatedService[o]['propina'] = this.unliquidatedService[o]?.propina
      }

      if (this.unliquidatedService[o]?.numberEncarg > 999) {

        const coma = this.unliquidatedService[o]?.numberEncarg.toString().indexOf(".") !== -1 ? true : false;
        const array = coma ? this.unliquidatedService[o]?.numberEncarg.toString().split(".") : this.unliquidatedService[o]?.numberEncarg.toString().split("");
        let integer = coma ? array[o].split("") : array;
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
        this.unliquidatedService[o]['numberEncarg'] = integer[0].toString()
      } else {
        this.unliquidatedService[o]['numberEncarg'] = this.unliquidatedService[o]?.numberEncarg
      }

      if (this.unliquidatedService[o]?.bebidas > 999) {

        const coma = this.unliquidatedService[o]?.bebidas.toString().indexOf(".") !== -1 ? true : false;
        const array = coma ? this.unliquidatedService[o]?.bebidas.toString().split(".") : this.unliquidatedService[o]?.bebidas.toString().split("");
        let integer = coma ? array[o].split("") : array;
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
        this.unliquidatedService[o]['bebidas'] = integer[0].toString()
      } else {
        this.unliquidatedService[o]['bebidas'] = this.unliquidatedService[o]?.bebidas
      }

      if (this.unliquidatedService[o]?.tabaco > 999) {

        const coma = this.unliquidatedService[o]?.tabaco.toString().indexOf(".") !== -1 ? true : false;
        const array = coma ? this.unliquidatedService[o]?.tabaco.toString().split(".") : this.unliquidatedService[o]?.tabaco.toString().split("");
        let integer = coma ? array[o].split("") : array;
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
        this.unliquidatedService[o]['tabaco'] = integer[0].toString()
      } else {
        this.unliquidatedService[o]['tabaco'] = this.unliquidatedService[o]?.tabaco
      }

      if (this.unliquidatedService[o]?.vitaminas > 999) {

        const coma = this.unliquidatedService[o]?.vitaminas.toString().indexOf(".") !== -1 ? true : false;
        const array = coma ? this.unliquidatedService[o]?.vitaminas.toString().split(".") : this.unliquidatedService[o]?.vitaminas.toString().split("");
        let integer = coma ? array[o].split("") : array;
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
        this.unliquidatedService[o]['vitaminas'] = integer[0].toString()
      } else {
        this.unliquidatedService[o]['vitaminas'] = this.unliquidatedService[o]?.vitaminas
      }

      if (this.unliquidatedService[o]?.otros > 999) {

        const coma = this.unliquidatedService[o]?.otros.toString().indexOf(".") !== -1 ? true : false;
        const array = coma ? this.unliquidatedService[o]?.otros.toString().split(".") : this.unliquidatedService[o]?.otros.toString().split("");
        let integer = coma ? array[o].split("") : array;
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
        this.unliquidatedService[o]['otros'] = integer[0].toString()
      } else {
        this.unliquidatedService[o]['otros'] = this.unliquidatedService[o]?.otros
      }
    }

    if (this.totalService > 999) {

      const coma = this.totalService.toString().indexOf(".") !== -1 ? true : false;
      const array = coma ? this.totalService.toString().split(".") : this.totalService.toString().split("");
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
      this.textTotalService = integer[0].toString()
    } else {
      this.textTotalService = this.totalService.toString()
    }

    if (this.serviceCommission > 999) {

      const coma = this.serviceCommission.toString().indexOf(".") !== -1 ? true : false;
      const array = coma ? this.serviceCommission.toString().split(".") : this.serviceCommission.toString().split("");
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
      this.textServiceComission = integer[0].toString()
    } else {
      this.textServiceComission = this.serviceCommission.toString()
    }

    if (this.totalTipValue > 999) {

      const coma = this.totalTipValue.toString().indexOf(".") !== -1 ? true : false;
      const array = coma ? this.totalTipValue.toString().split(".") : this.totalTipValue.toString().split("");
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
      this.textTotalTip2 = integer[0].toString()
    } else {
      this.textTotalTip2 = this.totalTipValue.toString()
    }

    if (this.commissionTip > 999) {

      const coma = this.commissionTip.toString().indexOf(".") !== -1 ? true : false;
      const array = coma ? this.commissionTip.toString().split(".") : this.commissionTip.toString().split("");
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
      this.textComissionTip = integer[0].toString()
    } else {
      this.textComissionTip = this.commissionTip.toString()
    }

    if (this.totalValueDrink > 999) {

      const coma = this.totalValueDrink.toString().indexOf(".") !== -1 ? true : false;
      const array = coma ? this.totalValueDrink.toString().split(".") : this.totalValueDrink.toString().split("");
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
      this.textValueDrink = integer[0].toString()
    } else {
      this.textValueDrink = this.totalValueDrink.toString()
    }

    if (this.totalValueDrinkTherap > 999) {

      const coma = this.totalValueDrinkTherap.toString().indexOf(".") !== -1 ? true : false;
      const array = coma ? this.totalValueDrinkTherap.toString().split(".") : this.totalValueDrinkTherap.toString().split("");
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
      this.textValueDrinkTherap = integer[0].toString()
    } else {
      this.textValueDrinkTherap = this.totalValueDrinkTherap.toString()
    }

    if (this.beverageCommission > 999) {

      const coma = this.beverageCommission.toString().indexOf(".") !== -1 ? true : false;
      const array = coma ? this.beverageCommission.toString().split(".") : this.beverageCommission.toString().split("");
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
      this.textBeverageCommission = integer[0].toString()
    } else {
      this.textBeverageCommission = this.beverageCommission.toString()
    }

    if (this.beverageTherapistCommission > 999) {

      const coma = this.beverageTherapistCommission.toString().indexOf(".") !== -1 ? true : false;
      const array = coma ? this.beverageTherapistCommission.toString().split(".") : this.beverageTherapistCommission.toString().split("");
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
      this.textbeverageTherapistCommission = integer[0].toString()
    } else {
      this.textbeverageTherapistCommission = this.beverageTherapistCommission.toString()
    }

    if (this.totalTobaccoValue > 999) {

      const coma = this.totalTobaccoValue.toString().indexOf(".") !== -1 ? true : false;
      const array = coma ? this.totalTobaccoValue.toString().split(".") : this.totalTobaccoValue.toString().split("");
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
      this.textTobaccoValue = integer[0].toString()
    } else {
      this.textTobaccoValue = this.totalTobaccoValue.toString()
    }

    if (this.tobaccoCommission > 999) {

      const coma = this.tobaccoCommission.toString().indexOf(".") !== -1 ? true : false;
      const array = coma ? this.tobaccoCommission.toString().split(".") : this.tobaccoCommission.toString().split("");
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
      this.textTobaccoCommission = integer[0].toString()
    } else {
      this.textTobaccoCommission = this.tobaccoCommission.toString()
    }

    if (this.totalValueVitamins > 999) {

      const coma = this.totalValueVitamins.toString().indexOf(".") !== -1 ? true : false;
      const array = coma ? this.totalValueVitamins.toString().split(".") : this.totalValueVitamins.toString().split("");
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
      this.textValueVitamins = integer[0].toString()
    } else {
      this.textValueVitamins = this.totalValueVitamins.toString()
    }

    if (this.vitaminCommission > 999) {

      const coma = this.vitaminCommission.toString().indexOf(".") !== -1 ? true : false;
      const array = coma ? this.vitaminCommission.toString().split(".") : this.vitaminCommission.toString().split("");
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
      this.textVitaminCommission = integer[0].toString()
    } else {
      this.textVitaminCommission = this.vitaminCommission.toString()
    }

    if (this.totalValueOther > 999) {

      const coma = this.totalValueOther.toString().indexOf(".") !== -1 ? true : false;
      const array = coma ? this.totalValueOther.toString().split(".") : this.totalValueOther.toString().split("");
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
      this.textValueOther = integer[0].toString()
    } else {
      this.textValueOther = this.totalValueOther.toString()
    }

    if (this.commissionOthers > 999) {

      const coma = this.commissionOthers.toString().indexOf(".") !== -1 ? true : false;
      const array = coma ? this.commissionOthers.toString().split(".") : this.commissionOthers.toString().split("");
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
      this.textCommissionOthers = integer[0].toString()
    } else {
      this.textCommissionOthers = this.commissionOthers.toString()
    }

    if (this.sumCommission > 999) {

      const coma = this.sumCommission.toString().indexOf(".") !== -1 ? true : false;
      const array = coma ? this.sumCommission.toString().split(".") : this.sumCommission.toString().split("");
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
      this.textSumCommission = integer[0].toString()
    } else {
      this.textSumCommission = this.sumCommission.toString()
    }

    if (this.receivedManager > 999) {

      const coma = this.receivedManager.toString().indexOf(".") !== -1 ? true : false;
      const array = coma ? this.receivedManager.toString().split(".") : this.receivedManager.toString().split("");
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
      this.textReceivedManager = integer[0].toString()
    } else {
      this.textReceivedManager = this.receivedManager.toString()
    }

    if (this.totalCommission > 999) {

      const coma = this.totalCommission.toString().indexOf(".") !== -1 ? true : false;
      const array = coma ? this.totalCommission.toString().split(".") : this.totalCommission.toString().split("");
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
      this.textTotalCommission = integer[0].toString()
    } else {
      this.textTotalCommission = this.totalCommission.toString()
    }

    if (this.totalCash > 999) {

      const coma = this.totalCash.toString().indexOf(".") !== -1 ? true : false;
      const array = coma ? this.totalCash.toString().split(".") : this.totalCash.toString().split("");
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
      this.textTotalCash = integer[0].toString()
    } else {
      this.textTotalCash = this.totalCash.toString()
    }

    if (this.totalBizum > 999) {

      const coma = this.totalBizum.toString().indexOf(".") !== -1 ? true : false;
      const array = coma ? this.totalBizum.toString().split(".") : this.totalBizum.toString().split("");
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
      this.textTotalBizum = integer[0].toString()
    } else {
      this.textTotalBizum = this.totalBizum.toString()
    }


    if (this.totalCard > 999) {

      const coma = this.totalCard.toString().indexOf(".") !== -1 ? true : false;
      const array = coma ? this.totalCard.toString().split(".") : this.totalCard.toString().split("");
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
      this.textTotalCard = integer[0].toString()
    } else {
      this.textTotalCard = this.totalCard.toString()
    }

    if (this.totalTransaction > 999) {

      const coma = this.totalTransaction.toString().indexOf(".") !== -1 ? true : false;
      const array = coma ? this.totalTransaction.toString().split(".") : this.totalTransaction.toString().split("");
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
      this.textTotalTransaction = integer[0].toString()
    } else {
      this.textTotalTransaction = this.totalTransaction.toString()
    }

    if (this.totalTherapistPayment > 999) {

      const coma = this.totalTherapistPayment.toString().indexOf(".") !== -1 ? true : false;
      const array = coma ? this.totalTherapistPayment.toString().split(".") : this.totalTherapistPayment.toString().split("");
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
      this.textTotalManagerPayment = integer[0].toString()
    } else {
      this.textTotalManagerPayment = this.totalTherapistPayment.toString()
    }
  }

  arrowLine1() {
    document.querySelector('.column').scrollLeft += 30;
    document.getElementById('arrowLine1').style.display = 'none'
  }

  arrowTable2Add() {
    document.querySelector('.column2').scrollLeft += 30;
    document.getElementById('arrowTable2Add').style.display = 'none'
  }

  fixedNumberDay(event: any) {
    let numberValue = 0
    numberValue = Number(event.target.value)
    this.liquidationManager.fixedDay = Number(event.target.value)

    if (numberValue > 0) {
      this.serviceManager.getEncargada(this.liquidationManager.encargada).subscribe((resp: any) => {
        this.fijoDia = resp[0]['fijoDia']
        this.letterFixedDay = this.fijoDia.toString()
        this.fixedTotalDay = numberValue * this.fijoDia
        this.pountFixedDay()
        this.totalCommission = this.sumCommission + this.fixedTotalDay - this.receivedManager
        this.liquidationManager.importe = this.totalCommission

        if (this.totalCommission > 999) {

          const coma = this.totalCommission.toString().indexOf(".") !== -1 ? true : false;
          const array = coma ? this.totalCommission.toString().split(".") : this.totalCommission.toString().split("");
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
          this.textTotalCommission = integer[0].toString()
          this.textTotalComission = integer[0].toString()
        } else {
          this.textTotalCommission = this.totalCommission.toString()
          this.textTotalComission = this.totalCommission.toString()
        }
      })
    }
  }

  // Edit

  calculateTheDaysEdit() {
    let day = '', convertDay = '', month = '', year = '', hour = new Date().toTimeString().substring(0, 8), dayEnd = '', monthEnd = '', yearEnd = ''

    dayEnd = this.liquidationManager.desdeFechaLiquidado.substring(0, 2)
    monthEnd = this.liquidationManager.desdeFechaLiquidado.substring(3, 5)
    yearEnd = this.liquidationManager.desdeFechaLiquidado.substring(6, 8)

    var date1 = moment(`${yearEnd}-${monthEnd}-${dayEnd}`, "YY-MM-DD")

    // Date 2

    day = this.liquidationManager.hastaFechaLiquidado.substring(0, 2)
    month = this.liquidationManager.hastaFechaLiquidado.substring(3, 5)
    year = this.liquidationManager.hastaFechaLiquidado.substring(6, 8)

    var date2 = moment(`${year}-${month}-${day}`, "YY-MM-DD")

    // this.fixedDay = date1.diff(date2, 'd')
    this.fixedDay = this.liquidationManager.fixedDay
  }

  convertToZeroEdit() {
    this.textTotalComission = '0'
    this.textTotalService = '0'
    this.textTotalTip2 = '0'
    this.textValueDrink = '0'
    this.textValueDrinkTherap = '0'
    this.textTobaccoValue = '0'
    this.textValueVitamins = '0'
    this.textValueOther = '0'
    this.managerName = '0'
    this.textServiceComission = '0'
    this.commissionTip = 0
    this.textBeverageCommission = '0'
    this.textbeverageTherapistCommission = '0'
    this.textTobaccoCommission = '0'
    this.textVitaminCommission = '0'
    this.textComissionTip = '0'
    this.textCommissionOthers = '0'
    this.textSumCommission = '0'
    this.textReceivedManager = '0'
    this.textTotalCommission = '0'
    this.textTotalCash = '0'
    this.textTotalBizum = '0'
    this.textTotalCard = '0'
    this.textTotalTransaction = '0'
    this.textTotalManagerPayment = '0'
  }

  async thousandPointEdit() {
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
      this.textTotalComission = integer[0].toString()
    } else {
      this.textTotalComission = this.totalLiquidation.toString()
    }

    if (this.totalService > 999) {

      const coma = this.totalService.toString().indexOf(".") !== -1 ? true : false;
      const array = coma ? this.totalService.toString().split(".") : this.totalService.toString().split("");
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
      this.textTotalService = integer[0].toString()
    } else {
      this.textTotalService = this.totalService.toString()
    }

    if (this.serviceCommission > 999) {

      const coma = this.serviceCommission.toString().indexOf(".") !== -1 ? true : false;
      const array = coma ? this.serviceCommission.toString().split(".") : this.serviceCommission.toString().split("");
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
      this.textServiceComission = integer[0].toString()
    } else {
      this.textServiceComission = this.serviceCommission.toString()
    }

    if (this.totalTipValue > 999) {

      const coma = this.totalTipValue.toString().indexOf(".") !== -1 ? true : false;
      const array = coma ? this.totalTipValue.toString().split(".") : this.totalTipValue.toString().split("");
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
      this.textTotalTip2 = integer[0].toString()
    } else {
      this.textTotalTip2 = this.totalTipValue.toString()
    }

    if (this.commissionTip > 999) {

      const coma = this.commissionTip.toString().indexOf(".") !== -1 ? true : false;
      const array = coma ? this.commissionTip.toString().split(".") : this.commissionTip.toString().split("");
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
      this.textComissionTip = integer[0].toString()
    } else {
      this.textComissionTip = this.commissionTip.toString()
    }

    if (this.totalValueDrink > 999) {

      const coma = this.totalValueDrink.toString().indexOf(".") !== -1 ? true : false;
      const array = coma ? this.totalValueDrink.toString().split(".") : this.totalValueDrink.toString().split("");
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
      this.textValueDrink = integer[0].toString()
    } else {
      this.textValueDrink = this.totalValueDrink.toString()
    }

    if (this.totalValueDrinkTherap > 999) {

      const coma = this.totalValueDrinkTherap.toString().indexOf(".") !== -1 ? true : false;
      const array = coma ? this.totalValueDrinkTherap.toString().split(".") : this.totalValueDrinkTherap.toString().split("");
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
      this.textValueDrinkTherap = integer[0].toString()
    } else {
      this.textValueDrinkTherap = this.totalValueDrinkTherap.toString()
    }

    if (this.beverageCommission > 999) {

      const coma = this.beverageCommission.toString().indexOf(".") !== -1 ? true : false;
      const array = coma ? this.beverageCommission.toString().split(".") : this.beverageCommission.toString().split("");
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
      this.textBeverageCommission = integer[0].toString()
    } else {
      this.textBeverageCommission = this.beverageCommission.toString()
    }

    if (this.beverageTherapistCommission > 999) {

      const coma = this.beverageTherapistCommission.toString().indexOf(".") !== -1 ? true : false;
      const array = coma ? this.beverageTherapistCommission.toString().split(".") : this.beverageTherapistCommission.toString().split("");
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
      this.textbeverageTherapistCommission = integer[0].toString()
    } else {
      this.textbeverageTherapistCommission = this.beverageTherapistCommission.toString()
    }

    if (this.totalTobaccoValue > 999) {

      const coma = this.totalTobaccoValue.toString().indexOf(".") !== -1 ? true : false;
      const array = coma ? this.totalTobaccoValue.toString().split(".") : this.totalTobaccoValue.toString().split("");
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
      this.textTobaccoValue = integer[0].toString()
    } else {
      this.textTobaccoValue = this.totalTobaccoValue.toString()
    }

    if (this.tobaccoCommission > 999) {

      const coma = this.tobaccoCommission.toString().indexOf(".") !== -1 ? true : false;
      const array = coma ? this.tobaccoCommission.toString().split(".") : this.tobaccoCommission.toString().split("");
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
      this.textTobaccoCommission = integer[0].toString()
    } else {
      this.textTobaccoCommission = this.tobaccoCommission.toString()
    }

    if (this.totalValueVitamins > 999) {

      const coma = this.totalValueVitamins.toString().indexOf(".") !== -1 ? true : false;
      const array = coma ? this.totalValueVitamins.toString().split(".") : this.totalValueVitamins.toString().split("");
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
      this.textValueVitamins = integer[0].toString()
    } else {
      this.textValueVitamins = this.totalValueVitamins.toString()
    }

    if (this.vitaminCommission > 999) {

      const coma = this.vitaminCommission.toString().indexOf(".") !== -1 ? true : false;
      const array = coma ? this.vitaminCommission.toString().split(".") : this.vitaminCommission.toString().split("");
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
      this.textVitaminCommission = integer[0].toString()
    } else {
      this.textVitaminCommission = this.vitaminCommission.toString()
    }

    if (this.totalValueOther > 999) {

      const coma = this.totalValueOther.toString().indexOf(".") !== -1 ? true : false;
      const array = coma ? this.totalValueOther.toString().split(".") : this.totalValueOther.toString().split("");
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
      this.textValueOther = integer[0].toString()
    } else {
      this.textValueOther = this.totalValueOther.toString()
    }

    if (this.commissionOthers > 999) {

      const coma = this.commissionOthers.toString().indexOf(".") !== -1 ? true : false;
      const array = coma ? this.commissionOthers.toString().split(".") : this.commissionOthers.toString().split("");
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
      this.textCommissionOthers = integer[0].toString()
    } else {
      this.textCommissionOthers = this.commissionOthers.toString()
    }

    if (this.sumCommission > 999) {

      const coma = this.sumCommission.toString().indexOf(".") !== -1 ? true : false;
      const array = coma ? this.sumCommission.toString().split(".") : this.sumCommission.toString().split("");
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
      this.textSumCommission = integer[0].toString()
    } else {
      this.textSumCommission = this.sumCommission.toString()
    }

    if (this.receivedManager > 999) {

      const coma = this.receivedManager.toString().indexOf(".") !== -1 ? true : false;
      const array = coma ? this.receivedManager.toString().split(".") : this.receivedManager.toString().split("");
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
      this.textReceivedManager = integer[0].toString()
    } else {
      this.textReceivedManager = this.receivedManager.toString()
    }

    if (this.totalCommission > 999) {

      const coma = this.totalCommission.toString().indexOf(".") !== -1 ? true : false;
      const array = coma ? this.totalCommission.toString().split(".") : this.totalCommission.toString().split("");
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
      this.textTotalCommission = integer[0].toString()
    } else {
      this.textTotalCommission = this.totalCommission.toString()
    }

    if (this.totalCash > 999) {

      const coma = this.totalCash.toString().indexOf(".") !== -1 ? true : false;
      const array = coma ? this.totalCash.toString().split(".") : this.totalCash.toString().split("");
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
      this.textTotalCash = integer[0].toString()
    } else {
      this.textTotalCash = this.totalCash.toString()
    }

    if (this.totalBizum > 999) {

      const coma = this.totalBizum.toString().indexOf(".") !== -1 ? true : false;
      const array = coma ? this.totalBizum.toString().split(".") : this.totalBizum.toString().split("");
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
      this.textTotalBizum = integer[0].toString()
    } else {
      this.textTotalBizum = this.totalBizum.toString()
    }


    if (this.totalCard > 999) {

      const coma = this.totalCard.toString().indexOf(".") !== -1 ? true : false;
      const array = coma ? this.totalCard.toString().split(".") : this.totalCard.toString().split("");
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
      this.textTotalCard = integer[0].toString()
    } else {
      this.textTotalCard = this.totalCard.toString()
    }

    if (this.totalTransaction > 999) {

      const coma = this.totalTransaction.toString().indexOf(".") !== -1 ? true : false;
      const array = coma ? this.totalTransaction.toString().split(".") : this.totalTransaction.toString().split("");
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
      this.textTotalTransaction = integer[0].toString()
    } else {
      this.textTotalTransaction = this.totalTransaction.toString()
    }

    if (this.totalTherapistPayment > 999) {

      const coma = this.totalTherapistPayment.toString().indexOf(".") !== -1 ? true : false;
      const array = coma ? this.totalTherapistPayment.toString().split(".") : this.totalTherapistPayment.toString().split("");
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
      this.textTotalManagerPayment = integer[0].toString()
    } else {
      this.textTotalManagerPayment = this.totalTherapistPayment.toString()
    }

    for (let o = 0; o < this.settledData?.length; o++) {
      if (this.settledData[o]?.servicio > 999) {

        const coma = this.settledData[o]?.servicio.toString().indexOf(".") !== -1 ? true : false;
        const array = coma ? this.settledData[o]?.servicio.toString().split(".") : this.settledData[o]?.servicio.toString().split("");
        let integer = coma ? array[o].split("") : array;
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
        this.settledData[o]['servicio'] = integer[0].toString()
      } else {
        this.settledData[o]['servicio'] = this.settledData[o]?.servicio
      }

      if (this.settledData[o]?.propina > 999) {

        const coma = this.settledData[o]?.propina.toString().indexOf(".") !== -1 ? true : false;
        const array = coma ? this.settledData[o]?.propina.toString().split(".") : this.settledData[o]?.propina.toString().split("");
        let integer = coma ? array[o].split("") : array;
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
        this.settledData[o]['propina'] = integer[0].toString()
      } else {
        this.settledData[o]['propina'] = this.settledData[o]?.propina
      }

      if (this.settledData[o]?.numberEncarg > 999) {

        const coma = this.settledData[o]?.numberEncarg.toString().indexOf(".") !== -1 ? true : false;
        const array = coma ? this.settledData[o]?.numberEncarg.toString().split(".") : this.settledData[o]?.numberEncarg.toString().split("");
        let integer = coma ? array[o].split("") : array;
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
        this.settledData[o]['numberEncarg'] = integer[0].toString()
      } else {
        this.settledData[o]['numberEncarg'] = this.settledData[o]?.numberEncarg
      }

      if (this.settledData[o]?.bebidas > 999) {

        const coma = this.settledData[o]?.bebidas.toString().indexOf(".") !== -1 ? true : false;
        const array = coma ? this.settledData[o]?.bebidas.toString().split(".") : this.settledData[o]?.bebidas.toString().split("");
        let integer = coma ? array[o].split("") : array;
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
        this.settledData[o]['bebidas'] = integer[0].toString()
      } else {
        this.settledData[o]['bebidas'] = this.settledData[o]?.bebidas
      }

      if (this.settledData[o]?.tabaco > 999) {

        const coma = this.settledData[o]?.tabaco.toString().indexOf(".") !== -1 ? true : false;
        const array = coma ? this.settledData[o]?.tabaco.toString().split(".") : this.settledData[o]?.tabaco.toString().split("");
        let integer = coma ? array[o].split("") : array;
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
        this.settledData[o]['tabaco'] = integer[0].toString()
      } else {
        this.settledData[o]['tabaco'] = this.settledData[o]?.tabaco
      }

      if (this.settledData[o]?.vitaminas > 999) {

        const coma = this.settledData[o]?.vitaminas.toString().indexOf(".") !== -1 ? true : false;
        const array = coma ? this.settledData[o]?.vitaminas.toString().split(".") : this.settledData[o]?.vitaminas.toString().split("");
        let integer = coma ? array[o].split("") : array;
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
        this.settledData[o]['vitaminas'] = integer[0].toString()
      } else {
        this.settledData[o]['vitaminas'] = this.settledData[o]?.vitaminas
      }

      if (this.settledData[o]?.otros > 999) {

        const coma = this.settledData[o]?.otros.toString().indexOf(".") !== -1 ? true : false;
        const array = coma ? this.settledData[o]?.otros.toString().split(".") : this.settledData[o]?.otros.toString().split("");
        let integer = coma ? array[o].split("") : array;
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
        this.settledData[o]['otros'] = integer[0].toString()
      } else {
        this.settledData[o]['otros'] = this.settledData[o]?.otros
      }
    }
  }

  goToEdit(id: number) {
    const params = this.activeRoute.snapshot['_urlSegment'].segments[1];
    this.idUser = Number(params.path)

    this.service.getById(id).subscribe((rp: any) => {
      if (rp.length > 0) this.router.navigate([`menu/${this.idUser}/nuevo-servicio/${rp[0]['id']}/true`])
    })
  }

  async dataFormEdit(idManager: string, id: number) {
    this.loading = true
    this.validationFilters = false
    this.liquidationForm = false
    this.idSettled = id
    this.idManager = idManager

    this.serviceLiquidationManager.getIdEncarg(idManager).subscribe(async (datosManager) => {
      this.liquidationManager.desdeFechaLiquidado = datosManager[0]['desdeFechaLiquidado']
      this.liquidationManager.desdeHoraLiquidado = datosManager[0]['desdeHoraLiquidado']
      this.liquidationManager.hastaFechaLiquidado = datosManager[0]['hastaFechaLiquidado']
      this.liquidationManager.hastaHoraLiquidado = datosManager[0]['hastaHoraLiquidado']
      this.liquidationManager.fixedDay = datosManager[0]['fixedDay']
    })

    await this.sumTotal(idManager)
  }

  async sumTotal(idManager: string) {
    this.service.getByIdEncarg(idManager).subscribe(async (rp: any) => {
      if (rp.length > 0) {
        this.settledData = rp
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

        this.comission(rp)
      } else {
        await this.serviceLiquidationManager.getIdEncarg(idManager).subscribe(async (rp: any) => {
          this.managerTitle = rp[0]['encargada']
          this.convertToZeroEdit()
          this.loading = false
          this.liquidationForm = false
          this.editEncarg = true
        })
      }
    })
  }

  async comission(element) {
    let comisiServicio = 0, comiPropina = 0, comiBebida = 0, comiBebidaTherapist = 0, comiTabaco = 0, comiVitamina = 0,
      comiOtros = 0, sumComision = 0, comission = 0

    this.serviceManager.getEncargada(element[0]['encargada']).subscribe(async (rp: any) => {
      if (rp.length > 0) {
        this.managerName = rp[0]
        this.fijoDia = rp[0]?.fijoDia
        this.letterFixedDay = this.fijoDia.toString()

        // Comision
        comisiServicio = this.totalService / 100 * rp[0]?.servicio
        comiPropina = this.totalTipValue / 100 * rp[0]?.propina
        comiBebida = this.totalValueDrink / 100 * rp[0]?.bebida
        comiBebidaTherapist = this.totalValueDrinkTherap / 100 * rp[0]?.bebidaTerap
        comiTabaco = this.totalTobaccoValue / 100 * rp[0]?.tabaco
        comiVitamina = this.totalValueVitamins / 100 * rp[0]?.vitamina
        comiOtros = this.totalValueOther / 100 * rp[0]?.otros

        // Conversion decimal
        this.serviceCommission = Number(comisiServicio.toFixed(0))
        this.commissionTip = Number(comiPropina.toFixed(0))
        this.beverageCommission = Number(comiBebida.toFixed(0))
        this.beverageTherapistCommission = Number(comiBebidaTherapist.toFixed(0))
        this.tobaccoCommission = Number(comiTabaco.toFixed(0))
        this.vitaminCommission = Number(comiVitamina.toFixed(0))
        this.commissionOthers = Number(comiOtros.toFixed(0))

        this.calculateTheDaysEdit()
        this.fixedTotalDay = this.fixedDay * this.fijoDia
        this.pountFixedDay()

        sumComision = Number(this.serviceCommission) + Number(this.commissionTip) +
          Number(this.beverageCommission) + + Number(this.beverageTherapistCommission) + Number(this.tobaccoCommission) +
          Number(this.vitaminCommission) + Number(this.commissionOthers)

        if (this.sumCommission != 0 || this.sumCommission != undefined) {
          this.sumCommission = Number(sumComision.toFixed(1))
        }

        // Recibido
        element.map(item => {
          const numberEncarg = this.settledData.filter(serv => serv)
          this.receivedManager = numberEncarg.reduce((accumulator, serv) => {
            return accumulator + serv.numberEncarg
          }, 0)
        })

        this.totalLiquidation = this.sumCommission - Number(this.receivedManager)
        comission = this.sumCommission + this.fixedTotalDay - Number(this.receivedManager)
        this.totalCommission = Number(comission.toFixed(2))

        this.validateNullData()
        await this.thousandPointEdit()
        if (rp.length == 0) this.textTotalComission = '0'
        this.loading = false
        this.liquidationForm = false
        this.editEncarg = true
      }
    })
  }

  formatDate() {
    let fromDay = '', fromMonth = '', fromYear = '', untilDay = '', untilMonth = '', untilYear = ''

    // From 

    fromDay = this.liquidationManager.desdeFechaLiquidado.substring(8, 10)
    fromMonth = this.liquidationManager.desdeFechaLiquidado.substring(5, 7)
    fromYear = this.liquidationManager.desdeFechaLiquidado.substring(2, 4)

    this.liquidationManager.desdeFechaLiquidado = `${fromDay}-${fromMonth}-${fromYear}`

    // Until

    untilDay = this.liquidationManager.hastaFechaLiquidado.substring(8, 10)
    untilMonth = this.liquidationManager.hastaFechaLiquidado.substring(5, 7)
    untilYear = this.liquidationManager.hastaFechaLiquidado.substring(2, 4)

    this.liquidationManager.hastaFechaLiquidado = `${untilDay}-${untilMonth}-${untilYear}`
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
        this.services.idEncargada = ""
        this.services.liquidadoEncargada = false
        this.service.updateManagerSettlementManagerIdByManagerId(this.idManager, this.services).subscribe(async (rp) => {
          this.serviceLiquidationManager.deleteLiquidationManager(this.idSettled).subscribe(async (rp) => {
            if (this.administratorRole == true) {
              await this.consultLiquidationManagerByAdministrator()
            }
            else {
              await this.consultLiquidationManagerByManager()
            }
          })
        })
      }
    })
  }

  // End edit

  save() {
    this.buttonSave = document.getElementById('btnSave') as HTMLButtonElement
    this.buttonSave.disabled = true;
    this.createUniqueId()
    this.liquidationManager.currentDate = this.currentDate.toString()
    this.formatDate()
    this.dateCurrentDay()

    if (this.liquidationManager.fixedDay == 0)
      this.liquidationManager.fixedDay = this.fixedDay

    if (this.liquidationManager.encargada != "") {

      this.serviceLiquidationManager.getByEncargada(this.liquidationManager.encargada).subscribe(async (rp: any) => {

        if (rp.length > 0) {

          for (let o = 0; o < this.unliquidatedService.length; o++) {
            this.liquidationManager.tratamiento = this.unliquidatedService.length
            this.services.liquidadoEncargada = true
            this.service.updateLiquidacionEncarg(this.unliquidatedService[o]['id'], this.services).subscribe((dates) => { })
          }

          this.serviceLiquidationManager.settlementRecord(this.liquidationManager).subscribe((dates: any) => { })
          this.thousandPount()

          if (this.administratorRole == true) {
            await this.consultLiquidationManagerByAdministrator()
          }
          else {
            await this.consultLiquidationManagerByManager()
          }

          Swal.fire({
            position: 'top-end', icon: 'success', title: 'Liquidado Correctamente!', showConfirmButton: false, timer: 2500
          })
        }

        if (rp.length == 0) {

          for (let o = 0; o < this.unliquidatedService.length; o++) {
            this.liquidationManager.tratamiento = this.unliquidatedService.length
            this.service.updateLiquidacionEncarg(this.unliquidatedService[o]['id'], this.services).subscribe((datos) => {
            })
          }

          this.serviceLiquidationManager.settlementRecord(this.liquidationManager).subscribe(async (datos) => {
            this.convertToZero()

            if (this.administratorRole == true) {
              await this.consultLiquidationManagerByAdministrator()
            }
            else {
              await this.consultLiquidationManagerByManager()
            }

            Swal.fire({ position: 'top-end', icon: 'success', title: 'Liquidado Correctamente!', showConfirmButton: false, timer: 2500 })
          })
        }
      })

    } else {
      this.buttonSave.disabled = false;

      Swal.fire({
        icon: 'error', title: 'Oops...', text: 'No hay ninguna encargada seleccionada', showConfirmButton: false, timer: 2500
      })
    }
  }

  async cancel() {
    this.validitingUser()
    this.liquidationForm = true
    this.validationFilters = true
    this.addForm = false
    this.editEncarg = false
    this.selected = false
    this.dates = false
    this.liquidationManager.encargada = ""
  }

  createUniqueId() {
    var d = new Date().getTime()
    var uuid = 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = (d + Math.random() * 16) % 16 | 0
      d = Math.floor(d / 16)
      return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16)
    })

    this.services.idEncargada = uuid
    this.liquidationManager.idUnico = uuid
    this.liquidationManager.idEncargada = uuid
    return this.liquidationManager.idUnico
  }

  dateCurrentDay() {
    let date = new Date(), day = 0, month = 0, year = 0, convertMonth = '', convertDay = ''

    day = date.getDate()
    month = date.getMonth() + 1
    year = date.getFullYear()

    if (month > 0 && month < 10) {
      convertMonth = '0' + month
      this.liquidationManager.createdDate = `${year}-${convertMonth}-${day}`
    } else {
      convertMonth = month.toString()
      this.liquidationManager.createdDate = `${year}-${month}-${day}`
    }

    if (day > 0 && day < 10) {
      convertDay = '0' + day
      this.liquidationManager.createdDate = `${year}-${convertMonth}-${convertDay}`
    } else {
      this.liquidationManager.createdDate = `${year}-${convertMonth}-${day}`
    }
  }

  async deleteLiquidation() {
    this.serviceManager.getById(this.idUser).subscribe(async (rp) => {
      if (rp[0]['rol'] == 'administrador') {
        if (this.liquidationManager.encargada != "" ||
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
                    this.services.idEncargada = ""
                    this.services.liquidadoEncargada = false
                    this.service.updateManagerSettlementManagerIdByManagerId(item['idTerapeuta'], this.services).subscribe(async (rp) => {
                      this.serviceLiquidationManager.deleteLiquidationManager(item['id']).subscribe(async (rp) => {
                        if (this.administratorRole == true) {
                          await this.consultLiquidationManagerByAdministrator()
                        }
                        else {
                          await this.consultLiquidationManagerByManager()
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
    this.liquidationManager.encargada = ""
    this.formTemplate.value.fechaInicio = ""
    this.formTemplate.value.FechaFin = ""
    this.formTemplate.value.busqueda = ""
  }
}