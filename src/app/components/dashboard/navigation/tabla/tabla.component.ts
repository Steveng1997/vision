import { Component, OnInit, ɵbypassSanitizationTrustResourceUrl } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { ServicioService } from 'src/app/core/services/servicio'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'
import * as XLSX from 'xlsx'

// Service
import { TrabajadoresService } from 'src/app/core/services/trabajadores'
import { FormBuilder, FormControl, FormGroup } from '@angular/forms'
import { LoginService } from 'src/app/core/services/login'


@Component({
  selector: 'app-tabla',
  templateUrl: './tabla.component.html',
  styleUrls: ['./tabla.component.css']
})

export class TablaComponent implements OnInit {

  fechaInicio: string
  fechaFinal: string
  filtredBusqueda: string
  page!: number

  // Terapeuta
  terapeuta: any
  selectedTerapeuta: string

  // Encargada
  encargada: any
  selectedEncargada: string
  selectedFormPago: string

  servicio: any
  horario: any

  fileName = 'tabla.xlsx'
  idUser: number

  // Servicios
  totalServicio: number
  totalPiso2: number;
  totalPiso: number
  totalValorTerapeuta: number
  totalValorEncargada: number
  totalValorAOtros: number
  TotalValorBebida: number
  TotalValorTabaco: number
  totalValorVitaminas: number
  totalValorPropina: number
  totalValorOtroServ: number
  totalValor: number

  formTemplate = new FormGroup({
    fechaInicio: new FormControl(''),
    FechaFin: new FormControl(''),
    terapeuta: new FormControl(''),
    encargada: new FormControl(''),
    busqueda: new FormControl(''),
    formaPago: new FormControl('')
  })

  constructor(
    public router: Router,
    public trabajadorService: TrabajadoresService,
    public servicioService: ServicioService,
    public fb: FormBuilder,
    private modalService: NgbModal,
    public loginService: LoginService,
    private activeRoute: ActivatedRoute,
  ) {
  }

  ngOnInit(): void {
    document.getElementById('idTitulo').style.display = 'block'
    document.getElementById('idTitulo').innerHTML = 'TABLA'

    this.selectedTerapeuta = ""
    this.selectedEncargada = ""
    this.selectedFormPago = ""

    const params = this.activeRoute.snapshot.params;
    this.idUser = Number(params['id'])
    if (this.idUser) {
      this.loginService.getById(this.idUser).subscribe((rp) => {
        this.idUser = rp[0]
      })
    }

    this.getEncargada()
    this.getTerapeuta()
    this.getServicio()
    this.totalesUndefined()
  }

  totalesUndefined() {
    if (this.totalServicio == undefined) this.totalServicio = 0
    if (this.totalPiso == undefined) this.totalPiso = 0
    if (this.totalPiso2 == undefined) this.totalPiso2 = 0
    if (this.totalValorTerapeuta == undefined) this.totalValorTerapeuta = 0
    if (this.totalValorEncargada == undefined) this.totalValorEncargada = 0
    if (this.totalValorAOtros == undefined) this.totalValorAOtros = 0
    if (this.TotalValorBebida == undefined) this.TotalValorBebida = 0
    if (this.TotalValorTabaco == undefined) this.TotalValorTabaco = 0
    if (this.totalValorVitaminas == undefined) this.totalValorVitaminas = 0
    if (this.totalValorPropina == undefined) this.totalValorPropina = 0
    if (this.totalValorOtroServ == undefined) this.totalValorOtroServ = 0
    if (this.totalValor == undefined) this.totalValor = 0
  }

  getServicio() {
    this.servicioService.getServicio().subscribe((datoServicio: any) => {
      this.servicio = datoServicio
      if (datoServicio.length != 0) {
        this.sumaTotalServicios()
      }
    })
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

    this.calcularSumaDeServicios()
  }

  calcularSumaDeServicios() {

    const condicionTerapeuta = serv => {
      return (this.selectedTerapeuta) ? serv.terapeuta === this.selectedTerapeuta : true
    }

    const condicionEncargada = serv => {
      return (this.selectedEncargada) ? serv.encargada === this.selectedEncargada : true
    }

    const condicionFormaPago = serv => {
      return (this.selectedFormPago) ? serv.formaPago === this.selectedFormPago : true
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
      const criterio = this.filtredBusqueda
      return (serv.terapeuta.match(criterio)
        || serv.encargada.match(criterio)
        || serv.formaPago.match(criterio)
        || serv.fecha.match(criterio)
        || serv.cliente.match(criterio)) ? true : false
    }

    // Filter by Servicio
    if (Array.isArray(this.servicio)) {
      const servicios = this.servicio.filter(serv => condicionTerapeuta(serv)
        && condicionEncargada(serv) && condicionFormaPago(serv)
        && condicionBuscar(serv) && condicionEntreFechas(serv))
      this.totalServicio = servicios.reduce((accumulator, serv) => {
        return accumulator + serv.servicio
      }, 0)

      // Filter by Pisos
      const pisoss = this.servicio.filter(serv => condicionTerapeuta(serv)
        && condicionEncargada(serv) && condicionFormaPago(serv)
        && condicionBuscar(serv) && condicionEntreFechas(serv))
      this.totalPiso = pisoss.reduce((accumulator, serv) => {
        return accumulator + serv.numberPiso1
      }, 0)

      // Filter by Pisos
      const pisos2 = this.servicio.filter(serv => condicionTerapeuta(serv)
        && condicionEncargada(serv) && condicionFormaPago(serv)
        && condicionBuscar(serv) && condicionEntreFechas(serv))
      this.totalPiso2 = pisoss.reduce((accumulator, serv) => {
        return accumulator + serv.numberPiso2
      }, 0)

      // Filter by Terapeuta
      const terapeuta = this.servicio.filter(serv => condicionTerapeuta(serv)
        && condicionEncargada(serv) && condicionFormaPago(serv)
        && condicionBuscar(serv) && condicionEntreFechas(serv))
      this.totalValorTerapeuta = terapeuta.reduce((accumulator, serv) => {
        return accumulator + serv.numberTerap
      }, 0)

      // Filter by Encargada
      const encargada = this.servicio.filter(serv => condicionTerapeuta(serv)
        && condicionEncargada(serv) && condicionFormaPago(serv)
        && condicionBuscar(serv) && condicionEntreFechas(serv))
      this.totalValorEncargada = encargada.reduce((accumulator, serv) => {
        return accumulator + serv.numberEncarg
      }, 0)

      // Filter by Valor Otro
      const valorOtro = this.servicio.filter(serv => condicionTerapeuta(serv)
        && condicionEncargada(serv) && condicionFormaPago(serv)
        && condicionBuscar(serv) && condicionEntreFechas(serv))
      this.totalValorAOtros = valorOtro.reduce((accumulator, serv) => {
        return accumulator + serv.numberOtro
      }, 0)

      // Filter by Valor Bebida
      const valorBebida = this.servicio.filter(serv => condicionTerapeuta(serv)
        && condicionEncargada(serv) && condicionFormaPago(serv)
        && condicionBuscar(serv) && condicionEntreFechas(serv))
      this.TotalValorBebida = valorBebida.reduce((accumulator, serv) => {
        return accumulator + serv.bebidas
      }, 0)

      // Filter by Valor Tabaco
      const valorTabaco = this.servicio.filter(serv => condicionTerapeuta(serv)
        && condicionEncargada(serv) && condicionFormaPago(serv)
        && condicionBuscar(serv) && condicionEntreFechas(serv))
      this.TotalValorTabaco = valorTabaco.reduce((accumulator, serv) => {
        return accumulator + serv.tabaco
      }, 0)

      // Filter by Valor Vitamina
      const valorVitamina = this.servicio.filter(serv => condicionTerapeuta(serv)
        && condicionEncargada(serv) && condicionFormaPago(serv)
        && condicionBuscar(serv) && condicionEntreFechas(serv))
      this.totalValorVitaminas = valorVitamina.reduce((accumulator, serv) => {
        return accumulator + serv.vitaminas
      }, 0)

      // Filter by Valor Propina
      const valorPropina = this.servicio.filter(serv => condicionTerapeuta(serv)
        && condicionEncargada(serv) && condicionFormaPago(serv)
        && condicionBuscar(serv) && condicionEntreFechas(serv))
      this.totalValorPropina = valorPropina.reduce((accumulator, serv) => {
        return accumulator + serv.propina
      }, 0)

      // Filter by Valor Total
      const valorTotal = this.servicio.filter(serv => condicionTerapeuta(serv)
        && condicionEncargada(serv) && condicionFormaPago(serv)
        && condicionBuscar(serv) && condicionEntreFechas(serv))
      this.totalValor = valorTotal.reduce((accumulator, serv) => {
        return accumulator + serv.totalServicio
      }, 0)


      // Filter by Valor Propina
      const valorOtros = this.servicio.filter(serv => condicionTerapeuta(serv)
        && condicionEncargada(serv) && condicionFormaPago(serv)
        && condicionBuscar(serv) && condicionEntreFechas(serv))
      this.totalValorOtroServ = valorOtros.reduce((accumulator, serv) => {
        return accumulator + serv.otros
      }, 0)
    }
  }

  sumaTotalServicios() {
    const totalServ = this.servicio.map(({ servicio }) => servicio).reduce((acc, value) => acc + value, 0)
    this.totalServicio = totalServ

    const totalPisos = this.servicio.map(({ numberPiso1 }) => numberPiso1).reduce((acc, value) => acc + value, 0)
    this.totalPiso = totalPisos

    const totalPisos2 = this.servicio.map(({ numberPiso2 }) => numberPiso2).reduce((acc, value) => acc + value, 0)
    this.totalPiso2 = totalPisos2

    const totalTera = this.servicio.map(({ numberTerap }) => numberTerap).reduce((acc, value) => acc + value, 0)
    this.totalValorTerapeuta = totalTera

    const totalEncarg = this.servicio.map(({ numberEncarg }) => numberEncarg).reduce((acc, value) => acc + value, 0)
    this.totalValorEncargada = totalEncarg

    const totalOtr = this.servicio.map(({ numberOtro }) => numberOtro).reduce((acc, value) => acc + value, 0)
    this.totalValorAOtros = totalOtr

    const totalValorBebida = this.servicio.map(({ bebidas }) => bebidas).reduce((acc, value) => acc + value, 0)
    this.TotalValorBebida = totalValorBebida

    const totalValorTab = this.servicio.map(({ tabaco }) => tabaco).reduce((acc, value) => acc + value, 0)
    this.TotalValorTabaco = totalValorTab

    const totalValorVitamina = this.servicio.map(({ vitaminas }) => vitaminas).reduce((acc, value) => acc + value, 0)
    this.totalValorVitaminas = totalValorVitamina

    const totalValorProp = this.servicio.map(({ propina }) => propina).reduce((acc, value) => acc + value, 0)
    this.totalValorPropina = totalValorProp

    const totalValorOtroServicio = this.servicio.map(({ otros }) => otros).reduce((acc, value) => acc + value, 0)
    this.totalValorOtroServ = totalValorOtroServicio

    const totalvalors = this.servicio.map(({ totalServicio }) => totalServicio).reduce((acc, value) => acc + value, 0)
    this.totalValor = totalvalors
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

  exportTableToExcel() {
    let element = document.getElementById('excel-table')
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element)
    const wb: XLSX.WorkBook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1')
    XLSX.writeFile(wb, this.fileName)
  }

  editamos(id: string) {
    this.router.navigate([`menu/${this.idUser['id']}/nuevo-servicio/${id}/true`])
  }
}