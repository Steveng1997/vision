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

  dateConvertion = new Date();
  fechaHoy = new Intl.DateTimeFormat("az").format(this.dateConvertion);

  terapeuta: any[] = [];
  fechaLast = [];
  encargada: any[] = [];

  chageDate = '';
  formaPago: string = '';
  salidaTrabajador = '';

  horaFin: string;
  horaFinMinutos: string;
  fechaPrint: string;
  servicioTotal = 0;

  sumatoriaServicios = 0;
  restamosCobro = 0;

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
    nota: new FormControl(''),

    servicio: new FormControl(''),
    bebidas: new FormControl(''),
    tabaco: new FormControl(''),
    vitaminas: new FormControl(''),
    propina: new FormControl(''),
    otros: new FormControl('')
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
      if (datoLastDate[0] != undefined) {
        this.fechaLast[0] = datoLastDate[0];
      } else {
        this.fechaLast = datoLastDate['00:00'];
      }

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
          this.horaStarted, this.servicioTotal, this.horaFinMinutos, this.salidaTrabajador, this.fechaHoy).then((rp) => {
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
    var fecha = new Date();
    console.log(this.horaFinMinutos)
    // var horaStartedd = new Date().toTimeString().substring(0, 5);

    var sumarsesion = Number(event.target.value);
    var minutes = fecha.getMinutes();

    fecha.setMinutes(minutes + sumarsesion);
    var respuesta111 = minutes + ":" + fecha.getMinutes();
    this.horaFinMinutos = respuesta111;

    console.log(this.horaFinMinutos)
  }


  salida(event: any) {
    if (event.checked == true) {
      this.salidaTrabajador = 'Salida';
    } else {
      this.salidaTrabajador = '';
    }
  }

  valueService() {

    let servicio = 0, bebida = 0, tabaco = 0, vitaminas = 0,
      propina = 0, otros = 0, sumatoria = 0;

    if (this.formTemplate.value.servicio != "" && this.formTemplate.value.servicio != null) {
      servicio = parseInt(this.formTemplate.value.servicio)
    } else {
      servicio = 0;
    }

    if (this.formTemplate.value.bebidas != "" && this.formTemplate.value.bebidas != null) {
      bebida = parseInt(this.formTemplate.value.bebidas)
    } else {
      bebida = 0;
    }

    if (this.formTemplate.value.tabaco != "" && this.formTemplate.value.tabaco != null) {
      tabaco = parseInt(this.formTemplate.value.tabaco)
    } else {
      tabaco = 0;
    }

    if (this.formTemplate.value.vitaminas != "" && this.formTemplate.value.vitaminas != null) {
      vitaminas = parseInt(this.formTemplate.value.vitaminas)
    } else {
      vitaminas = 0;
    }

    if (this.formTemplate.value.propina != "" && this.formTemplate.value.propina != null) {
      propina = parseInt(this.formTemplate.value.propina)
    } else {
      propina = 0;
    }

    if (this.formTemplate.value.otros != "" && this.formTemplate.value.otros != null) {
      otros = parseInt(this.formTemplate.value.otros)
    } else {
      otros = 0;
    }

    sumatoria = servicio + bebida + tabaco + vitaminas + propina + otros;
    this.sumatoriaServicios = sumatoria;
    // this.restamosCobro = this.sumatoriaServicios;
  }

  valueCobros() {

    this.restamosCobro = this.sumatoriaServicios;

    // let valuepiso1 = 0, valuepiso2 = 0, valueterapeuta = 0, valueEncarg = 0,
    //   valueotros = 0, restamos = 0, resultado = 0;

    // if (this.formTemplate.value.numberPiso1 != "" && this.formTemplate.value.numberPiso1 != null) {
    //   valuepiso1 = parseInt(this.formTemplate.value.numberPiso1)
    // } else {
    //   valuepiso1 = 0;
    // }

    // if (this.formTemplate.value.numberPiso2 != "" && this.formTemplate.value.numberPiso2 != null) {
    //   valuepiso2 = parseInt(this.formTemplate.value.numberPiso2)
    // } else {
    //   valuepiso2 = 0;
    // }

    // if (this.formTemplate.value.numberTerap != "" && this.formTemplate.value.numberTerap != null) {
    //   valueterapeuta = parseInt(this.formTemplate.value.numberTerap)
    // } else {
    //   valueterapeuta = 0;
    // }

    // if (this.formTemplate.value.numberEncarg != "" && this.formTemplate.value.numberEncarg != null) {
    //   valueEncarg = parseInt(this.formTemplate.value.numberEncarg)
    // } else {
    //   valueEncarg = 0;
    // }

    // if (this.formTemplate.value.numberOtro != "" && this.formTemplate.value.numberOtro != null) {
    //   valueotros = parseInt(this.formTemplate.value.numberOtro)
    // } else {
    //   valueotros = 0;
    // }

    // restamos = valuepiso1 + valuepiso2 + valueterapeuta + valueEncarg + valueotros;
    // resultado = this.sumatoriaServicios - restamos
    // this.restamosCobro = resultado
  }
}