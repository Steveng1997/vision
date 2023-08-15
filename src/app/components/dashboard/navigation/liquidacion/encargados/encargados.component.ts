import { Component, OnInit, ɵbypassSanitizationTrustResourceUrl } from '@angular/core'
import { FormBuilder, FormControl, FormGroup } from '@angular/forms'
import Swal from 'sweetalert2'
import { Router } from '@angular/router'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'

// Servicios
import { LoginService } from 'src/app/core/services/login'
import { ServicioService } from 'src/app/core/services/servicio'
import { LiquidacioneEncargService } from 'src/app/core/services/liquidacionesEncarg'

// Model
import { LiquidacionEncargada } from 'src/app/core/models/liquidacionEncarg'

@Component({
  selector: 'app-encargados',
  templateUrl: './encargados.component.html',
  styleUrls: ['./encargados.component.css']
})
export class EncargadosComponent implements OnInit {

  liqEncarg: boolean
  addEncarg: boolean
  editEncarg: boolean
  filtredBusqueda: string
  filtredBusquedaNumber: number
  Liquidada: any
  servicioNoLiquidadaEncargada: any
  liquidacionesEncargada: any
  datosLiquidadoEncargada: any
  page!: number
  numberFiltro: number

  // Encargada
  encargada: any[] = []

  encargadaName: any[] = []

  // Fecha
  fechaInicio: string
  fechaFinal: string
  idUnico: string
  selected: boolean

  // Conversión
  fechaAsc: string
  horaAsc: string
  fechaDesc: string
  horaDesc: string
  fechaConvertion = new Date().toISOString().substring(0, 10)
  mostrarFecha: boolean

  // Servicios
  totalServicio: number
  totalValorPropina: number
  totalValorEncargada: number
  TotalValorBebida: number
  TotalValorTabaco: number
  totalValorVitaminas: number
  totalValorOtroServ: number
  totalValorTerapeuta: number

  // Comision
  comisionServicio: number
  comisionPropina: number
  comisionBebida: number
  comisionTabaco: number
  comisionVitamina: number
  comisionOtros: number
  sumaComision: number

  recibidoTerap: any

  horaHoy = new Date().toTimeString().substring(0, 5)

  currentDate = new Date().getTime()
  existe: boolean

  liqEncargada: LiquidacionEncargada = {
    currentDate: "",
    desdeFechaLiquidado: "",
    desdeHoraLiquidado: "",
    encargada: "",
    hastaFechaLiquidado: "",
    hastaHoraLiquidado: new Date().toTimeString().substring(0, 5),
    id: 0,
    idEncargada: 0,
    importe: 0,
    tratamiento: 0
  }

  constructor(
    public router: Router,
    public fb: FormBuilder,
    private modalService: NgbModal,
    public servicioService: ServicioService,
    public loginService: LoginService,
    public liqudacionEncargServ: LiquidacioneEncargService,
  ) { }

  formTemplate = new FormGroup({
    fechaInicio: new FormControl(''),
    FechaFin: new FormControl(''),
    encargada: new FormControl(''),
    busqueda: new FormControl(''),
  })

  ngOnInit(): void {
    document.getElementById('idTitulo').style.display = 'block'
    document.getElementById('idTitulo').innerHTML = 'LIQUIDACIÓNES ENCARGADAS'

    this.liqEncargada.encargada = ""

    this.liqEncarg = true
    this.addEncarg = false
    this.selected = false
    this.editEncarg = false
    this.getLiquidaciones()
    this.getServicio()
    this.getServicioFalceLiquid()
    this.getEncargada()
    this.tableComision()
  }

  tableComision() {
    if (this.encargadaName['servicio'] == "") this.encargadaName['servicio'] = 0
    if (this.encargadaName['propina'] == "") this.encargadaName['propina'] = 0
    if (this.encargadaName['bebida'] == "") this.encargadaName['bebida'] = 0
    if (this.encargadaName['tabaco'] == "") this.encargadaName['tabaco'] = 0
    if (this.encargadaName['vitamina'] == "") this.encargadaName['vitamina'] = 0
    if (this.encargadaName['otros'] == "") this.encargadaName['otros'] = 0
    if (this.comisionServicio == undefined) this.comisionServicio = 0
    if (this.comisionPropina == undefined) this.comisionPropina = 0
    if (this.comisionBebida == undefined) this.comisionBebida = 0
    if (this.comisionTabaco == undefined) this.comisionTabaco = 0
    if (this.comisionVitamina == undefined) this.comisionVitamina = 0
    if (this.comisionOtros == undefined) this.comisionOtros = 0
    if (this.sumaComision == undefined) this.sumaComision = 0
    if (this.liqEncargada.importe == undefined) this.liqEncargada.importe = 0
  }

  getLiquidaciones() {
    this.liqudacionEncargServ.getLiquidacionesEncargada().subscribe((datoEncargLiq: any) => {
      this.liquidacionesEncargada = datoEncargLiq

      if (datoEncargLiq.length > 0) {
        this.liqEncargada.desdeFechaLiquidado = datoEncargLiq[0]['hastaFechaLiquidado']
        this.liqEncargada.desdeHoraLiquidado = datoEncargLiq[0]['hastaHoraLiquidado']
        this.existe = true
      } else this.existe = false
    })
  }

  getServicio() {
    this.servicioService.getByLiquidTerapTrue().subscribe((datoServicio) => {
      this.Liquidada = datoServicio
    })
  }

  getServicioFalceLiquid() {
    this.servicioService.getByLiquidEncargadaFalse().subscribe((datoServicio) => {
      this.servicioNoLiquidadaEncargada = datoServicio
    })
  }

  getEncargada() {
    this.loginService.getUsuarios().subscribe((datosEncargada: any) => {
      this.encargada = datosEncargada
    })
  }

  dateStart(event: any) {
    this.fechaInicio = event.target.value
  }

  dateEnd(event: any) {
    this.fechaFinal = event.target.value
  }

  busqueda(event: any, eventNumber: number) {
    this.filtredBusquedaNumber = Number(eventNumber)
    this.filtredBusqueda = event.replace(/(^\w{1})|(\s+\w{1})/g, letra => letra.toUpperCase())
  }

  addLiquidacion() {
    this.liqEncargada.encargada = ""
    this.calcularSumaDeServicios()
    this.selected = false
    this.liqEncarg = false
    this.editEncarg = false
    this.addEncarg = true
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
      this.liqEncargada.hastaFechaLiquidado = `${dia}-${convertMes}-${convertAno}`
    } else {
      this.liqEncargada.hastaFechaLiquidado = `${dia}-${mes}-${convertAno}`
    }

    if (dia > 0 && dia < 10) {
      convertDia = '0' + dia
      this.liqEncargada.hastaFechaLiquidado = `${convertDia}-${convertMes}-${convertAno}`
    } else {
      this.liqEncargada.hastaFechaLiquidado = `${dia}-${convertMes}-${convertAno}`
    }
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

  calcularSumaDeServicios() {

    let respuesta: any

    if (this.liqEncargada.encargada != "") {

      debugger

      this.servicioService.getByEncargada(this.liqEncargada.encargada).subscribe((resp) => {
        respuesta = resp
        if (respuesta.length > 0) {

          this.selected = true

          const condicionEncargada = serv => {
            return (this.liqEncargada.encargada) ? serv.encargada === this.liqEncargada.encargada : true
          }

          this.servicioService.getEncargFechaDesc(this.liqEncargada.encargada).subscribe((fechaDesc: any) => {
            let año = "", mes = "", dia = ""
            año = fechaDesc[0]['fechaHoyInicio'].substring(2, 4)
            mes = fechaDesc[0]['fechaHoyInicio'].substring(8, 10)
            dia = fechaDesc[0]['fechaHoyInicio'].substring(5, 7)

            this.fechaAsc = `${dia}-${mes}-${año}`
            this.horaAsc = fechaDesc[0]['horaStart']
          })

          this.servicioService.getEncargFechaAsc(this.liqEncargada.encargada).subscribe((fechaAsc) => {
            let año = "", mes = "", dia = ""
            año = fechaAsc[0]['fechaHoyInicio'].substring(2, 4)
            mes = fechaAsc[0]['fechaHoyInicio'].substring(8, 10)
            dia = fechaAsc[0]['fechaHoyInicio'].substring(5, 7)

            this.fechaDesc = `${dia}-${mes}-${año}`
            this.horaDesc = fechaAsc[0]['horaStart']
          })

          const mostrarFech = this.servicioNoLiquidadaEncargada.filter(serv => condicionEncargada(serv))
          if (mostrarFech.length != 0) {
            this.mostrarFecha = true
          } else {
            this.mostrarFecha = false
          }

          // Filter by servicio
          const servicios = this.servicioNoLiquidadaEncargada.filter(serv => condicionEncargada(serv))
          this.totalServicio = servicios.reduce((accumulator, serv) => {
            return accumulator + serv.servicio
          }, 0)

          // Filter by Propina
          const propinas = this.servicioNoLiquidadaEncargada.filter(serv => condicionEncargada(serv))
          this.totalValorPropina = propinas.reduce((accumulator, serv) => {
            return accumulator + serv.propina
          }, 0)

          // Filter by Pago
          const encargada = this.servicioNoLiquidadaEncargada.filter(serv => condicionEncargada(serv))
          this.totalValorEncargada = encargada.reduce((accumulator, serv) => {
            return accumulator + serv.numberEncarg
          }, 0)

          const terapeuta = this.servicioNoLiquidadaEncargada.filter(serv => condicionEncargada(serv))
          this.totalValorTerapeuta = terapeuta.reduce((accumulator, serv) => {
            return accumulator + serv.numberTerap
          }, 0)

          // Filter by Bebida
          const bebida = this.servicioNoLiquidadaEncargada.filter(serv => condicionEncargada(serv))
          this.TotalValorBebida = bebida.reduce((accumulator, serv) => {
            return accumulator + serv.bebidas
          }, 0)

          // Filter by Tabaco
          const tabac = this.servicioNoLiquidadaEncargada.filter(serv => condicionEncargada(serv))
          this.TotalValorTabaco = tabac.reduce((accumulator, serv) => {
            return accumulator + serv.tabaco
          }, 0)

          // Filter by Vitamina
          const vitamina = this.servicioNoLiquidadaEncargada.filter(serv => condicionEncargada(serv))
          this.totalValorVitaminas = vitamina.reduce((accumulator, serv) => {
            return accumulator + serv.vitaminas
          }, 0)

          // Filter by Vitamina
          const otroServicio = this.servicioNoLiquidadaEncargada.filter(serv => condicionEncargada(serv))
          this.totalValorOtroServ = otroServicio.reduce((accumulator, serv) => {
            return accumulator + serv.otros
          }, 0)

          let comisiServicio = 0, comiPropina = 0, comiBebida = 0, comiTabaco = 0, comiVitamina = 0, comiOtros = 0, sumComision = 0
          this.liqEncargada.importe = 0

          this.loginService.getEncargada(this.liqEncargada.encargada).subscribe((datosNameTerapeuta) => {
            this.encargadaName = datosNameTerapeuta[0]
            this.tableComision()

            // Comision
            comisiServicio = this.totalServicio / 100 * datosNameTerapeuta[0]['servicio']
            comiPropina = this.totalValorPropina / 100 * datosNameTerapeuta[0]['propina']
            comiBebida = this.TotalValorBebida / 100 * datosNameTerapeuta[0]['bebida']
            comiTabaco = this.TotalValorTabaco / 100 * datosNameTerapeuta[0]['tabaco']
            comiVitamina = this.totalValorVitaminas / 100 * datosNameTerapeuta[0]['vitamina']
            comiOtros = this.totalValorOtroServ / 100 * datosNameTerapeuta[0]['otros']

            // Conversion decimal
            this.comisionServicio = Number(comisiServicio.toFixed(1))
            this.comisionPropina = Number(comiPropina.toFixed(1))
            this.comisionBebida = Number(comiBebida.toFixed(1))
            this.comisionTabaco = Number(comiTabaco.toFixed(1))
            this.comisionVitamina = Number(comiVitamina.toFixed(1))
            this.comisionOtros = Number(comiOtros.toFixed(1))

            sumComision = Number(this.comisionServicio) + Number(this.comisionPropina) +
              Number(this.comisionBebida) + Number(this.comisionTabaco) +
              Number(this.comisionVitamina) + Number(this.comisionOtros)

            // return this.sumaComision = sumComision.toFixed(0)
            if (this.sumaComision != 0 || this.sumaComision != undefined) {
              this.sumaComision = Number(sumComision.toFixed(1))
            }

            this.recibidoTerap = this.totalValorEncargada + this.totalValorTerapeuta

            return this.liqEncargada.importe = this.sumaComision - Number(this.recibidoTerap)
          })
        }
      })
    } else {
      this.selected = false
      this.mostrarFecha = false
    }
  }

  editamos(id: string) {
    this.router.navigate([`menu/${id}/nuevo-servicio/${id}`,])
  }

  editamosServicio(id: number) {
    this.liqEncarg = false
    this.addEncarg = false
    this.editEncarg = true

    this.liqudacionEncargServ.getIdEncarg(id).subscribe((datos) => {
      this.horaAsc = datos[0]['hastaHoraLiquidado']
      this.horaDesc = datos[0]['desdeHoraLiquidado']
    })

    this.servicioService.getByIdEncarg(id).subscribe((datosEncargada) => {
      this.datosLiquidadoEncargada = datosEncargada;

      this.servicioService.getEncargadaFechaAscByLiqTrue(datosEncargada[0]['encargada']).subscribe((fechaAsce) => {
        this.fechaAsc = fechaAsce[0]['fechaHoyInicio']
      })

      this.servicioService.getEncargadaFechaDescByLiqTrue(datosEncargada[0]['encargada']).subscribe((fechaDesce) => {
        this.fechaDesc = fechaDesce[0]['fechaHoyInicio']
      })

      // Filter by servicio
      const servicios = this.datosLiquidadoEncargada.filter(serv => serv)
      this.totalServicio = servicios.reduce((accumulator, serv) => {
        return accumulator + serv.servicio
      }, 0)

      // Filter by Propina
      const propinas = this.datosLiquidadoEncargada.filter(serv => serv)
      this.totalValorPropina = propinas.reduce((accumulator, serv) => {
        return accumulator + serv.propina
      }, 0)

      // Filter by Pago
      const terapeuta = this.datosLiquidadoEncargada.filter(serv => serv)
      this.totalValorEncargada = terapeuta.reduce((accumulator, serv) => {
        return accumulator + serv.numberTerap
      }, 0)

      // Filter by Bebida
      const bebida = this.datosLiquidadoEncargada.filter(serv => serv)
      this.TotalValorBebida = bebida.reduce((accumulator, serv) => {
        return accumulator + serv.bebidas
      }, 0)

      // Filter by Tabaco
      const tabac = this.datosLiquidadoEncargada.filter(serv => serv)
      this.TotalValorTabaco = tabac.reduce((accumulator, serv) => {
        return accumulator + serv.tabaco
      }, 0)

      // Filter by Vitamina
      const vitamina = this.datosLiquidadoEncargada.filter(serv => serv)
      this.totalValorVitaminas = vitamina.reduce((accumulator, serv) => {
        return accumulator + serv.vitaminas
      }, 0)

      // Filter by Vitamina
      const otroServicio = this.datosLiquidadoEncargada.filter(serv => serv)
      this.totalValorOtroServ = otroServicio.reduce((accumulator, serv) => {
        return accumulator + serv.otros
      }, 0)

      let comisiServicio = 0, comiPropina = 0, comiBebida = 0, comiTabaco = 0, comiVitamina = 0, comiOtros = 0, sumComision = 0
      this.liqEncargada.importe = 0

      this.loginService.getEncargada(this.datosLiquidadoEncargada[0]['encargada']).subscribe((datosNameTerapeuta) => {
        this.encargadaName = datosNameTerapeuta[0]
        this.tableComision()

        // Comision
        comisiServicio = this.totalServicio / 100 * datosNameTerapeuta[0]['servicio']
        comiPropina = this.totalValorPropina / 100 * datosNameTerapeuta[0]['propina']
        comiBebida = this.TotalValorBebida / 100 * datosNameTerapeuta[0]['bebida']
        comiTabaco = this.TotalValorTabaco / 100 * datosNameTerapeuta[0]['tabaco']
        comiVitamina = this.totalValorVitaminas / 100 * datosNameTerapeuta[0]['vitamina']
        comiOtros = this.totalValorOtroServ / 100 * datosNameTerapeuta[0]['otros']

        // Conversion decimal
        this.comisionServicio = Number(comisiServicio.toFixed(1))
        this.comisionPropina = Number(comiPropina.toFixed(1))
        this.comisionBebida = Number(comiBebida.toFixed(1))
        this.comisionTabaco = Number(comiTabaco.toFixed(1))
        this.comisionVitamina = Number(comiVitamina.toFixed(1))
        this.comisionOtros = Number(comiOtros.toFixed(1))

        sumComision = Number(this.comisionServicio) + Number(this.comisionPropina) +
          Number(this.comisionBebida) + Number(this.comisionTabaco) +
          Number(this.comisionVitamina) + Number(this.comisionOtros)

        // return this.sumaComision = sumComision.toFixed(0)
        if (this.sumaComision != 0 || this.sumaComision != undefined) {
          this.sumaComision = Number(sumComision.toFixed(1))
        }

        // Recibido

        for (let index = 0; index < this.datosLiquidadoEncargada.length; index++) {
          const numbTerap = this.datosLiquidadoEncargada.filter(serv => serv)
          this.recibidoTerap = numbTerap.reduce((accumulator, serv) => {
            return accumulator + serv.numberTerap
          }, 0)
        }
        return this.liqEncargada.importe = this.sumaComision - Number(this.recibidoTerap)
      })
    })
  }

  editarEncargada() {
    this.liqudacionEncargServ.getIdEncarg(this.datosLiquidadoEncargada[0]['idEncargada']).subscribe((datos: any) => {
      for (let index = 0; index < datos.length; index++) {
        this.liqudacionEncargServ.updateById(datos[index]['idEncargada'], this.liqEncargada).subscribe((datos) => {
          this.liqEncarg = true
          this.addEncarg = false
          this.editEncarg = false
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Guardado Correctamente!',
            showConfirmButton: false,
            timer: 2500,
          })
        })
      }
    })
  }

  filtro() {
    this.filtredBusqueda = this.formTemplate.value.busqueda.replace(/(^\w{1})|(\s+\w{1})/g, letra => letra.toUpperCase())
    this.filtredBusquedaNumber = Number(this.formTemplate.value.busqueda)

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

  cancelar() {
    this.getLiquidaciones()
    this.liqEncarg = true
    this.addEncarg = false
    this.editEncarg = false
    this.selected = false
    this.mostrarFecha = false
    this.liqEncargada.encargada = ""
  }

  guardar() {
    // let conteo = 0, idEncargada = '';

    this.liqEncargada.currentDate = this.currentDate.toString()

    if (this.liqEncargada.encargada) {
      if (this.existe === true) {

        this.servicioService.getEncargadaAndLiquidacion(this.liqEncargada.encargada).subscribe((datos: any) => {
          this.liqEncargada.idEncargada = datos[0]['id']
          for (let index = 0; index < datos.length; index++) {
            this.liqEncargada.tratamiento = datos.length
            this.servicioService.updateLiquidacionEncarg(datos[index]['id'], this.liqEncargada).subscribe((datos) => {
            })
          }

          this.fechaOrdenada()

          this.liqudacionEncargServ.registerLiquidacionesEncargada(this.liqEncargada).subscribe((datos) => { })

          setTimeout(() => {
            this.getLiquidaciones()
            this.liqEncarg = true
            this.addEncarg = false
            this.editEncarg = false
            this.selected = false
            this.mostrarFecha = false
            this.liqEncargada.encargada = ""
            Swal.fire({
              position: 'top-end',
              icon: 'success',
              title: 'Liquidado Correctamente!',
              showConfirmButton: false,
              timer: 2500,
            })
          }, 1000);
        })
      }

      if (this.existe === false) {

        this.servicioService.getEncargadaAndLiquidacion(this.liqEncargada.encargada).subscribe((datosForFecha) => {
          this.liqEncargada.desdeFechaLiquidado = datosForFecha[0]['fechaHoyInicio']
          this.liqEncargada.desdeHoraLiquidado = datosForFecha[0]['horaStart']

          let convertMes = '', convertDia = '', convertAno = ''

          convertDia = this.liqEncargada.desdeFechaLiquidado.toString().substring(8, 11)
          convertMes = this.liqEncargada.desdeFechaLiquidado.toString().substring(5, 7)
          convertAno = this.liqEncargada.desdeFechaLiquidado.toString().substring(2, 4)

          this.liqEncargada.desdeFechaLiquidado = `${convertDia}-${convertMes}-${convertAno}`

          this.servicioService.getEncargadaAndLiquidacion(this.liqEncargada.encargada).subscribe((datos: any) => {
            this.liqEncargada.idEncargada = datos[0]['id']
            for (let index = 0; index < datos.length; index++) {
              this.liqEncargada.tratamiento = datos.length
              this.servicioService.updateLiquidacionEncarg(datos[index]['id'], this.liqEncargada).subscribe((datos) => {
              })
            }

            this.fechaOrdenada()

            this.liqudacionEncargServ.registerLiquidacionesEncargada(this.liqEncargada).subscribe((datos) => { })

            setTimeout(() => {
              this.getLiquidaciones()
              this.liqEncarg = true
              this.addEncarg = false
              this.editEncarg = false
              this.selected = false
              this.mostrarFecha = false
              this.liqEncargada.encargada = ""
              Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Liquidado Correctamente!',
                showConfirmButton: false,
                timer: 2500,
              })
            }, 1000);
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