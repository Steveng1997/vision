import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

// Service
import { TrabajadoresService } from 'src/app/core/services/trabajadores';

interface Food {
  value: string;
  viewValue: string;
}

interface Car {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-tabla',
  templateUrl: './tabla.component.html',
  styleUrls: ['./tabla.component.css']
})
export class TablaComponent implements OnInit {

  selectedValue: string;
  selectedCar: string;

  DateStart = new Date(1990, 0, 1);
  DateEnd = new Date(1990, 0, 1);

  foods: Food[] = [
    { value: 'steak-0', viewValue: 'Steak' },
    { value: 'pizza-1', viewValue: 'Pizza' },
    { value: 'tacos-2', viewValue: 'Tacos' },
  ];

  cars: Car[] = [
    { value: 'volvo', viewValue: 'Volvo' },
    { value: 'saab', viewValue: 'Saab' },
    { value: 'mercedes', viewValue: 'Mercedes' },
  ];

  selectedStates = this.foods;

  displayedColumns: string[] = ['value', 'viewValue'];
  dataSource = this.foods;

  // Terapeuta

  terapeuta: any[] = [];
  selectedTerapeuta: string;

  // Encargada

  encargada: any[] = [];
  selectedEncargada: string;

  constructor(
    public router: Router,
    public trabajadorService: TrabajadoresService
  ) { }

  ngOnInit(): void {
    this.getEncargada();
    this.getTerapeuta();
  }

  onKey(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.selectedStates = this.search(filterValue);
  }

  search(value: string) {
    let filter = value.toLowerCase();
    return this.foods.filter(option => option.value.toLowerCase().startsWith(filter));
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
}