import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ServicioService } from 'src/app/core/services/servicio';
import * as moment from 'moment';

moment().format();

// Service
import { TrabajadoresService } from 'src/app/core/services/trabajadores';

@Component({
  selector: 'app-tabla',
  templateUrl: './tabla.component.html',
  styleUrls: ['./tabla.component.css']
})
export class TablaComponent implements OnInit {

  selectedValue: string;
  selectedCar: string;
  page!: number;

  DateStart = new Date(1990, 0, 1);
  DateEnd = new Date(1990, 0, 1);

  // Terapeuta

  terapeuta: any[] = [];
  selectedTerapeuta: string;

  // Encargada

  encargada: any[] = [];
  selectedEncargada: string;

  servicio: any[] = [];
  horario: any[] = []

  constructor(
    public router: Router,
    public trabajadorService: TrabajadoresService,
    public servicioService: ServicioService
  ) { }

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

  filterTerapeuta() {
    this.servicio = this.terapeuta.filter((x) => x.nombre === this.selectedTerapeuta);

    this.servicioService.getTerapeuta(this.selectedTerapeuta).then((datosTerapeuta) => {
      this.servicio = datosTerapeuta;
    });
  }

  filterEncargada() {
    this.servicio = this.encargada.filter((x) => x.nombre === this.selectedEncargada);

    this.servicioService.getEncargada(this.selectedEncargada).then((datosEncargada) => {
      this.servicio = datosEncargada;
    });
  }
}