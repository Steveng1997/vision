import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormControl, FormGroup } from '@angular/forms'
import Swal from 'sweetalert2'
import { ActivatedRoute, Router } from '@angular/router'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'

// Servicios
import { ServiceManager } from 'src/app/core/services/manager'
import { Service } from 'src/app/core/services/service'
import { ServiceTherapist } from 'src/app/core/services/therapist'
import { ServiceLiquidationTherapist } from 'src/app/core/services/therapistCloseouts'

// Model
import { LiquidationTherapist } from 'src/app/core/models/liquidationTherapist'
import { ModelService } from 'src/app/core/models/service'

@Component({
  selector: 'app-therapist',
  templateUrl: './therapist.component.html',
  styleUrls: ['./therapist.component.css']
})
export class TherapistComponent implements OnInit {

  therapist = ""
  dates: boolean = false
  loading: boolean = false
  deleteButton: boolean = false
  validationFilters: boolean = true
  CurrenDate = ""
  idSettled: number
  liquidationForm: boolean
  addForm: boolean
  editTerap: boolean
  filterByName: string
  filterByNumber: number
  filtredBusqueda: string
  unliquidatedService: any
  liquidated: any
  settledData: any
  page!: number
  idTherap: string
  idLiquidation: any

  // Encargada
  manager: any
  administratorRole: boolean = false

  // Terapeuta
  terapeuta: any
  terapeutaName: any

  // Fecha
  fechaInicio: string
  fechaFinal: string

  selected: boolean
  idUser: number

  // Servicios
  totalService: number
  totalTipValue: number
  totalTherapistValue: number
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
  receivedTherapist: any

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
  textReceivedTherapist: string
  textTotalCommission: string
  textTotalCash: string
  textTotalBizum: string
  textTotalCard: string
  textTotalTransaction: string
  textTotalTherapistPayment: string

  // Total Payment Method
  totalCash: number
  totalCard: number
  totalBizum: number
  totalTransaction: number
  totalTherapistPayment: number

  currentDate = new Date().getTime()

  valueRegular: string

  liquidationTherapist: LiquidationTherapist = {
    createdDate: "",
    currentDate: "",
    desdeFechaLiquidado: "",
    desdeHoraLiquidado: "",
    encargada: "",
    hastaFechaLiquidado: "",
    hastaHoraLiquidado: new Date().toTimeString().substring(0, 5),
    id: 0,
    idUnico: "",
    idTerapeuta: "",
    importe: 0,
    regularizacion: "",
    terapeuta: "",
    tratamiento: 0,
    valueRegularizacion: 0
  }

  services: ModelService = {
    idTerapeuta: ""
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
    public serviceTherapist: ServiceTherapist,
    public service: Service,
    public serviceManager: ServiceManager,
    public serviceLiquidationTherapist: ServiceLiquidationTherapist
  ) { }

  ngOnInit(): void {
    this.liquidationForm = true
    this.addForm = false
    this.selected = false
    this.editTerap = false
    this.dates = false
    this.deleteButton = false
    this.loading = true

    const params = this.activeRoute.snapshot['_urlSegment'].segments[1];
    this.idUser = Number(params.path)

    this.date()
    this.thousandPount()
    this.getTerapeuta()

    if (this.idUser) {
      this.validitingUser()
    }
  }

  validitingUser() {
    this.serviceManager.getById(this.idUser).subscribe((rp) => {
      if (rp[0]['rol'] == 'administrador') {
        this.administratorRole = true
        this.loading = false
        this.getManager()
      } else {
        this.manager = rp
        this.loading = false
        this.liquidationTherapist.encargada = this.manager[0].nombre
        this.serviceLiquidationTherapist.consultManager(this.liquidationTherapist.encargada).subscribe(async (rp) => {
          this.liquidated = rp
        })
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
      convertMonth = month.toString()
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
    this.totalTherapistValue = 0
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
    this.receivedTherapist = 0
    this.totalCommission = 0
  }

  validateNullData() {
    if (this.terapeutaName?.['servicio'] == "") this.terapeutaName['servicio'] = 0
    if (this.terapeutaName?.['propina'] == "") this.terapeutaName['propina'] = 0
    if (this.terapeutaName?.['bebida'] == "") this.terapeutaName['bebida'] = 0
    if (this.terapeutaName?.['tabaco'] == "") this.terapeutaName['tabaco'] = 0
    if (this.terapeutaName?.['vitamina'] == "") this.terapeutaName['vitamina'] = 0
    if (this.terapeutaName?.['otros'] == "") this.terapeutaName['otros'] = 0
    if (this.totalService == undefined) this.totalService = 0
    if (this.totalTipValue == undefined) this.totalTipValue = 0
    if (this.totalTherapistValue == undefined) this.totalTherapistValue = 0
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
    if (this.receivedTherapist == undefined || Number.isNaN(this.receivedTherapist)) this.receivedTherapist = 0
    if (this.totalCash == undefined) this.totalCash = 0
    if (this.totalBizum == undefined) this.totalBizum = 0
    if (this.totalCard == undefined) this.totalCard = 0
    if (this.totalTransaction == undefined) this.totalTransaction = 0
    if (this.totalTherapistPayment == undefined) this.totalTherapistPayment = 0
  }

  async thousandPount() {
    this.serviceLiquidationTherapist.consultTherapistSettlements().subscribe(async (rp: any) => {
      this.liquidated = rp

      rp.map(item => {
        if (item['importe'] > 999) {
          const coma = item['importe'].toString().indexOf(".") !== -1 ? true : false;
          const array = coma ? item['importe'].toString().split(".") : item['importe'].toString().split("");
          let integer = coma ? array.split("") : array;
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
          item['importe'] = integer[0].toString()
        } else {
          item['importe'] = item['importe'].toString()
        }
      })
    })
  }

  filtersDateEnd(event: any) {
    this.formTemplate.value.FechaFin = event.target.value
    if (this.formTemplate.value.FechaFin != "") {
      let fechaFin = ''
      fechaFin = this.formTemplate.value.FechaFin
      this.fechaFinal = fechaFin
    }
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

    const therapistCondition = serv => {
      return (this.liquidationTherapist.terapeuta) ? serv.terapeuta === this.liquidationTherapist.terapeuta : true
    }

    const managerCondition = serv => {
      return (this.liquidationTherapist.encargada) ? serv.encargada === this.liquidationTherapist.encargada : true
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

    if (this.liquidationTherapist.terapeuta != "" || this.liquidationTherapist.encargada != "" ||
      this.formTemplate.value.fechaInicio || this.formTemplate.value.FechaFin != "") {
      this.idLiquidation = this.liquidated.filter(serv => therapistCondition(serv)
        && managerCondition(serv) && searchCondition(serv) && conditionBetweenDates(serv))
    }
  }

  async OK() {
    this.modalService.dismissAll()

    await this.serviceManager.getById(this.idUser).subscribe(async (rp) => {
      if (rp[0]['rol'] == 'administrador') {
        if (this.liquidationTherapist.terapeuta != "" || this.liquidationTherapist.encargada != "" ||
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

  async getThoseThatNotLiquidated() {
    this.service.getByLiquidTerapFalse().subscribe(async (datoServicio) => {
      this.unliquidatedService = datoServicio
    })
  }

  getTerapeuta() {
    this.serviceTherapist.getAllTerapeuta().subscribe((datosTerapeuta: any) => {
      this.terapeuta = datosTerapeuta
    })
  }

  getManager() {
    this.serviceManager.getUsuarios().subscribe((datosEncargada: any) => {
      this.manager = datosEncargada
    })
  }

  insertForm() {
    this.validationFilters = false
    this.liquidationTherapist.regularizacion = ""
    this.liquidationTherapist.valueRegularizacion = 0
    this.serviceManager.getById(this.idUser).subscribe((rp) => {
      if (rp[0]['rol'] == 'administrador') {
        this.administratorRole = true
        this.liquidationTherapist.encargada = ""
      } else {
        this.liquidationTherapist.encargada = this.manager[0].nombre
      }
    })

    this.liquidationTherapist.terapeuta = ""
    this.liquidationForm = false
    this.editTerap = false
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

    await this.serviceLiquidationTherapist.consultTherapistAndManager(this.liquidationTherapist.terapeuta, this.liquidationTherapist.encargada).subscribe(async (rp: any) => {
      if (rp.length > 0) {

        fromDay = rp[0]['hastaFechaLiquidado'].substring(0, 2)
        fromMonth = rp[0]['hastaFechaLiquidado'].substring(3, 5)
        fromYear = rp[0]['hastaFechaLiquidado'].substring(6, 8)

        this.liquidationTherapist.desdeFechaLiquidado = `${'20' + fromYear}-${fromMonth}-${fromDay}`
        this.liquidationTherapist.desdeHoraLiquidado = rp[0]['hastaHoraLiquidado']
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
      this.liquidationTherapist.hastaFechaLiquidado = `${untilYear}-${convertMonth}-${untilDay}`
    } else {
      convertMonth = untilMonth.toString()
      this.liquidationTherapist.hastaFechaLiquidado = `${untilYear}-${convertMonth}-${untilDay}`
    }

    if (untilDay > 0 && untilDay < 10) {
      convertDay = '0' + untilDay
      this.liquidationTherapist.hastaFechaLiquidado = `${untilYear}-${convertMonth}-${convertDay}`
    } else {
      this.liquidationTherapist.hastaFechaLiquidado = `${untilYear}-${convertMonth}-${untilDay}`
    }
  }

  async calculateServices() {
    if (this.liquidationTherapist.encargada != "" && this.liquidationTherapist.terapeuta != "") {
      this.loading = true
      this.getThoseThatNotLiquidated()

      this.service.getByTerapeutaAndEncargada(this.liquidationTherapist.terapeuta, this.liquidationTherapist.encargada).subscribe(async (resp: any) => {
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
    let comisiServicio = 0, comiPropina = 0, comiBebida = 0, comiBebidaTerap = 0, comiTabaco = 0, comiVitamina = 0, comiOtros = 0, sumComision = 0
    this.totalCommission = 0

    this.service.getByTerapeutaEncargadaFechaHoraInicioFechaHoraFin(this.liquidationTherapist.terapeuta,
      this.liquidationTherapist.encargada, this.liquidationTherapist.desdeHoraLiquidado, this.liquidationTherapist.hastaHoraLiquidado,
      this.liquidationTherapist.desdeFechaLiquidado, this.liquidationTherapist.hastaFechaLiquidado).subscribe(async (rp: any) => {

        if (rp.length > 0) {
          this.unliquidatedService = rp

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
          this.totalTherapistValue = terapeuta.reduce((accumulator, serv) => {
            return accumulator + serv.numberTerap
          }, 0)

          // Filter by Drink
          const bebida = rp.filter(serv => serv)
          this.totalValueDrink = bebida.reduce((accumulator, serv) => {
            return accumulator + serv.bebidas
          }, 0)

          // Filter by Drink Therapist
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

          // Filter by Others
          const otroServicio = rp.filter(serv => serv)
          this.totalValueOther = otroServicio.reduce((accumulator, serv) => {
            return accumulator + serv.otros
          }, 0)

          // Filter by totalCash
          const totalCashs = rp.filter(serv => serv)
          this.totalCash = totalCashs.reduce((accumulator, serv) => {
            return accumulator + serv.valueEfectTerapeuta
          }, 0)

          // Filter by totalBizum
          const totalBizums = rp.filter(serv => serv)
          this.totalBizum = totalBizums.reduce((accumulator, serv) => {
            return accumulator + serv.valueBizuTerapeuta
          }, 0)

          // Filter by totalCard
          const totalCards = rp.filter(serv => serv)
          this.totalCard = totalCards.reduce((accumulator, serv) => {
            return accumulator + serv.valueTarjeTerapeuta
          }, 0)

          // Filter by totalTransaction
          const totalTransactions = rp.filter(serv => serv)
          this.totalTransaction = totalTransactions.reduce((accumulator, serv) => {
            return accumulator + serv.valueTransTerapeuta
          }, 0)

          // Total therapist payment
          this.totalTherapistPayment = this.totalCash + this.totalCard + this.totalBizum + this.totalTransaction

          await this.serviceTherapist.getTerapeuta(this.liquidationTherapist.terapeuta).subscribe(async (datosNameTerapeuta) => {
            this.terapeutaName = datosNameTerapeuta[0]

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
              Number(this.beverageCommission) + Number(this.beverageTherapistCommission) + Number(this.tobaccoCommission) +
              Number(this.vitaminCommission) + Number(this.commissionOthers)

            if (this.sumCommission != 0 || this.sumCommission != undefined) {
              this.sumCommission = Math.ceil(sumComision)
            }

            // Recibido
            this.receivedTherapist = this.totalTherapistValue
            this.totalCommission = Math.ceil(this.sumCommission) - Number(this.receivedTherapist)
            this.liquidationTherapist.importe = this.totalCommission

            this.validateNullData()
            this.thousandPoint()
            this.loading = false
            this.selected = true
            this.dates = true
          })
        } else {
          this.unliquidatedService = rp
          this.loading = false
          this.dates = true
          this.textTotalComission = '0'

          Swal.fire({
            icon: 'error', title: 'Oops...', text: 'No hay ningun servicio con la fecha seleccionada', showConfirmButton: false, timer: 2500
          })
        }
      })
  }

  async dateDoesNotExist() {
    let año = "", mes = "", dia = ""

    await this.service.getTerapeutaFechaAsc(this.liquidationTherapist.terapeuta, this.liquidationTherapist.encargada).subscribe(async (rp) => {
      año = rp[0]['fechaHoyInicio'].substring(0, 4)
      mes = rp[0]['fechaHoyInicio'].substring(5, 7)
      dia = rp[0]['fechaHoyInicio'].substring(8, 10)
      this.liquidationTherapist.desdeFechaLiquidado = `${año}-${mes}-${dia}`
      this.liquidationTherapist.desdeHoraLiquidado = rp[0]['horaStart']
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

    for (let o = 0; o < this.unliquidatedService.length; o++) {
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

      if (this.unliquidatedService[o]?.numberTerap > 999) {

        const coma = this.unliquidatedService[o]?.numberTerap.toString().indexOf(".") !== -1 ? true : false;
        const array = coma ? this.unliquidatedService[o]?.numberTerap.toString().split(".") : this.unliquidatedService[o]?.numberTerap.toString().split("");
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
        this.unliquidatedService[o]['numberTerap'] = integer[0].toString()
      } else {
        this.unliquidatedService[o]['numberTerap'] = this.unliquidatedService[o]?.numberTerap
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

    if (this.receivedTherapist > 999) {

      const coma = this.receivedTherapist.toString().indexOf(".") !== -1 ? true : false;
      const array = coma ? this.receivedTherapist.toString().split(".") : this.receivedTherapist.toString().split("");
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
      this.textReceivedTherapist = integer[0].toString()
    } else {
      this.textReceivedTherapist = this.receivedTherapist.toString()
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
      this.textTotalTherapistPayment = integer[0].toString()
    } else {
      this.textTotalTherapistPayment = this.totalTherapistPayment.toString()
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

  regularization(event: any) {
    let numberRegularization = 0, valueRegularization = 0
    numberRegularization = Number(event.target.value)

    if (numberRegularization > 0) {
      valueRegularization = this.totalCommission + numberRegularization
    } else {
      valueRegularization = this.totalCommission + numberRegularization
    }

    this.liquidationTherapist.valueRegularizacion = numberRegularization;

    if (valueRegularization > 999 || numberRegularization > 999) {

      const coma = valueRegularization.toString().indexOf(".") !== -1 ? true : false;
      const array = coma ? this.totalCommission.toString().split(".") : valueRegularization.toString().split("");
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
      this.textTotalComission = integer[0]
    } else {
      this.textTotalComission = valueRegularization.toString()
      this.valueRegular = numberRegularization.toString()
    }
  }

  // Edit

  convertToZeroEdit() {
    this.textTotalComission = '0'
    this.textTotalService = '0'
    this.textTotalTip2 = '0'
    this.textValueDrink = '0'
    this.textValueDrinkTherap = '0'
    this.textTobaccoValue = '0'
    this.textValueVitamins = '0'
    this.textValueOther = '0'
    this.terapeutaName = '0'
    this.textServiceComission = '0'
    this.commissionTip = 0
    this.textBeverageCommission = '0'
    this.textbeverageTherapistCommission = '0'
    this.textTobaccoCommission = '0'
    this.textVitaminCommission = '0'
    this.textCommissionOthers = '0'
    this.textSumCommission = '0'
    this.textReceivedTherapist = '0'
    this.textTotalCommission = '0'
    this.textTotalCash = '0'
    this.textTotalBizum = '0'
    this.textTotalCard = '0'
    this.textTotalTransaction = '0'
    this.textTotalTherapistPayment = '0'
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

    if (this.receivedTherapist > 999) {

      const coma = this.receivedTherapist.toString().indexOf(".") !== -1 ? true : false;
      const array = coma ? this.receivedTherapist.toString().split(".") : this.receivedTherapist.toString().split("");
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
      this.textReceivedTherapist = integer[0].toString()
    } else {
      this.textReceivedTherapist = this.receivedTherapist.toString()
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
      this.textTotalTherapistPayment = integer[0].toString()
    } else {
      this.textTotalTherapistPayment = this.totalTherapistPayment.toString()
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

      if (this.settledData[o]?.numberTerap > 999) {

        const coma = this.settledData[o]?.numberTerap.toString().indexOf(".") !== -1 ? true : false;
        const array = coma ? this.settledData[o]?.numberTerap.toString().split(".") : this.settledData[o]?.numberTerap.toString().split("");
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
        this.settledData[o]['numberTerap'] = integer[0].toString()
      } else {
        this.settledData[o]['numberTerap'] = this.settledData[o]?.numberTerap
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

  async dataFormEdit(idTherapist: string, id: number) {
    this.loading = true
    this.validationFilters = false
    this.liquidationForm = false
    this.idSettled = id
    this.idTherap = idTherapist

    this.serviceLiquidationTherapist.consultTherapistId(idTherapist).subscribe(async (rp) => {
      this.liquidationTherapist = rp[0]
      this.liquidationTherapist.desdeFechaLiquidado = rp[0]['desdeFechaLiquidado']
      this.liquidationTherapist.desdeHoraLiquidado = rp[0]['desdeHoraLiquidado']
      this.liquidationTherapist.hastaFechaLiquidado = rp[0]['hastaFechaLiquidado']
      this.liquidationTherapist.hastaHoraLiquidado = rp[0]['hastaHoraLiquidado']
    })

    await this.sumTotal(idTherapist)
  }

  async sumTotal(idTherapist: string) {
    this.service.getByIdTerap(idTherapist).subscribe(async (rp: any) => {
      if (rp.length > 0) {
        this.therapist = rp[0]['terapeuta']
        this.settledData = rp

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
        this.totalTherapistValue = terapeuta.reduce((accumulator, serv) => {
          return accumulator + serv.numberTerap
        }, 0)

        // Filter by Bebida
        const bebida = rp.filter(serv => serv)
        this.totalValueDrink = bebida.reduce((accumulator, serv) => {
          return accumulator + serv.bebidas
        }, 0)

        // Filter by Bebida
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
        await this.serviceLiquidationTherapist.consultTherapistId(idTherapist).subscribe(async (rp: any) => {
          this.therapist = rp[0]['terapeuta']
          this.convertToZeroEdit()
          this.loading = false
          this.liquidationForm = false
          this.editTerap = true
        })
      }
    })
  }

  async comission(element) {
    let comisiServicio = 0, comiPropina = 0, comiBebida = 0, comiBebidaTherapist = 0, comiTabaco = 0, comiVitamina = 0, comiOtros = 0, sumComision = 0
    this.totalCommission = 0

    this.serviceTherapist.getTerapeuta(element[0]['terapeuta']).subscribe(async (rp: any) => {

      this.terapeutaName = rp[0]

      // Comision
      comisiServicio = this.totalService / 100 * rp[0]?.servicio
      comiPropina = this.totalTipValue / 100 * rp[0]?.propina
      comiBebida = this.totalValueDrink / 100 * rp[0]?.bebida
      comiBebidaTherapist = this.totalValueDrinkTherap / 100 * rp[0]?.bebidaTerap
      comiTabaco = this.totalTobaccoValue / 100 * rp[0]?.tabaco
      comiVitamina = this.totalValueVitamins / 100 * rp[0]?.vitamina
      comiOtros = this.totalValueOther / 100 * rp[0]?.otros

      // Conversion decimal
      this.serviceCommission = Number(comisiServicio.toFixed(1))
      this.commissionTip = Number(comiPropina.toFixed(1))
      this.beverageCommission = Number(comiBebida.toFixed(1))
      this.beverageTherapistCommission = Number(comiBebidaTherapist.toFixed(1))
      this.tobaccoCommission = Number(comiTabaco.toFixed(1))
      this.vitaminCommission = Number(comiVitamina.toFixed(1))
      this.commissionOthers = Number(comiOtros.toFixed(1))

      sumComision = Number(this.serviceCommission) + Number(this.commissionTip) +
        Number(this.beverageCommission) + Number(this.beverageTherapistCommission) + Number(this.tobaccoCommission) +
        Number(this.vitaminCommission) + Number(this.commissionOthers)

      if (this.sumCommission != 0 || this.sumCommission != undefined) {
        this.sumCommission = Number(sumComision.toFixed(1))
      }

      // Recibido
      element.map(item => {
        const numbTerap = this.settledData.filter(serv => serv)
        this.receivedTherapist = numbTerap.reduce((accumulator, serv) => {
          return accumulator + serv.numberTerap
        }, 0)
      })

      this.totalLiquidation = this.sumCommission - Number(this.receivedTherapist) + this.liquidationTherapist.valueRegularizacion
      this.totalCommission = this.sumCommission - Number(this.receivedTherapist)

      this.validateNullData()
      await this.thousandPointEdit()
      if (rp.length == 0) this.textTotalComission = '0'
      this.loading = false
      this.liquidationForm = false
      this.editTerap = true
    })
  }

  formatDate() {
    let fromDay = '', fromMonth = '', fromYear = '', untilDay = '', untilMonth = '', untilYear = ''

    // From 

    fromDay = this.liquidationTherapist.desdeFechaLiquidado.substring(8, 10)
    fromMonth = this.liquidationTherapist.desdeFechaLiquidado.substring(5, 7)
    fromYear = this.liquidationTherapist.desdeFechaLiquidado.substring(2, 4)

    this.liquidationTherapist.desdeFechaLiquidado = `${fromDay}-${fromMonth}-${fromYear}`

    // Until

    untilDay = this.liquidationTherapist.hastaFechaLiquidado.substring(8, 10)
    untilMonth = this.liquidationTherapist.hastaFechaLiquidado.substring(5, 7)
    untilYear = this.liquidationTherapist.hastaFechaLiquidado.substring(2, 4)

    this.liquidationTherapist.hastaFechaLiquidado = `${untilDay}-${untilMonth}-${untilYear}`
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
        this.services.idTerapeuta = ""
        this.services.liquidadoTerapeuta = false
        this.service.updateTherapistSettlementTherapistIdByTherapistId(this.idTherap, this.services).subscribe(async (rp) => {
          this.serviceLiquidationTherapist.deleteLiquidationTherapist(this.idSettled).subscribe(async (rp) => {
            this.validitingUser()
            this.liquidationTherapist.terapeuta = ""
            this.liquidationTherapist.encargada = ""
            this.liquidationForm = true
            this.validationFilters = true
            this.addForm = false
            this.editTerap = false
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
    this.liquidationTherapist.currentDate = this.currentDate.toString()
    this.formatDate()
    this.dateCurrentDay()

    if (this.liquidationTherapist.terapeuta != "") {
      if (this.liquidationTherapist.encargada != "") {

        if (this.liquidationTherapist.regularizacion != "") {
          this.liquidationTherapist.regularizacion = this.liquidationTherapist.regularizacion.replace(/(^\w{1})|(\s+\w{1})/g, letra => letra.toUpperCase())
        }

        this.serviceLiquidationTherapist.consultTherapistAndManager(this.liquidationTherapist.terapeuta,
          this.liquidationTherapist.encargada).subscribe((rp: any) => {

            if (rp.length > 0) {

              for (let o = 0; o < this.unliquidatedService.length; o++) {
                this.liquidationTherapist.tratamiento = this.unliquidatedService.length
                this.service.updateLiquidacionTerap(this.unliquidatedService[o]['id'], this.services).subscribe((rp) => { })
              }

              this.serviceLiquidationTherapist.settlementRecord(this.liquidationTherapist).subscribe(async (rp) => { })

              this.validitingUser()
              this.convertToZero()
              this.liquidationForm = true
              this.validationFilters = true
              this.addForm = false
              this.editTerap = false
              this.selected = false
              this.dates = false
              this.liquidationTherapist.encargada = ""
              this.liquidationTherapist.terapeuta = ""

              Swal.fire({
                position: 'top-end', icon: 'success', title: 'Liquidado Correctamente!', showConfirmButton: false, timer: 2500
              })
            }

            else if (rp.length == 0) {

              for (let o = 0; o < this.unliquidatedService.length; o++) {
                this.liquidationTherapist.tratamiento = this.unliquidatedService.length
                this.service.updateLiquidacionTerap(this.unliquidatedService[o]['id'], this.services).subscribe((rp) => { })
              }

              this.serviceLiquidationTherapist.settlementRecord(this.liquidationTherapist).subscribe(async (rp) => { })

              this.validitingUser()
              this.convertToZero()
              this.liquidationForm = true
              this.validationFilters = true
              this.addForm = false
              this.editTerap = false
              this.selected = false
              this.dates = false
              this.liquidationTherapist.encargada = ""
              this.liquidationTherapist.terapeuta = ""

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
    } else {
      Swal.fire({
        icon: 'error', title: 'Oops...', text: 'No hay ninguna terapeuta seleccionada', showConfirmButton: false, timer: 2500
      })
    }
  }

  async cancel() {
    this.validitingUser()
    this.liquidationForm = true
    this.validationFilters = true
    this.addForm = false
    this.editTerap = false
    this.selected = false
    this.dates = false
    this.liquidationTherapist.encargada = ""
    this.liquidationTherapist.terapeuta = ""
  }

  createUniqueId() {
    var d = new Date().getTime()
    var uuid = 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = (d + Math.random() * 16) % 16 | 0
      d = Math.floor(d / 16)
      return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16)
    })

    this.services.idTerapeuta = uuid
    this.liquidationTherapist.idUnico = uuid
    this.liquidationTherapist.idTerapeuta = uuid
    return this.liquidationTherapist.idUnico
  }

  dateCurrentDay() {
    let date = new Date(), day = 0, month = 0, year = 0, convertMonth = '', convertDay = ''

    day = date.getDate()
    month = date.getMonth() + 1
    year = date.getFullYear()

    if (month > 0 && month < 10) {
      convertMonth = '0' + month
      this.liquidationTherapist.createdDate = `${year}-${convertMonth}-${day}`
    } else {
      convertMonth = month.toString()
      this.liquidationTherapist.createdDate = `${year}-${month}-${day}`
    }

    if (day > 0 && day < 10) {
      convertDay = '0' + day
      this.liquidationTherapist.createdDate = `${year}-${convertMonth}-${convertDay}`
    } else {
      this.liquidationTherapist.createdDate = `${year}-${convertMonth}-${day}`
    }
  }

  async deleteLiquidation() {
    this.serviceManager.getById(this.idUser).subscribe(async (rp) => {
      if (rp[0]['rol'] == 'administrador') {
        if (this.liquidationTherapist.terapeuta != "" || this.liquidationTherapist.encargada != "" ||
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
                    this.services.idTerapeuta = ""
                    this.services.liquidadoTerapeuta = false
                    this.service.updateTherapistSettlementTherapistIdByTherapistId(item['idTerapeuta'], this.services).subscribe(async (rp) => {
                      this.serviceLiquidationTherapist.deleteLiquidationTherapist(item['id']).subscribe(async (rp) => {
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
    this.liquidationTherapist.terapeuta = ""
    this.liquidationTherapist.encargada = ""
    this.formTemplate.value.fechaInicio = ""
    this.formTemplate.value.FechaFin = ""
    this.formTemplate.value.busqueda = ""
  }
}