import { Component, OnInit, ɵbypassSanitizationTrustResourceUrl } from '@angular/core'
import { FormBuilder, FormControl, FormGroup } from '@angular/forms'
import Swal from 'sweetalert2'
import { ActivatedRoute, Router } from '@angular/router'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'

// Servicios
import { ServiceManager } from 'src/app/core/services/manager'
import { Service } from 'src/app/core/services/service'
import { ServiceLiquidationManager } from 'src/app/core/services/managerCloseouts'

// Model
import { LiquidationManager } from 'src/app/core/models/liquidationManager'
import { ModelService } from 'src/app/core/models/service'

@Component({
  selector: 'app-manager',
  templateUrl: './manager.component.html',
  styleUrls: ['./manager.component.css']
})
export class ManagerComponent implements OnInit {

  idLiquid: number
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
  idUser: number

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

  liquidationManager: LiquidationManager = {
    currentDate: "",
    desdeFechaLiquidado: "",
    desdeHoraLiquidado: "",
    encargada: "",
    hastaFechaLiquidado: "",
    hastaHoraLiquidado: new Date().toTimeString().substring(0, 5),
    id: 0,
    idUnico: "",
    idEncargada: 0,
    importe: 0,
    tratamiento: 0
  }

  services: ModelService = {
    idEncargada: "",
  }

  constructor(
    public router: Router,
    public fb: FormBuilder,
    private modalService: NgbModal,
    public service: Service,
    public serviceManager: ServiceManager,
    public serviceLiquidationManager: ServiceLiquidationManager,
    private activatedRoute: ActivatedRoute,
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

    const params = this.activatedRoute.snapshot['_urlSegment'].segments[1];
    this.idUser = Number(params.path)

    this.liquidationManager.encargada = ""

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
    if (this.liquidationManager.importe == undefined) this.liquidationManager.importe = 0
  }

  getLiquidaciones() {
    this.serviceLiquidationManager.getLiquidacionesEncargada().subscribe((datoEncargLiq: any) => {
      this.liquidacionesEncargada = datoEncargLiq

      if (datoEncargLiq.length > 0) {
        this.liquidationManager.desdeFechaLiquidado = datoEncargLiq[0]['hastaFechaLiquidado']
        this.liquidationManager.desdeHoraLiquidado = datoEncargLiq[0]['hastaHoraLiquidado']
        this.existe = true
      } else this.existe = false
    })
  }

  getServicio() {
    this.service.getByLiquidTerapTrue().subscribe((datoServicio) => {
      this.Liquidada = datoServicio
    })
  }

  getServicioFalceLiquid() {
    this.service.getByLiquidEncargadaFalse().subscribe((datoServicio) => {
      this.servicioNoLiquidadaEncargada = datoServicio
    })
  }

  getEncargada() {
    this.serviceManager.getUsuarios().subscribe((datosEncargada: any) => {
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
    this.liquidationManager.encargada = ""
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
      this.liquidationManager.hastaFechaLiquidado = `${dia}-${convertMes}-${convertAno}`
    } else {
      this.liquidationManager.hastaFechaLiquidado = `${dia}-${mes}-${convertAno}`
    }

    if (dia > 0 && dia < 10) {
      convertDia = '0' + dia
      this.liquidationManager.hastaFechaLiquidado = `${convertDia}-${convertMes}-${convertAno}`
    } else {
      this.liquidationManager.hastaFechaLiquidado = `${dia}-${convertMes}-${convertAno}`
    }
  }

  notas(targetModal, modal) {
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

  calcularSumaDeServicios() {

    let respuesta: any

    if (this.liquidationManager.encargada != "") {

      this.service.getByEncargada(this.liquidationManager.encargada).subscribe((resp) => {
        respuesta = resp
        if (respuesta.length > 0) {

          this.selected = true

          const condicionEncargada = serv => {
            return (this.liquidationManager.encargada) ? serv.encargada === this.liquidationManager.encargada : true
          }

          this.service.getEncargFechaDesc(this.liquidationManager.encargada).subscribe((fechaDesc: any) => {
            let año = "", mes = "", dia = ""
            año = fechaDesc[0]['fechaHoyInicio'].substring(2, 4)
            mes = fechaDesc[0]['fechaHoyInicio'].substring(5, 7)
            dia = fechaDesc[0]['fechaHoyInicio'].substring(8, 10)

            this.fechaAsc = `${dia}-${mes}-${año}`
            this.horaAsc = fechaDesc[0]['horaStart']
          })

          this.service.getEncargFechaAsc(this.liquidationManager.encargada).subscribe((fechaAsc) => {
            let año = "", mes = "", dia = ""
            año = fechaAsc[0]['fechaHoyInicio'].substring(2, 4)
            mes = fechaAsc[0]['fechaHoyInicio'].substring(5, 7)
            dia = fechaAsc[0]['fechaHoyInicio'].substring(8, 10)

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
          this.liquidationManager.importe = 0

          this.serviceManager.getEncargada(this.liquidationManager.encargada).subscribe((datosNameTerapeuta) => {
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

            return this.liquidationManager.importe = this.sumaComision - Number(this.recibidoTerap)
          })
        }
      })
    } else {
      this.selected = false
      this.mostrarFecha = false
    }
  }

  editar() {
    this.liquidationManager.importe = this.liquidationManager.importe
    this.serviceLiquidationManager.updateEncargImporteId(this.idLiquid, this.liquidationManager).subscribe((rp) => { })

    setTimeout(() => {
      this.getLiquidaciones()
      this.liqEncarg = true
      this.addEncarg = false
      this.editEncarg = false
      this.selected = false
      this.mostrarFecha = false
      this.liquidationManager.encargada = ""
    }, 1000);
  }

  editamos(id: number) {
    this.service.getByIdEncarg(id).subscribe((rp: any) => {
      if (rp.length > 0) this.router.navigate([`menu/${this.idUser}/nuevo-servicio/${rp[0]['id']}/true`])
    })
  }

  editamosServicio(id: number, idLiquidacion: number) {
    this.idLiquid = idLiquidacion
    this.liqEncarg = false
    this.addEncarg = false
    this.editEncarg = true

    this.serviceLiquidationManager.getIdEncarg(id).subscribe((datos) => {
      this.fechaAsc = datos[0]['desdeFechaLiquidado']
      this.horaAsc = datos[0]['desdeHoraLiquidado']
      this.fechaDesc = datos[0]['hastaFechaLiquidado']
      this.horaDesc = datos[0]['hastaHoraLiquidado']
    })

    this.service.getByIdEncarg(id).subscribe((datosEncargada) => {
      this.datosLiquidadoEncargada = datosEncargada;

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
      const bebida = this.datosLiquidadoEncargada.filter(serv => serv.bebidas)
      this.TotalValorBebida = bebida.reduce((accumulator, serv) => {
        return accumulator + serv.bebidas
      }, 0)

      // Filter by Tabaco
      const tabac = this.datosLiquidadoEncargada.filter(serv => serv.tabaco)
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
      this.liquidationManager.importe = 0

      this.serviceManager.getEncargada(this.datosLiquidadoEncargada[0]['encargada']).subscribe((datosNameTerapeuta) => {
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
        return this.liquidationManager.importe = this.sumaComision - Number(this.recibidoTerap)
      })
    })
  }

  editarEncargada() {
    this.serviceLiquidationManager.getIdEncarg(this.datosLiquidadoEncargada[0]['idEncargada']).subscribe((datos: any) => {
      for (let index = 0; index < datos.length; index++) {
        this.serviceLiquidationManager.updateById(datos[index]['idEncargada'], this.liquidationManager).subscribe((datos) => {
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
    this.liquidationManager.encargada = ""
  }

  guardar() {
    this.liquidationManager.currentDate = this.currentDate.toString()

    if (this.liquidationManager.encargada) {
      if (this.existe === true) {

        for (let index = 0; index < this.servicioNoLiquidadaEncargada.length; index++) {
          this.liquidationManager.tratamiento = this.servicioNoLiquidadaEncargada.length
          this.services.idEncargada = this.liquidationManager.idUnico
          this.service.updateLiquidacionEncarg(this.servicioNoLiquidadaEncargada[index]['id'], this.services).subscribe((datos) => {
          })
        }

        this.fechaOrdenada()

        this.serviceLiquidationManager.getByEncargada(this.liquidationManager.encargada).subscribe((rp) => {
          this.liquidationManager.desdeFechaLiquidado = rp[0]['hastaFechaLiquidado']
          this.liquidationManager.desdeHoraLiquidado = rp[0]['hastaHoraLiquidado']
        })


        this.serviceLiquidationManager.registerLiquidacionesEncargada(this.liquidationManager).subscribe((datos) => { })

        setTimeout(() => {
          this.getLiquidaciones()
        }, 1000);

        this.liqEncarg = true
        this.addEncarg = false
        this.editEncarg = false
        this.selected = false
        this.mostrarFecha = false
        this.liquidationManager.encargada = ""
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Liquidado Correctamente!',
          showConfirmButton: false,
          timer: 2500,
        })
      }

      if (this.existe === false) {

        this.service.getEncargadaAndLiquidacion(this.liquidationManager.encargada).subscribe((datosForFecha) => {
          this.liquidationManager.desdeFechaLiquidado = datosForFecha[0]['fechaHoyInicio']
          this.liquidationManager.desdeHoraLiquidado = datosForFecha[0]['horaStart']

          let convertMes = '', convertDia = '', convertAno = ''

          convertDia = this.liquidationManager.desdeFechaLiquidado.toString().substring(8, 11)
          convertMes = this.liquidationManager.desdeFechaLiquidado.toString().substring(5, 7)
          convertAno = this.liquidationManager.desdeFechaLiquidado.toString().substring(2, 4)

          this.liquidationManager.desdeFechaLiquidado = `${convertDia}-${convertMes}-${convertAno}`

          for (let index = 0; index < this.servicioNoLiquidadaEncargada.length; index++) {
            this.liquidationManager.tratamiento = this.servicioNoLiquidadaEncargada.length
            this.services.idEncargada = this.liquidationManager.idUnico
            this.service.updateLiquidacionEncarg(this.servicioNoLiquidadaEncargada[index]['id'], this.services).subscribe((datos) => {
            })
          }

          this.fechaOrdenada()

          this.serviceLiquidationManager.registerLiquidacionesEncargada(this.liquidationManager).subscribe((datos) => { })

          setTimeout(() => {
            this.getLiquidaciones()
          }, 1000);

          this.liqEncarg = true
          this.addEncarg = false
          this.editEncarg = false
          this.selected = false
          this.mostrarFecha = false
          this.liquidationManager.encargada = ""
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Liquidado Correctamente!',
            showConfirmButton: false,
            timer: 2500,
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