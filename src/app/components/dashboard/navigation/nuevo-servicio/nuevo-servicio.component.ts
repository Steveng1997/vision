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

  fechaActual = new Date();
  horaInicio = new Date();

  terapeuta: any[] = [];
  encargada: any[] = [];

  chageDate = '';
  formaPago: string = '';

  horaFin = '';

  formTemplate = new FormGroup({
    terapeuta: new FormControl(''),
    encargada: new FormControl(''),
    cliente: new FormControl(''),
    fecha: new FormControl(''),
    hora: new FormControl(''),
    minuto: new FormControl(''),
    efectPiso1: new FormControl(false),
    bizuPiso1: new FormControl(false),
    tarjPiso1: new FormControl(false),
    transPiso1: new FormControl(false),
    efectPiso2: new FormControl(false),
    bizuPiso2: new FormControl(false),
    tarjPiso2: new FormControl(false),
    transPiso2: new FormControl(false),
    efectTerap: new FormControl(false),
    bizuTerap: new FormControl(false),
    tarjTerap: new FormControl(false),
    transTerap: new FormControl(false),
    efectEncarg: new FormControl(false),
    bizuEncarg: new FormControl(false),
    tarjEncarg: new FormControl(false),
    transEncarg: new FormControl(false),
    efectOtro: new FormControl(false),
    bizuOtro: new FormControl(false),
    tarjOtro: new FormControl(false),
    transOtro: new FormControl(false),
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
    this.chageDate = event.target.value.substring(5, 10)
  }

  addServicio(formValue) {
    if (this.formTemplate.value.terapeuta != '') {
      if (this.formTemplate.value.encargada != '') {
        this.formTemplate.value.fecha = this.formTemplate.value.fecha.substring(5, 10);
        (this.formTemplate.value.fecha);
        this.llenarFormaPago()
        this.servicioService.registerServicio(formValue, this.formaPago).then((rp) => {
          if (rp) {
            Swal.fire({
              position: 'top-end',
              icon: 'success',
              title: '¡Insertado Correctamente!',
              showConfirmButton: false,
              timer: 2500,
            });
          }
          localStorage.clear();
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

  efectCheckToggle(event: any) {
    if (event) {
      localStorage.setItem('Efectivo', 'Efectivo')

      return
    }

    if (!this.formTemplate.value.efectPiso1 &&
      !this.formTemplate.value.efectPiso2 &&
      !this.formTemplate.value.efectTerap &&
      !this.formTemplate.value.efectEncarg &&
      !this.formTemplate.value.efectOtro) {
      localStorage.removeItem('Efectivo')
    }
  }

  bizumCheckToggle(event: any) {
    if (event) {
      localStorage.setItem('Bizum', 'Bizum')

      return
    }

    if (!this.formTemplate.value.bizuPiso1 &&
      !this.formTemplate.value.bizuPiso2 &&
      !this.formTemplate.value.bizuTerap &&
      !this.formTemplate.value.bizuEncarg &&
      !this.formTemplate.value.bizuOtro) {
      localStorage.removeItem('Bizum')
    }
  }

  tarjCheckToggle(event: any) {
    if (event) {
      localStorage.setItem('Tarjeta', 'Tarjeta')

      return
    }

    if (!this.formTemplate.value.tarjPiso1 &&
      !this.formTemplate.value.tarjPiso2 &&
      !this.formTemplate.value.tarjTerap &&
      !this.formTemplate.value.tarjEncarg &&
      !this.formTemplate.value.tarjOtro) {
      localStorage.removeItem('Tarjeta')
    }
  }

  transCheckToggle(event: any) {
    if (event) {
      localStorage.setItem('Trans', 'Trans')

      return
    }

    if (!this.formTemplate.value.transPiso1 &&
      !this.formTemplate.value.transPiso2 &&
      !this.formTemplate.value.transTerap &&
      !this.formTemplate.value.transEncarg &&
      !this.formTemplate.value.transOtro) {
      localStorage.removeItem('Trans')
    }
  }

  llenarFormaPago(): void {
    const formPago = []
    if (localStorage.getItem('Efectivo')) {
      formPago.push('Efectivo')
    }
    if (localStorage.getItem('Bizum')) {
      formPago.push('Bizum')
    }
    if (localStorage.getItem('Tarjeta')) {
      formPago.push('Tarjeta')
    }
    if (localStorage.getItem('Trans')) {
      formPago.push('Trans')
    }

    this.formaPago = formPago.join(',')
  }


  minutos(event: any){
    const duracion = event.target.value
    console.log(this.horaInicio)

    var respuesta = this.horaInicio.setMinutes(this.horaInicio.getMinutes() + duracion);
    console.log(respuesta)
    this.horaFin = respuesta.toString()
  }
}
