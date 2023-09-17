import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormControl, FormGroup } from '@angular/forms'
import Swal from 'sweetalert2'
import { ActivatedRoute, Router } from '@angular/router'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'

// Servicios
import { ServiceManager } from 'src/app/core/services/manager'
import { Service } from 'src/app/core/services/service'
import { ServiceTherapist } from 'src/app/core/services/therapist'
import { ServiceLiquidationManager } from 'src/app/core/services/managerCloseouts'

// Model
import { ModelService } from 'src/app/core/models/service'
import { LiquidationManager } from 'src/app/core/models/liquidationManager'

@Component({
  selector: 'app-manager',
  templateUrl: './manager.component.html',
  styleUrls: ['./manager.component.css']
})
export class ManagerComponent implements OnInit {

  CurrenDate = ""
  idSettled: number
  liquidationForm: boolean
  addForm: boolean
  editEncarg: boolean
  filterByName: string
  filterByNumber: number
  unliquidatedService: any
  liquidated: any
  settledData: any
  page!: number
  fijoDia: number
  fixedTotalDay: number

  // Encargada
  encargada: any[] = []
  encargadaName: any

  // Fecha
  fechaInicio: string
  fechaFinal: string

  selected: boolean
  idUser: number

  // Servicios
  totalService: number
  totalTipValue: number
  totalValueOrdered: number
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

  currentDate = new Date().getTime()
  exist: boolean

  liquidationManager: LiquidationManager = {
    currentDate: "",
    desdeFechaLiquidado: "",
    desdeHoraLiquidado: "",
    encargada: "",
    hastaFechaLiquidado: "",
    hastaHoraLiquidado: new Date().toTimeString().substring(0, 5),
    id: 0,
    idUnico: "",
    idEncargada: "",
    importe: 0,
    tratamiento: 0
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
    private modalService: NgbModal,
    public serviceTherapist: ServiceTherapist,
    public service: Service,
    public serviceManager: ServiceManager,
    public serviceLiquidationManager: ServiceLiquidationManager,
    private activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    document.getElementById('idTitulo').style.display = 'block'
    document.getElementById('idTitulo').innerHTML = 'LIQUIDACIÓNES ENCARGADAS'

    this.liquidationForm = true
    this.addForm = false
    this.selected = false
    this.editEncarg = false
    this.date()
    this.getSettlements()
    this.getEncargada()
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
    this.totalValueOrdered = 0
    this.encargadaName['servicio'] = 0
    this.encargadaName['propina'] = 0
    this.encargadaName['bebida'] = 0
    this.encargadaName['tabaco'] = 0
    this.encargadaName['vitamina'] = 0
    this.encargadaName['otros'] = 0
    this.serviceCommission = 0
    this.commissionTip = 0
    this.beverageCommission = 0
    this.tobaccoCommission = 0
    this.vitaminCommission = 0
    this.commissionOthers = 0
    this.sumCommission = 0
    this.receivedTherapist = 0
    this.totalCommission = 0
  }

  validateNullData() {
    if (this.encargadaName?.['servicio'] == "") this.encargadaName['servicio'] = 0
    if (this.encargadaName?.['propina'] == "") this.encargadaName['propina'] = 0
    if (this.encargadaName?.['bebida'] == "") this.encargadaName['bebida'] = 0
    if (this.encargadaName?.['tabaco'] == "") this.encargadaName['tabaco'] = 0
    if (this.encargadaName?.['vitamina'] == "") this.encargadaName['vitamina'] = 0
    if (this.encargadaName?.['otros'] == "") this.encargadaName['otros'] = 0
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
    if (this.totalValueOrdered == undefined) this.totalValueOrdered = 0
  }

  getSettlements() {
    let añoDesde = "", mesDesde = "", diaDesde = "", añoHasta = "", mesHasta = "", diaHasta = ""

    this.serviceLiquidationManager.getLiquidacionesEncargada().subscribe((datoLiquidaciones: any) => {
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

      if (datoLiquidaciones.length > 0) this.exist = true
      else this.exist = false
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

  filters(event: any) {
    this.formTemplate.value.fechaInicio = event.target.value
    this.filterByName = this.formTemplate.value.busqueda.replace(/(^\w{1})|(\s+\w{1})/g, letra => letra.toUpperCase())
    this.filterByNumber = Number(this.formTemplate.value.busqueda)

    if (this.formTemplate.value.fechaInicio != "") {
      let mes = '', dia = '', año = '', fecha = ''
      fecha = this.formTemplate.value.fechaInicio
      dia = fecha.substring(8, 11)
      mes = fecha.substring(5, 7)
      año = fecha.substring(2, 4)
      this.fechaInicio = `${dia}-${mes}-${año}`
    }
  }

  getThoseThatNotLiquidated() {
    this.service.getByLiquidTerapFalse().subscribe((datoServicio) => {
      this.unliquidatedService = datoServicio
    })
  }

  getEncargada() {
    this.serviceManager.getUsuarios().subscribe((datosEncargada: any) => {
      this.encargada = datosEncargada
    })
  }

  insertForm() {
    this.liquidationManager.encargada = ""
    this.liquidationForm = false
    this.editEncarg = false
    this.selected = false
    this.addForm = true
  }

  comments(targetModal, modal) {
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

    this.serviceLiquidationManager.getLiquidacionesEncargada().subscribe((rp: any) => {
      if (rp.length > 0) {
        año = fecha.getFullYear()
        mes = rp[0]['hastaFechaLiquidado'].substring(5, 7)
        dia = rp[0]['hastaFechaLiquidado'].substring(8, 10)
        this.liquidationManager.desdeFechaLiquidado = `${año}-${mes}-${dia}`
        this.liquidationManager.desdeHoraLiquidado = rp[0]['hastaHoraLiquidado']
      } else {
        this.dateDoesNotExist()
      }
    })

    diaHasta = fecha.getDate()
    mesHasta = fecha.getMonth() + 1
    añoHasta = fecha.getFullYear()

    if (mesHasta > 0 && mesHasta < 10) {
      convertMes = '0' + mesHasta
      this.liquidationManager.hastaFechaLiquidado = `${añoHasta}-${convertMes}-${diaHasta}`
    } else {
      this.liquidationManager.hastaFechaLiquidado = `${añoHasta}-${mesHasta}-${diaHasta}`
    }

    if (diaHasta > 0 && diaHasta < 10) {
      convertDia = '0' + diaHasta
      this.liquidationManager.hastaFechaLiquidado = `${añoHasta}-${convertMes}-${convertDia}`
    } else {
      this.liquidationManager.hastaFechaLiquidado = `${añoHasta}-${convertMes}-${diaHasta}`
    }
  }

  fixedNumberDay(event: any) {
    let numberValue = 0
    numberValue = Number(event.target.value)
    if (numberValue > 0) {
      this.fixedTotalDay = numberValue * this.fijoDia
      this.totalCommission = this.sumCommission + this.fixedTotalDay - Number(this.receivedTherapist)
    }
  }

  consultWithManager() {
    this.serviceManager.getEncargada(this.liquidationManager.encargada).subscribe((resp: any) => {
      this.fijoDia = resp[0]['fijoDia']
      this.fixedTotalDay = resp[0]['fijoDia']
    })
    return true
  }

  calculateServices(): any {
    if (this.liquidationManager.encargada != "") {
      this.getThoseThatNotLiquidated()
      if (!this.consultWithManager()) return
      this.service.getByEncargada(this.liquidationManager.encargada).subscribe((resp: any) => {
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
      this.service.getByEncargadaFechaHoraInicioFechaHoraFin(this.liquidationManager.encargada,
        this.liquidationManager.desdeHoraLiquidado, this.liquidationManager.hastaHoraLiquidado,
        this.liquidationManager.desdeFechaLiquidado, this.liquidationManager.hastaFechaLiquidado).subscribe((rp: any) => {

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

            const encargada = this.unliquidatedService.filter(serv => rp)
            this.totalValueOrdered = encargada.reduce((accumulator, serv) => {
              return accumulator + serv.numberEncarg
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

            // Filter by Vitamina
            const otroServicio = this.unliquidatedService.filter(serv => rp)
            this.totalValueOther = otroServicio.reduce((accumulator, serv) => {
              return accumulator + serv.otros
            }, 0)

            this.serviceManager.getEncargada(this.liquidationManager.encargada).subscribe((datosNameTerapeuta) => {
              this.encargadaName = datosNameTerapeuta[0]

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

              let dayStart = 0, dayEnd = 0, fixedDay = 0
              dayStart = Number(this.liquidationManager.desdeFechaLiquidado.toString().substring(8, 10))
              dayEnd = Number(this.liquidationManager.hastaFechaLiquidado.toString().substring(8, 10))

              this.fixedTotalDay = dayEnd - dayStart
              fixedDay = this.fixedTotalDay * this.fijoDia

              // Recibido
              this.receivedTherapist = this.totalValueOrdered + this.totalTherapistValue
              this.totalCommission = this.sumCommission + fixedDay - Number(this.receivedTherapist)
              this.liquidationManager.importe = this.totalCommission

              this.validateNullData()
            })
            return true
          } else {
            this.unliquidatedService = rp

            this.serviceManager.getEncargada(this.liquidationManager.encargada).subscribe((datosNameTerapeuta) => {
              this.encargadaName = datosNameTerapeuta[0]

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

              let dayStart = 0, dayEnd = 0, fixedDay = 0
              dayStart = Number(this.liquidationManager.desdeFechaLiquidado.toString().substring(8, 10))
              dayEnd = Number(this.liquidationManager.hastaFechaLiquidado.toString().substring(8, 10))

              this.fixedTotalDay = dayEnd - dayStart
              fixedDay = this.fixedTotalDay * this.fijoDia

              // Recibido
              this.receivedTherapist = this.totalValueOrdered + this.totalTherapistValue
              this.totalCommission = this.sumCommission + fixedDay - Number(this.receivedTherapist)
              this.liquidationManager.importe = this.totalCommission

              this.validateNullData()
            })

            Swal.fire({
              icon: 'error', title: 'Oops...', text: 'No hay ningun servicio con la fecha seleccionada', showConfirmButton: false, timer: 2500
            })
            return false
          }
        })
    }, 900);
    return false
  }

  dateDoesNotExist() {
    let año = "", mes = "", dia = ""

    this.service.getEncargFechaAsc(this.liquidationManager.encargada).subscribe((rp) => {
      año = rp[0]['fechaHoyInicio'].substring(0, 4)
      mes = rp[0]['fechaHoyInicio'].substring(5, 7)
      dia = rp[0]['fechaHoyInicio'].substring(8, 10)
      this.liquidationManager.desdeFechaLiquidado = `${año}-${mes}-${dia}`
      this.liquidationManager.desdeHoraLiquidado = rp[0]['horaStart']
    })
  }

  goToEdit(id: number) {
    const params = this.activatedRoute.snapshot['_urlSegment'].segments[1];
    this.idUser = Number(params.path)

    this.service.getById(id).subscribe((rp: any) => {
      if (rp.length > 0) this.router.navigate([`menu/${this.idUser}/nuevo-servicio/${rp[0]['id']}/true`])
    })
  }

  edit() {
    this.idSettled
    this.liquidationManager.importe = this.totalCommission
    this.serviceLiquidationManager.updateEncargImporteId(this.idSettled, this.liquidationManager).subscribe((rp) => { })

    setTimeout(() => {
      this.getSettlements()
      this.liquidationForm = true
      this.editEncarg = false
      this.selected = false
      this.liquidationManager.encargada = ""
    }, 1000);
  }

  dataFormEdit(id: number, idEncarg: number) {
    this.idSettled = idEncarg
    this.liquidationForm = false
    this.editEncarg = true

    this.serviceLiquidationManager.getIdEncarg(id).subscribe((datosTerapeuta) => {
      this.liquidationManager.desdeFechaLiquidado = datosTerapeuta[0]['desdeFechaLiquidado']
      this.liquidationManager.desdeHoraLiquidado = datosTerapeuta[0]['desdeHoraLiquidado']
      this.liquidationManager.hastaFechaLiquidado = datosTerapeuta[0]['hastaFechaLiquidado']
      this.liquidationManager.hastaHoraLiquidado = datosTerapeuta[0]['hastaHoraLiquidado']
    })

    this.service.getByIdEncarg(id).subscribe((datosTerapeuta) => {
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
        this.encargadaName = datosNameTerapeuta[0]
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
    this.editEncarg = false
    this.selected = false
    this.liquidationManager.encargada = ""
  }

  getDateFrom() {
    this.serviceLiquidationManager.getByEncargada(this.liquidationManager.encargada).subscribe((rp) => {
      this.liquidationManager.desdeFechaLiquidado = rp[0]['hastaFechaLiquidado']
      this.liquidationManager.desdeHoraLiquidado = rp[0]['hastaHoraLiquidado']
    })
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

  save() {
    this.createUniqueId()
    this.liquidationManager.currentDate = this.currentDate.toString()
    if (this.liquidationManager.encargada != "") {
      if (this.exist === true) {

        for (let index = 0; index < this.unliquidatedService.length; index++) {
          this.liquidationManager.tratamiento = this.unliquidatedService.length
          this.service.updateLiquidacionEncarg(this.unliquidatedService[index]['id'], this.services).subscribe((datos) => { })
        }

        this.getDateFrom()
        this.serviceLiquidationManager.settlementRecord(this.liquidationManager).subscribe((datos) => { })

        setTimeout(() => { this.getSettlements() }, 1000);

        this.liquidationForm = true
        this.addForm = false
        this.editEncarg = false
        this.selected = false
        this.liquidationManager.encargada = ""
        Swal.fire({
          position: 'top-end', icon: 'success', title: 'Liquidado Correctamente!', showConfirmButton: false, timer: 2500
        })
      }

      if (this.exist === false) {

        this.service.getEncargadaAndLiquidacion(this.liquidationManager.encargada).subscribe((datosForFecha) => {
          this.liquidationManager.desdeFechaLiquidado = datosForFecha[0]['fechaHoyInicio']
          this.liquidationManager.desdeHoraLiquidado = datosForFecha[0]['horaStart']

          let convertMes = '', convertDia = '', convertAno = ''

          convertDia = this.liquidationManager.desdeFechaLiquidado.toString().substring(8, 11)
          convertMes = this.liquidationManager.desdeFechaLiquidado.toString().substring(5, 7)
          convertAno = this.liquidationManager.desdeFechaLiquidado.toString().substring(2, 4)

          this.liquidationManager.desdeFechaLiquidado = `${convertDia}-${convertMes}-${convertAno}`

          for (let index = 0; index < this.unliquidatedService.length; index++) {
            this.liquidationManager.tratamiento = this.unliquidatedService.length
            this.service.updateLiquidacionEncarg(this.unliquidatedService[index]['id'], this.services).subscribe((datos) => {
            })
          }

          this.serviceLiquidationManager.settlementRecord(this.liquidationManager).subscribe((datos) => { })

          setTimeout(() => {
            this.getSettlements()
          }, 1000);

          this.liquidationForm = true
          this.addForm = false
          this.editEncarg = false
          this.selected = false
          this.liquidationManager.encargada = ""
          this.convertToZero()
          Swal.fire({
            position: 'top-end', icon: 'success', title: 'Liquidado Correctamente!', showConfirmButton: false, timer: 2500
          })
        })
      }
    } else {
      Swal.fire({
        icon: 'error', title: 'Oops...', text: 'No hay ninguna encargada seleccionada', showConfirmButton: false, timer: 2500
      })
    }
  }
}