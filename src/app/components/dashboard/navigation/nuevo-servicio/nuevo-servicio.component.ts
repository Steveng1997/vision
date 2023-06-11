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

  sumatoriaServiciosEdit = 0;
  restamosCobroEdit = 0;
  sumatoriaCobrosEdit = 0;

  idEditar: string;
  editarService: Servicio[];
  sumaErrorMetodo: number;
  editamos = false;
  idUserAdministrador: string
  idUser: string
  buttonDelete = false

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
    numberPiso1: new FormControl(0),
    numberPiso2: new FormControl(0),
    numberTerap: new FormControl(0),
    numberEncarg: new FormControl(0),
    numberOtro: new FormControl(0),
    nota: new FormControl(''),
    servicio: new FormControl(0),
    bebidas: new FormControl(0),
    tabaco: new FormControl(0),
    vitaminas: new FormControl(0),
    propina: new FormControl(0),
    otros: new FormControl(0)
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
    document.getElementById('idTitulo').style.display = 'block'
    document.getElementById('idTitulo').innerHTML = 'NUEVO SERVICIO'

    this.cargar();
    this.getEncargada();
    this.getTerapeuta();
    this.getLastDate();
    this.horaInicialServicio = this.horaStarted;
    this.horaFinalServicio = this.horaStarted;
    this.valueServiceEdit();
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
    if (selectDate < currentDateWithoutHours && currentHours <= 12) {
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
                    `menu/${this.idUser['id']}/vision/${this.idUser['id']}`
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

    if (this.formTemplate.value.numberPiso1 != 0 && this.formTemplate.value.efectPiso1 == false &&
      this.formTemplate.value.bizuPiso1 == false && this.formTemplate.value.tarjPiso1 == false &&
      this.formTemplate.value.transPiso1 == false) {
      errorPiso1 = 1;
    }

    if (this.formTemplate.value.numberPiso2 != 0 && this.formTemplate.value.efectPiso2 == false &&
      this.formTemplate.value.bizuPiso2 == false && this.formTemplate.value.tarjPiso2 == false &&
      this.formTemplate.value.transPiso2 == false) {
      errorPiso2 = 1;
    }

    if (this.formTemplate.value.numberTerap != 0 && this.formTemplate.value.efectTerap == false &&
      this.formTemplate.value.bizuTerap == false && this.formTemplate.value.tarjTerap == false &&
      this.formTemplate.value.transTerap == false) {
      errorTerapeuta = 1;
    }

    if (this.formTemplate.value.numberEncarg != 0 && this.formTemplate.value.efectEncarg == false &&
      this.formTemplate.value.bizuEncarg == false && this.formTemplate.value.tarjEncarg == false &&
      this.formTemplate.value.transEncarg == false) {
      errorEncargada = 1;
    }

    if (this.formTemplate.value.numberOtro != 0 && this.formTemplate.value.efectOtro == false &&
      this.formTemplate.value.bizuOtro == false && this.formTemplate.value.tarjOtro == false &&
      this.formTemplate.value.transOtro == false) {
      errorOtro = 1;
    }

    this.sumaErrorMetodo = errorPiso1 + errorPiso2 + errorTerapeuta + errorEncargada + errorOtro;
  }

  totalServicio() {
    let piso1 = 0; let piso2 = 0; let terap = 0; let encargada = 0; let otros = 0;

    if (this.formTemplate.value.numberPiso1 === 0) {
      piso1 = 0
    } else {
      piso1 = Number(this.formTemplate.value.numberPiso1);
    }

    if (this.formTemplate.value.numberPiso2 == 0) {
      piso2 = 0;
    } else {
      piso2 = Number(this.formTemplate.value.numberPiso2);
    }

    if (this.formTemplate.value.numberTerap == 0) {
      terap = 0;
    } else {
      terap = Number(this.formTemplate.value.numberTerap);
    }

    if (this.formTemplate.value.numberEncarg == 0) {
      encargada = 0;
    } else {
      encargada = Number(this.formTemplate.value.numberEncarg);
    }

    if (this.formTemplate.value.numberOtro == 0) {
      otros = 0;
    } else {
      otros = Number(this.formTemplate.value.numberOtro);
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

  llenarFormaPagoEdit(): void {
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

    this.editarService[0]['formaPago'] = formPago.join(',')
    this.formaPago = formPago.join(',')
  }

  horaInicio(event: any) {
    this.horaFinalServicio = event.target.value.toString();
    this.horaInicialServicio = event.target.value.toString();
  }

  fechaEscogida(event: any) {
    this.editarService[0]['fecha'] = event.target.value;
    this.fechaActual = event.target.value;
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
    this.editarService[0]['horaEnd'] = `${defineDate.getHours()}:${defineDate.getMinutes()}`

    let hora = this.horaFinalServicio.slice(0, 2);
    let minutes = this.horaFinalServicio.slice(3, 5);
    this.horaFinalServicio = hora + ':' + (Number(minutes) < 10 ? '0' : '') + minutes
    this.editarService[0]['horaEnd'] = hora + ':' + (Number(minutes) < 10 ? '0' : '') + minutes
  }

  salida(event: any) {
    if (event.checked == true) {
      this.salidaTrabajador = 'Salida';
      this.editarService[0]['salida'] = 'Salida';
    } else {
      this.salidaTrabajador = '';
      this.editarService[0]['salida'] = '';
    }
  }

  valueService() {

    let servicio = 0, bebida = 0, tabaco = 0, vitaminas = 0,
      propina = 0, otros = 0, sumatoria = 0;

    if (this.formTemplate.value.servicio != 0 && this.formTemplate.value.servicio != null) {
      servicio = Number(this.formTemplate.value.servicio);
    } else {
      servicio = 0;
    }

    if (this.formTemplate.value.bebidas != 0 && this.formTemplate.value.bebidas != null) {
      bebida = Number(this.formTemplate.value.bebidas);
    } else {
      bebida = 0;
    }

    if (this.formTemplate.value.tabaco != 0 && this.formTemplate.value.tabaco != null) {
      tabaco = Number(this.formTemplate.value.tabaco);
    } else {
      tabaco = 0;
    }

    if (this.formTemplate.value.vitaminas != 0 && this.formTemplate.value.vitaminas != null) {
      vitaminas = Number(this.formTemplate.value.vitaminas);
    } else {
      vitaminas = 0;
    }

    if (this.formTemplate.value.propina != 0 && this.formTemplate.value.propina != null) {
      propina = Number(this.formTemplate.value.propina);
    } else {
      propina = 0;
    }

    if (this.formTemplate.value.otros != 0 && this.formTemplate.value.otros != null) {
      otros = Number(this.formTemplate.value.otros);
    } else {
      otros = 0;
    }

    sumatoria = servicio + bebida + tabaco + vitaminas + propina + otros;
    this.sumatoriaServicios = sumatoria;
    this.restamosCobro = sumatoria;

    const restamos = Number(this.formTemplate.value.numberPiso1) + Number(this.formTemplate.value.numberPiso2) +
      Number(this.formTemplate.value.numberTerap) + Number(this.formTemplate.value.numberEncarg) +
      Number(this.formTemplate.value.numberOtro)

    if (this.formTemplate.value.numberPiso1 != 0 && this.formTemplate.value.numberPiso1 != 0) {
      this.restamosCobro = sumatoria - restamos
    }

    if (this.formTemplate.value.numberPiso2 != 0 && this.formTemplate.value.numberPiso2 != 0) {
      this.restamosCobro = sumatoria - restamos
    }

    if (this.formTemplate.value.numberTerap != null && this.formTemplate.value.numberTerap != 0) {
      this.restamosCobro = sumatoria - restamos
    }

    if (this.formTemplate.value.numberEncarg != null && this.formTemplate.value.numberEncarg != 0) {
      this.restamosCobro = sumatoria - restamos
    }

    if (this.formTemplate.value.numberOtro != null && this.formTemplate.value.numberOtro != 0) {
      this.restamosCobro = sumatoria - restamos
    }
  }

  valueCobros() {
    let valuepiso1 = 0, valuepiso2 = 0, valueterapeuta = 0, valueEncarg = 0,
      valueotros = 0, restamos = 0, resultado = 0;

    if (this.formTemplate.value.numberPiso1 != 0 && this.formTemplate.value.numberPiso1 != null) {
      valuepiso1 = Number(this.formTemplate.value.numberPiso1);
    } else {
      valuepiso1 = 0;
    }

    if (this.formTemplate.value.numberPiso2 != 0 && this.formTemplate.value.numberPiso2 != null) {
      valuepiso2 = Number(this.formTemplate.value.numberPiso2);
    } else {
      valuepiso2 = 0;
    }

    if (this.formTemplate.value.numberTerap != 0 && this.formTemplate.value.numberTerap != null) {
      valueterapeuta = Number(this.formTemplate.value.numberTerap);
    } else {
      valueterapeuta = 0;
    }

    if (this.formTemplate.value.numberEncarg != 0 && this.formTemplate.value.numberEncarg != null) {
      valueEncarg = Number(this.formTemplate.value.numberEncarg);
    } else {
      valueEncarg = 0;
    }

    if (this.formTemplate.value.numberOtro != 0 && this.formTemplate.value.numberOtro != null) {
      valueotros = Number(this.formTemplate.value.numberOtro);
    } else {
      valueotros = 0;
    }

    if (this.formTemplate.value.servicio != 0 && this.formTemplate.value.servicio != null) {
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
    this.idUserAdministrador = this.activeRoute.snapshot['_urlSegment']['segments'][1]['path'];
    this.idEditar = this.activeRoute.snapshot.paramMap.get('id');
    this.servicioService.getByEditar(this.idEditar).then((datosServicio: any[]) => {
      if (datosServicio.length != 0) {
        this.editamos = true;
        document.getElementById('idTitulo').style.display = 'block'
        document.getElementById('idTitulo').innerHTML = 'Editar servicio'
        this.editarService = datosServicio;

        this.serviceLogin.getByIdAndAdministrador(this.idUserAdministrador).then((datoAdministrador: any[]) => {
          if (datoAdministrador.length != 0) {
            this.buttonDelete = true
          } else {
            this.buttonDelete = false
          }
        });

      } else {
        this.editamos = false;
        this.idUser = this.activeRoute.snapshot['_urlSegment']['segments'][1]['path'];
        this.serviceLogin.getById(this.idUser).then((datoUser: any[]) => {
          this.idUser = datoUser[0]
        });
      }
    });
  }

  editarServicio(idDocument, idServicio, serv: Servicio) {
    if (!this.validarFechaVencida()) return
    if (this.restamosCobroEdit == 0) {
      this.llenarFormaPagoEdit();
      this.servicioService.updateServicio(idDocument, idServicio, serv);
      localStorage.clear();
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
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'El valor debe quedar en 0 cobros',
        showConfirmButton: false,
        timer: 2500,
      });
    }
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
            this.servicioService.deleteServicio(datoEliminado[0]['idDocument'], id)
            localStorage.clear();
            this.router.navigate([`menu/${this.encargada[0]['id']}/vision/${this.encargada[0]['id']}`]);
            Swal.fire({
              position: 'top-end',
              icon: 'success',
              title: '¡Eliminado Correctamente!',
              showConfirmButton: false,
              timer: 2500,
            });
          }
        });
      }
    });
  }

  valueServiceEdit() {
    let servicioEdit = 0, bebidaEdit = 0, tabacoEdit = 0, vitaminasEdit = 0,
      propinaEdit = 0, otrosEdit = 0, sumatoriaEdit = 0;

    if (this.editarService[0]['servicio'] != null) {
      servicioEdit = Number(this.editarService[0]['servicio'])
    } else {
      servicioEdit = 0;
    }

    if (this.editarService[0]['bebidas'] != null) {
      bebidaEdit = Number(this.editarService[0]['bebidas'])
    } else {
      bebidaEdit = 0;
    }

    if (this.editarService[0]['tabaco'] != null) {
      tabacoEdit = Number(this.editarService[0]['tabaco'])
    } else {
      tabacoEdit = 0;
    }

    if (this.editarService[0]['vitaminas'] != null) {
      vitaminasEdit = Number(this.editarService[0]['vitaminas'])
    } else {
      vitaminasEdit = 0;
    }

    if (this.editarService[0]['propina'] != null) {
      propinaEdit = Number(this.editarService[0]['propina'])
    } else {
      propinaEdit = 0;
    }

    if (this.editarService[0]['otros'] != null) {
      otrosEdit = Number(this.editarService[0]['otros'])
    } else {
      otrosEdit = 0;
    }

    sumatoriaEdit = servicioEdit + bebidaEdit + tabacoEdit + vitaminasEdit + propinaEdit + otrosEdit;
    this.editarService[0]['totalServicio'] = sumatoriaEdit;
    this.restamosCobroEdit = sumatoriaEdit;

    const restamosEdit = Number(this.editarService[0]['numberPiso1']) + Number(this.editarService[0]['numberPiso2']) +
      Number(this.editarService[0]['numberTerap']) + Number(this.editarService[0]['numberEncarg']) +
      Number(this.editarService[0]['numberOtro'])

    if (this.editarService[0]['numberPiso1'] != null) {
      this.restamosCobroEdit = sumatoriaEdit - restamosEdit
    }

    if (Number(this.editarService[0]['numberPiso2']) != null) {
      this.restamosCobroEdit = sumatoriaEdit - restamosEdit
    }

    if (Number(this.editarService[0]['numberTerap'] != null)) {
      this.restamosCobroEdit = sumatoriaEdit - restamosEdit
    }

    if (Number(this.editarService[0]['numberEncarg'] != null)) {
      this.restamosCobroEdit = sumatoriaEdit - restamosEdit
    }

    if (this.editarService[0]['numberOtro'] != null) {
      this.restamosCobroEdit = sumatoriaEdit - restamosEdit
    }
  }

  valueCobrosEdit() {
    let valuepiso1Edit = 0, valuepiso2Edit = 0, valueterapeutaEdit = 0, valueEncargEdit = 0,
      valueotrosEdit = 0, restamosEdit = 0, resultadoEdit = 0;

    if (Number(this.editarService[0]['numberPiso1'] != null)) {
      valuepiso1Edit = Number(this.editarService[0]['numberPiso1'])
    } else {
      valuepiso1Edit = 0;
    }

    if (Number(this.editarService[0]['numberPiso2'] != null)) {
      valuepiso2Edit = Number(this.editarService[0]['numberPiso2'])
    } else {
      valuepiso2Edit = 0;
    }

    if (Number(this.editarService[0]['numberTerap'] != null)) {
      valueterapeutaEdit = Number(this.editarService[0]['numberTerap'])
    } else {
      valueterapeutaEdit = 0;
    }

    if (Number(this.editarService[0]['numberEncarg'] != null)) {
      valueEncargEdit = Number(this.editarService[0]['numberEncarg'])
    } else {
      valueEncargEdit = 0;
    }

    if (Number(this.editarService[0]['numberOtro'] != null)) {
      valueotrosEdit = Number(this.editarService[0]['numberOtro'])
    } else {
      valueotrosEdit = 0;
    }

    if (this.editarService[0]['totalServicio'] != null) {
      resultadoEdit = Number(this.editarService[0]['totalServicio']) - valuepiso1Edit
    }

    this.sumatoriaCobrosEdit = valuepiso1Edit + valuepiso2Edit + valueterapeutaEdit + valueEncargEdit + valueotrosEdit;

    restamosEdit = valuepiso1Edit + valuepiso2Edit + valueterapeutaEdit + valueEncargEdit + valueotrosEdit;
    resultadoEdit = this.editarService[0]['totalServicio'] - restamosEdit
    this.restamosCobroEdit = resultadoEdit
  }
} 