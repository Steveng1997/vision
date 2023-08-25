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

  idLiquidacion: number
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
  idUser: number

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
    private activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    document.getElementById('idTitulo').style.display = 'block'
    document.getElementById('idTitulo').innerHTML = 'LIQUIDACIÓNES TERAPEUTAS'

    const params = this.activatedRoute.snapshot['_urlSegment'].segments[1];
    this.idUser = Number(params.path)

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

      if (datoLiquidaciones.length > 0) this.existe = true
      else this.existe = false
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

  fechaInicial(event: any) {
    let dia = '', mes = '', año = ''

    dia = event.target.value.substring(8, 10)
    mes = event.target.value.substring(5, 7)
    año = event.target.value.substring(2, 4)
    this.fechaDesc = `${dia}-${mes}-${año}`
  }

  fechaFinals(event: any) {
    let dia = '', mes = '', año = ''

    dia = event.target.value.substring(8, 10)
    mes = event.target.value.substring(5, 7)
    año = event.target.value.substring(2, 4)
    this.fechaAsc = `${dia}-${mes}-${año}`
  }


  horaInicial(event: any) {
    this.horaDesc = event.target.value
  }

  horaFinal(event: any) {
    this.horaAsc = event.target.value
  }

  fechaSelectNoExiste() {
    let año = "", mes = "", dia = ""

    this.servicioService.getTerapeutaFechaAsc(this.liqTerapeuta.terapeuta, this.liqTerapeuta.encargada).subscribe((rp) => {
      año = rp[0]['fechaHoyInicio'].substring(0, 4)
      mes = rp[0]['fechaHoyInicio'].substring(5, 7)
      dia = rp[0]['fechaHoyInicio'].substring(8, 10)

      this.liqTerapeuta.desdeFechaLiquidado = `${año}-${mes}-${dia}`
      this.liqTerapeuta.desdeHoraLiquidado = rp[0]['horaStart']

      this.fechaDesc = `${dia}-${mes}-${año}`
      this.horaDesc = rp[0]['horaStart']
    })
  }

  fechaSelectExiste() {
    let fecha = new Date(), dia = '', mes = '', año = 0, diaHasta = 0, mesHasta = 0, añoHasta = 0, convertMes = '', convertDia = ''

    this.liquidacionTerapService.getTerapAndEncarg(this.liqTerapeuta.terapeuta, this.liqTerapeuta.encargada).subscribe((rp: any) => {

      if (rp.length > 0) {
        this.fechaDesc = rp[0]['hastaFechaLiquidado']
        this.horaDesc = rp[0]['hastaHoraLiquidado']

        año = fecha.getFullYear()
        mes = rp[0]['hastaFechaLiquidado'].substring(3, 5)
        dia = rp[0]['hastaFechaLiquidado'].substring(0,2)
        this.liqTerapeuta.desdeFechaLiquidado = `${año}-${mes}-${dia}`
        this.liqTerapeuta.desdeHoraLiquidado = rp[0]['hastaHoraLiquidado']
      } else {
        this.fechaSelectNoExiste()
        // this.fechaHasta()
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

  calcularSumaDeServicios(): any {

    debugger

    if (this.liqTerapeuta.encargada != "" && this.liqTerapeuta.terapeuta != "") {
      let respuesta: any

      this.servicioService.getByTerapeutaAndEncargada(this.liqTerapeuta.terapeuta, this.liqTerapeuta.encargada).subscribe((resp: any) => {
        respuesta = resp

        if (respuesta.length > 0) {

          this.selected = true
          this.fechaSelectExiste()
          this.fechaHasta()

          const condicionTerapeuta = serv => {
            return (this.liqTerapeuta.terapeuta) ? serv.terapeuta === this.liqTerapeuta.terapeuta : true
          }

          const condicionEncargada = serv => {
            return (this.liqTerapeuta.encargada) ? serv.encargada === this.liqTerapeuta.encargada : true
          }

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
            this.liqTerapeuta.importe = this.totalComision
          })
        } else {
          this.selected = false
          this.mostrarFecha = false
        }
      })
    }
  }

  editamos(id: number) {
    this.servicioService.getByIdTerap(id).subscribe((rp: any) => {
      if (rp.length > 0) this.router.navigate([`menu/${this.idUser}/nuevo-servicio/${rp[0]['id']}/true`])
    })
  }

  editar() {
    this.liqTerapeuta.importe = this.totalComision
    this.liquidacionTerapService.updateTerapImporteId(this.idLiquidacion, this.liqTerapeuta).subscribe((rp) => { })

    setTimeout(() => {
      this.getLiquidaciones()
      this.liqTep = true
      this.addTerap = false
      this.editTerap = false
      this.selected = false
      this.mostrarFecha = false
      this.liqTerapeuta.encargada = ""
      this.liqTerapeuta.terapeuta = ""
    }, 1000);
  }

  editamosServicio(id: number, idLiq: number) {
    this.idLiquidacion = idLiq
    this.liqTep = false
    this.addTerap = false
    this.editTerap = true

    this.liquidacionTerapService.getIdTerap(id).subscribe((datosTerapeuta) => {
      this.fechaAsc = datosTerapeuta[0]['desdeFechaLiquidado']
      this.horaAsc = datosTerapeuta[0]['desdeHoraLiquidado']
      this.fechaDesc = datosTerapeuta[0]['hastaFechaLiquidado']
      this.horaDesc = datosTerapeuta[0]['hastaHoraLiquidado']
    })

    this.servicioService.getByIdTerap(id).subscribe((datosTerapeuta) => {
      this.datosLiquidadoTerap = datosTerapeuta;

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

  fechaDesde() {
    this.liquidacionTerapService.getTerapAndEncarg(this.liqTerapeuta.terapeuta, this.liqTerapeuta.encargada).subscribe((rp) => {
      this.liqTerapeuta.desdeFechaLiquidado = rp[0]['hastaFechaLiquidado']
      this.liqTerapeuta.desdeHoraLiquidado = rp[0]['hastaHoraLiquidado']
    })
  }

  fechaHasta() {
    let fecha = new Date(), dia = 0, mes = 0, año = 0, convertMes = '', convertDia = '', convertAño = ''

    dia = fecha.getDate()
    mes = fecha.getMonth() + 1
    año = fecha.getFullYear()

    convertAño = año.toString().substring(2, 4)

    if (mes > 0 && mes < 10) {
      convertMes = '0' + mes
      this.fechaAsc = `${dia}-${convertMes}-${convertAño}`
    } else {
      this.fechaAsc = `${dia}-${mes}-${convertAño}`
    }

    if (dia > 0 && dia < 10) {
      convertDia = '0' + dia
      this.fechaAsc = `${convertDia}-${convertMes}-${convertAño}`
    } else {
      this.fechaAsc = `${dia}-${convertMes}-${convertAño}`
    }

    this.horaAsc = this.liqTerapeuta.hastaHoraLiquidado
  }

  guardar() {
    if (this.liqTerapeuta.terapeuta != "") {
      if (this.liqTerapeuta.encargada != "") {
        if (this.existe === true) {

          this.liqTerapeuta.currentDate = this.currentDate.toString()
          this.liqTerapeuta.desdeFechaLiquidado = this.fechaDesc
          this.liqTerapeuta.desdeHoraLiquidado = this.horaDesc
          this.liqTerapeuta.hastaFechaLiquidado = this.fechaAsc
          this.liqTerapeuta.hastaHoraLiquidado = this.horaAsc

          this.servicioService.getTerapeutaEncargada(this.liqTerapeuta.terapeuta, this.liqTerapeuta.encargada).subscribe((datos: any) => {
            this.liqTerapeuta.idTerapeuta = datos[0]['id']
            for (let index = 0; index < datos.length; index++) {
              this.liqTerapeuta.tratamiento = datos.length
              this.servicioService.updateLiquidacionTerap(datos[index]['id'], this.liqTerapeuta).subscribe((datos) => {
              })
            }

            this.fechaDesde()
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