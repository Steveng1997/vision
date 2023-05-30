import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ServicioService } from 'src/app/core/services/servicio';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

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
    public loginService: LoginService
  ) {
  }

  ngOnInit(): void {
    this.getServicio();
    this.getEncargada();
    this.getTerapeuta();
  }

  getServicio() {
    this.servicioService.getServicio().subscribe((datoServicio) => {
      this.servicio = datoServicio;
    });
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
}