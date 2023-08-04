import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormControl, FormGroup } from '@angular/forms'
import Swal from 'sweetalert2'
import { Router } from '@angular/router'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'

// Servicios
import { LoginService } from 'src/app/core/services/login'
import { ServicioService } from 'src/app/core/services/servicio'
import { CierreService } from 'src/app/core/services/cierre'

@Component({
  selector: 'app-cierre',
  templateUrl: './cierre.component.html',
  styleUrls: ['./cierre.component.css']
})
export class CierreComponent implements OnInit {

  liqCierre: boolean
  addCierre: boolean
  tableCierre: boolean
  filtredBusqueda: string
  servicio: any
  page!: number
  cierreTrue = []
  cierre: any

  // Encargada
  encargada: any[] = []
  selectedEncargada: string
  encargadaSelect: string

  // Fecha
  fechaInicio: string
  fechaFinal: string

  // Conversión
  fechaAsc: string
  fechaDesc: string
  horaAsc: string
  horaDesc: string
  fechaAnterior: string
  fechaHoy: string
  horaAnterior: string
  horaHoy = new Date().toTimeString().substring(0, 5)
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

  totalCajaEfectivo: number
  totalCajaBizu: number
  totalCajaTarjeta: number
  totalCajaTransfer: number
  sumaEfectivo = 0
  sumaBizum = 0
  sumaTarjeta = 0
  sumaTransfe = 0

  // Periodo
  sumaPeriodo: number

  // Pagos Periodo
  totalesEfectivo: number
  totalesBizum: number
  totalesTarjeta: number
  totalesTransferencia: number

  tablas: boolean
  currentDate = new Date().getTime()
  existe: boolean

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

    this.tablas = false
    this.tableCierre = true
    this.liqCierre = true
    this.addCierre = false

    this.getCierre()
    this.getServicio()
    this.getEncargada()
    this.getCierreTrue()
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
      this.fechaHoy = `${dia}-${convertMes}-${convertAno}`
    } else {
      this.fechaHoy = `${dia}-${mes}-${convertAno}`
    }

    if (dia > 0 && dia < 10) {
      convertDia = '0' + dia
      this.fechaHoy = `${convertDia}-${convertMes}-${convertAno}`
    } else {
      this.fechaHoy = `${dia}-${convertMes}-${convertAno}`
    }
  }

  editamos(id: string) {
    this.router.navigate([`menu/${id}/nuevo-servicio/${id}`,
    ])
  }

  getCierre() {
    this.cierreService.getAllCierre().subscribe((datoCierre) => {
      if (datoCierre.length > 0) {
        this.cierre = datoCierre
        this.sumaTotalServicios()
        this.fechaAnterior = datoCierre[0]['fechaHasta']
        this.horaAnterior = datoCierre[0]['horaHasta']
        this.existe = true
      }
      else this.existe = false
    })
  }

  getCierreTrue() {
    this.servicioService.geyByCierreTrue().then((datoCierreTrue) => {
      if (datoCierreTrue.length != 0) {
        // Esta linea de codigo hace que no se repita las terapeutas
        let personasMap = datoCierreTrue.map(item => {
          return [item['idUnico'], item]
        })
        var personasMapArr = new Map(personasMap)
        this.cierreTrue = [...personasMapArr.values()]

        if (datoCierreTrue != 0) {
          this.servicioService.geyByCurrentDesc().then((datoCierreTrue) => {
            this.fechaDesde = datoCierreTrue[0]['fecha']
          })
        }
      }
    })
  }

  getServicio() {
    this.servicioService.geyByCierreFalse().then((datoServicio) => {
      this.servicio = datoServicio
    })
  }

  getEncargada() {
    this.loginService.getUsuarios().subscribe((datosEncargada) => {
      this.encargada = datosEncargada
    })
  }

  dateStart(event: any) {
    this.fechaInicio = event.target.value
  }

  dateEnd(event: any) {
    this.fechaFinal = event.target.value
  }

  busqueda(event: any) {
    this.filtredBusqueda = event.replace(/(^\w{1})|(\s+\w{1})/g, letra => letra)
  }

  totalesUndefined() {
    if (this.totalValueServicio == undefined) this.totalValueServicio = 0
    if (this.totalValueEfectivo == undefined) this.totalValueEfectivo = 0
    if (this.totalValueBizum == undefined) this.totalValueBizum = 0
    if (this.totalValueTarjeta == undefined) this.totalValueTarjeta = 0
    if (this.totalValueTrans == undefined) this.totalValueTrans = 0
  }

  addLiquidacion() {
    this.getServicio()
    this.calcularSumaDeServicios()
    this.liqCierre = false
    this.tableCierre = false
    this.addCierre = true


    if (this.selectedEncargada == undefined) this.tablas = false
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

  notas(targetModal, modal) {
    var notaMensaje = []
    this.servicioService.getById(targetModal).then((datoServicio) => {
      notaMensaje = datoServicio[0]

      if (notaMensaje['nota'] != '')
        this.modalService.open(modal, {
          centered: true,
          backdrop: 'static',
        })
    })
  }

  calcularSumaDeServicios() {
    if (this.selectedEncargada != undefined) {
      this.tablas = true

      const condicionEncargada = serv => {
        return (this.selectedEncargada) ? serv.encargada === this.selectedEncargada : true
      }

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

      // Este debe ser el Primero
      this.servicioService.getEncargadaFechaAsc(this.selectedEncargada).then((fechaDesc) => {
        this.fechaAsc = fechaDesc[0]['fechaHoyInicio']
        this.horaAsc = fechaDesc[0]['horaStart']
      })

      // este debe ser el ultimo
      this.servicioService.getEncargadaFechaDesc(this.selectedEncargada).then((fechaAscedent) => {
        this.fechaDesc = fechaAscedent[0]['fechaHoyInicio']
        this.horaDesc = fechaAscedent[0]['horaStart']
      })

      // Filter by Total Efectivo
      const totalEfect = this.servicio.filter(serv => condicionEncargada(serv))
      this.totalesEfectivo = totalEfect.reduce((accumulator, serv) => {
        return accumulator + serv.valueEfectivo
      }, 0)

      // Filter by Total Bizum
      const totalBizum = this.servicio.filter(serv => condicionEncargada(serv))
      this.totalesBizum = totalBizum.reduce((accumulator, serv) => {
        return accumulator + serv.valueBizum
      }, 0)

      // Filter by Total Tarjeta
      const totalTarjeta = this.servicio.filter(serv => condicionEncargada(serv))
      this.totalesTarjeta = totalTarjeta.reduce((accumulator, serv) => {
        return accumulator + serv.valueTarjeta
      }, 0)

      // Filter by Total Transferencia
      const totalTransfer = this.servicio.filter(serv => condicionEncargada(serv))
      this.totalesTransferencia = totalTransfer.reduce((accumulator, serv) => {
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
      this.totalCajaEfectivo = Number(this.totalValueServicio) - this.sumaEfectivo

      this.sumaBizum = Number(this.cajaEncargBizum) + Number(this.cajaTerapBizum)
      this.totalCajaBizu = Number(this.totalValueServicio) - this.sumaBizum

      this.sumaTarjeta = Number(this.cajaEncargTarj) + Number(this.cajaTerapTarj)
      this.totalCajaTarjeta = Number(this.totalValueServicio) - this.sumaTarjeta

      this.sumaTransfe = Number(this.cajaEncargTrans) + Number(this.cajaTerapTrans)
      this.totalCajaTransfer = Number(this.totalValueServicio) - this.sumaTransfe
    }

    if (this.selectedEncargada == undefined) {
      this.tablas = false
    }
  }

  guardar() {
    let conteo = 0

    if (this.selectedEncargada) {
      if (this.existe === true) {

        this.cierreService.getServicioByEncargadaAndIdUnico(this.selectedEncargada).then((datos) => {
          for (let index = 0; index < datos.length; index++) {
            conteo = datos.length
            this.servicioService.updateCierre(datos[index]['idDocument'], datos[index]['id'])
          }

          this.fechaOrdenada()

          this.cierreService.registerCierre(this.selectedEncargada, this.fechaAnterior, this.fechaHoy, this.horaAnterior,
            this.horaHoy, conteo, this.totalCajaEfectivo, this.totalesEfectivo, this.totalesBizum,
            this.totalesTarjeta, this.totalesTransferencia, this.currentDate).then((datos) => {
              this.getCierre()
              this.tableCierre = true
              this.liqCierre = true
              this.addCierre = false
              this.selectedEncargada = undefined
              Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Liquidado Correctamente!',
                showConfirmButton: false,
                timer: 2500,
              })
            })
        })
      }

      if (this.existe === false) {

        this.cierreService.getServicioByEncargadaAndIdUnico(this.selectedEncargada).then((datosForFecha) => {
          this.fechaAnterior = datosForFecha[0]['fechaHoyInicio']
          this.horaAnterior = datosForFecha[0]['horaStart']

          let convertMes = '', convertDia = '', convertAno = ''

          convertDia = this.fechaAnterior.toString().substring(8, 11)
          convertMes = this.fechaAnterior.toString().substring(5, 7)
          convertAno = this.fechaAnterior.toString().substring(2, 4)

          this.fechaAnterior = `${convertDia}-${convertMes}-${convertAno}`

          this.cierreService.getServicioByEncargadaAndIdUnico(this.selectedEncargada).then((datos) => {
            for (let index = 0; index < datos.length; index++) {
              conteo = datos.length
              this.servicioService.updateCierre(datos[index]['idDocument'], datos[index]['id'])
            }

            this.fechaOrdenada()

            this.cierreService.registerCierre(this.selectedEncargada, this.fechaAnterior, this.fechaHoy, this.horaAnterior,
              this.horaHoy, conteo, this.totalCajaEfectivo, this.totalesEfectivo, this.totalesBizum,
              this.totalesTarjeta, this.totalesTransferencia, this.currentDate).then((datos) => {
                this.getCierre()
                this.tableCierre = true
                this.addCierre = false
                this.liqCierre = true
                this.selectedEncargada = undefined
                Swal.fire({
                  position: 'top-end',
                  icon: 'success',
                  title: 'Liquidado Correctamente!',
                  showConfirmButton: false,
                  timer: 2500,
                })
              })
            // })
          })
        })
      }
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