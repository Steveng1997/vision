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
  liquidated: any
  settledData: any
  page!: number

  // Encargada
  manager: any
  administratorRole: boolean = false

  // Terapeuta
  terapeuta: any[]
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
  totalCommission: number

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
    this.getSettlements()
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

  getSettlements() {
    let añoDesde = "", mesDesde = "", diaDesde = "", añoHasta = "", mesHasta = "", diaHasta = ""

    this.serviceManager.getById(this.idUser).subscribe((rp) => {
      if (rp[0]['rol'] == 'administrador') {

        this.serviceLiquidationTherapist.consultTherapistSettlements().subscribe((datoLiquidaciones: any) => {
          this.liquidated = datoLiquidaciones

          for (let index = 0; index < this.liquidated.length; index++) {
            añoHasta = this.liquidated[index]['hastaFechaLiquidado'].toString().substring(2, 4)
            mesHasta = this.liquidated[index]['hastaFechaLiquidado'].toString().substring(5, 7)
            diaHasta = this.liquidated[index]['hastaFechaLiquidado'].toString().substring(8, 10)
            this.liquidated[index]['hastaFechaLiquidado'] = `${diaHasta}-${mesHasta}-${añoHasta}`

            if (this.liquidated[index]['desdeFechaLiquidado'].length >= 10) {
              añoDesde = this.liquidated[index]['desdeFechaLiquidado'].toString().substring(2, 4)
              mesDesde = this.liquidated[index]['desdeFechaLiquidado'].toString().substring(5, 7)
              diaDesde = this.liquidated[index]['desdeFechaLiquidado'].toString().substring(8, 10)
              this.liquidated[index]['desdeFechaLiquidado'] = `${diaDesde}-${mesDesde}-${añoDesde}`
            }
          }
        })
      } else {
        this.serviceLiquidationTherapist.consultManager(this.liquidationTherapist.encargada).subscribe((datoLiquidaciones: any) => {
          this.liquidated = datoLiquidaciones

          for (let index = 0; index < this.liquidated.length; index++) {
            añoHasta = this.liquidated[index]['hastaFechaLiquidado'].toString().substring(2, 4)
            mesHasta = this.liquidated[index]['hastaFechaLiquidado'].toString().substring(5, 7)
            diaHasta = this.liquidated[index]['hastaFechaLiquidado'].toString().substring(8, 10)
            this.liquidated[index]['hastaFechaLiquidado'] = `${diaHasta}-${mesHasta}-${añoHasta}`

            if (this.liquidated[index]['desdeFechaLiquidado'].length >= 10) {
              añoDesde = this.liquidated[index]['desdeFechaLiquidado'].toString().substring(2, 4)
              mesDesde = this.liquidated[index]['desdeFechaLiquidado'].toString().substring(5, 7)
              diaDesde = this.liquidated[index]['desdeFechaLiquidado'].toString().substring(8, 10)
              this.liquidated[index]['desdeFechaLiquidado'] = `${diaDesde}-${mesDesde}-${añoDesde}`
            }
          }
        })
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
    let fecha = new Date(), dia = '', mes = '', año = 0, diaHasta = 0, mesHasta = 0, añoHasta = 0, convertMes = '', convertDia = ''

    this.serviceLiquidationTherapist.consultTherapistAndManager(this.liquidationTherapist.terapeuta,
      this.liquidationTherapist.encargada).subscribe((rp: any) => {
        if (rp.length > 0) {
          año = fecha.getFullYear()
          mes = rp[0]['hastaFechaLiquidado'].substring(5, 7)
          dia = rp[0]['hastaFechaLiquidado'].substring(8, 10)
          this.liquidationTherapist.desdeFechaLiquidado = `${año}-${mes}-${dia}`
          this.liquidationTherapist.desdeHoraLiquidado = rp[0]['hastaHoraLiquidado']
        } else {
          this.dateDoesNotExist()
        }
      })

    diaHasta = fecha.getDate()
    mesHasta = fecha.getMonth() + 1
    añoHasta = fecha.getFullYear()

    if (mesHasta > 0 && mesHasta < 10) {
      convertMes = '0' + mesHasta
      this.liquidationTherapist.hastaFechaLiquidado = `${añoHasta}-${convertMes}-${diaHasta}`
    } else {
      convertMes = mesHasta.toString()
      this.liquidationTherapist.hastaFechaLiquidado = `${añoHasta}-${convertMes}-${diaHasta}`
    }

    if (diaHasta > 0 && diaHasta < 10) {
      convertDia = '0' + diaHasta
      this.liquidationTherapist.hastaFechaLiquidado = `${añoHasta}-${convertMes}-${convertDia}`
    } else {
      this.liquidationTherapist.hastaFechaLiquidado = `${añoHasta}-${convertMes}-${diaHasta}`
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
          }, 200);

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

    setTimeout(() => {
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
    }, 900);
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
      this.getSettlements()
      this.liquidationForm = true
      this.editTerap = false
      this.selected = false
      this.liquidationTherapist.encargada = ""
      this.liquidationTherapist.terapeuta = ""
    }, 1000);
  }

  dataFormEdit(id: number, idLiq: number) {
    this.idSettled = idLiq
    this.liquidationForm = false
    this.editTerap = true

    this.serviceLiquidationTherapist.consultTherapistId(id).subscribe((datosTerapeuta) => {
      this.liquidationTherapist.desdeFechaLiquidado = datosTerapeuta[0]['desdeFechaLiquidado']
      this.liquidationTherapist.desdeHoraLiquidado = datosTerapeuta[0]['desdeHoraLiquidado']
      this.liquidationTherapist.hastaFechaLiquidado = datosTerapeuta[0]['hastaFechaLiquidado']
      this.liquidationTherapist.hastaHoraLiquidado = datosTerapeuta[0]['hastaHoraLiquidado']
    })

    this.service.getByIdTerap(id).subscribe((datosTerapeuta) => {
      this.settledData = datosTerapeuta;

      // Filter by servicio
      const servicios = this.settledData.filter(serv => serv)
      this.totalService = servicios.reduce((accumulator, serv) => {
        return accumulator + serv.servicio
      }, 0)

      // Filter by Propina
      const propinas = this.settledData.filter(serv => serv)
      this.totalTipValue = propinas.reduce((accumulator, serv) => {
        return accumulator + serv.propina
      }, 0)

      // Filter by Pago
      const terapeuta = this.settledData.filter(serv => serv)
      this.totalTherapistValue = terapeuta.reduce((accumulator, serv) => {
        return accumulator + serv.numberTerap
      }, 0)

      // Filter by Bebida
      const bebida = this.settledData.filter(serv => serv)
      this.totalValueDrink = bebida.reduce((accumulator, serv) => {
        return accumulator + serv.bebidas
      }, 0)

      // Filter by Tabaco
      const tabac = this.settledData.filter(serv => serv)
      this.totalTobaccoValue = tabac.reduce((accumulator, serv) => {
        return accumulator + serv.tabaco
      }, 0)

      // Filter by Vitamina
      const vitamina = this.settledData.filter(serv => serv)
      this.totalValueVitamins = vitamina.reduce((accumulator, serv) => {
        return accumulator + serv.vitaminas
      }, 0)

      // Filter by Vitamina
      const otroServicio = this.settledData.filter(serv => serv)
      this.totalValueOther = otroServicio.reduce((accumulator, serv) => {
        return accumulator + serv.otros
      }, 0)

      let comisiServicio = 0, comiPropina = 0, comiBebida = 0, comiTabaco = 0, comiVitamina = 0, comiOtros = 0, sumComision = 0
      this.totalCommission = 0

      this.serviceTherapist.getTerapeuta(this.settledData[0]['terapeuta']).subscribe((datosNameTerapeuta) => {
        this.terapeutaName = datosNameTerapeuta[0]
        this.validateNullData()

        // Comision
        comisiServicio = this.totalService / 100 * datosNameTerapeuta[0]['servicio']
        comiPropina = this.totalTipValue / 100 * datosNameTerapeuta[0]['propina']
        comiBebida = this.totalValueDrink / 100 * datosNameTerapeuta[0]['bebida']
        comiTabaco = this.totalTobaccoValue / 100 * datosNameTerapeuta[0]['tabaco']
        comiVitamina = this.totalValueVitamins / 100 * datosNameTerapeuta[0]['vitamina']
        comiOtros = this.totalValueOther / 100 * datosNameTerapeuta[0]['otros']

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

        // return this.sumCommission = sumComision.toFixed(0)
        if (this.sumCommission != 0 || this.sumCommission != undefined) {
          this.sumCommission = Number(sumComision.toFixed(1))
        }

        // Recibido

        for (let index = 0; index < this.settledData.length; index++) {
          const numbTerap = this.settledData.filter(serv => serv)
          this.receivedTherapist = numbTerap.reduce((accumulator, serv) => {
            return accumulator + serv.numberTerap
          }, 0)
        }
        return this.totalCommission = this.sumCommission - Number(this.receivedTherapist)
      })
    })
  }

  cancel() {
    this.getSettlements()
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

    if (this.liquidationTherapist.terapeuta != "") {
      if (this.liquidationTherapist.encargada != "") {

        this.serviceLiquidationTherapist.consultTherapistAndManager(this.liquidationTherapist.terapeuta,
          this.liquidationTherapist.encargada).subscribe((rp: any) => {

            if (rp.length > 0) {

              for (let index = 0; index < this.unliquidatedService.length; index++) {
                this.liquidationTherapist.tratamiento = this.unliquidatedService.length
                this.service.updateLiquidacionTerap(this.unliquidatedService[index]['id'], this.services).subscribe((dates) => { })
              }

              this.serviceLiquidationTherapist.settlementRecord(this.liquidationTherapist).subscribe((dates: any) => {

                setTimeout(() => { this.getSettlements() }, 1000);

                this.liquidationForm = true
                this.addForm = false
                this.editTerap = false
                this.selected = false
              })

              Swal.fire({
                position: 'top-end', icon: 'success', title: 'Liquidado Correctamente!', showConfirmButton: false, timer: 2500
              })
            }

            if (rp.length == 0) {

              this.service.getTerapeutaEncargada(this.liquidationTherapist.terapeuta, this.liquidationTherapist.encargada).subscribe((datesForDate) => {
                this.liquidationTherapist.desdeFechaLiquidado = datesForDate[0]['fechaHoyInicio']
                this.liquidationTherapist.desdeHoraLiquidado = datesForDate[0]['horaStart']

                let convertMes = '', convertDia = '', convertAno = ''

                convertDia = this.liquidationTherapist.desdeFechaLiquidado.toString().substring(8, 11)
                convertMes = this.liquidationTherapist.desdeFechaLiquidado.toString().substring(5, 7)
                convertAno = this.liquidationTherapist.desdeFechaLiquidado.toString().substring(2, 4)

                this.liquidationTherapist.desdeFechaLiquidado = `${convertDia}-${convertMes}-${convertAno}`

                for (let index = 0; index < this.unliquidatedService.length; index++) {
                  this.liquidationTherapist.tratamiento = this.unliquidatedService.length
                  this.service.updateLiquidacionTerap(this.unliquidatedService[index]['id'], this.services).subscribe((datos) => {
                  })
                }

                this.serviceLiquidationTherapist.settlementRecord(this.liquidationTherapist).subscribe((datos) => { })

                setTimeout(() => {
                  this.getSettlements()
                }, 1000);

                this.liquidationForm = true
                this.addForm = false
                this.editTerap = false
                this.selected = false
                this.convertToZero()
                Swal.fire({
                  position: 'top-end', icon: 'success', title: 'Liquidado Correctamente!', showConfirmButton: false, timer: 2500
                })
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