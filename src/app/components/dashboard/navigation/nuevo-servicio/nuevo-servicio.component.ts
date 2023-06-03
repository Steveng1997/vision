import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormControl } from '@angular/forms';
import Swal from 'sweetalert2';

// Service
import { TrabajadoresService } from 'src/app/core/services/trabajadores';
import { ServicioService } from 'src/app/core/services/servicio';
import { LoginService } from 'src/app/core/services/login';
import { Servicio } from 'src/app/core/models/servicio';

@Component({
  selector: 'app-nuevo-servicio',
  templateUrl: './nuevo-servicio.component.html',
  styleUrls: ['./nuevo-servicio.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class NuevoServicioComponent implements OnInit {

  horaStartTerapeuta = ''
  horaEndTerapeuta = ''

  fechaActual = new Date().toISOString().substring(0, 10);
  horaStarted = new Date().toTimeString().substring(0, 5);

  dateConvertion = new Date();
  fechaHoyInicio = new Intl.DateTimeFormat("az").format(this.dateConvertion);

  terapeuta: any[] = [];

  fechaLast = [];
  encargada: any[] = [];

  chageDate = '';
  formaPago: string = '';
  salidaTrabajador = '';

  horaInicialServicio: string;
  fechaPrint: string;
  servicioTotal = 0;

  horaFinalServicio: string;

  sumatoriaServicios = 0;
  restamosCobro = 0;
  sumatoriaCobros = 0;

  // Editar

  editar: string;
  editarService: Servicio[];
  sumaErrorMetodo: number;

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
    public serviceLogin: LoginService,
    private activeRoute: ActivatedRoute,
    private serviceUser: LoginService
  ) { }

  ngOnInit(): void {
    this.cargar();
    this.getEncargada();
    this.getTerapeuta();
    this.getLastDate();
    this.horaInicialServicio = this.horaStarted;
    this.horaFinalServicio = this.horaStarted;
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
    this.serviceLogin.getUsuarios().subscribe((datosEncargada) => {
      this.encargada = datosEncargada;
    });
  }

  isDisabled(date: NgbDateStruct, current: { month: number }) {
    return date.month !== current.month;
  }

  changeFecha(event) {
    this.chageDate = event.target.value.substring(5, 10)
  }

  validarFechaVencida() {
    const splitDate = this.fechaActual.split('-')
    const selectDate = new Date(`${splitDate[1]}/${splitDate[2]}/${splitDate[0]}`)
    const currentDate = new Date()
    const currentDateWithoutHours = new Date(`${currentDate.getMonth() + 1}/${currentDate.getDate()}/${currentDate.getFullYear()}`)
    const currentHours = currentDate.getHours()
    if (selectDate < currentDateWithoutHours && currentHours >= 12) {
      // Swal.fire({
      //   position: 'top-end',
      //   icon: 'success',
      //   title: 'Ya han pasado 12 horas 😢',
      //   showConfirmButton: false,
      //   timer: 2500,
      // })
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'No se puede crear el servicio por la fecha.',
        showConfirmButton: false,
        timer: 2500,
      });
      return false
    }

    return true
  }

  addServicio(formValue): any {
    if (this.formTemplate.value.terapeuta != '') {
      if (this.formTemplate.value.encargada != '') {
        // NO SE DEBE CREAR FECHA ATRAS SI YA PASO LAS 12 HORAS PERO ADMINISTRADOR PUEDE HACER LO QUE SEA
        this.errorMetodo();
        if (this.sumaErrorMetodo == 0) {
          if (this.restamosCobro == 0) {
            this.llenarFormaPago()
            this.totalServicio()

            if (!this.validarFechaVencida()) return

            this.servicioService.registerServicio(formValue, this.formaPago, this.fechaActual,
              this.horaInicialServicio, this.servicioTotal, this.horaFinalServicio, this.salidaTrabajador,
              this.fechaHoyInicio).then((rp) => {
                if (rp) {
                  Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    title: '¡Insertado Correctamente!',
                    showConfirmButton: false,
                    timer: 2500,
                  });
                  this.router.navigate([
                    `menu/${this.encargada['id']}/vision/${this.encargada['id']}`
                  ]);
                }
                localStorage.clear();
              })
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'El valor debe quedar en 0 cobros',
              showConfirmButton: false,
              timer: 2500,
            });
          }
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'No se ha seleccionado los metodos de pago',
            showConfirmButton: false,
            timer: 2500,
          });
        }

      } else {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'No hay ninguna encargada seleccionada',
          showConfirmButton: false,
          timer: 2500,
        });
      }

    } else {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'No hay ninguna terapeuta seleccionada',
        showConfirmButton: false,
        timer: 2500,
      });
    }
  }

  errorMetodo() {
    let errorPiso1 = 0, errorPiso2 = 0, errorTerapeuta = 0, errorEncargada = 0, errorOtro = 0;

    if (this.formTemplate.value.numberPiso1 != "" && this.formTemplate.value.efectPiso1 == false &&
      this.formTemplate.value.bizuPiso1 == false && this.formTemplate.value.tarjPiso1 == false &&
      this.formTemplate.value.transPiso1 == false) {
      errorPiso1 = 1;
    }

    if (this.formTemplate.value.numberPiso2 != "" && this.formTemplate.value.efectPiso2 == false &&
      this.formTemplate.value.bizuPiso2 == false && this.formTemplate.value.tarjPiso2 == false &&
      this.formTemplate.value.transPiso2 == false) {
      errorPiso2 = 1;
    }

    if (this.formTemplate.value.numberTerap != "" && this.formTemplate.value.efectTerap == false &&
      this.formTemplate.value.bizuTerap == false && this.formTemplate.value.tarjTerap == false &&
      this.formTemplate.value.transTerap == false) {
      errorTerapeuta = 1;
    }

    if (this.formTemplate.value.numberEncarg != "" && this.formTemplate.value.efectEncarg == false &&
      this.formTemplate.value.bizuEncarg == false && this.formTemplate.value.tarjEncarg == false &&
      this.formTemplate.value.transEncarg == false) {
      errorEncargada = 1;
    }

    if (this.formTemplate.value.numberOtro != "" && this.formTemplate.value.efectOtro == false &&
      this.formTemplate.value.bizuOtro == false && this.formTemplate.value.tarjOtro == false &&
      this.formTemplate.value.transOtro == false) {
      errorOtro = 1;
    }

    this.sumaErrorMetodo = errorPiso1 + errorPiso2 + errorTerapeuta + errorEncargada + errorOtro;
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
    this.horaFinalServicio = event.target.value.toString();
    this.horaInicialServicio = event.target.value.toString();
  }

  fechaEscogida(event: any) {
    this.fechaActual = event.target.value
  }

  minutos(event: any) {
    let sumarsesion = event;
    if (event === null) sumarsesion = 0

    // Create date by Date and Hour
    const splitDate = this.fechaActual.toString().split('-')
    const splitHour = this.horaInicialServicio.split(':')

    let defineDate = new Date(Number(splitDate[0]), (Number(splitDate[1]) - 1),
      Number(splitDate[2]), Number(splitHour[0]),
      Number(splitHour[1]))

    defineDate.setMinutes(defineDate.getMinutes() + sumarsesion)
    this.horaFinalServicio = `${defineDate.getHours()}:${defineDate.getMinutes()}`

    let hora = this.horaFinalServicio.slice(0, 2);
    let minutes = this.horaFinalServicio.slice(3, 5);
    this.horaFinalServicio = hora + ':' + (Number(minutes) < 10 ? '0' : '') + minutes
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
    this.restamosCobro = sumatoria;

    const restamos = Number(this.formTemplate.value.numberPiso1) + Number(this.formTemplate.value.numberPiso2) +
      Number(this.formTemplate.value.numberTerap) + Number(this.formTemplate.value.numberEncarg) +
      Number(this.formTemplate.value.numberOtro)

    if (parseInt(this.formTemplate.value.numberPiso1) != 0 && this.formTemplate.value.numberPiso1 != "") {
      this.restamosCobro = sumatoria - restamos
    }

    if (parseInt(this.formTemplate.value.numberPiso2) != 0 && this.formTemplate.value.numberPiso2 != "") {
      this.restamosCobro = sumatoria - restamos
    }

    if (this.formTemplate.value.numberTerap != null && this.formTemplate.value.numberTerap != "") {
      this.restamosCobro = sumatoria - restamos
    }

    if (this.formTemplate.value.numberEncarg != null && this.formTemplate.value.numberEncarg != "") {
      this.restamosCobro = sumatoria - restamos
    }

    if (this.formTemplate.value.numberOtro != null && this.formTemplate.value.numberOtro != "") {
      this.restamosCobro = sumatoria - restamos
    }
  }

  valueCobros() {

    let valuepiso1 = 0, valuepiso2 = 0, valueterapeuta = 0, valueEncarg = 0,
      valueotros = 0, restamos = 0, resultado = 0;

    if (this.formTemplate.value.numberPiso1 != "" && this.formTemplate.value.numberPiso1 != null) {
      valuepiso1 = parseInt(this.formTemplate.value.numberPiso1)
    } else {
      valuepiso1 = 0;
    }

    if (this.formTemplate.value.numberPiso2 != "" && this.formTemplate.value.numberPiso2 != null) {
      valuepiso2 = parseInt(this.formTemplate.value.numberPiso2)
    } else {
      valuepiso2 = 0;
    }

    if (this.formTemplate.value.numberTerap != "" && this.formTemplate.value.numberTerap != null) {
      valueterapeuta = parseInt(this.formTemplate.value.numberTerap)
    } else {
      valueterapeuta = 0;
    }

    if (this.formTemplate.value.numberEncarg != "" && this.formTemplate.value.numberEncarg != null) {
      valueEncarg = parseInt(this.formTemplate.value.numberEncarg)
    } else {
      valueEncarg = 0;
    }

    if (this.formTemplate.value.numberOtro != "" && this.formTemplate.value.numberOtro != null) {
      valueotros = parseInt(this.formTemplate.value.numberOtro)
    } else {
      valueotros = 0;
    }

    if (this.formTemplate.value.servicio != "" && this.formTemplate.value.servicio != null) {
      resultado = Number(this.formTemplate.value.servicio) - valuepiso1
    }

    this.sumatoriaCobros = valuepiso1 + valuepiso2 + valueterapeuta + valueEncarg + valueotros;

    restamos = valuepiso1 + valuepiso2 + valueterapeuta + valueEncarg + valueotros;
    resultado = this.sumatoriaServicios - restamos
    this.restamosCobro = resultado
  }

  terapeu(event: any) {
    this.servicioService.getTerapeutaByAsc(event).then((rp) => {
      if (rp[0] != undefined) {
        this.horaStartTerapeuta = rp[0]['horaStart']
        this.horaEndTerapeuta = rp[0]['horaEnd']
      }

    })
    this.horaStartTerapeuta = ''
    this.horaEndTerapeuta = ''
  }




























  // -------------------------------------------- Editamos ---------------------------------------------

  cargar() {
    this.editar = this.activeRoute.snapshot.paramMap.get('id');
    this.servicioService.getById(this.editar).then((datosServicio: any[]) => {
      if (datosServicio.length != 0) {
        this.editar = datosServicio[0];
        this.editarService = datosServicio;
      } else {
        this.serviceUser.getById(this.editar).then((datosUsuario: any) => {
          this.editar = datosUsuario[0];
        });
      }
    });
  }

  editarServicio(idDocument, idServicio, serv: Servicio) {
    // DESDE LA FECHA ACTUAL Y SI PASA 12 HORAS NO SE PUEDE EDITAR MADAAAAAAAAAAAAAAAAAA!
    // SE PUEDE EDITAR SOLAMENTE SI ESTA EN RANGO DE LAS 12 HORAS DESDE LA FECHA ACTUAL
    // PERO ADMINISTRADOR PUEDE HACER LO QUE SEA
    if (!this.validarFechaVencida()) return
    this.servicioService.updateServicio(idDocument, idServicio, serv);
    Swal.fire({
      position: 'top-end',
      icon: 'success',
      title: '¡Editado Correctamente!',
      showConfirmButton: false,
      timer: 2500,
    });
    this.router.navigate([
      `menu/${this.encargada[0]['id']}/tabla/${this.encargada[0]['id']}`
    ]);
  }

  eliminarServicio(id) {
    this.servicioService.getById(id).then((datoEliminado) => {
      if (datoEliminado) {
        Swal.fire({
          title: '¿Deseas eliminar el registro?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Si, Deseo eliminar!',
        }).then((result) => {
          if (result.isConfirmed) {
            Swal.fire({
              position: 'top-end',
              icon: 'success',
              title: '¡Eliminado Correctamente!',
              showConfirmButton: false,
              timer: 2500,
            });
          }
        });
        this.servicioService.deleteServicio(datoEliminado[0]['idDocument'], id).then((datoEliminado) => {
          this.router.navigate([`menu/${id}/tabla/${id}`]);
        });
      }
    });
  }
} 