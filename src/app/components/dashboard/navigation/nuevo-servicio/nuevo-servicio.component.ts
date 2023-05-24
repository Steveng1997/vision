import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
// Service
import { TrabajadoresService } from 'src/app/core/services/trabajadores';

@Component({
  selector: 'app-nuevo-servicio',
  templateUrl: './nuevo-servicio.component.html',
  styleUrls: ['./nuevo-servicio.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class NuevoServicioComponent implements OnInit {

  // Checkbox
  opcion1=false;

  date = new Date();
  time: Date = new Date();
  model: NgbDateStruct;

  // Terapeuta

  terapeuta: any[] = [];
  selectedTerapeuta: string;

  // Encargada

  encargada: any[] = [];
  selectedEncargada: string;

  especialDates: NgbDateStruct[] = [
    { year: 2018, month: 6, day: 1 },
    { year: 2018, month: 6, day: 10 }]

  constructor(
    public router: Router,
    public trabajadorService: TrabajadoresService
  ) { }

  ngOnInit(): void {
    this.getEncargada();
    this.getTerapeuta();
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

  myClass(date: NgbDateStruct) {
    let isSelected = this.especialDates
      .find(d => d.year == date.year && d.month == date.month && d.day == date.day)
    return isSelected ? 'classSelected' : 'classNormal'
  }

  isWeekend(date: NgbDateStruct) {
    const d = new Date(date.year, date.month - 1, date.day);
    return d.getDay() === 0 || d.getDay() === 6;
  }

  isDisabled(date: NgbDateStruct, current: { month: number }) {
    return date.month !== current.month;
  }


  cambio(event) {
    var respuesta = event.checked
    console.log(respuesta)
  }
}
