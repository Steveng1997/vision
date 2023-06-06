import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LoginService } from 'src/app/core/services/login';
import { ServicioService } from 'src/app/core/services/servicio';
import { TrabajadoresService } from 'src/app/core/services/trabajadores';

@Component({
  selector: 'app-terapeutas',
  templateUrl: './terapeutas.component.html',
  styleUrls: ['./terapeutas.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class TerapeutasComponent implements OnInit {

  liqTep: boolean;
  addTerap: boolean;
  filtredBusqueda: string;
  servicio: any;
  page!: number;

  // Encargada
  encargada: any[] = [];
  selectedEncargada: string;

  // Terapeuta
  terapeuta: any[] = [];
  selectedTerapeuta: string;

  // Fecha
  fechaInicio: string;
  fechaFinal: string;

  // Servicios

  totalServicio: number;
  totalValorPropina: number;
  totalValorTerapeuta: number;
  TotalValorBebida: number;
  TotalValorTabaco: number;
  totalValorVitaminas: number;
  totalValorOtroServ: number;

  constructor(
    public router: Router,
    public trabajadorService: TrabajadoresService,
    public servicioService: ServicioService,
    public fb: FormBuilder,
    public loginService: LoginService,
    private activeRoute: ActivatedRoute,
    private modalService: NgbModal,
  ) { }

  formTemplate = new FormGroup({
    fechaInicio: new FormControl(''),
    FechaFin: new FormControl(''),
    terapeuta: new FormControl(''),
    encargada: new FormControl(''),
    busqueda: new FormControl(''),
  });

  ngOnInit(): void {
    this.liqTep = true;
    this.addTerap = false;
    this.getServicio();
    this.getEncargada();
    this.getTerapeuta();
  }

  getServicio() {
    this.servicioService.getByLiquidFalse().subscribe((datoServicio) => {
      this.servicio = datoServicio;
      if (datoServicio.length != 0) {
        this.sumaTotalServicios();
      }
    })
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

  addLiquidacion() {
    this.liqTep = false;
    this.addTerap = true
  }

  sumaTotalServicios() {
    const totalServ = this.servicio.map(({ servicio }) => servicio).reduce((acc, value) => acc + value);
    this.totalServicio = totalServ;

    const totalValorProp = this.servicio.map(({ propina }) => propina).reduce((acc, value) => acc + value);
    this.totalValorPropina = totalValorProp;

    const totalTera = this.servicio.map(({ numberTerap }) => numberTerap).reduce((acc, value) => acc + value);
    this.totalValorTerapeuta = totalTera;

    const totalValorBebida = this.servicio.map(({ bebidas }) => bebidas).reduce((acc, value) => acc + value);
    this.TotalValorBebida = totalValorBebida;

    const totalValorTab = this.servicio.map(({ tabaco }) => tabaco).reduce((acc, value) => acc + value);
    this.TotalValorTabaco = totalValorTab;

    const totalValorVitamina = this.servicio.map(({ vitaminas }) => vitaminas).reduce((acc, value) => acc + value);
    this.totalValorVitaminas = totalValorVitamina;

    const totalValorOtroServicio = this.servicio.map(({ otros }) => otros).reduce((acc, value) => acc + value);
    this.totalValorOtroServ = totalValorOtroServicio;
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

  calcularSumaDeServicios() {
    const condicionTerapeuta = serv => {
      return (this.selectedTerapeuta) ? serv.terapeuta === this.selectedTerapeuta : true
    }

    const condicionEncargada = serv => {
      return (this.selectedEncargada) ? serv.encargada === this.selectedEncargada : true
    }

    // Filter by servicio
    const servicios = this.servicio.filter(serv => condicionTerapeuta(serv)
      && condicionEncargada(serv))
    this.totalServicio = servicios.reduce((accumulator, serv) => {
      return accumulator + serv.servicio;
    }, 0)

    // Filter by Propina
    const propinas = this.servicio.filter(serv => condicionTerapeuta(serv)
      && condicionEncargada(serv))
    this.totalValorPropina = propinas.reduce((accumulator, serv) => {
      return accumulator + serv.propina;
    }, 0)

    // Filter by Pago
    const terapeuta = this.servicio.filter(serv => condicionTerapeuta(serv)
      && condicionEncargada(serv))
    this.totalValorTerapeuta = terapeuta.reduce((accumulator, serv) => {
      return accumulator + serv.numberTerap;
    }, 0)

    // Filter by Bebida
    const bebida = this.servicio.filter(serv => condicionTerapeuta(serv)
      && condicionEncargada(serv))
    this.TotalValorBebida = bebida.reduce((accumulator, serv) => {
      return accumulator + serv.bebidas;
    }, 0)

    // Filter by Tabaco
    const tabac = this.servicio.filter(serv => condicionTerapeuta(serv)
      && condicionEncargada(serv))
    this.TotalValorTabaco = tabac.reduce((accumulator, serv) => {
      return accumulator + serv.tabaco;
    }, 0)

    // Filter by Vitamina
    const vitamina = this.servicio.filter(serv => condicionTerapeuta(serv)
      && condicionEncargada(serv))
    this.totalValorVitaminas = vitamina.reduce((accumulator, serv) => {
      return accumulator + serv.vitaminas;
    }, 0)

    // Filter by Vitamina
    const otroServicio = this.servicio.filter(serv => condicionTerapeuta(serv)
      && condicionEncargada(serv))
    this.totalValorOtroServ = otroServicio.reduce((accumulator, serv) => {
      return accumulator + serv.otros;
    }, 0)
  }
}
