import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ServicioService } from 'src/app/core/services/servicio';
import * as moment from 'moment';

moment().format();

// Service
import { TrabajadoresService } from 'src/app/core/services/trabajadores';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-tabla',
  templateUrl: './tabla.component.html',
  styleUrls: ['./tabla.component.css']
})

export class TablaComponent implements OnInit {

  fechaInicial: any[] = [];
  fechaFinal: any[] = [];
  StartDate: any;
  EndDate: any;

  selectedValue: string;
  selectedCar: string;
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
    StartDate: new FormControl(''),
    EndDate: new FormControl(''),
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

  filterFechaInicio(event) {
    const fechaInicio = event.target.value.substring(5, 10);
    this.servicioService.getFecha(fechaInicio).then((datoDechaInicio) => {
      this.servicio = datoDechaInicio
      this.fechaInicial = datoDechaInicio;
    })
  }

  doSumalt() {
    debugger
    const fechaHoy = new Date();
    const todayDate = Date.now();
    const hoy = new Date(todayDate).toLocaleDateString();


    const fechaChangeInicial = this.formTemplate.value.StartDate.substring(5, 10);
    const fechaChangeFinal = this.formTemplate.value.EndDate.substring(5, 10);
    this.servicio.forEach(element => {

      if (element.fecha == '') {

        // if (fechaChangeInicial && fechaChangeFinal) {
          this.servicioService.getFechaInicialAndFinal(fechaChangeInicial, fechaChangeInicial).then((datoFechaFin) => {
            this.servicio = datoFechaFin
          })
        // }
      }
    })
  }

  filterFechaFin(event) {
    const fechaFin = event.target.value.substring(5, 10);
    this.servicioService.getFecha(fechaFin).then((datoFechaFin) => {
      this.servicio = datoFechaFin
    })
  }

  busqueda(event: any) {
    debugger
    this.servicio = this.encargada.filter((x) => x.nombre === event.target.value);

    console.log(event.target.value)

    if (event.target.value != "") {
      this.servicioService.getTerapeuta(event.target.value).then((datosTerapeuta) => {
        this.servicio = datosTerapeuta;
      });
    } else {
      this.servicioService.getServicio().subscribe((datoServicio) => {
        this.servicio = datoServicio;
      });
    }


  }
}