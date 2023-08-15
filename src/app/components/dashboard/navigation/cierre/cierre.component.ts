import { Component, OnInit, ɵbypassSanitizationTrustResourceUrl } from '@angular/core'
import { FormBuilder, FormControl, FormGroup } from '@angular/forms'
import Swal from 'sweetalert2'
import { Router } from '@angular/router'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'

// Servicios
import { LoginService } from 'src/app/core/services/login'
import { ServicioService } from 'src/app/core/services/servicio'
import { CierreService } from 'src/app/core/services/cierre'

// Model
import { Cierre } from 'src/app/core/models/cierre'

@Component({
  selector: 'app-cierre',
  templateUrl: './cierre.component.html',
  styleUrls: ['./cierre.component.css']
})
export class CierreComponent implements OnInit {

  liqCierre: boolean
  addCierre: boolean
  filtredBusqueda: string
  servicio: any
  page!: number
  cierreTrue = []
  cierre: any
  editCierre: boolean
  datosCierre: any

  // Encargada
  encargada: any[] = []
  encargadaSelect: string

  // Fecha
  fechaInicio: string
  fechaFinal: string

  // Conversión
  fechaAsc: string
  fechaDesc: string
  horaAsc: string
  horaDesc: string
  mostrarFecha: boolean
  fechaDesde: any

  // Pagos
  totalValueServicio: number
  totalValueEfectivo: number
  totalValueBizum: number
  totalValueTarjeta: number
  totalValueTrans: number
  ingresoPeriodo: number

  // Cobros
  totalValuePiso: number
  totalValuePiso2: number
  totalValueTerap: number
  totalValueEncarg: number
  totalValueOtros: number

  /* Caja Encargada*/
  cajaEncargEfect: number
  cajaEncargBizum: number
  cajaEncargTarj: number
  cajaEncargTrans: number

  /* Caja Terapeuta*/
  cajaTerapEfect: number
  cajaTerapBizum: number
  cajaTerapTarj: number
  cajaTerapTrans: number

  /* Totales caja */

  totalCajaBizu: number
  totalCajaTarjeta: number
  totalCajaTransfer: number
  sumaEfectivo = 0
  sumaBizum = 0
  sumaTarjeta = 0
  sumaTransfe = 0

  // Periodo
  sumaPeriodo: number

  currentDate = new Date().getTime()
  existe: boolean
  selected: boolean

  cierres: Cierre = {
    bizum: 0,
    currentDate: "",
    efectivo: 0,
    encargada: "",
    fechaDesde: "",
    fechaHasta: "",
    horaDesde: "",
    horaHasta: new Date().toTimeString().substring(0, 5),
    id: 0,
    idCierre: 0,
    tarjeta: 0,
    total: 0,
    transaccion: 0,
    tratamiento: 0,
  }

  constructor(
    public router: Router,
    private modalService: NgbModal,
    public fb: FormBuilder,
    private servicioService: ServicioService,
    private loginService: LoginService,
    private cierreService: CierreService,
  ) { }

  formTemplate = new FormGroup({
    fechaInicio: new FormControl(''),
    FechaFin: new FormControl(''),
    terapeuta: new FormControl(''),
    encargada: new FormControl(''),
    busqueda: new FormControl(''),
  })

  ngOnInit(): void {
    document.getElementById('idTitulo').style.display = 'block'
    document.getElementById('idTitulo').innerHTML = 'CIERRE'

    this.cierres.encargada = ""
    this.editCierre = false
    this.liqCierre = true
    this.addCierre = false
    this.selected = false

    this.getCierre()
    this.getServicio()
    this.getEncargada()
    this.totalesUndefined()
  }

  fechaOrdenada() {
    let fecha = new Date(), dia = 0, mes = 0, año = 0, convertMes = '', convertDia = '',
      convertAno = ''

    dia = fecha.getDate()
    mes = fecha.getMonth() + 1
    año = fecha.getFullYear()
    convertAno = año.toString().substring(2, 4)

    if (mes > 0 && mes < 10) {
      convertMes = '0' + mes
      this.cierres.fechaHasta = `${dia}-${convertMes}-${convertAno}`
    } else {
      this.cierres.fechaHasta = `${dia}-${mes}-${convertAno}`
    }

    if (dia > 0 && dia < 10) {
      convertDia = '0' + dia
      this.cierres.fechaHasta = `${convertDia}-${convertMes}-${convertAno}`
    } else {
      this.cierres.fechaHasta = `${dia}-${convertMes}-${convertAno}`
    }
  }

  editamos(id: number) {
    this.editCierre = true
    this.addCierre = false
    this.liqCierre = false

    this.cierreService.getIdCierre(id).subscribe((datosCierre) => {
      this.horaAsc = datosCierre[0]['horaHasta']
      this.horaDesc = datosCierre[0]['horaDesde']
    })

    this.servicioService.getByIdCierre(id).subscribe((datosCierre) => {
      this.datosCierre = datosCierre;

      this.cierreService.getEncargadaFechaAscByCierreTrue(datosCierre[0]['encargada']).subscribe((fechaAsce) => {
        this.fechaAsc = datosCierre[0]['fechaHoyInicio']
      })

      this.cierreService.getEncargadaFechaDescByCierreFalse(datosCierre[0]['encargada']).subscribe((fechaDesce) => {
        this.fechaDesc = datosCierre[0]['fechaHoyInicio']
      })

      // Filter by servicio
      const servicios = this.datosCierre.filter(serv => serv)
      this.ingresoPeriodo = servicios.reduce((accumulator, serv) => {
        return accumulator + serv.totalServicio
      }, 0)


      // Caja Efectivo
      const cajaEfectivo = this.datosCierre.filter(serv => serv)
      this.cierres.total = cajaEfectivo.reduce((accumulator, serv) => {
        return accumulator + serv.totalServicio
      }, 0)

      // Ingresos Efectivo
      const ingresosEfectivo = this.datosCierre.filter(serv => serv)
      this.cierres.efectivo = ingresosEfectivo.reduce((accumulator, serv) => {
        return accumulator + serv.valueEfectivo
      }, 0)

      // Caja - Encargada

      // Filter by Encargada Efectivo
      const totalEncargadaEfect = this.datosCierre.filter(serv => serv)
      this.cajaEncargEfect = totalEncargadaEfect.reduce((accumulator, serv) => {
        return accumulator + serv.valueEfectEncargada
      }, 0)

      // Filter by Encargada Bizu
      const totalEncargadaBizum = this.datosCierre.filter(serv => serv)
      this.cajaEncargBizum = totalEncargadaBizum.reduce((accumulator, serv) => {
        return accumulator + serv.valueBizuEncargada
      }, 0)

      // Filter by Encargada Tarjeta
      const totalEncargadaTarjeta = this.datosCierre.filter(serv => serv)
      this.cajaEncargTarj = totalEncargadaTarjeta.reduce((accumulator, serv) => {
        return accumulator + serv.valueTarjeEncargada
      }, 0)

      // Filter by Encargada Transferencia
      const totalEncargadaTransf = this.datosCierre.filter(serv => serv)
      this.cajaEncargTrans = totalEncargadaTransf.reduce((accumulator, serv) => {
        return accumulator + serv.valueTransEncargada
      }, 0)

      // Caja - Terapeuta

      // Filter by Terapeuta Efectivo
      const totalTerapeutaEfectivo = this.datosCierre.filter(serv => serv)
      this.cajaTerapEfect = totalTerapeutaEfectivo.reduce((accumulator, serv) => {
        return accumulator + serv.valueEfectTerapeuta
      }, 0)

      // Filter by Terapeuta Bizum
      const totalTerapeutaBizum = this.datosCierre.filter(serv => serv)
      this.cajaTerapBizum = totalTerapeutaBizum.reduce((accumulator, serv) => {
        return accumulator + serv.valueBizuTerapeuta
      }, 0)

      // Filter by Terapeuta Tarjeta
      const totalTerapeutaTarjeta = this.datosCierre.filter(serv => serv)
      this.cajaTerapTarj = totalTerapeutaTarjeta.reduce((accumulator, serv) => {
        return accumulator + serv.valueTarjeTerapeuta
      }, 0)

      // Filter by Terapeuta Transferencia
      const totalTerapeutaTransf = this.datosCierre.filter(serv => serv)
      this.cajaTerapTrans = totalTerapeutaTransf.reduce((accumulator, serv) => {
        return accumulator + serv.valueTransTerapeuta
      }, 0)

      // Pagos Efectivo
      this.sumaEfectivo = Number(this.cajaEncargEfect) + Number(this.cajaTerapEfect)

      // Caja Bizum
      const cajaBizum = this.datosCierre.filter(serv => serv)
      this.totalCajaBizu = cajaBizum.reduce((accumulator, serv) => {
        return accumulator + serv.totalServicio
      }, 0)

      // Ingresos Bizum
      const ingresosBizum = this.datosCierre.filter(serv => serv)
      this.cierres.bizum = ingresosBizum.reduce((accumulator, serv) => {
        return accumulator + serv.valueBizum
      }, 0)

      // Pagos Bizum
      this.sumaBizum = Number(this.cajaEncargBizum) + Number(this.cajaTerapBizum)

      // Caja Tarjeta
      const cajaTarjet = this.datosCierre.filter(serv => serv)
      this.totalCajaTarjeta = cajaTarjet.reduce((accumulator, serv) => {
        return accumulator + serv.totalServicio
      }, 0)

      // Ingresos Tarjeta
      const ingresosTarjeta = this.datosCierre.filter(serv => serv)
      this.cierres.tarjeta = ingresosTarjeta.reduce((accumulator, serv) => {
        return accumulator + serv.valueTarjeta
      }, 0)

      // Pagos Tarjeta
      this.sumaTarjeta = Number(this.cajaEncargTarj) + Number(this.cajaTerapTarj)

      // Caja Transferencia
      const cajaTransf = this.datosCierre.filter(serv => serv)
      this.totalCajaTransfer = cajaTransf.reduce((accumulator, serv) => {
        return accumulator + serv.totalServicio
      }, 0)

      // Ingresos Transferencia
      const ingresosTransf = this.datosCierre.filter(serv => serv)
      this.cierres.transaccion = ingresosTransf.reduce((accumulator, serv) => {
        return accumulator + serv.valueTrans
      }, 0)

      // Pagos Transferencia
      this.sumaTransfe = Number(this.cajaEncargTrans) + Number(this.cajaTerapTrans)

      // Tabla #2

      // Filter by Piso
      const piso1 = this.datosCierre.filter(serv => serv)
      this.totalValuePiso = piso1.reduce((accumulator, serv) => {
        return accumulator + serv.numberPiso1
      }, 0)

      // Filter by Piso 2
      const piso2 = this.datosCierre.filter(serv => serv)
      this.totalValuePiso2 = piso2.reduce((accumulator, serv) => {
        return accumulator + serv.numberPiso2
      }, 0)

      // Filter by Terapeuta
      const terap = this.datosCierre.filter(serv => serv)
      this.totalValueTerap = terap.reduce((accumulator, serv) => {
        return accumulator + serv.numberTerap
      }, 0)

      // Filter by Encargada
      const encarg = this.datosCierre.filter(serv => serv)
      this.totalValueEncarg = encarg.reduce((accumulator, serv) => {
        return accumulator + serv.numberEncarg
      }, 0)

      // Filter by Otro
      const otros = this.datosCierre.filter(serv => serv)
      this.totalValueOtros = otros.reduce((accumulator, serv) => {
        return accumulator + serv.numberOtro
      }, 0)

      // Total Periodo
      this.sumaPeriodo = this.totalValuePiso + this.totalValuePiso2 +
        this.totalValueTerap + this.totalValueEncarg + this.totalValueOtros
    })
  }

  getCierre() {
    debugger
    this.cierreService.getAllCierre().subscribe((datoCierre: any) => {
      this.cierre = datoCierre

      if (datoCierre.length > 0) {
        this.cierres.fechaDesde = datoCierre[0]['fechaHasta']
        this.cierres.horaDesde = datoCierre[0]['horaHasta']
        this.existe = true
      } else this.existe = false
    })
  }

  getServicio() {
    this.servicioService.geyByCierreFalse().subscribe((datoServicio) => {
      this.servicio = datoServicio
    })
  }

  getEncargada() {
    this.loginService.getUsuarios().subscribe((datosEncargada: any) => {
      this.encargada = datosEncargada
    })
  }

  totalesUndefined() {
    if (this.totalValueServicio == undefined) this.totalValueServicio = 0
    if (this.totalValueEfectivo == undefined) this.totalValueEfectivo = 0
    if (this.totalValueBizum == undefined) this.totalValueBizum = 0
    if (this.totalValueTarjeta == undefined) this.totalValueTarjeta = 0
    if (this.totalValueTrans == undefined) this.totalValueTrans = 0
  }

  addLiquidacion() {
    this.cierres.encargada = ""
    this.calcularSumaDeServicios()
    this.liqCierre = false
    this.editCierre = false
    this.selected = false
    this.addCierre = true
  }

  notas(targetModal, modal) {
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

  sumaTotalServicios() {
    const totalServ = this.cierre.map(({ total }) => total).reduce((acc, value) => acc + value)
    this.totalValueServicio = totalServ

    const totalEfec = this.cierre.map(({ efectivo }) => efectivo).reduce((acc, value) => acc + value)
    this.totalValueEfectivo = totalEfec

    const totalBizum = this.cierre.map(({ bizum }) => bizum).reduce((acc, value) => acc + value)
    this.totalValueBizum = totalBizum

    const totalTarj = this.cierre.map(({ tarjeta }) => tarjeta).reduce((acc, value) => acc + value)
    this.totalValueTarjeta = totalTarj

    const totalTransf = this.cierre.map(({ transaccion }) => transaccion).reduce((acc, value) => acc + value)
    this.totalValueTrans = totalTransf
  }

  calcularSumaDeServicios() {

    let total = 0, respuesta: any
    this.servicioService.getByCierre(this.cierres.encargada).subscribe((resp) => {
      respuesta = resp

      if (respuesta.length > 0 && this.cierres.encargada != "") {

        this.selected = true

        const condicionEncargada = serv => {
          return (this.cierres.encargada) ? serv.encargada === this.cierres.encargada : true
        }

        // Este debe ser el Primero
        this.servicioService.getEncargadaFechaDesc(this.cierres.encargada).subscribe((fechaDesc) => {
          let año = "", mes = "", dia = ""
          año = fechaDesc[0]['fechaHoyInicio'].substring(2, 4)
          mes = fechaDesc[0]['fechaHoyInicio'].substring(8, 10)
          dia = fechaDesc[0]['fechaHoyInicio'].substring(5, 7)

          this.fechaAsc = `${dia}-${mes}-${año}`
          this.horaAsc = fechaDesc[0]['horaStart']
        })

        // este debe ser el ultimo
        this.servicioService.getEncargadaFechaAsc(this.cierres.encargada).subscribe((fechaAscedent) => {
          let año = "", mes = "", dia = ""
          año = fechaAscedent[0]['fechaHoyInicio'].substring(2, 4)
          mes = fechaAscedent[0]['fechaHoyInicio'].substring(8, 10)
          dia = fechaAscedent[0]['fechaHoyInicio'].substring(5, 7)

          this.fechaDesc = `${dia}-${mes}-${año}`
          this.horaDesc = fechaAscedent[0]['horaStart']
        })

        const mostrarFech = this.servicio.filter(serv => condicionEncargada(serv))
        if (mostrarFech.length != 0) {
          this.mostrarFecha = true
        } else {
          this.mostrarFecha = false
        }

        // Filter by totalCobros
        const total = this.servicio.filter(serv => condicionEncargada(serv))
        this.totalValueServicio = total.reduce((accumulator, serv) => {
          return accumulator + serv.totalServicio
        }, 0)

        // Filter by totalEfectivo
        const efect = this.servicio.filter(serv => condicionEncargada(serv))
        this.totalValueEfectivo = efect.reduce((accumulator, serv) => {
          return accumulator + serv.valueEfectivo
        }, 0)

        // Filter by totalBizum
        const bizu = this.servicio.filter(serv => condicionEncargada(serv))
        this.totalValueBizum = bizu.reduce((accumulator, serv) => {
          return accumulator + serv.valueBizum
        }, 0)

        // Filter by totalTarjeta
        const tarjeta = this.servicio.filter(serv => condicionEncargada(serv))
        this.totalValueTarjeta = tarjeta.reduce((accumulator, serv) => {
          return accumulator + serv.valueTarjeta
        }, 0)

        // Filter by totalTransferencia
        const transfe = this.servicio.filter(serv => condicionEncargada(serv))
        this.totalValueTrans = transfe.reduce((accumulator, serv) => {
          return accumulator + serv.valueTrans
        }, 0)

        this.ingresoPeriodo = this.totalValueEfectivo + this.totalValueBizum + this.totalValueTarjeta +
          this.totalValueTrans

        // Filter by Piso
        const piso1 = this.servicio.filter(serv => condicionEncargada(serv))
        this.totalValuePiso = piso1.reduce((accumulator, serv) => {
          return accumulator + serv.numberPiso1
        }, 0)

        // Filter by Piso 2
        const piso2 = this.servicio.filter(serv => condicionEncargada(serv))
        this.totalValuePiso2 = piso2.reduce((accumulator, serv) => {
          return accumulator + serv.numberPiso2
        }, 0)

        // Filter by Terapeuta
        const terap = this.servicio.filter(serv => condicionEncargada(serv))
        this.totalValueTerap = terap.reduce((accumulator, serv) => {
          return accumulator + serv.numberTerap
        }, 0)

        // Filter by Encargada
        const encarg = this.servicio.filter(serv => condicionEncargada(serv))
        this.totalValueEncarg = encarg.reduce((accumulator, serv) => {
          return accumulator + serv.numberEncarg
        }, 0)

        // Filter by Otro
        const otros = this.servicio.filter(serv => condicionEncargada(serv))
        this.totalValueOtros = otros.reduce((accumulator, serv) => {
          return accumulator + serv.numberOtro
        }, 0)

        // Total Periodo
        this.sumaPeriodo = this.totalValuePiso + this.totalValuePiso2 +
          this.totalValueTerap + this.totalValueEncarg + this.totalValueOtros

        // Filter by Total Efectivo
        const totalEfect = this.servicio.filter(serv => condicionEncargada(serv))
        this.cierres.efectivo = totalEfect.reduce((accumulator, serv) => {
          return accumulator + serv.valueEfectivo
        }, 0)

        // Filter by Total Bizum
        const totalBizum = this.servicio.filter(serv => condicionEncargada(serv))
        this.cierres.bizum = totalBizum.reduce((accumulator, serv) => {
          return accumulator + serv.valueBizum
        }, 0)

        // Filter by Total Tarjeta
        const totalTarjeta = this.servicio.filter(serv => condicionEncargada(serv))
        this.cierres.tarjeta = totalTarjeta.reduce((accumulator, serv) => {
          return accumulator + serv.valueTarjeta
        }, 0)

        // Filter by Total Transferencia
        const totalTransfer = this.servicio.filter(serv => condicionEncargada(serv))
        this.cierres.transaccion = totalTransfer.reduce((accumulator, serv) => {
          return accumulator + serv.valueTrans
        }, 0)

        // Caja - Encargada

        // Filter by Encargada Efectivo
        const totalEncargadaEfect = this.servicio.filter(serv => condicionEncargada(serv))
        this.cajaEncargEfect = totalEncargadaEfect.reduce((accumulator, serv) => {
          return accumulator + serv.valueEfectEncargada
        }, 0)

        // Filter by Encargada Bizu
        const totalEncargadaBizum = this.servicio.filter(serv => condicionEncargada(serv))
        this.cajaEncargBizum = totalEncargadaBizum.reduce((accumulator, serv) => {
          return accumulator + serv.valueBizuEncargada
        }, 0)

        // Filter by Encargada Tarjeta
        const totalEncargadaTarjeta = this.servicio.filter(serv => condicionEncargada(serv))
        this.cajaEncargTarj = totalEncargadaTarjeta.reduce((accumulator, serv) => {
          return accumulator + serv.valueTarjeEncargada
        }, 0)

        // Filter by Encargada Transferencia
        const totalEncargadaTransf = this.servicio.filter(serv => condicionEncargada(serv))
        this.cajaEncargTrans = totalEncargadaTransf.reduce((accumulator, serv) => {
          return accumulator + serv.valueTransEncargada
        }, 0)

        // Caja - Terapeuta

        // Filter by Terapeuta Efectivo
        const totalTerapeutaEfectivo = this.servicio.filter(serv => condicionEncargada(serv))
        this.cajaTerapEfect = totalTerapeutaEfectivo.reduce((accumulator, serv) => {
          return accumulator + serv.valueEfectTerapeuta
        }, 0)

        // Filter by Terapeuta Bizum
        const totalTerapeutaBizum = this.servicio.filter(serv => condicionEncargada(serv))
        this.cajaTerapBizum = totalTerapeutaBizum.reduce((accumulator, serv) => {
          return accumulator + serv.valueBizuTerapeuta
        }, 0)

        // Filter by Terapeuta Tarjeta
        const totalTerapeutaTarjeta = this.servicio.filter(serv => condicionEncargada(serv))
        this.cajaTerapTarj = totalTerapeutaTarjeta.reduce((accumulator, serv) => {
          return accumulator + serv.valueTarjeTerapeuta
        }, 0)

        // Filter by Terapeuta Transferencia
        const totalTerapeutaTransf = this.servicio.filter(serv => condicionEncargada(serv))
        this.cajaTerapTrans = totalTerapeutaTransf.reduce((accumulator, serv) => {
          return accumulator + serv.valueTransTerapeuta
        }, 0)

        this.sumaEfectivo = Number(this.cajaEncargEfect) + Number(this.cajaTerapEfect)
        this.cierres.total = Number(this.totalValueServicio) - this.sumaEfectivo

        this.sumaBizum = Number(this.cajaEncargBizum) + Number(this.cajaTerapBizum)
        this.totalCajaBizu = Number(this.totalValueServicio) - this.sumaBizum

        this.sumaTarjeta = Number(this.cajaEncargTarj) + Number(this.cajaTerapTarj)
        this.totalCajaTarjeta = Number(this.totalValueServicio) - this.sumaTarjeta

        this.sumaTransfe = Number(this.cajaEncargTrans) + Number(this.cajaTerapTrans)
        this.totalCajaTransfer = Number(this.totalValueServicio) - this.sumaTransfe
      }
    })
  }

  guardar() {

    this.cierres.currentDate = this.currentDate.toString()

    if (this.cierres.encargada != "") {
      if (this.existe === true) {

        this.cierreService.getEncargadaByCierre(this.cierres.encargada).subscribe((datos: any) => {
          this.cierres.idCierre = datos[0]['id']
          for (let index = 0; index < datos.length; index++) {
            this.cierres.tratamiento = datos.length
            this.servicioService.updateCierre(this.cierres.idCierre, datos[index]['id'], this.cierres).subscribe((datos) => {
            })
          }

          this.fechaOrdenada()

          this.cierreService.registerCierre(this.cierres).subscribe((datos) => { })

          setTimeout(() => {
            this.getCierre()
            this.liqCierre = true
            this.addCierre = false
            this.editCierre = false
            this.selected = false
            this.mostrarFecha = false
            this.cierres.encargada = ""
            Swal.fire({
              position: 'top-end', icon: 'success', title: 'Cierre Correctamente!', showConfirmButton: false, timer: 2500
            })
          }, 1000);
        })
      }

      if (this.existe === false) {

        this.cierreService.getEncargadaByCierre(this.cierres.encargada).subscribe((datosForFecha) => {
          this.cierres.fechaDesde = datosForFecha[0]['fechaHoyInicio']
          this.cierres.horaDesde = datosForFecha[0]['horaStart']

          let convertMes = '', convertDia = '', convertAno = ''

          convertDia = this.cierres.fechaDesde.toString().substring(8, 11)
          convertMes = this.cierres.fechaDesde.toString().substring(5, 7)
          convertAno = this.cierres.fechaDesde.toString().substring(2, 4)

          this.cierres.fechaDesde = `${convertDia}-${convertMes}-${convertAno}`

          this.cierreService.getServicioByEncargadaAndIdUnico(this.cierres.encargada).subscribe((datos: any) => {
            this.cierres.idCierre = datos[0]['id']
            for (let index = 0; index < datos.length; index++) {
              this.cierres.tratamiento = datos.length
              this.servicioService.updateCierre(this.cierres.idCierre, datos[index]['id'], this.cierres).subscribe((datos) => {
              })
            }

            this.fechaOrdenada()

            debugger
            this.cierreService.registerCierre(this.cierres).subscribe((datos) => { })

            setTimeout(() => {
              this.getCierre()
              this.liqCierre = true
              this.addCierre = false
              this.editCierre = false
              this.selected = false
              this.mostrarFecha = false
              this.cierres.encargada = ""
              Swal.fire({
                position: 'top-end', icon: 'success', title: 'Cierre Correctamente!', showConfirmButton: false, timer: 2500,
              })
            }, 1000);
          })
        })
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'No hay ninguna encargada seleccionada',
          showConfirmButton: false,
          timer: 2500,
        })
      }
    }
  }

  cancelar() {
    this.cierres.encargada = ""
    this.editCierre = false
    this.addCierre = false
    this.mostrarFecha = false
    this.selected = false
    this.liqCierre = true
  }

  filtro() {
    this.filtredBusqueda = this.formTemplate.value.busqueda.replace(/(^\w{1})|(\s+\w{1})/g, letra => letra.toUpperCase())

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

    const condicionEncargada = serv => {
      return (this.cierres.encargada) ? serv.encargada === this.cierres.encargada : true
    }

    const condicionEntreFechas = serv => {
      if (this.fechaInicio === undefined && this.fechaFinal === undefined) return true
      if (this.fechaInicio === undefined && serv.fecha <= this.fechaFinal) return true
      if (this.fechaFinal === undefined && serv.fecha === this.fechaInicio) return ɵbypassSanitizationTrustResourceUrl
      if (serv.fecha >= this.fechaInicio && serv.fecha <= this.fechaFinal) return true

      return false
    }

    const condicionBuscar = serv => {
      if (!this.filtredBusqueda) return true
      const criterio = this.filtredBusqueda.toLowerCase()
      return (serv.encargada.toLowerCase().match(criterio)
        || serv.fechaDesde.toLowerCase().match(criterio)
        || serv.fechaHasta.toLowerCase().match(criterio)) ? true : false
    }

    if (Array.isArray(this.cierre)) {
      const total = this.cierre.filter(cierr => condicionEncargada(cierr)
        && condicionBuscar(cierr) && condicionEntreFechas(cierr))
      this.totalValueServicio = total.reduce((accumulator, cierr) => {
        return accumulator + cierr.total
      }, 0)

      const efectivo = this.cierre.filter(cierr => condicionEncargada(cierr)
        && condicionBuscar(cierr) && condicionEntreFechas(cierr))
      this.totalValueEfectivo = efectivo.reduce((accumulator, cierr) => {
        return accumulator + cierr.efectivo
      }, 0)

      const bizum = this.cierre.filter(cierr => condicionEncargada(cierr)
        && condicionBuscar(cierr) && condicionEntreFechas(cierr))
      this.totalValueBizum = bizum.reduce((accumulator, cierr) => {
        return accumulator + cierr.bizum
      }, 0)

      const tarjeta = this.cierre.filter(cierr => condicionEncargada(cierr)
        && condicionBuscar(cierr) && condicionEntreFechas(cierr))
      this.totalValueTarjeta = tarjeta.reduce((accumulator, cierr) => {
        return accumulator + cierr.tarjeta
      }, 0)

      const transaccion = this.cierre.filter(cierr => condicionEncargada(cierr)
        && condicionBuscar(cierr) && condicionEntreFechas(cierr))
      this.totalValueTrans = transaccion.reduce((accumulator, cierr) => {
        return accumulator + cierr.transaccion
      }, 0)
    }
  }
}