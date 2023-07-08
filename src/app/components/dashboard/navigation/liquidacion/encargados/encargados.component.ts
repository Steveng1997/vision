import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormControl, FormGroup } from '@angular/forms'
import Swal from 'sweetalert2'
import { Router } from '@angular/router'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'

// Servicios
import { LoginService } from 'src/app/core/services/login'
import { ServicioService } from 'src/app/core/services/servicio'
import { LiquidacioneEncargService } from 'src/app/core/services/liquidacionesEncarg'

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
  Liquidada: any
  servicioNoLiquidadaEncargada: any
  liquidacionesEncargada: any
  datosLiquidadoEncargada: any
  page!: number

  // Encargada
  encargada: any[] = []
  selectedEncargada: string

  encargadaName: any[] = []

  // Fecha
  fechaInicio: string
  fechaFinal: string

  selected: boolean

  // Conversión
  fechaAsc: string
  fechaDesc: string
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

  // Comision
  comisionServicio: number
  comisionPropina: number
  comisionBebida: number
  comisionTabaco: number
  comisionVitamina: number
  comisionOtros: number
  sumaComision: number

  recibidoTerap: any
  totalComision: number

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
    terapeuta: new FormControl(''),
    encargada: new FormControl(''),
    busqueda: new FormControl(''),
  })

  ngOnInit(): void {
    document.getElementById('idTitulo').style.display = 'block'
    document.getElementById('idTitulo').innerHTML = 'LIQUIDACIÓNES ENCARGADAS'

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
    if (this.encargadaName['servicio'] == undefined) this.encargadaName['servicio'] = 0
    if (this.encargadaName['propina'] == undefined) this.encargadaName['propina'] = 0
    if (this.encargadaName['bebida'] == undefined) this.encargadaName['bebida'] = 0
    if (this.encargadaName['tabaco'] == undefined) this.encargadaName['tabaco'] = 0
    if (this.encargadaName['vitamina'] == undefined) this.encargadaName['vitamina'] = 0
    if (this.encargadaName['otros'] == undefined) this.encargadaName['otros'] = 0
    if (this.comisionServicio == undefined) this.comisionServicio = 0
    if (this.comisionPropina == undefined) this.comisionPropina = 0
    if (this.comisionBebida == undefined) this.comisionBebida = 0
    if (this.comisionTabaco == undefined) this.comisionTabaco = 0
    if (this.comisionVitamina == undefined) this.comisionVitamina = 0
    if (this.comisionOtros == undefined) this.comisionOtros = 0
    if (this.sumaComision == undefined) this.sumaComision = 0
    if (this.totalComision == undefined) this.totalComision = 0
  }

  getLiquidaciones() {
    this.liqudacionEncargServ.getLiquidacionesEncargada().subscribe((datoEncargLiq) => {
      this.liquidacionesEncargada = datoEncargLiq
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

  addLiquidacion() {
    this.liqEncarg = false
    this.editEncarg = false
    this.validate()
    this.addEncarg = true
  }

  validate() {
    // if (this.fechaAsc == undefined) this.fechaAsc = this.fechaConvertion
    // if (this.fechaDesc == undefined) this.fechaDesc = this.fechaConvertion
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
      this.selected = true

      this.servicioService.getEncargFechaAsc(this.selectedEncargada).then((fechaAsce) => {
        this.fechaAsc = fechaAsce[0]['fechaHoyInicio']
      })

      this.servicioService.getEncargFechaDesc(this.selectedEncargada).then((fechaDesce) => {
        this.fechaDesc = fechaDesce[0]['fechaHoyInicio']
      })

      const condicionEncargada = serv => {
        return (this.selectedEncargada) ? serv.encargada === this.selectedEncargada : true
      }

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
      this.totalComision = 0

      this.loginService.getEncargada(this.selectedEncargada).then((datosNameTerapeuta) => {
        this.encargadaName = datosNameTerapeuta[0]

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

        const numbTerap = this.servicioNoLiquidadaEncargada.filter(serv => condicionEncargada(serv))
        this.recibidoTerap = numbTerap.reduce((accumulator, serv) => {
          return accumulator + serv.numberTerap
        }, 0)

        return this.totalComision = this.sumaComision - Number(this.recibidoTerap)
      })
    }
  }

  editamos(id: string) {
    this.router.navigate([`menu/${id}/nuevo-servicio/${id}`,
    ])
  }

  editamosServicio(id: string) {
    this.liqEncarg = false
    this.addEncarg = false
    this.editEncarg = true

    this.servicioService.getByIdEncarg(id).subscribe((datosEncargada) => {
      this.datosLiquidadoEncargada = datosEncargada;

      this.servicioService.getEncargadaFechaAscByLiqTrue(datosEncargada[0]['encargada']).then((fechaAsce) => {
        this.fechaAsc = fechaAsce[0]['fechaHoyInicio']
      })

      this.servicioService.getEncargadaFechaDescByLiqTrue(datosEncargada[0]['encargada']).then((fechaDesce) => {
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
      this.totalComision = 0

      this.loginService.getEncargada(this.datosLiquidadoEncargada[0]['encargada']).then((datosNameTerapeuta) => {
        this.encargadaName = datosNameTerapeuta[0]

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
        return this.totalComision = this.sumaComision - Number(this.recibidoTerap)
      })
    })
  }

  editarEncargada() {
    this.liqudacionEncargServ.getIdEncarg(this.datosLiquidadoEncargada[0]['idEncargada']).then((datos) => {
      for (let index = 0; index < datos.length; index++) {
        this.liqudacionEncargServ.updateById(datos[index]['idDocument'], datos[index]['idEncargada'], this.totalComision).then((datos) => {
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

  guardar() {
    let conteo = 0, fechaDesdeDato = '', horaDesdeDato = '', fechaHastaDato = '', horaHastaDato = '', idEncargada = '';
    if (this.selectedEncargada) {

      this.servicioService.getTerapNoLiquidadaByFechaDesc(this.selectedEncargada).then((datoTerap) => {
        fechaDesdeDato = datoTerap[0]['fechaHoyInicio']
        horaDesdeDato = datoTerap[0]['horaStart']
      })
      this.servicioService.getTerapNoLiquidadaByFechaAsc(this.selectedEncargada).then((datosEncargada) => {
        fechaHastaDato = datosEncargada[0]['fechaHoyInicio']
        horaHastaDato = datosEncargada[0]['horaStart']
      })

      this.servicioService.getEncargadaAndLiquidacion(this.selectedEncargada).then((datos) => {
        idEncargada = datos[0]['id']
        for (let index = 0; index < datos.length; index++) {
          conteo = datos.length
          this.servicioService.updateLiquidacionEncarg(datos[index]['idDocument'], datos[index]['id'], idEncargada).then((datos) => {
          })
        }

        this.liqudacionEncargServ.registerLiquidacionesEncargada(this.selectedEncargada, fechaDesdeDato, fechaHastaDato, horaDesdeDato, horaHastaDato, conteo, this.totalComision, idEncargada).then((datos) => {
          this.liqEncarg = true
          this.addEncarg = false
          this.editEncarg = false
          // window.location.reload()
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Liquidado Correctamente!',
            showConfirmButton: false,
            timer: 2500,
          })
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