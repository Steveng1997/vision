import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ServicioService } from 'src/app/core/services/servicio';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as XLSX from 'xlsx';

// Service
import { TrabajadoresService } from 'src/app/core/services/trabajadores';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { LoginService } from 'src/app/core/services/login';


@Component({
  selector: 'app-tabla',
  templateUrl: './tabla.component.html',
  styleUrls: ['./tabla.component.css']
})

export class TablaComponent implements OnInit {

  fechaInicio: string;
  fechaFinal: string;

  filtredBusqueda: string;

  page!: number;

  prestamosArray: any[] = [];
  equiposArray: any[] = [];

  // Terapeuta

  terapeuta: any[] = [];
  selectedTerapeuta: string;

  // Encargada

  encargada: any[] = [];
  selectedEncargada: string;
  selectedFormPago: string;

  servicio: any;
  horario: any[] = []

  fileName = 'tabla.xlsx'
  idUser: string;

  // Servicios
  totalServicio: number;
  totalValorTerapeuta: number;
  totalValorEncargada: number;
  totalValorAOtros: number;
  TotalValorBebida: number;
  TotalValorTabaco: number;
  totalValorVitaminas: number;
  totalValorPropina: number;
  totalValorOtroServ: number;

  formTemplate = new FormGroup({
    fechaInicio: new FormControl(''),
    FechaFin: new FormControl(''),
    terapeuta: new FormControl(''),
    encargada: new FormControl(''),
    busqueda: new FormControl(''),
  });

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
    this.idUser = this.activeRoute.snapshot.paramMap.get('id');
    this.loginService.getById(this.idUser).then((rp) => {
      this.idUser = rp[0]
    })
    this.getServicio();
    this.getEncargada();
    this.getTerapeuta();
  }

  getServicio() {
    this.servicioService.getServicio().subscribe((datoServicio) => {
      this.servicio = datoServicio;
      if (datoServicio.length != 0) {
        this.sumaTotalServicios();
      }
    })
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

    const condicionFechaInicio = serv => {
      return (this.fechaInicio) ? serv.fechaHoyInicio === this.fechaInicio : true
    }

    const condicionBuscar = serv => {
      debugger
      if (!this.filtredBusqueda) return true
      return (serv.terapeuta.match(this.filtredBusqueda)
        || serv.encargada.match(this.filtredBusqueda)
        || serv.formaPago.match(this.filtredBusqueda)
        || serv.servicio.match(this.filtredBusqueda)
        || serv.cliente.match(this.filtredBusqueda)) ? true : false
    }

    // Filter by Servicio
    const servicios = this.servicio.filter(serv => condicionTerapeuta(serv)
      && condicionEncargada(serv) && condicionFormaPago(serv)
      && condicionBuscar(serv))
    this.totalServicio = servicios.reduce((accumulator, serv) => {
      return accumulator + serv.servicio;
    }, 0)
  }

  sumaTotalServicios() {
    const totalServ = this.servicio.map(({ servicio }) => servicio).reduce((acc, value) => acc + value, 0);
    this.totalServicio = totalServ;

    const totalTera = this.servicio.map(({ numberTerap }) => numberTerap).reduce((acc, value) => acc + value, 0);
    this.totalValorTerapeuta = totalTera;

    const totalEncarg = this.servicio.map(({ numberEncarg }) => numberEncarg).reduce((acc, value) => acc + value, 0);
    this.totalValorEncargada = totalEncarg;

    const totalOtr = this.servicio.map(({ numberOtro }) => numberOtro).reduce((acc, value) => acc + value, 0);
    this.totalValorAOtros = totalOtr;

    const totalValorBebida = this.servicio.map(({ bebidas }) => bebidas).reduce((acc, value) => acc + value, 0);
    this.TotalValorBebida = totalValorBebida;

    const totalValorTab = this.servicio.map(({ tabaco }) => tabaco).reduce((acc, value) => acc + value, 0);
    this.TotalValorTabaco = totalValorTab;

    const totalValorVitamina = this.servicio.map(({ vitaminas }) => vitaminas).reduce((acc, value) => acc + value, 0);
    this.totalValorVitaminas = totalValorVitamina;

    const totalValorProp = this.servicio.map(({ propina }) => propina).reduce((acc, value) => acc + value, 0);
    this.totalValorPropina = totalValorProp;

    const totalValorOtroServicio = this.servicio.map(({ otros }) => otros).reduce((acc, value) => acc + value, 0);
    this.totalValorOtroServ = totalValorOtroServicio;
  }

  getTerapeuta() {
    this.trabajadorService.getAllTerapeuta().subscribe((datosTerapeuta) => {
      this.terapeuta = datosTerapeuta;
    });
  }

  getEncargada() {
    this.loginService.getUsuarios().subscribe((datosEncargada) => {
      this.encargada = datosEncargada;
    });
  }

  dateStart(event: any) {
    this.fechaInicio = event.target.value;
  }

  dateEnd(event: any) {
    this.fechaFinal = event.target.value
  }

  busqueda(event: any) {
    this.filtredBusqueda = event.replace(/(^\w{1})|(\s+\w{1})/g, letra => letra.toUpperCase());
  }

  notas(targetModal, modal) {
    var notaMensaje = [];
    this.servicioService.getById(targetModal).then((datoServicio) => {
      notaMensaje = datoServicio[0];

      if (notaMensaje['nota'] != '')
        this.modalService.open(modal, {
          centered: true,
          backdrop: 'static',
        });
    });
  }

  exportTableToExcel() {
    let element = document.getElementById('excel-table')
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element)
    const wb: XLSX.WorkBook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1')
    XLSX.writeFile(wb, this.fileName)
  }

  editamos(id: string) {
    this.router.navigate([
      `menu/${this.idUser['id']}/nuevo-servicio/${id}`,
    ]);
  }
}