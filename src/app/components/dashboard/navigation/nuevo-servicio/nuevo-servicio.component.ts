import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormControl } from '@angular/forms';
import Swal from 'sweetalert2';

// Service
import { TrabajadoresService } from 'src/app/core/services/trabajadores';
import { ServicioService } from 'src/app/core/services/servicio';
import { } from '@ng-bootstrap/ng-bootstrap/util/util';

@Component({
  selector: 'app-nuevo-servicio',
  templateUrl: './nuevo-servicio.component.html',
  styleUrls: ['./nuevo-servicio.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class NuevoServicioComponent implements OnInit {

  fechaActual = new Date().toISOString().substring(0, 10);
  horaStarted = new Date().toTimeString().substring(0, 5);

  terapeuta: any[] = [];
  fechaLast = [];
  encargada: any[] = [];

  chageDate = '';
  formaPago: string = '';

  horaFin: string;
  horaFinMinutos: string;
  fechaPrint: string;
  servicioTotal = 0;

  formTemplate = new FormGroup({
    terapeuta: new FormControl(''),
    encargada: new FormControl(''),
    cliente: new FormControl(''),
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
    this.getLastDate();
    this.horaFinMinutos = this.horaStarted;
  }

  getLastDate() {
    this.servicioService.getServicio().subscribe((datoLastDate) => {
      this.fechaLast[0] = datoLastDate[0];
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

  isDisabled(date: NgbDateStruct, current: { month: number }) {
    return date.month !== current.month;
  }

  changeFecha(event) {
    this.chageDate = event.target.value.substring(5, 10)
  }

  addServicio(formValue) {
    debugger
    if (this.formTemplate.value.terapeuta != '') {
      if (this.formTemplate.value.encargada != '') {
        this.llenarFormaPago()
        this.totalServicio()
        if (this.fechaPrint == undefined) {
          this.fechaActual = this.fechaActual.substring(5, 10);
          this.fechaPrint = this.fechaActual;
        }
        this.horaStarted = this.horaFin;
        this.servicioService.registerServicio(formValue, this.formaPago, this.fechaPrint,
          this.horaStarted, this.servicioTotal, this.horaFinMinutos).then((rp) => {
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

  totalServicio() {
    let piso1 = 0; let piso2 = 0; let terap = 0; let encargada = 0; let otros = 0;

    if (this.formTemplate.value.numberPiso1 === "") {
      piso1 = 0
    } else {
      piso1 = parseInt(this.formTemplate.value.numberPiso1);
    }

    if (this.formTemplate.value.numberPiso2 == "") {
      piso2 = 0;
    } else {
      piso2 = parseInt(this.formTemplate.value.numberPiso2);
    }

    if (this.formTemplate.value.numberTerap == "") {
      terap = 0;
    } else {
      terap = parseInt(this.formTemplate.value.numberTerap);
    }

    if (this.formTemplate.value.numberEncarg == "") {
      encargada = 0;
    } else {
      encargada = parseInt(this.formTemplate.value.numberEncarg);
    }

    if (this.formTemplate.value.numberOtro == "") {
      otros = 0;
    } else {
      otros = parseInt(this.formTemplate.value.numberOtro);
    }

    this.servicioTotal = Number(piso1 + piso2 + terap + encargada + otros);
  }

  efectCheckToggle(event: any) {
    if (event) {
      localStorage.setItem('Efectivo', 'Efectivo')
      return
    }

    if (!this.formTemplate.value.efectPiso1 && !this.formTemplate.value.efectPiso2 &&
      !this.formTemplate.value.efectTerap && !this.formTemplate.value.efectEncarg &&
      !this.formTemplate.value.efectOtro) {
      localStorage.removeItem('Efectivo')
    }
  }

  bizumCheckToggle(event: any) {
    if (event) {
      localStorage.setItem('Bizum', 'Bizum')
      return
    }

    if (!this.formTemplate.value.bizuPiso1 && !this.formTemplate.value.bizuPiso2 &&
      !this.formTemplate.value.bizuTerap && !this.formTemplate.value.bizuEncarg &&
      !this.formTemplate.value.bizuOtro) {
      localStorage.removeItem('Bizum')
    }
  }

  tarjCheckToggle(event: any) {
    if (event) {
      localStorage.setItem('Tarjeta', 'Tarjeta')
      return
    }

    if (!this.formTemplate.value.tarjPiso1 && !this.formTemplate.value.tarjPiso2 &&
      !this.formTemplate.value.tarjTerap && !this.formTemplate.value.tarjEncarg &&
      !this.formTemplate.value.tarjOtro) {
      localStorage.removeItem('Tarjeta')
    }
  }

  transCheckToggle(event: any) {
    if (event) {
      localStorage.setItem('Trans', 'Trans')
      return
    }

    if (!this.formTemplate.value.transPiso1 && !this.formTemplate.value.transPiso2 &&
      !this.formTemplate.value.transTerap && !this.formTemplate.value.transEncarg &&
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

  horaInicio(event: any) {
    var minutes = event.target.value;
    this.horaFin = minutes.toString();
    this.horaFinMinutos = minutes.toString();
  }

  fechaEscogida(event: any) {
    var fecha1 = event.target.value.substring(5, 10);
    this.fechaPrint = fecha1;
  }

  minutos(event: any) {
    debugger
    // var fecha34 = new Date();
    // console.log(fecha34);

    // var sumarsesion = event.target.value;
    // var aqui = fecha34.getMinutes() + ":" + (fecha34.setMinutes(fecha34.getMinutes() + sumarsesion) && fecha34.getMinutes());
    // this.horaFinMinutos = aqui.toString()

    // var fecha = new Date(),
    //   dia = fecha.getMinutes(),
    //   dia = fecha.getUTCMinutes(),
    //   dia = fecha.getDate(),
    //   mes = fecha.getMonth() + 1,
    //   anio = fecha.getFullYear(),
    //   tiempo = event.target.value,
    //   addTime = tiempo * 86400; //Tiempo en segundos

    // fecha.setSeconds(addTime); //Añado el tiempo

    // document.body.innerHTML = "Fecha actual: " + dia + "/" + mes + "/" + anio + "<br />";
    // document.body.innerHTML += "Tiempo añadido: " + tiempo + " días<br />";
    // document.body.innerHTML += "Fecha final: " + fecha.getDate() + "/" + (fecha.getMonth() + 1) + "/" + fecha.getFullYear();

    // var fecha = new Date();
    // var sumarsesion = Number(event.target.value);
    // var minutes = parseInt(this.horaStarted.substring(3,5));

    // var respuesta33 = fecha.setMinutes(minutes + sumarsesion);
    // var respueta22 = minutes + ":" + fecha.getMinutes();
    // console.log(respueta22)




    var fecha = new Date();
    var sumarsesion = Number(event.target.value);
    var minutes = fecha.getMinutes();

    var a111 = fecha.setMinutes(minutes + sumarsesion);
    console.log(a111)
    var respuesta111 = minutes + ":" + fecha.getMinutes();
    console.log(respuesta111)
  }
}