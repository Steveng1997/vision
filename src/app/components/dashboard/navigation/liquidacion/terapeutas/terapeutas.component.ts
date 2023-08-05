import { Component, OnInit, ɵbypassSanitizationTrustResourceUrl } from '@angular/core'
import { FormBuilder, FormControl, FormGroup } from '@angular/forms'
import Swal from 'sweetalert2'
import { Router } from '@angular/router'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'

// Servicios
import { LoginService } from 'src/app/core/services/login'
import { ServicioService } from 'src/app/core/services/servicio'
import { TrabajadoresService } from 'src/app/core/services/trabajadores'
import { LiquidacioneTerapService } from 'src/app/core/services/liquidacionesTerap'

@Component({
  selector: 'app-terapeutas',
  templateUrl: './terapeutas.component.html',
  styleUrls: ['./terapeutas.component.css']
})
export class TerapeutasComponent implements OnInit {

  liqTep: boolean
  addTerap: boolean
  editTerap: boolean
  filtredBusqueda: string
  filtredBusquedaNumber: number
  servicioNoLiquidadaTerapeuta: any
  liquidacionesTerapeutas: any
  datosLiquidadoTerap: any
  page!: number

  // Encargada
  encargada: any[] = []
  selectedEncargada: string

  // Terapeuta
  terapeuta: any[] = []
  selectedTerapeuta: string
  terapeutaName: any[] = []

  // Fecha
  fechaInicio: string
  fechaFinal: string

  selected: boolean

  // Conversión
  fechaAsc: string
  horaAsc: string
  fechaDesc: string
  horaDesc: string
  fechaAnterior: string
  horaAnterior: string
  horaHoy = new Date().toTimeString().substring(0, 5)
  fechaHoy: string
  mostrarFecha: boolean

  // Servicios
  totalServicio: number
  totalValorPropina: number
  totalValorEncargada: number
  totalValorTerapeuta: number
  TotalValorBebida: number
  TotalValorTabaco: number
  totalValorVitaminas: number
  totalValorOtroServ: number

  // Comision
  comisionServicio: number
  comisionPropina: number
  comisionBebida: number
  comisionTabaco: number
  comisionVitamina: number
  comisionOtros: number
  sumaComision: number
  idUnico: string
  recibidoTerap: any
  totalComision: number

  currentDate = new Date().getTime()
  existe: boolean

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
  ) { }

  ngOnInit(): void {
    document.getElementById('idTitulo').style.display = 'block'
    document.getElementById('idTitulo').innerHTML = 'LIQUIDACIÓNES TERAPEUTAS'

    this.liqTep = true
    this.addTerap = false
    this.selected = false
    this.editTerap = false
    this.getLiquidaciones()
    this.getServicioFalceLiquid()
    this.getEncargada()
    this.getTerapeuta()
    this.tableComision()
  }

  tableComision() {
    if (this.terapeutaName['servicio'] == undefined) this.terapeutaName['servicio'] = 0
    if (this.terapeutaName['propina'] == undefined) this.terapeutaName['propina'] = 0
    if (this.terapeutaName['bebida'] == undefined) this.terapeutaName['bebida'] = 0
    if (this.terapeutaName['tabaco'] == undefined) this.terapeutaName['tabaco'] = 0
    if (this.terapeutaName['vitamina'] == undefined) this.terapeutaName['vitamina'] = 0
    if (this.terapeutaName['otros'] == undefined) this.terapeutaName['otros'] = 0
    if (this.comisionServicio == undefined) this.comisionServicio = 0
    if (this.comisionPropina == undefined) this.comisionPropina = 0
    if (this.comisionBebida == undefined) this.comisionBebida = 0
    if (this.comisionTabaco == undefined) this.comisionTabaco = 0
    if (this.comisionVitamina == undefined) this.comisionVitamina = 0
    if (this.comisionOtros == undefined) this.comisionOtros = 0
    if (this.sumaComision == undefined) this.sumaComision = 0
    if (this.totalComision == undefined) this.totalComision = 0
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

  getLiquidaciones() {
    this.liquidacionTerapService.getLiquidacionesTerapeuta().subscribe((datoLiquidaciones) => {
      this.liquidacionesTerapeutas = datoLiquidaciones

      if (datoLiquidaciones.length > 0) {
        this.fechaAnterior = datoLiquidaciones[0]['hastaFechaLiquidado']
        this.horaAnterior = datoLiquidaciones[0]['hastaHoraLiquidado']
        this.existe = true
      } else this.existe = false
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

    const condicionEncargada = serv => {
      return (this.selectedEncargada) ? serv.encargada === this.selectedEncargada : true
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
  }

  getServicioFalceLiquid() {
    this.servicioService.getByLiquidTerapFalse().subscribe((datoServicio) => {
      this.servicioNoLiquidadaTerapeuta = datoServicio
    })
  }

  getTerapeuta() {
    this.trabajadorService.getAllTerapeuta().subscribe((datosTerapeuta) => {
      this.terapeuta = datosTerapeuta
    })
  }

  getEncargada() {
    this.loginService.getUsuarios().subscribe((datosEncargada) => {
      this.encargada = datosEncargada
    })
  }

  addLiquidacion() {
    this.selectedEncargada = ""
    this.selectedTerapeuta = ""
    this.calcularSumaDeServicios()
    this.liqTep = false
    this.editTerap = false
    this.selected = false
    this.addTerap = true
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
    if (this.selectedEncargada != "" && this.selectedTerapeuta != "") {
      this.selected = true

      const condicionTerapeuta = serv => {
        return (this.selectedTerapeuta) ? serv.terapeuta === this.selectedTerapeuta : true
      }

      const condicionEncargada = serv => {
        return (this.selectedEncargada) ? serv.encargada === this.selectedEncargada : true
      }

      this.servicioService.getTerapeutaFechaAsc(this.selectedTerapeuta, this.selectedEncargada).then((fechaAsce) => {
        this.fechaAsc = fechaAsce[0]['fechaHoyInicio']
      })

      this.servicioService.getTerapeutaFechaDesc(this.selectedTerapeuta, this.selectedEncargada).then((fechaDesce) => {
        this.fechaDesc = fechaDesce[0]['fechaHoyInicio']
      })

      const mostrarFech = this.servicioNoLiquidadaTerapeuta.filter(serv => condicionTerapeuta(serv)
        && condicionEncargada(serv))
      if (mostrarFech.length != 0) {
        this.mostrarFecha = true
      } else {
        this.mostrarFecha = false
      }

      // Filter by servicio
      const servicios = this.servicioNoLiquidadaTerapeuta.filter(serv => condicionTerapeuta(serv)
        && condicionEncargada(serv))
      this.totalServicio = servicios.reduce((accumulator, serv) => {
        return accumulator + serv.servicio
      }, 0)

      // Filter by Propina
      const propinas = this.servicioNoLiquidadaTerapeuta.filter(serv => condicionTerapeuta(serv)
        && condicionEncargada(serv))
      this.totalValorPropina = propinas.reduce((accumulator, serv) => {
        return accumulator + serv.propina
      }, 0)

      // Filter by Pago
      const terapeuta = this.servicioNoLiquidadaTerapeuta.filter(serv => condicionTerapeuta(serv)
        && condicionEncargada(serv))
      this.totalValorTerapeuta = terapeuta.reduce((accumulator, serv) => {
        return accumulator + serv.numberTerap
      }, 0)

      const encargada = this.servicioNoLiquidadaTerapeuta.filter(serv => condicionTerapeuta(serv)
        && condicionEncargada(serv))
      this.totalValorEncargada = encargada.reduce((accumulator, serv) => {
        return accumulator + serv.numberEncarg
      }, 0)

      // Filter by Bebida
      const bebida = this.servicioNoLiquidadaTerapeuta.filter(serv => condicionTerapeuta(serv)
        && condicionEncargada(serv))
      this.TotalValorBebida = bebida.reduce((accumulator, serv) => {
        return accumulator + serv.bebidas
      }, 0)

      // Filter by Tabaco
      const tabac = this.servicioNoLiquidadaTerapeuta.filter(serv => condicionTerapeuta(serv)
        && condicionEncargada(serv))
      this.TotalValorTabaco = tabac.reduce((accumulator, serv) => {
        return accumulator + serv.tabaco
      }, 0)

      // Filter by Vitamina
      const vitamina = this.servicioNoLiquidadaTerapeuta.filter(serv => condicionTerapeuta(serv)
        && condicionEncargada(serv))
      this.totalValorVitaminas = vitamina.reduce((accumulator, serv) => {
        return accumulator + serv.vitaminas
      }, 0)

      // Filter by Vitamina
      const otroServicio = this.servicioNoLiquidadaTerapeuta.filter(serv => condicionTerapeuta(serv)
        && condicionEncargada(serv))
      this.totalValorOtroServ = otroServicio.reduce((accumulator, serv) => {
        return accumulator + serv.otros
      }, 0)

      let comisiServicio = 0, comiPropina = 0, comiBebida = 0, comiTabaco = 0, comiVitamina = 0, comiOtros = 0, sumComision = 0
      this.totalComision = 0

      this.trabajadorService.getTerapeuta(this.selectedTerapeuta).then((datosNameTerapeuta) => {
        this.terapeutaName = datosNameTerapeuta[0]

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

        this.recibidoTerap = this.totalValorEncargada + this.totalValorTerapeuta

        return this.totalComision = this.sumaComision - Number(this.recibidoTerap)
      })
    }
  }

  editamos(id: string) {
    this.router.navigate([`menu/${id}/nuevo-servicio/${id}`,
    ])
  }

  editamosServicio(id: string) {
    this.liqTep = false
    this.addTerap = false
    this.editTerap = true

    this.liquidacionTerapService.getIdTerap(id).then((datosTerapeuta) => {
      this.horaAsc = datosTerapeuta[0]['hastaHoraLiquidado']
      this.horaDesc = datosTerapeuta[0]['desdeHoraLiquidado']
    })

    this.servicioService.getByIdTerap(id).subscribe((datosTerapeuta) => {
      this.datosLiquidadoTerap = datosTerapeuta;

      this.servicioService.getTerapeutaFechaAscByLiqTrue(datosTerapeuta[0]['terapeuta'], datosTerapeuta[0]['encargada']).then((fechaAsce) => {
        this.fechaAsc = fechaAsce[0]['fechaHoyInicio']
      })

      this.servicioService.getTerapeutaFechaDescByLiqFalse(datosTerapeuta[0]['terapeuta'], datosTerapeuta[0]['encargada']).then((fechaDesce) => {
        this.fechaDesc = fechaDesce[0]['fechaHoyInicio']
      })

      // Filter by servicio
      const servicios = this.datosLiquidadoTerap.filter(serv => serv)
      this.totalServicio = servicios.reduce((accumulator, serv) => {
        return accumulator + serv.servicio
      }, 0)

      // Filter by Propina
      const propinas = this.datosLiquidadoTerap.filter(serv => serv)
      this.totalValorPropina = propinas.reduce((accumulator, serv) => {
        return accumulator + serv.propina
      }, 0)

      // Filter by Pago
      const terapeuta = this.datosLiquidadoTerap.filter(serv => serv)
      this.totalValorTerapeuta = terapeuta.reduce((accumulator, serv) => {
        return accumulator + serv.numberTerap
      }, 0)

      // Filter by Bebida
      const bebida = this.datosLiquidadoTerap.filter(serv => serv)
      this.TotalValorBebida = bebida.reduce((accumulator, serv) => {
        return accumulator + serv.bebidas
      }, 0)

      // Filter by Tabaco
      const tabac = this.datosLiquidadoTerap.filter(serv => serv)
      this.TotalValorTabaco = tabac.reduce((accumulator, serv) => {
        return accumulator + serv.tabaco
      }, 0)

      // Filter by Vitamina
      const vitamina = this.datosLiquidadoTerap.filter(serv => serv)
      this.totalValorVitaminas = vitamina.reduce((accumulator, serv) => {
        return accumulator + serv.vitaminas
      }, 0)

      // Filter by Vitamina
      const otroServicio = this.datosLiquidadoTerap.filter(serv => serv)
      this.totalValorOtroServ = otroServicio.reduce((accumulator, serv) => {
        return accumulator + serv.otros
      }, 0)

      let comisiServicio = 0, comiPropina = 0, comiBebida = 0, comiTabaco = 0, comiVitamina = 0, comiOtros = 0, sumComision = 0
      this.totalComision = 0

      this.trabajadorService.getTerapeuta(this.datosLiquidadoTerap[0]['terapeuta']).then((datosNameTerapeuta) => {
        this.terapeutaName = datosNameTerapeuta[0]

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

        for (let index = 0; index < this.datosLiquidadoTerap.length; index++) {
          const numbTerap = this.datosLiquidadoTerap.filter(serv => serv)
          this.recibidoTerap = numbTerap.reduce((accumulator, serv) => {
            return accumulator + serv.numberTerap
          }, 0)
        }
        return this.totalComision = this.sumaComision - Number(this.recibidoTerap)
      })
    })
  }

  editarTerapeuta() {
    this.liquidacionTerapService.getIdTerap(this.datosLiquidadoTerap[0]['idTerapeuta']).then((datos) => {
      for (let index = 0; index < datos.length; index++) {
        this.liquidacionTerapService.updateById(datos[index]['idDocument'], datos[index]['idTerapeuta'], this.totalComision).then((datos) => {
          this.liqTep = true
          this.addTerap = false
          this.editTerap = false
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

  guardar() {
    let conteo = 0, idTerapeuta = '';
    if (this.selectedTerapeuta) {
      if (this.selectedEncargada) {
        if (this.existe === true) {

          this.servicioService.getTerapeutaEncargada(this.selectedTerapeuta, this.selectedEncargada).then((datos) => {
            idTerapeuta = datos[0]['id']
            for (let index = 0; index < datos.length; index++) {
              conteo = datos.length
              this.servicioService.updateLiquidacionTerap(datos[index]['idDocument'], datos[index]['id'], idTerapeuta).then((datos) => {
              })
            }

            this.fechaOrdenada()

            this.liquidacionTerapService.registerLiquidacionesTerapeutas(this.selectedTerapeuta, this.selectedEncargada,
              this.fechaAnterior, this.fechaHoy, this.horaAnterior, this.horaHoy, conteo, this.totalComision,
              idTerapeuta, this.currentDate).then((datos) => {
                this.getLiquidaciones()
                this.liqTep = true
                this.addTerap = false
                this.editTerap = false
                this.selected = false
                this.mostrarFecha = false
                this.selectedEncargada = ""
                this.selectedTerapeuta = ""
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

          this.servicioService.getTerapeutaEncargada(this.selectedTerapeuta, this.selectedEncargada).then((datosForFecha) => {
            this.fechaAnterior = datosForFecha[0]['fechaHoyInicio']
            this.horaAnterior = datosForFecha[0]['horaStart']

            let convertMes = '', convertDia = '', convertAno = ''

            convertDia = this.fechaAnterior.toString().substring(8, 11)
            convertMes = this.fechaAnterior.toString().substring(5, 7)
            convertAno = this.fechaAnterior.toString().substring(2, 4)

            this.fechaAnterior = `${convertDia}-${convertMes}-${convertAno}`

            this.servicioService.getTerapeutaEncargada(this.selectedTerapeuta, this.selectedEncargada).then((datos) => {
              idTerapeuta = datos[0]['id']
              for (let index = 0; index < datos.length; index++) {
                conteo = datos.length
                this.servicioService.updateLiquidacionTerap(datos[index]['idDocument'], datos[index]['id'], idTerapeuta).then((datos) => {
                })
              }

              this.fechaOrdenada()

              this.liquidacionTerapService.registerLiquidacionesTerapeutas(this.selectedTerapeuta, this.selectedEncargada,
                this.fechaAnterior, this.fechaHoy, this.horaAnterior, this.horaHoy, conteo, this.totalComision,
                idTerapeuta, this.currentDate).then((datos) => {
                  this.getLiquidaciones()
                  this.liqTep = true
                  this.addTerap = false
                  this.editTerap = false
                  this.selected = false
                  this.mostrarFecha = false
                  this.selectedEncargada = ""
                  this.selectedTerapeuta = ""
                  Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    title: 'Liquidado Correctamente!',
                    showConfirmButton: false,
                    timer: 2500,
                  })
                })

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
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'No hay ninguna terapeuta seleccionada',
        showConfirmButton: false,
        timer: 2500,
      })
    }
  }
}