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

  idSettled: number
  liquidationForm: boolean
  addForm: boolean
  editTerap: boolean
  filterByName: string
  filterByNumber: number
  unliquidatedService: any
  liquidated: any
  settledData: any
  page!: number

  // Encargada
  encargada: any[] = []

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
    private modalService: NgbModal,
    public serviceTherapist: ServiceTherapist,
    public service: Service,
    public serviceManager: ServiceManager,
    public serviceLiquidationTherapist: ServiceLiquidationTherapist,
    private activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    document.getElementById('idTitulo').style.display = 'block'
    document.getElementById('idTitulo').innerHTML = 'LIQUIDACIÓNES TERAPEUTAS'

    this.liquidationForm = true
    this.addForm = false
    this.selected = false
    this.editTerap = false
    this.getSettlements()
    this.getEncargada()
    this.getTerapeuta()
  }

  convertToZero() {
    this.totalService = 0
    this.totalTipValue = 0
    this.totalTherapistValue = 0
    this.totalValueDrink = 0
    this.totalTobaccoValue = 0
    this.totalValueVitamins = 0
    this.totalValueOther = 0
    this.terapeutaName['servicio'] = 0
    this.terapeutaName['propina'] = 0
    this.terapeutaName['bebida'] = 0
    this.terapeutaName['tabaco'] = 0
    this.terapeutaName['vitamina'] = 0
    this.terapeutaName['otros'] = 0
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
    if (this.serviceCommission == undefined) this.serviceCommission = 0
    if (this.commissionTip == undefined) this.commissionTip = 0
    if (this.beverageCommission == undefined) this.beverageCommission = 0
    if (this.tobaccoCommission == undefined) this.tobaccoCommission = 0
    if (this.vitaminCommission == undefined) this.vitaminCommission = 0
    if (this.commissionOthers == undefined) this.commissionOthers = 0
    if (this.sumCommission == undefined) this.sumCommission = 0
    if (this.totalCommission == undefined) this.totalCommission = 0
  }

  sortDate() {
    let fecha = new Date(), dia = 0, mes = 0, año = 0, convertMes = '', convertDia = '',
      convertAno = ''

    dia = fecha.getDate()
    mes = fecha.getMonth() + 1
    año = fecha.getFullYear()
    convertAno = año.toString().substring(2, 4)

    if (mes > 0 && mes < 10) {
      convertMes = '0' + mes
      this.liquidationTherapist.hastaFechaLiquidado = `${dia}-${convertMes}-${convertAno}`
    } else {
      this.liquidationTherapist.hastaFechaLiquidado = `${dia}-${mes}-${convertAno}`
    }

    if (dia > 0 && dia < 10) {
      convertDia = '0' + dia
      this.liquidationTherapist.hastaFechaLiquidado = `${convertDia}-${convertMes}-${convertAno}`
    } else {
      this.liquidationTherapist.hastaFechaLiquidado = `${dia}-${convertMes}-${convertAno}`
    }
  }

  getSettlements() {
    this.serviceLiquidationTherapist.getLiquidacionesTerapeuta().subscribe((datoLiquidaciones: any) => {
      this.liquidated = datoLiquidaciones

      if (datoLiquidaciones.length > 0) this.exist = true
      else this.exist = false
    })
  }

  filters() {
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

    if (this.formTemplate.value.FechaFin != "") {
      let mesFin = '', diaFin = '', añoFin = '', fechaFin = ''
      fechaFin = this.formTemplate.value.FechaFin
      diaFin = fechaFin.substring(8, 11)
      mesFin = fechaFin.substring(5, 7)
      añoFin = fechaFin.substring(2, 4)
      this.fechaFinal = `${diaFin}-${mesFin}-${añoFin}`
    }
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

  getEncargada() {
    this.serviceManager.getUsuarios().subscribe((datosEncargada: any) => {
      this.encargada = datosEncargada
    })
  }

  insertForm() {
    this.liquidationTherapist.encargada = ""
    this.liquidationTherapist.terapeuta = ""
    this.liquidationForm = false
    this.editTerap = false
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

    this.serviceLiquidationTherapist.getTerapAndEncarg(this.liquidationTherapist.terapeuta, this.liquidationTherapist.encargada).subscribe((rp: any) => {
      if (rp.length > 0) {
        año = fecha.getFullYear()
        mes = rp[0]['hastaFechaLiquidado'].substring(3, 5)
        dia = rp[0]['hastaFechaLiquidado'].substring(0, 2)
        this.liquidationTherapist.desdeFechaLiquidado = `${año}-${mes}-${dia}`
        this.liquidationTherapist.desdeHoraLiquidado = rp[0]['hastaHoraLiquidado']
      } else {
        this.dateDoesNotExist()
      }


      diaHasta = fecha.getDate()
      mesHasta = fecha.getMonth() + 1
      añoHasta = fecha.getFullYear()

      if (mesHasta > 0 && mesHasta < 10) {
        convertMes = '0' + mesHasta
        this.liquidationTherapist.hastaFechaLiquidado = `${añoHasta}-${convertMes}-${diaHasta}`
      } else {
        this.liquidationTherapist.hastaFechaLiquidado = `${añoHasta}-${mesHasta}-${diaHasta}`
      }

      if (diaHasta > 0 && diaHasta < 10) {
        convertDia = '0' + diaHasta
        this.liquidationTherapist.hastaFechaLiquidado = `${añoHasta}-${convertMes}-${convertDia}`
      } else {
        this.liquidationTherapist.hastaFechaLiquidado = `${añoHasta}-${convertMes}-${diaHasta}`
      }
      return true
    })
    return true
  }

  inputDateAndTime() {
    if (!this.dateExists()) return
    
    setTimeout(() => {
      this.selected = true

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
            const terapeuta = this.unliquidatedService.filter(serv => serv.rp)
            this.totalTherapistValue = terapeuta.reduce((accumulator, serv) => {
              return accumulator + serv.numberTerap
            }, 0)

            const encargada = this.unliquidatedService.filter(serv => serv.rp)
            this.totalValueOrdered = encargada.reduce((accumulator, serv) => {
              return accumulator + serv.numberEncarg
            }, 0)

            // Filter by Bebida
            const bebida = this.unliquidatedService.filter(serv => serv.rp)
            this.totalValueDrink = bebida.reduce((accumulator, serv) => {
              return accumulator + serv.bebidas
            }, 0)

            // Filter by Tabaco
            const tabac = this.unliquidatedService.filter(serv => serv.rp)
            this.totalTobaccoValue = tabac.reduce((accumulator, serv) => {
              return accumulator + serv.tabaco
            }, 0)

            // Filter by Vitamina
            const vitamina = this.unliquidatedService.filter(serv => serv.rp)
            this.totalValueVitamins = vitamina.reduce((accumulator, serv) => {
              return accumulator + serv.vitaminas
            }, 0)

            // Filter by Vitamina
            const otroServicio = this.unliquidatedService.filter(serv => serv.rp)
            this.totalValueOther = otroServicio.reduce((accumulator, serv) => {
              return accumulator + serv.otros
            }, 0)

            let comisiServicio = 0, comiPropina = 0, comiBebida = 0, comiTabaco = 0, comiVitamina = 0, comiOtros = 0, sumComision = 0
            this.totalCommission = 0

            this.serviceTherapist.getTerapeuta(this.liquidationTherapist.terapeuta).subscribe((datosNameTerapeuta) => {
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
              this.receivedTherapist = this.totalValueOrdered + this.totalTherapistValue
              this.totalCommission = this.sumCommission - Number(this.receivedTherapist)
              this.liquidationTherapist.importe = this.totalCommission
            })
          } else {
            this.selected = false
            this.unliquidatedService = rp
            this.convertToZero()
            Swal.fire({
              icon: 'error', title: 'Oops...', text: 'No hay ningun servicio con la fecha seleccionada', showConfirmButton: false, timer: 2500
            })
          }
        })
    }, 900);
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
    const params = this.activatedRoute.snapshot['_urlSegment'].segments[1];
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
    debugger
    this.idSettled = idLiq
    this.liquidationForm = false
    this.editTerap = true

    this.serviceLiquidationTherapist.getIdTerap(id).subscribe((datosTerapeuta) => {
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

  getDateFrom() {
    this.serviceLiquidationTherapist.getTerapAndEncarg(this.liquidationTherapist.terapeuta, this.liquidationTherapist.encargada).subscribe((rp) => {
      this.liquidationTherapist.desdeFechaLiquidado = rp[0]['hastaFechaLiquidado']
      this.liquidationTherapist.desdeHoraLiquidado = rp[0]['hastaHoraLiquidado']
    })
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
        if (this.exist === true) {


          for (let index = 0; index < this.unliquidatedService.length; index++) {
            this.liquidationTherapist.tratamiento = this.unliquidatedService.length
            this.service.updateLiquidacionTerap(this.unliquidatedService[index]['id'], this.services).subscribe((datos) => { })
          }

          this.getDateFrom()
          this.sortDate()

          this.serviceLiquidationTherapist.settlementRecord(this.liquidationTherapist).subscribe((datos) => { })

          setTimeout(() => { this.getSettlements() }, 1000);

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

        if (this.exist === false) {

          this.service.getTerapeutaEncargada(this.liquidationTherapist.terapeuta, this.liquidationTherapist.encargada).subscribe((datosForFecha) => {
            this.liquidationTherapist.desdeFechaLiquidado = datosForFecha[0]['fechaHoyInicio']
            this.liquidationTherapist.desdeHoraLiquidado = datosForFecha[0]['horaStart']

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

            this.sortDate()
            this.serviceLiquidationTherapist.settlementRecord(this.liquidationTherapist).subscribe((datos) => { })

            setTimeout(() => {
              this.getSettlements()
            }, 1000);

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
          })
        }
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
}