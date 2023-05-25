import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormControl } from '@angular/forms';
import Swal from 'sweetalert2';

// Service
import { TrabajadoresService } from 'src/app/core/services/trabajadores';
import { ServicioService } from 'src/app/core/services/servicio';

@Component({
  selector: 'app-nuevo-servicio',
  templateUrl: './nuevo-servicio.component.html',
  styleUrls: ['./nuevo-servicio.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class NuevoServicioComponent implements OnInit {
  
  terapeuta: any[] = [];
  encargada: any[] = [];

  chageDate = '';


  formTemplate = new FormGroup({
    terapeuta: new FormControl(''),
    encargada: new FormControl(''),
    cliente: new FormControl(''),
    fecha: new FormControl(''),
    hora: new FormControl(''),
    minuto: new FormControl(''),
    efectPiso1: new FormControl(''),
    bizuPiso1: new FormControl(''),
    tarjPiso1: new FormControl(''),
    transPiso1: new FormControl(''),
    efectPiso2: new FormControl(''),
    bizuPiso2: new FormControl(''),
    tarjPiso2: new FormControl(''),
    transPiso2: new FormControl(''),
    efectTerap: new FormControl(''),
    bizuTerap: new FormControl(''),
    tarjTerap: new FormControl(''),
    transTerap: new FormControl(''),
    efectEncarg: new FormControl(''),
    bizuEncarg: new FormControl(''),
    tarjEncarg: new FormControl(''),
    transEncarg: new FormControl(''),
    efectOtro: new FormControl(''),
    bizuOtro: new FormControl(''),
    tarjOtro: new FormControl(''),
    transOtro: new FormControl(''),
    numberPiso1: new FormControl(''),
    numberPiso2: new FormControl(''),
    numberTerap: new FormControl(''),
    numberEncarg: new FormControl(''),
    numberOtro: new FormControl(''),
    nota: new FormControl('')
  });

  constructor(
    public router: Router,
    public trabajadorService: TrabajadoresService,
    public servicioService: ServicioService,
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

  isDisabled(date: NgbDateStruct, current: { month: number }) {
    return date.month !== current.month;
  }

  changeFecha(event) {
    this.chageDate = event.target.value.substring(5,10)
  }

  addServicio(formValue) {
    if (this.formTemplate.value.terapeuta != '') {
      if (this.formTemplate.value.encargada != '') {
        this.formTemplate.value.fecha = this.formTemplate.value.fecha.substring(5,10);
        (this.formTemplate.value.fecha);
        this.servicioService.registerServicio(formValue).then((rp) => {
          console.log(rp)
          if (rp) {
            Swal.fire({
              position: 'top-end',
              icon: 'success',
              title: '¡Insertado Correctamente!',
              showConfirmButton: false,
              timer: 2500,
            });
          }
        })

      } else {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'No hay ninguna encargada seleccionada',
        });
      }

    } else {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'No hay ninguna terapeuta seleccionada',
      });
    }
  }

  efectPisoo1() {
    console.log(this.efectPisoo1)
  }
}
