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

  CurrenDate = ""
  idSettled: number
  liquidationForm: boolean
  addForm: boolean
  editTerap: boolean
  filterByName: string
  filterByNumber: number
  filtredBusqueda: string
  unliquidatedService: any
  liquidated: any[] = [];
  settledData: any[] = [];
  page!: number

  // Encargada
  manager: any
  administratorRole: boolean = false

  // Terapeuta
  terapeuta: any[] = [];
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
  totalTobaccoValue: number
  totalValueVitamins: number
  totalValueOther: number

  // Comision
  serviceCommission: number
  commissionTip: number
  beverageCommission: number
  tobaccoCommission: number
  vitaminCommission: number
  commissionOthers: number
  sumCommission: number
  idUnico: string
  receivedTherapist: any

  // Comission
  totalCommission: number

  // Thousand pount
  textTotalComission: string
  textTotalService: string
  textServiceComission: string
  textTotalTip2: string
  textComissionTip: string
  textValueDrink: string
  textBeverageCommission: string
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

  liquidationTherapist: LiquidationTherapist = {
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
    terapeuta: "",
    tratamiento: 0
  }

  services: ModelService = {
    idTerapeuta: "",
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

    const params = this.activeRoute.snapshot['_urlSegment'].segments[1];
    this.idUser = Number(params.path)

    if (this.idUser) {
      this.serviceManager.getById(this.idUser).subscribe((rp) => {
        if (rp[0]['rol'] == 'administrador') {
          this.administratorRole = true
          this.getManager()
        } else {
          this.manager = rp
          this.liquidationTherapist.encargada = this.manager[0].nombre
        }
      })
    }

    this.date()
    this.thousandPount()
    this.getTerapeuta()
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
    this.totalTherapistValue = 0
    this.totalValueDrink = 0
    this.totalTobaccoValue = 0
    this.totalValueVitamins = 0
    this.totalValueOther = 0
    this.serviceCommission = 0
    this.commissionTip = 0
    this.beverageCommission = 0
    this.tobaccoCommission = 0
    this.vitaminCommission = 0
    this.commissionOthers = 0
    this.sumCommission = 0
    this.receivedTherapist = 0
    this.totalCommission = 0

    this.terapeutaName['servicio'] = 0
    this.terapeutaName['propina'] = 0
    this.terapeutaName['bebida'] = 0
    this.terapeutaName['tabaco'] = 0
    this.terapeutaName['vitamina'] = 0
    this.terapeutaName['otros'] = 0
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
    if (this.totalTobaccoValue == undefined) this.totalTobaccoValue = 0
    if (this.totalValueVitamins == undefined) this.totalValueVitamins = 0
    if (this.totalValueOther == undefined) this.totalValueOther = 0
    if (this.serviceCommission == undefined || Number.isNaN(this.serviceCommission)) this.serviceCommission = 0
    if (this.commissionTip == undefined || Number.isNaN(this.commissionTip)) this.commissionTip = 0
    if (this.beverageCommission == undefined || Number.isNaN(this.beverageCommission)) this.beverageCommission = 0
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

  thousandPount() {
    this.serviceLiquidationTherapist.consultTherapistSettlements().subscribe((datoLiquidaciones: any) => {
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

  filtersDateEnd(event: any) {
    this.formTemplate.value.FechaFin = event.target.value
    if (this.formTemplate.value.FechaFin != "") {
      let mesFin = '', diaFin = '', añoFin = '', fechaFin = ''
      fechaFin = this.formTemplate.value.FechaFin
      diaFin = fechaFin.substring(8, 11)
      mesFin = fechaFin.substring(5, 7)
      añoFin = fechaFin.substring(2, 4)
      this.fechaFinal = `${diaFin}-${mesFin}-${añoFin}`
    }
  }

  filters() {
    this.filtredBusqueda = this.formTemplate.value.busqueda.replace(/(^\w{1})|(\s+\w{1})/g, letra => letra.toUpperCase())

    if (this.formTemplate.value.fechaInicio != "") {
      let mes = '', dia = '', año = '', fecha = ''
      fecha = this.formTemplate.value.fechaInicio
      dia = fecha.substring(8, 11)
      mes = fecha.substring(5, 7)
      año = fecha.substring(2, 4)
      this.fechaInicio = `${dia}-${mes}-${año}`
    }

    this.serviceManager.getById(this.idUser).subscribe((rp) => {
      if (rp[0]['rol'] == 'administrador') {

        if (this.liquidationTherapist.terapeuta != "" || this.liquidationTherapist.encargada != "" ||
          this.formTemplate.value.fechaInicio || this.formTemplate.value.FechaFin != "") {
          (document.getElementById('buttonDelete') as HTMLButtonElement).disabled = false;
        } else {
          (document.getElementById('buttonDelete') as HTMLButtonElement).disabled = true;
        }
      }
    })
  }

  getThoseThatNotLiquidated() {
    this.service.getByLiquidTerapFalse().subscribe((datoServicio) => {
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

  dateExists() {
    let fromMonth = '', fromDay = '', fromYear = '', convertMonth = '', convertDay = '',
      untilMonth = 0, untilDay = 0, untilYear = 0, currentDate = new Date()

    this.serviceLiquidationTherapist.consultTherapistAndManager(this.liquidationTherapist.terapeuta,
      this.liquidationTherapist.encargada).subscribe((rp: any) => {

        if (rp.length > 0) {

          fromDay = rp[0]['hastaFechaLiquidado'].substring(0, 2)
          fromMonth = rp[0]['hastaFechaLiquidado'].substring(3, 5)
          fromYear = rp[0]['hastaFechaLiquidado'].substring(6, 8)

          this.liquidationTherapist.desdeFechaLiquidado = `${'20' + fromYear}-${fromMonth}-${fromDay}`
          this.liquidationTherapist.desdeHoraLiquidado = rp[0]['hastaHoraLiquidado']
        } else {
          this.dateDoesNotExist()
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

  calculateServices(): any {
    if (this.liquidationTherapist.encargada != "" && this.liquidationTherapist.terapeuta != "") {
      this.getThoseThatNotLiquidated()

      this.service.getByTerapeutaAndEncargada(this.liquidationTherapist.terapeuta, this.liquidationTherapist.encargada).subscribe((resp: any) => {
        if (resp.length > 0) {

          this.selected = true
          this.dateExists()

          setTimeout(() => {
            if (this.inputDateAndTime()) return
          }, 600);


        } else {
          this.selected = false
          Swal.fire({
            icon: 'error', title: 'Oops...', text: 'No existe ningun servicio', showConfirmButton: false, timer: 2500
          })
        }
      })
    }
  }

  inputDateAndTime() {
    let comisiServicio = 0, comiPropina = 0, comiBebida = 0, comiTabaco = 0, comiVitamina = 0, comiOtros = 0, sumComision = 0
    this.totalCommission = 0

    this.service.getByTerapeutaEncargadaFechaHoraInicioFechaHoraFin(this.liquidationTherapist.terapeuta,
      this.liquidationTherapist.encargada, this.liquidationTherapist.desdeHoraLiquidado, this.liquidationTherapist.hastaHoraLiquidado,
      this.liquidationTherapist.desdeFechaLiquidado, this.liquidationTherapist.hastaFechaLiquidado).subscribe((rp: any) => {

        if (rp.length > 0) {

          this.unliquidatedService = rp

          // Filter by servicio
          const servicios = this.unliquidatedService.filter(serv => rp)
          this.totalService = servicios.reduce((accumulator, serv) => {
            return accumulator + serv.servicio
          }, 0)

          // Filter by Propina
          const propinas = this.unliquidatedService.filter(serv => rp)
          this.totalTipValue = propinas.reduce((accumulator, serv) => {
            return accumulator + serv.propina
          }, 0)

          // Filter by Pago
          const terapeuta = this.unliquidatedService.filter(serv => rp)
          this.totalTherapistValue = terapeuta.reduce((accumulator, serv) => {
            return accumulator + serv.numberTerap
          }, 0)

          // Filter by Bebida
          const bebida = this.unliquidatedService.filter(serv => rp)
          this.totalValueDrink = bebida.reduce((accumulator, serv) => {
            return accumulator + serv.bebidas
          }, 0)

          // Filter by Tabaco
          const tabac = this.unliquidatedService.filter(serv => rp)
          this.totalTobaccoValue = tabac.reduce((accumulator, serv) => {
            return accumulator + serv.tabaco
          }, 0)

          // Filter by Vitamina
          const vitamina = this.unliquidatedService.filter(serv => rp)
          this.totalValueVitamins = vitamina.reduce((accumulator, serv) => {
            return accumulator + serv.vitaminas
          }, 0)

          // Filter by Others
          const otroServicio = this.unliquidatedService.filter(serv => rp)
          this.totalValueOther = otroServicio.reduce((accumulator, serv) => {
            return accumulator + serv.otros
          }, 0)

          // Filter by totalCash
          const totalCashs = this.unliquidatedService.filter(serv => rp)
          this.totalCash = totalCashs.reduce((accumulator, serv) => {
            return accumulator + serv.valueEfectTerapeuta
          }, 0)

          // Filter by totalBizum
          const totalBizums = this.unliquidatedService.filter(serv => rp)
          this.totalBizum = totalBizums.reduce((accumulator, serv) => {
            return accumulator + serv.valueBizuTerapeuta
          }, 0)

          // Filter by totalCard
          const totalCards = this.unliquidatedService.filter(serv => rp)
          this.totalCard = totalCards.reduce((accumulator, serv) => {
            return accumulator + serv.valueTarjeTerapeuta
          }, 0)

          // Filter by totalTransaction
          const totalTransactions = this.unliquidatedService.filter(serv => rp)
          this.totalTransaction = totalTransactions.reduce((accumulator, serv) => {
            return accumulator + serv.valueTransTerapeuta
          }, 0)

          // Total therapist payment
          this.totalTherapistPayment = this.totalCash + this.totalCard + this.totalBizum + this.totalTransaction

          this.serviceTherapist.getTerapeuta(this.liquidationTherapist.terapeuta).subscribe((datosNameTerapeuta) => {
            this.terapeutaName = datosNameTerapeuta[0]

            // Comision
            comisiServicio = this.totalService / 100 * datosNameTerapeuta[0]['servicio']
            comiPropina = this.totalTipValue / 100 * datosNameTerapeuta[0]['propina']
            comiBebida = this.totalValueDrink / 100 * datosNameTerapeuta[0]['bebida']
            comiTabaco = this.totalTobaccoValue / 100 * datosNameTerapeuta[0]['tabaco']
            comiVitamina = this.totalValueVitamins / 100 * datosNameTerapeuta[0]['vitamina']
            comiOtros = this.totalValueOther / 100 * datosNameTerapeuta[0]['otros']

            // Conversion decimal
            this.serviceCommission = Math.ceil(comisiServicio)
            this.commissionTip = Math.ceil(comiPropina)
            this.beverageCommission = Math.ceil(comiBebida)
            this.tobaccoCommission = Math.ceil(comiTabaco)
            this.vitaminCommission = Math.ceil(comiVitamina)
            this.commissionOthers = Math.ceil(comiOtros)

            sumComision = Number(this.serviceCommission) + Number(this.commissionTip) +
              Number(this.beverageCommission) + Number(this.tobaccoCommission) +
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
          })
          return true
        } else {
          this.unliquidatedService = rp

          Swal.fire({
            icon: 'error', title: 'Oops...', text: 'No hay ningun servicio con la fecha seleccionada', showConfirmButton: false, timer: 2500
          })

          let comisiServicio = 0, comiPropina = 0, comiBebida = 0, comiTabaco = 0, comiVitamina = 0, comiOtros = 0, sumComision = 0
          this.totalCommission = 0

          this.serviceTherapist.getTerapeuta(this.liquidationTherapist.terapeuta).subscribe((datosNameTerapeuta) => {
            this.terapeutaName = datosNameTerapeuta[0]

            // Comision
            comisiServicio = this.totalService / 100 * datosNameTerapeuta[0]['servicio']
            comiPropina = this.totalTipValue / 100 * datosNameTerapeuta[0]['propina']
            comiBebida = this.totalValueDrink / 100 * datosNameTerapeuta[0]['bebida']
            comiTabaco = this.totalTobaccoValue / 100 * datosNameTerapeuta[0]['tabaco']
            comiVitamina = this.totalValueVitamins / 100 * datosNameTerapeuta[0]['vitamina']
            comiOtros = this.totalValueOther / 100 * datosNameTerapeuta[0]['otros']

            // Conversion decimal
            this.serviceCommission = Math.ceil(comisiServicio)
            this.commissionTip = Math.ceil(comiPropina)
            this.beverageCommission = Math.ceil(comiBebida)
            this.tobaccoCommission = Math.ceil(comiTabaco)
            this.vitaminCommission = Math.ceil(comiVitamina)
            this.commissionOthers = Math.ceil(comiOtros)

            sumComision = Number(this.serviceCommission) + Number(this.commissionTip) +
              Number(this.beverageCommission) + Number(this.tobaccoCommission) +
              Number(this.vitaminCommission) + Number(this.commissionOthers)

            if (this.sumCommission != 0 || this.sumCommission != undefined) {
              this.sumCommission = Math.ceil(sumComision)
            }

            // Recibido
            this.receivedTherapist = this.totalTherapistValue
            this.totalCommission = Math.ceil(this.sumCommission) - Number(this.receivedTherapist)
            this.liquidationTherapist.importe = this.totalCommission

            this.validateNullData()
            return true
          })
          return false
        }
      })
    return false
  }

  dateDoesNotExist() {
    let año = "", mes = "", dia = ""

    this.service.getTerapeutaFechaAsc(this.liquidationTherapist.terapeuta, this.liquidationTherapist.encargada).subscribe((rp) => {
      año = rp[0]['fechaHoyInicio'].substring(0, 4)
      mes = rp[0]['fechaHoyInicio'].substring(5, 7)
      dia = rp[0]['fechaHoyInicio'].substring(8, 10)
      this.liquidationTherapist.desdeFechaLiquidado = `${año}-${mes}-${dia}`
      this.liquidationTherapist.desdeHoraLiquidado = rp[0]['horaStart']
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

  // Edit

  thousandPointEdit() {
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

    for (let o = 0; o < this.settledData.length; o++) {
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

  goToEdit(id: number) {
    const params = this.activeRoute.snapshot['_urlSegment'].segments[1];
    this.idUser = Number(params.path)

    this.service.getById(id).subscribe((rp: any) => {
      if (rp.length > 0) this.router.navigate([`menu/${this.idUser}/nuevo-servicio/${rp[0]['id']}/true`])
    })
  }

  edit() {
    this.idSettled
    this.liquidationTherapist.importe = this.totalCommission
    this.serviceLiquidationTherapist.updateTerapImporteId(this.idSettled, this.liquidationTherapist).subscribe((rp) => { })

    setTimeout(() => {
      this.thousandPount()
      this.liquidationForm = true
      this.editTerap = false
      this.selected = false
      this.liquidationTherapist.encargada = ""
      this.liquidationTherapist.terapeuta = ""
    }, 1000);
  }

  dataFormEdit(idTerap: string, idLiq: number) {
    this.idSettled = idLiq
    this.liquidationForm = false
    this.editTerap = true

    this.serviceLiquidationTherapist.consultTherapistId(idTerap).subscribe((datosTerapeuta: any) => {
      this.liquidationTherapist.desdeFechaLiquidado = datosTerapeuta[0]?.desdeFechaLiquidado
      this.liquidationTherapist.desdeHoraLiquidado = datosTerapeuta[0]?.desdeHoraLiquidado
      this.liquidationTherapist.hastaFechaLiquidado = datosTerapeuta[0]?.hastaFechaLiquidado
      this.liquidationTherapist.hastaHoraLiquidado = datosTerapeuta[0]?.hastaHoraLiquidado
    })

    this.service.getByIdTerap(idTerap).subscribe((datosTerapeuta: any) => {
      this.settledData = datosTerapeuta;

      // Filter by servicio
      const servicios = this.settledData.filter(serv => serv)
      this.totalService = servicios.reduce((accumulator, serv) => {
        return accumulator + serv?.servicio
      }, 0)

      // Filter by Propina
      const propinas = this.settledData.filter(serv => serv)
      this.totalTipValue = propinas.reduce((accumulator, serv) => {
        return accumulator + serv?.propina
      }, 0)

      // Filter by Pago
      const terapeuta = this.settledData.filter(serv => serv)
      this.totalTherapistValue = terapeuta.reduce((accumulator, serv) => {
        return accumulator + serv?.numberTerap
      }, 0)

      // Filter by Bebida
      const bebida = this.settledData.filter(serv => serv)
      this.totalValueDrink = bebida.reduce((accumulator, serv) => {
        return accumulator + serv?.bebidas
      }, 0)

      // Filter by Tabaco
      const tabac = this.settledData.filter(serv => serv)
      this.totalTobaccoValue = tabac.reduce((accumulator, serv) => {
        return accumulator + serv?.tabaco
      }, 0)

      // Filter by Vitamina
      const vitamina = this.settledData.filter(serv => serv)
      this.totalValueVitamins = vitamina.reduce((accumulator, serv) => {
        return accumulator + serv?.vitaminas
      }, 0)

      // Filter by Vitamina
      const otroServicio = this.settledData.filter(serv => serv)
      this.totalValueOther = otroServicio.reduce((accumulator, serv) => {
        return accumulator + serv?.otros
      }, 0)

      let comisiServicio = 0, comiPropina = 0, comiBebida = 0, comiTabaco = 0, comiVitamina = 0, comiOtros = 0, sumComision = 0
      this.totalCommission = 0

      this.serviceTherapist.getTerapeuta(this.settledData[0]?.terapeuta).subscribe((datosNameTerapeuta: any) => {
        if (datosNameTerapeuta.length > 0) {
          this.terapeutaName = datosNameTerapeuta[0]
          this.validateNullData()

          // Comision
          comisiServicio = this.totalService / 100 * datosNameTerapeuta[0]?.servicio
          comiPropina = this.totalTipValue / 100 * datosNameTerapeuta[0]?.propina
          comiBebida = this.totalValueDrink / 100 * datosNameTerapeuta[0]?.bebida
          comiTabaco = this.totalTobaccoValue / 100 * datosNameTerapeuta[0]?.tabaco
          comiVitamina = this.totalValueVitamins / 100 * datosNameTerapeuta[0]?.vitamina
          comiOtros = this.totalValueOther / 100 * datosNameTerapeuta[0]?.otros

          // Conversion decimal
          this.serviceCommission = Number(comisiServicio.toFixed(1))
          this.commissionTip = Number(comiPropina.toFixed(1))
          this.beverageCommission = Number(comiBebida.toFixed(1))
          this.tobaccoCommission = Number(comiTabaco.toFixed(1))
          this.vitaminCommission = Number(comiVitamina.toFixed(1))
          this.commissionOthers = Number(comiOtros.toFixed(1))

          sumComision = Number(this.serviceCommission) + Number(this.commissionTip) +
            Number(this.beverageCommission) + Number(this.tobaccoCommission) +
            Number(this.vitaminCommission) + Number(this.commissionOthers)

          if (this.sumCommission != 0 || this.sumCommission != undefined) {
            this.sumCommission = Number(sumComision.toFixed(1))
          }
        }
      })

      // Recibido
      for (let o = 0; o < this.settledData.length; o++) {
        const numbTerap = this.settledData.filter(serv => serv)
        this.receivedTherapist = numbTerap.reduce((accumulator, serv) => {
          return accumulator + serv.numberTerap
        }, 0)
      }

      this.totalCommission = this.sumCommission - Number(this.receivedTherapist)
      this.thousandPointEdit()
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

  // End edit

  cancel() {
    this.liquidationForm = true
    this.addForm = false
    this.editTerap = false
    this.selected = false
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

  save() {
    this.createUniqueId()
    this.liquidationTherapist.currentDate = this.currentDate.toString()
    this.formatDate()

    if (this.liquidationTherapist.terapeuta != "") {
      if (this.liquidationTherapist.encargada != "") {

        this.serviceLiquidationTherapist.consultTherapistAndManager(this.liquidationTherapist.terapeuta,
          this.liquidationTherapist.encargada).subscribe((rp: any) => {

            if (rp.length > 0) {

              for (let o = 0; o < this.unliquidatedService.length; o++) {
                this.liquidationTherapist.tratamiento = this.unliquidatedService.length
                this.service.updateLiquidacionTerap(this.unliquidatedService[o]['id'], this.services).subscribe((dates) => { })
              }

              this.serviceLiquidationTherapist.settlementRecord(this.liquidationTherapist).subscribe((dates) => { })

              this.thousandPount()
              this.liquidationForm = true
              this.addForm = false
              this.editTerap = false
              this.selected = false
              this.liquidationTherapist.encargada = ""
              this.liquidationTherapist.terapeuta = ""

              Swal.fire({
                position: 'top-end', icon: 'success', title: 'Liquidado Correctamente!', showConfirmButton: false, timer: 2500
              })
            }

            else if (rp.length == 0) {

              for (let o = 0; o < this.unliquidatedService.length; o++) {
                this.liquidationTherapist.tratamiento = this.unliquidatedService.length
                this.service.updateLiquidacionTerap(this.unliquidatedService[o]['id'], this.services).subscribe((datos) => {
                })
              }

              this.serviceLiquidationTherapist.settlementRecord(this.liquidationTherapist).subscribe((datos) => { })
              this.thousandPount()
              this.liquidationForm = true
              this.addForm = false
              this.editTerap = false
              this.selected = false
              this.liquidationTherapist.encargada = ""
              this.liquidationTherapist.terapeuta = ""
              this.convertToZero()

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

  deleteService() {

  }
}