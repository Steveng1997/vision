import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormControl, FormGroup } from '@angular/forms'
import Swal from 'sweetalert2'
import { ActivatedRoute, Router } from '@angular/router'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'

// Servicios
import { LoginService } from 'src/app/core/services/login'
import { ServicioService } from 'src/app/core/services/servicio'
import { TrabajadoresService } from 'src/app/core/services/trabajadores'
import { LiquidacioneTerapService } from 'src/app/core/services/liquidacionesTerap'

// Model
import { LiquidacionTerapeuta } from 'src/app/core/models/liquidacionTerap'

@Component({
  selector: 'app-terapeutas',
  templateUrl: './terapeutas.component.html',
  styleUrls: ['./terapeutas.component.css']
})
export class TerapeutasComponent implements OnInit {

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

  liqTerapeuta: LiquidacionTerapeuta = {
    currentDate: "",
    desdeFechaLiquidado: "",
    desdeHoraLiquidado: "",
    encargada: "",
    hastaFechaLiquidado: "",
    hastaHoraLiquidado: new Date().toTimeString().substring(0, 5),
    id: 0,
    idTerapeuta: 0,
    importe: 0,
    terapeuta: "",
    tratamiento: 0
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
    public trabajadorService: TrabajadoresService,
    public servicioService: ServicioService,
    public loginService: LoginService,
    public liquidacionTerapService: LiquidacioneTerapService,
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
      this.liqTerapeuta.hastaFechaLiquidado = `${dia}-${convertMes}-${convertAno}`
    } else {
      this.liqTerapeuta.hastaFechaLiquidado = `${dia}-${mes}-${convertAno}`
    }

    if (dia > 0 && dia < 10) {
      convertDia = '0' + dia
      this.liqTerapeuta.hastaFechaLiquidado = `${convertDia}-${convertMes}-${convertAno}`
    } else {
      this.liqTerapeuta.hastaFechaLiquidado = `${dia}-${convertMes}-${convertAno}`
    }
  }

  getSettlements() {
    this.liquidacionTerapService.getLiquidacionesTerapeuta().subscribe((datoLiquidaciones: any) => {
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
    this.servicioService.getByLiquidTerapFalse().subscribe((datoServicio) => {
      this.unliquidatedService = datoServicio
    })
  }

  getTerapeuta() {
    this.trabajadorService.getAllTerapeuta().subscribe((datosTerapeuta: any) => {
      this.terapeuta = datosTerapeuta
    })
  }

  getEncargada() {
    this.loginService.getUsuarios().subscribe((datosEncargada: any) => {
      this.encargada = datosEncargada
    })
  }

  insertForm() {
    this.liqTerapeuta.encargada = ""
    this.liqTerapeuta.terapeuta = ""
    this.liquidationForm = false
    this.editTerap = false
    this.selected = false
    this.addForm = true
  }

  comments(targetModal, modal) {
    var notaMensaje = []
    this.servicioService.getById(targetModal).subscribe((datoServicio) => {
      notaMensaje = datoServicio[0]

      if (notaMensaje['nota'] != '')
        this.modalService.open(modal, {
          centered: true,
          backdrop: 'static',
        })
    })
  }

  inputDateAndTime() {
    this.servicioService.getByTerapeutaEncargadaFechaHoraInicioFechaHoraFin(this.liqTerapeuta.terapeuta,
      this.liqTerapeuta.encargada, this.liqTerapeuta.desdeHoraLiquidado, this.liqTerapeuta.hastaHoraLiquidado,
      this.liqTerapeuta.desdeFechaLiquidado, this.liqTerapeuta.hastaFechaLiquidado).subscribe((rp: any) => {
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

          this.trabajadorService.getTerapeuta(this.liqTerapeuta.terapeuta).subscribe((datosNameTerapeuta) => {
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
            this.liqTerapeuta.importe = this.totalCommission
          })

          return true
        } else {
          this.unliquidatedService = rp
          this.convertToZero()
          Swal.fire({
            icon: 'error', title: 'Oops...', text: 'No hay ningun servicio con la fecha seleccionada', showConfirmButton: false, timer: 2500
          })
          return false
        }
      })
    return false
  }

  dateDoesNotExist() {
    let año = "", mes = "", dia = ""

    this.servicioService.getTerapeutaFechaAsc(this.liqTerapeuta.terapeuta, this.liqTerapeuta.encargada).subscribe((rp) => {
      año = rp[0]['fechaHoyInicio'].substring(0, 4)
      mes = rp[0]['fechaHoyInicio'].substring(5, 7)
      dia = rp[0]['fechaHoyInicio'].substring(8, 10)

      this.liqTerapeuta.desdeFechaLiquidado = `${año}-${mes}-${dia}`
      this.liqTerapeuta.desdeHoraLiquidado = rp[0]['horaStart']
    })
  }

  dateExists() {
    let fecha = new Date(), dia = '', mes = '', año = 0, diaHasta = 0, mesHasta = 0, añoHasta = 0, convertMes = '', convertDia = ''

    this.liquidacionTerapService.getTerapAndEncarg(this.liqTerapeuta.terapeuta, this.liqTerapeuta.encargada).subscribe((rp: any) => {

      if (rp.length > 0) {
        año = fecha.getFullYear()
        mes = rp[0]['hastaFechaLiquidado'].substring(3, 5)
        dia = rp[0]['hastaFechaLiquidado'].substring(0, 2)
        this.liqTerapeuta.desdeFechaLiquidado = `${año}-${mes}-${dia}`
        this.liqTerapeuta.desdeHoraLiquidado = rp[0]['hastaHoraLiquidado']
      } else {
        this.dateDoesNotExist()
      }
    })

    diaHasta = fecha.getDate()
    mesHasta = fecha.getMonth() + 1
    añoHasta = fecha.getFullYear()

    if (mesHasta > 0 && mesHasta < 10) {
      convertMes = '0' + mesHasta
      this.liqTerapeuta.hastaFechaLiquidado = `${añoHasta}-${convertMes}-${diaHasta}`
    } else {
      this.liqTerapeuta.hastaFechaLiquidado = `${añoHasta}-${mesHasta}-${diaHasta}`
    }

    if (diaHasta > 0 && diaHasta < 10) {
      convertDia = '0' + diaHasta
      this.liqTerapeuta.hastaFechaLiquidado = `${añoHasta}-${convertMes}-${convertDia}`
    } else {
      this.liqTerapeuta.hastaFechaLiquidado = `${añoHasta}-${convertMes}-${diaHasta}`
    }
  }

  calculateServices(): any {
    if (this.liqTerapeuta.encargada != "" && this.liqTerapeuta.terapeuta != "") {
      this.getThoseThatNotLiquidated()

      this.servicioService.getByTerapeutaAndEncargada(this.liqTerapeuta.terapeuta, this.liqTerapeuta.encargada).subscribe((resp: any) => {
        if (resp.length > 0) {
          this.dateExists()
          if (this.inputDateAndTime()) return

          setTimeout(() => {
            this.selected = true
          }, 200);
          
        } else {
          this.selected = false
        }
      })
    }
  }

  goToEdit(id: number) {
    debugger
    const params = this.activatedRoute.snapshot['_urlSegment'].segments[1];
    this.idUser = Number(params.path)

    this.servicioService.getById(id).subscribe((rp: any) => {
      if (rp.length > 0) this.router.navigate([`menu/${this.idUser}/nuevo-servicio/${rp[0]['id']}/true`])
    })
  }

  edit() {
    this.idSettled
    debugger
    this.liqTerapeuta.importe = this.totalCommission
    this.liquidacionTerapService.updateTerapImporteId(this.idSettled, this.liqTerapeuta).subscribe((rp) => { })

    setTimeout(() => {
      this.getSettlements()
      this.liquidationForm = true
      this.editTerap = false
      this.selected = false
      this.liqTerapeuta.encargada = ""
      this.liqTerapeuta.terapeuta = ""
    }, 1000);
  }

  dataFormEdit(id: number, idLiq: number) {
    this.idSettled = idLiq
    this.liquidationForm = false
    this.editTerap = true

    this.liquidacionTerapService.getIdTerap(id).subscribe((datosTerapeuta) => {
      this.liqTerapeuta.desdeFechaLiquidado = datosTerapeuta[0]['desdeFechaLiquidado']
      this.liqTerapeuta.desdeHoraLiquidado = datosTerapeuta[0]['desdeHoraLiquidado']
      this.liqTerapeuta.hastaFechaLiquidado = datosTerapeuta[0]['hastaFechaLiquidado']
      this.liqTerapeuta.hastaHoraLiquidado = datosTerapeuta[0]['hastaHoraLiquidado']
    })

    this.servicioService.getByIdTerap(id).subscribe((datosTerapeuta) => {
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

      this.trabajadorService.getTerapeuta(this.settledData[0]['terapeuta']).subscribe((datosNameTerapeuta) => {
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
    this.liqTerapeuta.encargada = ""
    this.liqTerapeuta.terapeuta = ""
  }

  getDateFrom() {
    this.liquidacionTerapService.getTerapAndEncarg(this.liqTerapeuta.terapeuta, this.liqTerapeuta.encargada).subscribe((rp) => {
      this.liqTerapeuta.desdeFechaLiquidado = rp[0]['hastaFechaLiquidado']
      this.liqTerapeuta.desdeHoraLiquidado = rp[0]['hastaHoraLiquidado']
    })
  }

  save() {
    if (this.liqTerapeuta.terapeuta != "") {
      if (this.liqTerapeuta.encargada != "") {
        if (this.exist === true) {

          this.liqTerapeuta.currentDate = this.currentDate.toString()

          this.servicioService.getTerapeutaEncargada(this.liqTerapeuta.terapeuta, this.liqTerapeuta.encargada).subscribe((datos: any) => {
            this.liqTerapeuta.idTerapeuta = datos[0]['id']
            for (let index = 0; index < datos.length; index++) {
              this.liqTerapeuta.tratamiento = datos.length
              this.servicioService.updateLiquidacionTerap(datos[index]['id'], this.liqTerapeuta).subscribe((datos) => {
              })
            }

            this.getDateFrom()
            this.sortDate()

            this.liquidacionTerapService.settlementRecord(this.liqTerapeuta).subscribe((datos) => { })

            setTimeout(() => { this.getSettlements() }, 1000);

            this.liquidationForm = true
            this.addForm = false
            this.editTerap = false
            this.selected = false
            this.liqTerapeuta.encargada = ""
            this.liqTerapeuta.terapeuta = ""
            Swal.fire({
              position: 'top-end', icon: 'success', title: 'Liquidado Correctamente!', showConfirmButton: false, timer: 2500
            })
          })
        }

        if (this.exist === false) {

          this.servicioService.getTerapeutaEncargada(this.liqTerapeuta.terapeuta, this.liqTerapeuta.encargada).subscribe((datosForFecha) => {
            this.liqTerapeuta.desdeFechaLiquidado = datosForFecha[0]['fechaHoyInicio']
            this.liqTerapeuta.desdeHoraLiquidado = datosForFecha[0]['horaStart']

            let convertMes = '', convertDia = '', convertAno = ''

            convertDia = this.liqTerapeuta.desdeFechaLiquidado.toString().substring(8, 11)
            convertMes = this.liqTerapeuta.desdeFechaLiquidado.toString().substring(5, 7)
            convertAno = this.liqTerapeuta.desdeFechaLiquidado.toString().substring(2, 4)

            this.liqTerapeuta.desdeFechaLiquidado = `${convertDia}-${convertMes}-${convertAno}`

            this.servicioService.getTerapeutaEncargada(this.liqTerapeuta.terapeuta, this.liqTerapeuta.encargada).subscribe((datos: any) => {
              this.liqTerapeuta.idTerapeuta = datos[0]['id']
              for (let index = 0; index < datos.length; index++) {
                this.liqTerapeuta.tratamiento = datos.length
                this.servicioService.updateLiquidacionTerap(datos[index]['id'], this.liqTerapeuta).subscribe((datos) => {
                })
              }

              this.sortDate()
              this.liquidacionTerapService.settlementRecord(this.liqTerapeuta).subscribe((datos) => { })

              setTimeout(() => {
                this.getSettlements()
              }, 1000);

              this.liquidationForm = true
              this.addForm = false
              this.editTerap = false
              this.selected = false
              this.liqTerapeuta.encargada = ""
              this.liqTerapeuta.terapeuta = ""
              this.convertToZero()
              Swal.fire({
                position: 'top-end', icon: 'success', title: 'Liquidado Correctamente!', showConfirmButton: false, timer: 2500
              })
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