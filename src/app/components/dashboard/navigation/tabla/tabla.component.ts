import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ServicioService } from 'src/app/core/services/servicio';
// import * as moment from 'moment';

// moment().format();

// Service
import { TrabajadoresService } from 'src/app/core/services/trabajadores';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-tabla',
  templateUrl: './tabla.component.html',
  styleUrls: ['./tabla.component.css']
})

export class TablaComponent implements OnInit {

  fechaInicio: string;
  FechaFin: string;

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

  servicio: any;
  horario: any[] = []

  formTemplate = new FormGroup({
    fechaInicio: new FormControl(''),
    FechaFin: new FormControl(''),
    terapeuta: new FormControl(''),
    encargada: new FormControl(''),
  });

  constructor(
    public router: Router,
    public trabajadorService: TrabajadoresService,
    public servicioService: ServicioService,
    public fb: FormBuilder
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
    this.trabajadorService.getAllEncargada().subscribe((datosEncargada) => {
      this.encargada = datosEncargada;
    });
  }

  // filterEncargada() {
  //   this.servicio = this.encargada.filter((x) => x.nombre === this.selectedEncargada);

  //   this.servicioService.getEncargada(this.selectedEncargada).then((datosEncargada) => {
  //     this.servicio = datosEncargada;
  //   });
  // }

  dateStart(event: any){
    this.fechaInicio = event.target.value.substring(5,10)
  }

  dateEnd(event: any){
    this.FechaFin = event.target.value.substring(5,10)
  }
}