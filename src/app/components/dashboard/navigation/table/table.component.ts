import { Component, OnInit, ɵbypassSanitizationTrustResourceUrl } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { Service } from 'src/app/core/services/service'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'
import * as XLSX from 'xlsx'
import Swal from 'sweetalert2'

// Service
import { ServiceTherapist } from 'src/app/core/services/therapist'
import { FormBuilder, FormControl, FormGroup } from '@angular/forms'
import { ServiceManager } from 'src/app/core/services/manager'


@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})

export class TableComponent implements OnInit {

  fechaInicio: string
  fechaFinal: string
  filtredBusqueda: string
  page!: number

  // Terapeuta
  terapeuta: any
  selectedTerapeuta: string

  // Encargada
  manager: any
  selectedEncargada: string
  selectedFormPago: string

  servicio: any
  horario: any

  fileName = 'tabla.xlsx'
  idUser: number

  administratorRole: boolean = false

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
    public serviceTherapist: ServiceTherapist,
    public service: Service,
    public fb: FormBuilder,
    private modalService: NgbModal,
    public serviceManager: ServiceManager,
    private activeRoute: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    document.getElementById('idTitulo').style.display = 'block'
    document.getElementById('idTitulo').innerHTML = 'TABLA'

    this.selectedTerapeuta = ""
    this.selectedEncargada = ""
    this.selectedFormPago = ""
    
    const params = this.activeRoute.snapshot.params;
    this.idUser = Number(params['id'])

    if (this.idUser) {
      this.serviceManager.getById(this.idUser).subscribe((rp) => {
        if (rp[0]['rol'] == 'administrador') {
          this.administratorRole = true
          this.getManager()
        } else {
          this.manager = rp
          this.selectedEncargada = this.manager[0].nombre
        }
      })
    }

    this.getTherapist()
    this.getServices()
    this.emptyTotals()
  }

  emptyTotals() {
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

  getServices() {
    this.service.getServicio().subscribe((datoServicio: any) => {
      this.servicio = datoServicio
      if (datoServicio.length != 0) {
        this.totalSumOfServices()
      }
    })
  }

  filters() {
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

    this.calculateSumOfServices()
  }

  calculateSumOfServices() {

    const therapistCondition = serv => {
      return (this.selectedTerapeuta) ? serv.terapeuta === this.selectedTerapeuta : true
    }

    const managerCondition = serv => {
      return (this.selectedEncargada) ? serv.encargada === this.selectedEncargada : true
    }

    const conditionMethodOfPayment = serv => {
      return (this.selectedFormPago) ? serv.formaPago === this.selectedFormPago : true
    }

    const conditionBetweenDates = serv => {
      if (this.fechaInicio === undefined && this.fechaFinal === undefined) return true
      if (this.fechaInicio === undefined && serv.fecha <= this.fechaFinal) return true
      if (this.fechaFinal === undefined && serv.fecha === this.fechaInicio) return ɵbypassSanitizationTrustResourceUrl
      if (serv.fecha >= this.fechaInicio && serv.fecha <= this.fechaFinal) return true

      return false
    }

    const searchCondition = serv => {
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
      const servicios = this.servicio.filter(serv => therapistCondition(serv)
        && managerCondition(serv) && conditionMethodOfPayment(serv)
        && searchCondition(serv) && conditionBetweenDates(serv))
      this.totalServicio = servicios.reduce((accumulator, serv) => {
        return accumulator + serv.servicio
      }, 0)

      // Filter by Pisos
      const pisoss = this.servicio.filter(serv => therapistCondition(serv)
        && managerCondition(serv) && conditionMethodOfPayment(serv)
        && searchCondition(serv) && conditionBetweenDates(serv))
      this.totalPiso = pisoss.reduce((accumulator, serv) => {
        return accumulator + serv.numberPiso1
      }, 0)

      // Filter by Pisos
      const pisos2 = this.servicio.filter(serv => therapistCondition(serv)
        && managerCondition(serv) && conditionMethodOfPayment(serv)
        && searchCondition(serv) && conditionBetweenDates(serv))
      this.totalPiso2 = pisoss.reduce((accumulator, serv) => {
        return accumulator + serv.numberPiso2
      }, 0)

      // Filter by Terapeuta
      const terapeuta = this.servicio.filter(serv => therapistCondition(serv)
        && managerCondition(serv) && conditionMethodOfPayment(serv)
        && searchCondition(serv) && conditionBetweenDates(serv))
      this.totalValorTerapeuta = terapeuta.reduce((accumulator, serv) => {
        return accumulator + serv.numberTerap
      }, 0)

      // Filter by Encargada
      const encargada = this.servicio.filter(serv => therapistCondition(serv)
        && managerCondition(serv) && conditionMethodOfPayment(serv)
        && searchCondition(serv) && conditionBetweenDates(serv))
      this.totalValorEncargada = encargada.reduce((accumulator, serv) => {
        return accumulator + serv.numberEncarg
      }, 0)

      // Filter by Valor Otro
      const valorOtro = this.servicio.filter(serv => therapistCondition(serv)
        && managerCondition(serv) && conditionMethodOfPayment(serv)
        && searchCondition(serv) && conditionBetweenDates(serv))
      this.totalValorAOtros = valorOtro.reduce((accumulator, serv) => {
        return accumulator + serv.numberOtro
      }, 0)

      // Filter by Valor Bebida
      const valorBebida = this.servicio.filter(serv => therapistCondition(serv)
        && managerCondition(serv) && conditionMethodOfPayment(serv)
        && searchCondition(serv) && conditionBetweenDates(serv))
      this.TotalValorBebida = valorBebida.reduce((accumulator, serv) => {
        return accumulator + serv.bebidas
      }, 0)

      // Filter by Valor Tabaco
      const valorTabaco = this.servicio.filter(serv => therapistCondition(serv)
        && managerCondition(serv) && conditionMethodOfPayment(serv)
        && searchCondition(serv) && conditionBetweenDates(serv))
      this.TotalValorTabaco = valorTabaco.reduce((accumulator, serv) => {
        return accumulator + serv.tabaco
      }, 0)

      // Filter by Valor Vitamina
      const valorVitamina = this.servicio.filter(serv => therapistCondition(serv)
        && managerCondition(serv) && conditionMethodOfPayment(serv)
        && searchCondition(serv) && conditionBetweenDates(serv))
      this.totalValorVitaminas = valorVitamina.reduce((accumulator, serv) => {
        return accumulator + serv.vitaminas
      }, 0)

      // Filter by Valor Propina
      const valorPropina = this.servicio.filter(serv => therapistCondition(serv)
        && managerCondition(serv) && conditionMethodOfPayment(serv)
        && searchCondition(serv) && conditionBetweenDates(serv))
      this.totalValorPropina = valorPropina.reduce((accumulator, serv) => {
        return accumulator + serv.propina
      }, 0)

      // Filter by Valor Total
      const valorTotal = this.servicio.filter(serv => therapistCondition(serv)
        && managerCondition(serv) && conditionMethodOfPayment(serv)
        && searchCondition(serv) && conditionBetweenDates(serv))
      this.totalValor = valorTotal.reduce((accumulator, serv) => {
        return accumulator + serv.totalServicio
      }, 0)


      // Filter by Valor Propina
      const valorOtros = this.servicio.filter(serv => therapistCondition(serv)
        && managerCondition(serv) && conditionMethodOfPayment(serv)
        && searchCondition(serv) && conditionBetweenDates(serv))
      this.totalValorOtroServ = valorOtros.reduce((accumulator, serv) => {
        return accumulator + serv.otros
      }, 0)
    }
  }

  totalSumOfServices() {
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

  getTherapist() {
    this.serviceTherapist.getAllTerapeuta().subscribe((datosTerapeuta) => {
      this.terapeuta = datosTerapeuta
    })
  }

  getManager() {
    this.serviceManager.getUsuarios().subscribe((datosEncargada) => {
      this.manager = datosEncargada
    })
  }

  notes(targetModal, modal) {
    var notaMensaje = []
    this.service.getById(targetModal).subscribe((rp) => {
      notaMensaje = rp[0]

      if (notaMensaje['nota'] != '')
        this.modalService.open(modal, {
          centered: true,
          backdrop: 'static',
        })
    })
  }

  exportExcel() {
    let element = document.getElementById('excel-table')
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element)
    const wb: XLSX.WorkBook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1')
    XLSX.writeFile(wb, this.fileName)
  }

  editForm(id: string) {
    this.router.navigate([`menu/${this.idUser}/nuevo-servicio/${id}/true`])
  }

  deleteService() {
    Swal.fire({
      title: '¿Deseas eliminar el registro?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Deseo eliminar!'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: '¿Estas seguro de eliminar?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Si, Deseo eliminar!'
        }).then((result) => {
          this.service.getEncargada(this.selectedEncargada).subscribe((rp: any) => {
            for (let i = 0; rp.length; i++) {
              this.service.deleteServicio(rp[i].id).subscribe((rp: any) => { })
            }
          })
          Swal.fire({ position: 'top-end', icon: 'success', title: '¡Eliminado Correctamente!', showConfirmButton: false, timer: 2500 })
        })
      }
    })
  }
}