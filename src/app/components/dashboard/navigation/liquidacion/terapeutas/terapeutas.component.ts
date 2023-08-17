import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormControl, FormGroup } from '@angular/forms'
import Swal from 'sweetalert2'
import { Router } from '@angular/router'
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

  // Terapeuta
  terapeuta: any[]
  terapeutaName: any

  // Fecha
  fechaInicio: string
  fechaFinal: string

  selected: boolean

  // Conversión
  fechaAsc: string
  horaAsc: string
  fechaDesc: string
  horaDesc: string
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
  ) { }

  ngOnInit(): void {
    document.getElementById('idTitulo').style.display = 'block'
    document.getElementById('idTitulo').innerHTML = 'LIQUIDACIÓNES TERAPEUTAS'

    this.liqTerapeuta.encargada = ""
    this.liqTerapeuta.terapeuta = ""

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
    if (this.terapeutaName['servicio'] == "") this.terapeutaName['servicio'] = 0
    if (this.terapeutaName['propina'] == "") this.terapeutaName['propina'] = 0
    if (this.terapeutaName['bebida'] == "") this.terapeutaName['bebida'] = 0
    if (this.terapeutaName['tabaco'] == "") this.terapeutaName['tabaco'] = 0
    if (this.terapeutaName['vitamina'] == "") this.terapeutaName['vitamina'] = 0
    if (this.terapeutaName['otros'] == "") this.terapeutaName['otros'] = 0
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

  getLiquidaciones() {
    this.liquidacionTerapService.getLiquidacionesTerapeuta().subscribe((datoLiquidaciones: any) => {
      this.liquidacionesTerapeutas = datoLiquidaciones

      if (datoLiquidaciones.length > 0) {
        this.liqTerapeuta.desdeFechaLiquidado = datoLiquidaciones[0]['hastaFechaLiquidado']
        this.liqTerapeuta.desdeHoraLiquidado = datoLiquidaciones[0]['hastaHoraLiquidado']
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
  }

  getServicioFalceLiquid() {
    this.servicioService.getByLiquidTerapFalse().subscribe((datoServicio) => {
      this.servicioNoLiquidadaTerapeuta = datoServicio
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

  addLiquidacion() {
    this.liqTerapeuta.encargada = ""
    this.liqTerapeuta.terapeuta = ""
    this.liqTep = false
    this.editTerap = false
    this.selected = false
    this.addTerap = true
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

  calcularSumaDeServicios(): any {

    if (this.liqTerapeuta.encargada != "" && this.liqTerapeuta.terapeuta != "") {
      let respuesta: any

      this.servicioService.getByTerapeutaAndEncargada(this.liqTerapeuta.terapeuta, this.liqTerapeuta.encargada).subscribe((resp: any) => {
        respuesta = resp

        if (respuesta.length > 0) {

          this.selected = true

          const condicionTerapeuta = serv => {
            return (this.liqTerapeuta.terapeuta) ? serv.terapeuta === this.liqTerapeuta.terapeuta : true
          }

          const condicionEncargada = serv => {
            return (this.liqTerapeuta.encargada) ? serv.encargada === this.liqTerapeuta.encargada : true
          }

          this.servicioService.getTerapeutaFechaDesc(this.liqTerapeuta.terapeuta, this.liqTerapeuta.encargada).subscribe((fechaDesc) => {
            let año = "", mes = "", dia = ""
            año = fechaDesc[0]['fechaHoyInicio'].substring(2, 4)            
            mes = fechaDesc[0]['fechaHoyInicio'].substring(5, 7)
            dia = fechaDesc[0]['fechaHoyInicio'].substring(8, 10)

            this.fechaAsc = `${dia}-${mes}-${año}`
            this.horaAsc = fechaDesc[0]['horaStart']
          })

          debugger

          this.servicioService.getTerapeutaFechaAsc(this.liqTerapeuta.terapeuta, this.liqTerapeuta.encargada).subscribe((fechaAsc) => {
            let año = "", mes = "", dia = ""
            año = fechaAsc[0]['fechaHoyInicio'].substring(2, 4)            
            mes = fechaAsc[0]['fechaHoyInicio'].substring(5, 7)
            dia = fechaAsc[0]['fechaHoyInicio'].substring(8, 10)

            this.fechaDesc = `${dia}-${mes}-${año}`
            this.horaDesc = fechaAsc[0]['horaStart']
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

          this.trabajadorService.getTerapeuta(this.liqTerapeuta.terapeuta).subscribe((datosNameTerapeuta) => {
            this.terapeutaName = datosNameTerapeuta[0]
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
            this.recibidoTerap = this.totalValorEncargada + this.totalValorTerapeuta
            this.totalComision = this.sumaComision - Number(this.recibidoTerap)
          })
        }
      })
    } else {
      this.selected = false
      this.mostrarFecha = false
    }
  }

  editamos(id: string) {
    this.router.navigate([`menu/${id}/nuevo-servicio/${id}`,
    ])
  }

  editamosServicio(id: number) {
    this.liqTep = false
    this.addTerap = false
    this.editTerap = true

    this.liquidacionTerapService.getIdTerap(id).subscribe((datosTerapeuta) => {
      this.horaAsc = datosTerapeuta[0]['hastaHoraLiquidado']
      this.horaDesc = datosTerapeuta[0]['desdeHoraLiquidado']
    })

    debugger

    this.servicioService.getByIdTerap(id).subscribe((datosTerapeuta) => {
      this.datosLiquidadoTerap = datosTerapeuta;

      this.servicioService.getTerapeutaFechaAscByLiqTrue(datosTerapeuta[0]['terapeuta'], datosTerapeuta[0]['encargada']).subscribe((fechaAsce) => {
        this.fechaAsc = fechaAsce[0]['fechaHoyInicio']
      })

      this.servicioService.getTerapeutaFechaDescByLiqTrue(datosTerapeuta[0]['terapeuta'], datosTerapeuta[0]['encargada']).subscribe((fechaDesce) => {
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

      this.trabajadorService.getTerapeuta(this.datosLiquidadoTerap[0]['terapeuta']).subscribe((datosNameTerapeuta) => {
        this.terapeutaName = datosNameTerapeuta[0]
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

  cancelar() {
    this.getLiquidaciones()
    this.liqTep = true
    this.addTerap = false
    this.editTerap = false
    this.selected = false
    this.mostrarFecha = false
    this.liqTerapeuta.encargada = ""
    this.liqTerapeuta.terapeuta = ""
  }

  guardar() {

    this.liqTerapeuta.currentDate = this.currentDate.toString()

    if (this.liqTerapeuta.terapeuta != "") {
      if (this.liqTerapeuta.encargada != "") {
        if (this.existe === true) {

          this.servicioService.getTerapeutaEncargada(this.liqTerapeuta.terapeuta, this.liqTerapeuta.encargada).subscribe((datos: any) => {
            this.liqTerapeuta.idTerapeuta = datos[0]['id']
            for (let index = 0; index < datos.length; index++) {
              this.liqTerapeuta.tratamiento = datos.length
              this.servicioService.updateLiquidacionTerap(datos[index]['id'], this.liqTerapeuta).subscribe((datos) => {
              })
            }

            this.fechaOrdenada()

            this.liquidacionTerapService.registerLiquidacionesTerapeutas(this.liqTerapeuta).subscribe((datos) => { })

            setTimeout(() => {
              this.getLiquidaciones()
            }, 1000);

            this.liqTep = true
            this.addTerap = false
            this.editTerap = false
            this.selected = false
            this.mostrarFecha = false
            this.liqTerapeuta.encargada = ""
            this.liqTerapeuta.terapeuta = ""
            Swal.fire({
              position: 'top-end',
              icon: 'success',
              title: 'Liquidado Correctamente!',
              showConfirmButton: false,
              timer: 2500,
            })
          })
        }

        if (this.existe === false) {

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

              this.fechaOrdenada()
              this.liquidacionTerapService.registerLiquidacionesTerapeutas(this.liqTerapeuta).subscribe((datos) => { })

              setTimeout(() => {
                this.getLiquidaciones()
              }, 1000);

              this.liqTep = true
              this.addTerap = false
              this.editTerap = false
              this.selected = false
              this.mostrarFecha = false
              this.liqTerapeuta.encargada = ""
              this.liqTerapeuta.terapeuta = ""
              this.calcularSumaDeServicios()
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