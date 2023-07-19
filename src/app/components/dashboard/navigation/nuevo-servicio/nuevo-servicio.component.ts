import { Component, OnInit, ViewEncapsulation } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap'
import { FormGroup, FormControl } from '@angular/forms'
import Swal from 'sweetalert2'

// Service
import { TrabajadoresService } from 'src/app/core/services/trabajadores'
import { ServicioService } from 'src/app/core/services/servicio'
import { LoginService } from 'src/app/core/services/login'
import { Servicio } from 'src/app/core/models/servicio'

@Component({
  selector: 'app-nuevo-servicio',
  templateUrl: './nuevo-servicio.component.html',
  styleUrls: ['./nuevo-servicio.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class NuevoServicioComponent implements OnInit {

  horaStartTerapeuta = ''
  horaEndTerapeuta = ''

  fechaActual = new Date().toISOString().substring(0, 10)
  horaStarted = new Date().toTimeString().substring(0, 5)
  dateConvertion = new Date()
  fechaHoyInicio = ''
  currentDate = new Date().getTime()

  terapeuta: any[] = []

  fechaLast = []
  encargada: any[] = []

  chageDate = ''
  formaPago: string = ''
  salidaTrabajador = ''

  horaInicialServicio: string
  fechaPrint: string
  servicioTotal = 0

  horaFinalServicio: string

  sumatoriaServicios = 0
  restamosCobro = 0
  sumatoriaCobros = 0

  // Cobros
  valueEfectivo = 0
  valueBizum = 0
  valueTarjeta = 0
  valueTrans = 0
  validateEfect = true
  validateBizum = true
  validateTarjeta = true
  validateTrans = true

  // value Encargada & Terapeuta
  valueEfectTerapeuta = 0
  valueBizuTerapeuta = 0
  valueTarjeTerapeuta = 0
  valueTransTerapeuta = 0

  valueEfectEncargada = 0
  valueBizuEncargada = 0
  valueTarjeEncargada = 0
  valueTransEncargada = 0

  // Editar

  restamosCobroEdit = 0
  sumatoriaCobrosEdit = 0

  idEditar: string
  editarService: Servicio[]
  sumaErrorMetodo: number
  editamos = false
  idUserAdministrador: string
  idUser: string
  buttonDelete = false

  idUnico: string
  formaPagos = ""

  // conteo Numbers
  countEfect = 0
  countbizu = 0
  counttarj = 0
  counttrans = 0

  // Completo
  completoEfectivo = 0
  completoBizum = 0
  completoTarjeta = 0
  completoTrans = 0

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
    numberPiso1: new FormControl(),
    numberPiso2: new FormControl(),
    numberTerap: new FormControl(),
    numberEncarg: new FormControl(),
    numberOtro: new FormControl(),
    nota: new FormControl(''),
    servicio: new FormControl(),
    bebidas: new FormControl(),
    tabaco: new FormControl(),
    vitaminas: new FormControl(),
    propina: new FormControl(),
    otros: new FormControl(),
    salida: new FormControl(''),
  })

  constructor(
    public router: Router,
    private activeRoute: ActivatedRoute,
    public trabajadorService: TrabajadoresService,
    public servicioService: ServicioService,
    public serviceLogin: LoginService,
  ) { }

  ngOnInit(): void {
    document.getElementById('idTitulo').style.display = 'block'
    document.getElementById('idTitulo').innerHTML = 'NUEVO SERVICIO'

    this.cargar()
    this.getEncargada()
    this.getTerapeuta()
    this.getLastDate()
    this.horaInicialServicio = this.horaStarted
    this.horaFinalServicio = this.horaStarted
  }

  getLastDate() {
    this.servicioService.getServicio().subscribe((datoLastDate) => {
      if (datoLastDate[0] != undefined) {
        this.fechaLast[0] = datoLastDate[0]
      } else {
        this.fechaLast = datoLastDate['00:00']
      }
    })
  }

  getTerapeuta() {
    this.trabajadorService.getAllTerapeuta().subscribe((datosTerapeuta) => {
      this.terapeuta = datosTerapeuta
    })
  }

  getEncargada() {
    this.serviceLogin.getUsuarios().subscribe((datosEncargada) => {
      this.encargada = datosEncargada
    })
  }

  isDisabled(date: NgbDateStruct, current: { month: number }) {
    return date.month !== current.month
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
        timer: 2500
      })
      return false
    }
    return true
  }

  crearIdUnico() {
    var d = new Date().getTime()
    var uuid = 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = (d + Math.random() * 16) % 16 | 0
      d = Math.floor(d / 16)
      return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16)
    })
    this.idUnico = uuid
    return this.idUnico
  }

  fechadeHoy() {
    let convertDia
    let currentDate = new Date()
    let dia = currentDate.getDate()
    let mes = currentDate.toJSON().substring(5, 7)

    if (dia > 0 && dia < 10) {
      convertDia = '0' + dia
    } else {
      convertDia = dia
    }
    this.fechaHoyInicio = `${currentDate.getFullYear()}/${mes}/${convertDia}`
  }

  TodosCobroSelect(formValue) {
    if (this.formTemplate.value.numberPiso1 > 0 || this.formTemplate.value.numberPiso2 > 0 || this.formTemplate.value.numberTerap > 0 ||
      this.formTemplate.value.numberEncarg > 0 || this.formTemplate.value.numberOtro > 0) {

      // Efectivo
      if (this.formTemplate.value.efectPiso1 == true && this.formTemplate.value.efectPiso2 == true && this.formTemplate.value.efectTerap == true &&
        this.formTemplate.value.efectEncarg == true && this.formTemplate.value.efectOtro == true) {
        this.servicioService.registerServicio(formValue, this.idUnico, 'Efectivo', this.fechaActual, this.horaInicialServicio, this.servicioTotal, this.horaFinalServicio,
          this.fechaHoyInicio, this.valueEfectivo, 0, 0, 0, this.valueEfectTerapeuta, 0, 0, 0, this.valueEfectEncargada, 0, 0, 0, this.currentDate)
        return true
      }

      // Bizum
      if (this.formTemplate.value.bizuPiso1 == true && this.formTemplate.value.bizuPiso2 == true && this.formTemplate.value.bizuTerap == true &&
        this.formTemplate.value.bizuEncarg == true && this.formTemplate.value.bizuOtro == true) {
        this.servicioService.registerServicio(formValue, this.idUnico, 'Bizum', this.fechaActual, this.horaInicialServicio, this.servicioTotal, this.horaFinalServicio,
          this.fechaHoyInicio, 0, this.valueBizum, 0, 0, 0, this.valueBizuTerapeuta, 0, 0, 0, this.valueBizuEncargada, 0, 0, this.currentDate)
        return true
      }

      // Tarjeta
      if (this.formTemplate.value.tarjPiso1 == true && this.formTemplate.value.tarjPiso2 == true && this.formTemplate.value.tarjTerap == true &&
        this.formTemplate.value.tarjEncarg == true && this.formTemplate.value.tarjOtro == true) {
        this.servicioService.registerServicio(formValue, this.idUnico, 'Tarjeta', this.fechaActual, this.horaInicialServicio, this.servicioTotal, this.horaFinalServicio,
          this.fechaHoyInicio, 0, 0, this.valueTarjeta, 0, 0, 0, this.valueTarjeTerapeuta, 0, 0, 0, this.valueTarjeEncargada, 0, this.currentDate)
        return true
      }

      // Transaccion
      if (this.formTemplate.value.transPiso1 == true && this.formTemplate.value.transPiso2 == true && this.formTemplate.value.transTerap == true &&
        this.formTemplate.value.transEncarg == true && this.formTemplate.value.transOtro == true) {
        this.servicioService.registerServicio(formValue, this.idUnico, 'Transacción', this.fechaActual, this.horaInicialServicio, this.servicioTotal, this.horaFinalServicio,
          this.fechaHoyInicio, 0, 0, 0, this.valueTrans, 0, 0, 0, this.valueTransTerapeuta, 0, 0, 0, this.valueTransEncargada, this.currentDate)
        return true
      }
    }
    return true
  }

  mas4Select(formValue) {

    if (this.formTemplate.value.numberPiso1 > 0 || this.formTemplate.value.numberPiso2 > 0 || this.formTemplate.value.numberTerap > 0 ||
      this.formTemplate.value.numberEncarg > 0 || this.formTemplate.value.numberOtro > 0) {

      // Efectivo
      if (this.formTemplate.value.efectPiso1 == true && this.formTemplate.value.efectPiso2 == true && this.formTemplate.value.efectTerap == true
        && this.formTemplate.value.efectEncarg == true || this.formTemplate.value.efectPiso2 == true && this.formTemplate.value.efectTerap == true &&
        this.formTemplate.value.efectEncarg == true && this.formTemplate.value.efectOtro == true || this.formTemplate.value.efectPiso1 == true &&
        this.formTemplate.value.efectTerap == true && this.formTemplate.value.efectEncarg == true && this.formTemplate.value.efectOtro == true ||
        this.formTemplate.value.efectPiso1 == true && this.formTemplate.value.efectPiso2 == true && this.formTemplate.value.efectEncarg == true &&
        this.formTemplate.value.efectOtro == true || this.formTemplate.value.efectPiso1 == true && this.formTemplate.value.efectPiso2 == true &&
        this.formTemplate.value.efectTerap == true && this.formTemplate.value.efectOtro == true) {

        this.formaPagos = "Efectivo"
        this.servicioService.registerServicio(formValue, this.idUnico, 'Efectivo', this.fechaActual, this.horaInicialServicio, this.servicioTotal, this.horaFinalServicio,
          this.fechaHoyInicio, this.valueEfectivo, 0, 0, 0, this.valueEfectTerapeuta, 0, 0, 0, this.valueEfectEncargada, 0, 0, 0, this.currentDate)
        return true
      }

      // Bizum
      if (this.formTemplate.value.bizuPiso1 == true && this.formTemplate.value.bizuPiso2 == true && this.formTemplate.value.bizuTerap == true
        && this.formTemplate.value.bizuEncarg == true || this.formTemplate.value.bizuPiso2 == true && this.formTemplate.value.bizuTerap == true &&
        this.formTemplate.value.bizuEncarg == true && this.formTemplate.value.bizuOtro == true || this.formTemplate.value.bizuPiso1 == true &&
        this.formTemplate.value.bizuTerap == true && this.formTemplate.value.bizuEncarg == true && this.formTemplate.value.bizuOtro == true ||
        this.formTemplate.value.bizuPiso1 == true && this.formTemplate.value.bizuPiso2 == true && this.formTemplate.value.bizuEncarg == true &&
        this.formTemplate.value.bizuOtro == true || this.formTemplate.value.bizuPiso1 == true && this.formTemplate.value.bizuPiso2 == true &&
        this.formTemplate.value.bizuTerap == true && this.formTemplate.value.bizuOtro == true) {

        this.formaPagos = "Bizum"
        this.servicioService.registerServicio(formValue, this.idUnico, 'Bizum', this.fechaActual, this.horaInicialServicio, this.servicioTotal, this.horaFinalServicio,
          this.fechaHoyInicio, 0, this.valueBizum, 0, 0, 0, this.valueBizuTerapeuta, 0, 0, 0, this.valueBizuEncargada, 0, 0, this.currentDate)
        return true
      }

      // Tarjeta
      if (this.formTemplate.value.tarjPiso1 == true && this.formTemplate.value.tarjPiso2 == true && this.formTemplate.value.tarjTerap == true
        && this.formTemplate.value.tarjEncarg == true || this.formTemplate.value.tarjPiso2 == true && this.formTemplate.value.tarjTerap == true &&
        this.formTemplate.value.tarjEncarg == true && this.formTemplate.value.tarjOtro == true || this.formTemplate.value.tarjPiso1 == true &&
        this.formTemplate.value.tarjTerap == true && this.formTemplate.value.tarjEncarg == true && this.formTemplate.value.tarjOtro == true ||
        this.formTemplate.value.tarjPiso1 == true && this.formTemplate.value.tarjPiso2 == true && this.formTemplate.value.tarjEncarg == true &&
        this.formTemplate.value.tarjOtro == true || this.formTemplate.value.tarjPiso1 == true && this.formTemplate.value.tarjPiso2 == true &&
        this.formTemplate.value.tarjTerap == true && this.formTemplate.value.tarjOtro == true) {

        this.formaPagos = "Tarjeta"
        this.servicioService.registerServicio(formValue, this.idUnico, 'Tarjeta', this.fechaActual, this.horaInicialServicio, this.servicioTotal, this.horaFinalServicio,
          this.fechaHoyInicio, 0, 0, this.valueTarjeta, 0, 0, 0, this.valueTarjeTerapeuta, 0, 0, 0, this.valueTarjeEncargada, 0, this.currentDate)
        return true
      }

      // Transaccion
      if (this.formTemplate.value.transPiso1 == true && this.formTemplate.value.transPiso2 == true && this.formTemplate.value.transTerap == true
        && this.formTemplate.value.transEncarg == true || this.formTemplate.value.transPiso2 == true && this.formTemplate.value.transTerap == true &&
        this.formTemplate.value.transEncarg == true && this.formTemplate.value.transOtro == true || this.formTemplate.value.transPiso1 == true &&
        this.formTemplate.value.transTerap == true && this.formTemplate.value.transEncarg == true && this.formTemplate.value.transOtro == true ||
        this.formTemplate.value.transPiso1 == true && this.formTemplate.value.transPiso2 == true && this.formTemplate.value.transEncarg == true &&
        this.formTemplate.value.transOtro == true || this.formTemplate.value.transPiso1 == true && this.formTemplate.value.transPiso2 == true &&
        this.formTemplate.value.transTerap == true && this.formTemplate.value.transOtro == true) {

        this.formaPagos = "Transaccion"
        this.servicioService.registerServicio(formValue, this.idUnico, 'Transacción', this.fechaActual, this.horaInicialServicio, this.servicioTotal, this.horaFinalServicio,
          this.fechaHoyInicio, 0, 0, 0, this.valueTrans, 0, 0, 0, this.valueTransTerapeuta, 0, 0, 0, this.valueTransEncargada, this.currentDate)
        return true
      }
    }
    return true
  }

  mas3Select(formValue) {

    if (this.formTemplate.value.numberPiso1 > 0 || this.formTemplate.value.numberPiso2 > 0 || this.formTemplate.value.numberTerap > 0 ||
      this.formTemplate.value.numberEncarg > 0 || this.formTemplate.value.numberOtro > 0) {

      // Efectivo
      if (this.formTemplate.value.efectPiso1 == true && this.formTemplate.value.efectPiso2 == true && this.formTemplate.value.efectTerap == true ||
        this.formTemplate.value.efectPiso2 == true && this.formTemplate.value.efectTerap == true && this.formTemplate.value.efectEncarg == true ||
        this.formTemplate.value.efectTerap == true && this.formTemplate.value.efectEncarg == true && this.formTemplate.value.efectOtro == true ||
        this.formTemplate.value.efectPiso1 == true && this.formTemplate.value.efectTerap == true && this.formTemplate.value.efectOtro == true ||
        this.formTemplate.value.efectPiso1 == true && this.formTemplate.value.efectTerap == true && this.formTemplate.value.efectEncarg == true ||
        this.formTemplate.value.efectPiso1 == true && this.formTemplate.value.efectPiso2 == true && this.formTemplate.value.efectEncarg == true ||
        this.formTemplate.value.efectPiso1 == true && this.formTemplate.value.efectEncarg == true && this.formTemplate.value.efectOtro == true ||
        this.formTemplate.value.efectPiso1 == true && this.formTemplate.value.efectPiso2 == true && this.formTemplate.value.efectOtro == true ||
        this.formTemplate.value.efectPiso2 == true && this.formTemplate.value.efectEncarg == true && this.formTemplate.value.efectOtro == true ||
        this.formTemplate.value.efectPiso2 == true && this.formTemplate.value.efectTerap == true && this.formTemplate.value.efectOtro == true) {

        this.formaPagos = "Efectivo"
        this.servicioService.registerServicio(formValue, this.idUnico, 'Efectivo', this.fechaActual, this.horaInicialServicio, this.servicioTotal, this.horaFinalServicio,
          this.fechaHoyInicio, this.valueEfectivo, 0, 0, 0, this.valueEfectTerapeuta, 0, 0, 0, this.valueEfectEncargada, 0, 0, 0, this.currentDate)
        return true
      }

      // Bizum
      if (this.formTemplate.value.bizuPiso1 == true && this.formTemplate.value.bizuPiso2 == true && this.formTemplate.value.bizuTerap == true ||
        this.formTemplate.value.bizuPiso2 == true && this.formTemplate.value.bizuTerap == true && this.formTemplate.value.bizuEncarg == true ||
        this.formTemplate.value.bizuTerap == true && this.formTemplate.value.bizuEncarg == true && this.formTemplate.value.bizuOtro == true ||
        this.formTemplate.value.bizuPiso1 == true && this.formTemplate.value.bizuTerap == true && this.formTemplate.value.bizuOtro == true ||
        this.formTemplate.value.bizuPiso1 == true && this.formTemplate.value.bizuTerap == true && this.formTemplate.value.bizuEncarg == true ||
        this.formTemplate.value.bizuPiso1 == true && this.formTemplate.value.bizuPiso2 == true && this.formTemplate.value.bizuEncarg == true ||
        this.formTemplate.value.bizuPiso1 == true && this.formTemplate.value.bizuEncarg == true && this.formTemplate.value.bizuOtro == true ||
        this.formTemplate.value.bizuPiso1 == true && this.formTemplate.value.bizuPiso2 == true && this.formTemplate.value.bizuOtro == true ||
        this.formTemplate.value.bizuPiso2 == true && this.formTemplate.value.bizuEncarg == true && this.formTemplate.value.bizuOtro == true ||
        this.formTemplate.value.bizuPiso2 == true && this.formTemplate.value.bizuTerap == true && this.formTemplate.value.bizuOtro == true) {

        this.formaPagos = "Bizum"
        this.servicioService.registerServicio(formValue, this.idUnico, 'Bizum', this.fechaActual, this.horaInicialServicio, this.servicioTotal, this.horaFinalServicio,
          this.fechaHoyInicio, 0, this.valueBizum, 0, 0, 0, this.valueBizuTerapeuta, 0, 0, 0, this.valueBizuEncargada, 0, 0, this.currentDate)
        return true
      }

      // Tarjeta
      if (this.formTemplate.value.tarjPiso1 == true && this.formTemplate.value.tarjPiso2 == true && this.formTemplate.value.tarjTerap == true ||
        this.formTemplate.value.tarjPiso2 == true && this.formTemplate.value.tarjTerap == true && this.formTemplate.value.tarjEncarg == true ||
        this.formTemplate.value.tarjTerap == true && this.formTemplate.value.tarjEncarg == true && this.formTemplate.value.tarjOtro == true ||
        this.formTemplate.value.tarjPiso1 == true && this.formTemplate.value.tarjTerap == true && this.formTemplate.value.tarjOtro == true ||
        this.formTemplate.value.tarjPiso1 == true && this.formTemplate.value.tarjTerap == true && this.formTemplate.value.tarjEncarg == true ||
        this.formTemplate.value.tarjPiso1 == true && this.formTemplate.value.tarjPiso2 == true && this.formTemplate.value.tarjEncarg == true ||
        this.formTemplate.value.tarjPiso1 == true && this.formTemplate.value.tarjEncarg == true && this.formTemplate.value.tarjOtro == true ||
        this.formTemplate.value.tarjPiso1 == true && this.formTemplate.value.tarjPiso2 == true && this.formTemplate.value.tarjOtro == true ||
        this.formTemplate.value.tarjPiso2 == true && this.formTemplate.value.tarjEncarg == true && this.formTemplate.value.tarjOtro == true ||
        this.formTemplate.value.tarjPiso2 == true && this.formTemplate.value.tarjTerap == true && this.formTemplate.value.tarjOtro == true) {

        this.formaPagos = "Tarjeta"
        this.servicioService.registerServicio(formValue, this.idUnico, 'Tarjeta', this.fechaActual, this.horaInicialServicio, this.servicioTotal, this.horaFinalServicio,
          this.fechaHoyInicio, 0, 0, this.valueTarjeta, 0, 0, 0, this.valueTarjeTerapeuta, 0, 0, 0, this.valueTarjeEncargada, 0, this.currentDate)
        return true
      }

      // Transaccion
      if (this.formTemplate.value.transPiso1 == true && this.formTemplate.value.transPiso2 == true && this.formTemplate.value.transTerap == true ||
        this.formTemplate.value.transPiso2 == true && this.formTemplate.value.transTerap == true && this.formTemplate.value.transEncarg == true ||
        this.formTemplate.value.transTerap == true && this.formTemplate.value.transEncarg == true && this.formTemplate.value.transOtro == true ||
        this.formTemplate.value.transPiso1 == true && this.formTemplate.value.transTerap == true && this.formTemplate.value.transOtro == true ||
        this.formTemplate.value.transPiso1 == true && this.formTemplate.value.transTerap == true && this.formTemplate.value.transEncarg == true ||
        this.formTemplate.value.transPiso1 == true && this.formTemplate.value.transPiso2 == true && this.formTemplate.value.transEncarg == true ||
        this.formTemplate.value.transPiso1 == true && this.formTemplate.value.transEncarg == true && this.formTemplate.value.transOtro == true ||
        this.formTemplate.value.transPiso1 == true && this.formTemplate.value.transPiso2 == true && this.formTemplate.value.transOtro == true ||
        this.formTemplate.value.transPiso2 == true && this.formTemplate.value.transEncarg == true && this.formTemplate.value.transOtro == true ||
        this.formTemplate.value.transPiso2 == true && this.formTemplate.value.transTerap == true && this.formTemplate.value.transOtro == true) {

        this.formaPagos = "Transaccion"
        this.servicioService.registerServicio(formValue, this.idUnico, 'Transacción', this.fechaActual, this.horaInicialServicio, this.servicioTotal, this.horaFinalServicio,
          this.fechaHoyInicio, 0, 0, 0, this.valueTrans, 0, 0, 0, this.valueTransTerapeuta, 0, 0, 0, this.valueTransEncargada, this.currentDate)
        return true
      }
    }

    return true
  }

  todoenCero() {
    this.formTemplate.value.numberPiso1 = 0
    this.formTemplate.value.numberPiso2 = 0
    this.formTemplate.value.numberEncarg = 0
    this.formTemplate.value.numberTerap = 0
    this.formTemplate.value.numberOtro = 0
    this.formTemplate.value.servicio = 0
    this.formTemplate.value.bebidas = 0
    this.formTemplate.value.tabaco = 0
    this.formTemplate.value.vitaminas = 0
    this.formTemplate.value.propina = 0
    this.formTemplate.value.otros = 0
    this.servicioTotal = 0
  }

  conteoNumber() {

    if (this.formTemplate.value.efectPiso1 == true) this.countEfect += 1
    if (this.formTemplate.value.efectPiso2 == true) this.countEfect += 1
    if (this.formTemplate.value.efectTerap == true) this.countEfect += 1
    if (this.formTemplate.value.efectEncarg == true) this.countEfect += 1
    if (this.formTemplate.value.efectOtro == true) this.countEfect += 1

    if (this.formTemplate.value.bizuPiso1 == true) this.countbizu += 1
    if (this.formTemplate.value.bizuPiso2 == true) this.countbizu += 1
    if (this.formTemplate.value.bizuTerap == true) this.countbizu += 1
    if (this.formTemplate.value.bizuEncarg == true) this.countbizu += 1
    if (this.formTemplate.value.bizuOtro == true) this.countbizu += 1

    if (this.formTemplate.value.tarjPiso1 == true) this.counttarj += 1
    if (this.formTemplate.value.tarjPiso2 == true) this.counttarj += 1
    if (this.formTemplate.value.tarjTerap == true) this.counttarj += 1
    if (this.formTemplate.value.tarjEncarg == true) this.counttarj += 1
    if (this.formTemplate.value.tarjOtro == true) this.counttarj += 1

    if (this.formTemplate.value.transPiso1 == true) this.counttrans += 1
    if (this.formTemplate.value.transPiso2 == true) this.counttrans += 1
    if (this.formTemplate.value.transTerap == true) this.counttrans += 1
    if (this.formTemplate.value.transEncarg == true) this.counttrans += 1
    if (this.formTemplate.value.transOtro == true) this.counttrans += 1
  }

  mas2Select(formValue, piso1, piso2, terapeuta, encargada, otros) {

    if (piso1 > 0 || piso2 > 0 || terapeuta > 0 || encargada > 0 || otros > 0) {

      // Efectivo
      if (this.formTemplate.value.efectPiso1 == true && this.formTemplate.value.efectPiso2 == true || this.formTemplate.value.efectPiso1 == true &&
        this.formTemplate.value.efectTerap == true || this.formTemplate.value.efectPiso1 == true && this.formTemplate.value.efectEncarg == true ||
        this.formTemplate.value.efectPiso1 == true && this.formTemplate.value.efectOtro == true || this.formTemplate.value.efectPiso2 == true &&
        this.formTemplate.value.efectTerap == true || this.formTemplate.value.efectPiso2 == true && this.formTemplate.value.efectEncarg == true ||
        this.formTemplate.value.efectPiso2 == true && this.formTemplate.value.efectOtro == true || this.formTemplate.value.efectTerap == true &&
        this.formTemplate.value.efectOtro == true || this.formTemplate.value.efectEncarg == true && this.formTemplate.value.efectOtro == true ||
        this.formTemplate.value.efectTerap == true && this.formTemplate.value.efectEncarg == true) {

        this.formaPagos = 'Efectivo'
        this.servicioService.registerServicio(formValue, this.idUnico, 'Efectivo', this.fechaActual, this.horaInicialServicio, this.servicioTotal, this.horaFinalServicio,
          this.fechaHoyInicio, this.valueEfectivo, 0, 0, 0, this.valueEfectTerapeuta, 0, 0, 0, this.valueEfectEncargada, 0, 0, 0, this.currentDate)
        return true
      }


      // Bizum
      if (this.formTemplate.value.bizuPiso1 == true && this.formTemplate.value.bizuPiso2 == true || this.formTemplate.value.bizuPiso1 == true &&
        this.formTemplate.value.bizuTerap == true || this.formTemplate.value.bizuPiso1 == true && this.formTemplate.value.bizuEncarg == true ||
        this.formTemplate.value.bizuPiso1 == true && this.formTemplate.value.bizuOtro == true || this.formTemplate.value.bizuPiso2 == true &&
        this.formTemplate.value.bizuTerap == true || this.formTemplate.value.bizuPiso2 == true && this.formTemplate.value.bizuEncarg == true ||
        this.formTemplate.value.bizuPiso2 == true && this.formTemplate.value.bizuOtro == true || this.formTemplate.value.bizuTerap == true &&
        this.formTemplate.value.bizuOtro == true || this.formTemplate.value.bizuEncarg == true && this.formTemplate.value.bizuOtro == true ||
        this.formTemplate.value.bizuTerap == true && this.formTemplate.value.bizuEncarg == true) {

        this.formaPagos = 'Bizum'
        this.servicioService.registerServicio(formValue, this.idUnico, 'Bizum', this.fechaActual, this.horaInicialServicio, this.servicioTotal, this.horaFinalServicio,
          this.fechaHoyInicio, 0, this.valueBizum, 0, 0, 0, this.valueBizuTerapeuta, 0, 0, 0, this.valueBizuEncargada, 0, 0, this.currentDate)
        return true
      }

      // Tarjeta
      if (this.formTemplate.value.tarjPiso1 == true && this.formTemplate.value.tarjPiso2 == true || this.formTemplate.value.tarjPiso1 == true &&
        this.formTemplate.value.tarjTerap == true || this.formTemplate.value.tarjPiso1 == true && this.formTemplate.value.tarjEncarg == true ||
        this.formTemplate.value.tarjPiso1 == true && this.formTemplate.value.tarjOtro == true || this.formTemplate.value.tarjPiso2 == true &&
        this.formTemplate.value.tarjTerap == true || this.formTemplate.value.tarjPiso2 == true && this.formTemplate.value.tarjEncarg == true ||
        this.formTemplate.value.tarjPiso2 == true && this.formTemplate.value.tarjOtro == true || this.formTemplate.value.tarjTerap == true &&
        this.formTemplate.value.tarjOtro == true || this.formTemplate.value.tarjEncarg == true && this.formTemplate.value.tarjOtro == true ||
        this.formTemplate.value.tarjTerap == true && this.formTemplate.value.tarjEncarg == true) {

        this.formaPagos = 'Tarjeta'
        this.servicioService.registerServicio(formValue, this.idUnico, 'Tarjeta', this.fechaActual, this.horaInicialServicio, this.servicioTotal, this.horaFinalServicio,
          this.fechaHoyInicio, 0, 0, this.valueTarjeta, 0, 0, 0, this.valueTarjeTerapeuta, 0, 0, 0, this.valueTarjeEncargada, 0, this.currentDate)
        return true
      }

      // Transaccion
      if (this.formTemplate.value.transPiso1 == true && this.formTemplate.value.transPiso2 == true || this.formTemplate.value.transPiso1 == true &&
        this.formTemplate.value.transTerap == true || this.formTemplate.value.transPiso1 == true && this.formTemplate.value.transEncarg == true ||
        this.formTemplate.value.transPiso1 == true && this.formTemplate.value.transOtro == true || this.formTemplate.value.transPiso2 == true &&
        this.formTemplate.value.transTerap == true || this.formTemplate.value.transPiso2 == true && this.formTemplate.value.transEncarg == true ||
        this.formTemplate.value.transPiso2 == true && this.formTemplate.value.transOtro == true || this.formTemplate.value.transTerap == true &&
        this.formTemplate.value.transOtro == true || this.formTemplate.value.transEncarg == true && this.formTemplate.value.transOtro == true ||
        this.formTemplate.value.transTerap == true && this.formTemplate.value.transEncarg == true) {

        this.formaPagos = 'Transaccion'
        this.servicioService.registerServicio(formValue, this.idUnico, 'Transacción', this.fechaActual, this.horaInicialServicio, this.servicioTotal, this.horaFinalServicio,
          this.fechaHoyInicio, 0, 0, 0, this.valueTrans, 0, 0, 0, this.valueTransTerapeuta, 0, 0, 0, this.valueTransEncargada, this.currentDate)
        return true
      }
    }

    return true
  }

  mas2SelectUpdate(formValue, piso1, piso2, terapeuta, encargada, otros, idDocument) {

    if (piso1 > 0 || piso2 > 0 || terapeuta > 0 || encargada > 0 || otros > 0) {

      // Efectivo
      if (this.formaPagos == 'Bizum' || this.formaPagos == 'Tarjeta' || this.formaPagos == 'Transaccion') {
        if (this.formTemplate.value.efectPiso1 == true && this.formTemplate.value.efectPiso2 == true || this.formTemplate.value.efectPiso1 == true &&
          this.formTemplate.value.efectTerap == true || this.formTemplate.value.efectPiso1 == true && this.formTemplate.value.efectEncarg == true ||
          this.formTemplate.value.efectPiso1 == true && this.formTemplate.value.efectOtro == true || this.formTemplate.value.efectPiso2 == true &&
          this.formTemplate.value.efectTerap == true || this.formTemplate.value.efectPiso2 == true && this.formTemplate.value.efectEncarg == true ||
          this.formTemplate.value.efectPiso2 == true && this.formTemplate.value.efectOtro == true || this.formTemplate.value.efectTerap == true &&
          this.formTemplate.value.efectOtro == true || this.formTemplate.value.efectEncarg == true && this.formTemplate.value.efectOtro == true ||
          this.formTemplate.value.efectTerap == true && this.formTemplate.value.efectEncarg == true) {

          if (this.formTemplate.value.efectPiso1 == true) this.servicioService.updateNumberPiso1(idDocument, piso1)
          if (this.formTemplate.value.efectPiso2 == true) this.servicioService.updateNumberPiso2(idDocument, piso2)
          if (this.formTemplate.value.efectEncarg == true) this.servicioService.updateNumberEncargada(idDocument, encargada)
          if (this.formTemplate.value.efectTerap == true) this.servicioService.updateNumberTerap(idDocument, terapeuta)
          if (this.formTemplate.value.efectOtro == true) this.servicioService.updateNumberOtros(idDocument, otros)

          this.todoenCero()

          this.servicioService.registerServicio(formValue, this.idUnico, 'Efectivo', this.fechaActual, this.horaInicialServicio, this.servicioTotal, this.horaFinalServicio,
            this.fechaHoyInicio, this.valueEfectivo, 0, 0, 0, this.valueEfectTerapeuta, 0, 0, 0,
            this.valueEfectEncargada, 0, 0, 0, this.currentDate).then((register) => {

              if (this.formTemplate.value.efectPiso1 == true) this.servicioService.updateWithValueNumberPiso1(register.id, this.idUnico, piso1)
              if (this.formTemplate.value.efectPiso2 == true) this.servicioService.updateWithValueNumberPiso2(register.id, this.idUnico, piso2)
              if (this.formTemplate.value.efectEncarg == true) this.servicioService.updateWithValueNumberEncargada(register.id, this.idUnico, encargada)
              if (this.formTemplate.value.efectTerap == true) this.servicioService.updateWithValueNumberTerap(register.id, this.idUnico, terapeuta)
              if (this.formTemplate.value.efectOtro == true) this.servicioService.updateWithValueNumberOtros(register.id, this.idUnico, otros)
            })
          return true
        }
      }

      // Bizum
      if (this.formaPagos == 'Efectivo' || this.formaPagos == 'Tarjeta' || this.formaPagos == 'Transaccion') {
        if (this.formTemplate.value.bizuPiso1 == true && this.formTemplate.value.bizuPiso2 == true || this.formTemplate.value.bizuPiso1 == true &&
          this.formTemplate.value.bizuTerap == true || this.formTemplate.value.bizuPiso1 == true && this.formTemplate.value.bizuEncarg == true ||
          this.formTemplate.value.bizuPiso1 == true && this.formTemplate.value.bizuOtro == true || this.formTemplate.value.bizuPiso2 == true &&
          this.formTemplate.value.bizuTerap == true || this.formTemplate.value.bizuPiso2 == true && this.formTemplate.value.bizuEncarg == true ||
          this.formTemplate.value.bizuPiso2 == true && this.formTemplate.value.bizuOtro == true || this.formTemplate.value.bizuTerap == true &&
          this.formTemplate.value.bizuOtro == true || this.formTemplate.value.bizuEncarg == true && this.formTemplate.value.bizuOtro == true ||
          this.formTemplate.value.bizuTerap == true && this.formTemplate.value.bizuEncarg == true) {

          if (this.formTemplate.value.bizuPiso1 == true) this.servicioService.updateNumberPiso1(idDocument, piso1)
          if (this.formTemplate.value.bizuPiso2 == true) this.servicioService.updateNumberPiso2(idDocument, piso2)
          if (this.formTemplate.value.bizuEncarg == true) this.servicioService.updateNumberEncargada(idDocument, encargada)
          if (this.formTemplate.value.bizuTerap == true) this.servicioService.updateNumberTerap(idDocument, terapeuta)
          if (this.formTemplate.value.bizuOtro == true) this.servicioService.updateNumberOtros(idDocument, otros)

          this.todoenCero()

          this.servicioService.registerServicio(formValue, this.idUnico, 'Bizum', this.fechaActual, this.horaInicialServicio, this.servicioTotal, this.horaFinalServicio,
            this.fechaHoyInicio, 0, this.valueBizum, 0, 0, 0, this.valueBizuTerapeuta, 0, 0, 0,
            this.valueBizuEncargada, 0, 0, this.currentDate).then((register) => {

              if (this.formTemplate.value.bizuPiso1 == true) this.servicioService.updateWithValueNumberPiso1(register.id, this.idUnico, piso1)
              if (this.formTemplate.value.bizuPiso2 == true) this.servicioService.updateWithValueNumberPiso2(register.id, this.idUnico, piso2)
              if (this.formTemplate.value.bizuEncarg == true) this.servicioService.updateWithValueNumberEncargada(register.id, this.idUnico, encargada)
              if (this.formTemplate.value.bizuTerap == true) this.servicioService.updateWithValueNumberTerap(register.id, this.idUnico, terapeuta)
              if (this.formTemplate.value.bizuOtro == true) this.servicioService.updateWithValueNumberOtros(register.id, this.idUnico, otros)

            })
          return true
        }
      }

      // Tarjeta
      if (this.formaPagos == 'Efectivo' || this.formaPagos == 'Bizum' || this.formaPagos == 'Transaccion') {
        if (this.formTemplate.value.tarjPiso1 == true && this.formTemplate.value.tarjPiso2 == true || this.formTemplate.value.tarjPiso1 == true &&
          this.formTemplate.value.tarjTerap == true || this.formTemplate.value.tarjPiso1 == true && this.formTemplate.value.tarjEncarg == true ||
          this.formTemplate.value.tarjPiso1 == true && this.formTemplate.value.tarjOtro == true || this.formTemplate.value.tarjPiso2 == true &&
          this.formTemplate.value.tarjTerap == true || this.formTemplate.value.tarjPiso2 == true && this.formTemplate.value.tarjEncarg == true ||
          this.formTemplate.value.tarjPiso2 == true && this.formTemplate.value.tarjOtro == true || this.formTemplate.value.tarjTerap == true &&
          this.formTemplate.value.tarjOtro == true || this.formTemplate.value.tarjEncarg == true && this.formTemplate.value.tarjOtro == true ||
          this.formTemplate.value.tarjTerap == true && this.formTemplate.value.tarjEncarg == true) {

          if (this.formTemplate.value.tarjPiso1 == true) this.servicioService.updateNumberPiso1(idDocument, piso1)
          if (this.formTemplate.value.tarjPiso2 == true) this.servicioService.updateNumberPiso2(idDocument, piso2)
          if (this.formTemplate.value.tarjEncarg == true) this.servicioService.updateNumberEncargada(idDocument, encargada)
          if (this.formTemplate.value.tarjTerap == true) this.servicioService.updateNumberTerap(idDocument, terapeuta)
          if (this.formTemplate.value.tarjOtro == true) this.servicioService.updateNumberOtros(idDocument, otros)

          this.todoenCero()

          this.servicioService.registerServicio(formValue, this.idUnico, 'Tarjeta', this.fechaActual, this.horaInicialServicio, this.servicioTotal, this.horaFinalServicio,
            this.fechaHoyInicio, 0, 0, this.valueTarjeta, 0, 0, 0, this.valueTarjeTerapeuta, 0, 0, 0,
            this.valueTarjeEncargada, 0, this.currentDate).then((register) => {

              if (this.formTemplate.value.tarjPiso1 == true) this.servicioService.updateWithValueNumberPiso1(register.id, this.idUnico, piso1)
              if (this.formTemplate.value.tarjPiso2 == true) this.servicioService.updateWithValueNumberPiso2(register.id, this.idUnico, piso2)
              if (this.formTemplate.value.tarjEncarg == true) this.servicioService.updateWithValueNumberEncargada(register.id, this.idUnico, encargada)
              if (this.formTemplate.value.tarjTerap == true) this.servicioService.updateWithValueNumberTerap(register.id, this.idUnico, terapeuta)
              if (this.formTemplate.value.tarjOtro == true) this.servicioService.updateWithValueNumberOtros(register.id, this.idUnico, otros)

            })
          return true
        }
      }

      // Transaccion
      if (this.formaPagos == 'Efectivo' || this.formaPagos == 'Bizum' || this.formaPagos == 'Tarjeta') {
        if (this.formTemplate.value.transPiso1 == true && this.formTemplate.value.transPiso2 == true || this.formTemplate.value.transPiso1 == true &&
          this.formTemplate.value.transTerap == true || this.formTemplate.value.transPiso1 == true && this.formTemplate.value.transEncarg == true ||
          this.formTemplate.value.transPiso1 == true && this.formTemplate.value.transOtro == true || this.formTemplate.value.transPiso2 == true &&
          this.formTemplate.value.transTerap == true || this.formTemplate.value.transPiso2 == true && this.formTemplate.value.transEncarg == true ||
          this.formTemplate.value.transPiso2 == true && this.formTemplate.value.transOtro == true || this.formTemplate.value.transTerap == true &&
          this.formTemplate.value.transOtro == true || this.formTemplate.value.transEncarg == true && this.formTemplate.value.transOtro == true ||
          this.formTemplate.value.transTerap == true && this.formTemplate.value.transEncarg == true) {

          if (this.formTemplate.value.transPiso1 == true) this.servicioService.updateNumberPiso1(idDocument, piso1)
          if (this.formTemplate.value.transPiso2 == true) this.servicioService.updateNumberPiso2(idDocument, piso2)
          if (this.formTemplate.value.transEncarg == true) this.servicioService.updateNumberEncargada(idDocument, encargada)
          if (this.formTemplate.value.transTerap == true) this.servicioService.updateNumberTerap(idDocument, terapeuta)
          if (this.formTemplate.value.transOtro == true) this.servicioService.updateNumberOtros(idDocument, otros)

          this.todoenCero()

          this.servicioService.registerServicio(formValue, this.idUnico, 'Transacción', this.fechaActual, this.horaInicialServicio, this.servicioTotal, this.horaFinalServicio,
            this.fechaHoyInicio, 0, 0, 0, this.valueTrans, 0, 0, 0, this.valueTransTerapeuta, 0, 0, 0,
            this.valueTransEncargada, this.currentDate).then((register) => {

              if (this.formTemplate.value.transPiso1 == true) this.servicioService.updateWithValueNumberPiso1(register.id, this.idUnico, piso1)
              if (this.formTemplate.value.transPiso2 == true) this.servicioService.updateWithValueNumberPiso2(register.id, this.idUnico, piso2)
              if (this.formTemplate.value.transEncarg == true) this.servicioService.updateWithValueNumberEncargada(register.id, this.idUnico, encargada)
              if (this.formTemplate.value.transTerap == true) this.servicioService.updateWithValueNumberTerap(register.id, this.idUnico, terapeuta)
              if (this.formTemplate.value.transOtro == true) this.servicioService.updateWithValueNumberOtros(register.id, this.idUnico, otros)

            })
          return true
        }
      }
    }

    return true
  }

  mas1Select(formValue, piso1, piso2, terapeuta, encargada, otros) {

    if (piso1 > 0 || piso2 > 0 || terapeuta > 0 || encargada > 0 || otros > 0) {

      // Efectivo

      if (this.formTemplate.value.efectPiso1 == true || this.formTemplate.value.efectPiso2 == true || this.formTemplate.value.efectTerap == true ||
        this.formTemplate.value.efectEncarg == true || this.formTemplate.value.efectOtro == true) {

        this.formaPagos = 'Efectivo'
        this.completoEfectivo = 1
        this.servicioService.registerServicio(formValue, this.idUnico, 'Efectivo', this.fechaActual, this.horaInicialServicio, this.servicioTotal, this.horaFinalServicio,
          this.fechaHoyInicio, this.valueEfectivo, 0, 0, 0, this.valueEfectTerapeuta, 0, 0, 0, this.valueEfectEncargada, 0, 0, 0, this.currentDate)
        return true
      }

      // Bizum
      if (this.formTemplate.value.bizuPiso1 == true || this.formTemplate.value.bizuPiso2 == true || this.formTemplate.value.bizuTerap == true ||
        this.formTemplate.value.bizuEncarg == true || this.formTemplate.value.bizuOtro == true) {

        this.formaPagos = 'Bizum'
        this.completoBizum = 1
        this.servicioService.registerServicio(formValue, this.idUnico, 'Bizum', this.fechaActual, this.horaInicialServicio, this.servicioTotal, this.horaFinalServicio,
          this.fechaHoyInicio, 0, this.valueBizum, 0, 0, 0, this.valueBizuTerapeuta, 0, 0, 0, this.valueBizuEncargada, 0, 0, this.currentDate)
        return true
      }

      // Tarjeta
      if (this.formTemplate.value.tarjPiso1 == true || this.formTemplate.value.tarjPiso2 == true || this.formTemplate.value.tarjTerap == true ||
        this.formTemplate.value.tarjEncarg == true || this.formTemplate.value.tarjOtro == true) {

        this.formaPagos = 'Tarjeta'
        this.completoTarjeta = 1
        this.servicioService.registerServicio(formValue, this.idUnico, 'Tarjeta', this.fechaActual, this.horaInicialServicio, this.servicioTotal, this.horaFinalServicio,
          this.fechaHoyInicio, 0, 0, this.valueTarjeta, 0, 0, 0, this.valueTarjeTerapeuta, 0, 0, 0, this.valueTarjeEncargada, 0, this.currentDate)
        return true
      }

      // Transaccion
      if (this.formTemplate.value.transPiso1 == true || this.formTemplate.value.transPiso2 == true || this.formTemplate.value.transTerap == true ||
        this.formTemplate.value.transEncarg == true || this.formTemplate.value.transOtro == true) {

        this.formaPagos = 'Transaccion'
        this.completoTrans = 1
        this.servicioService.registerServicio(formValue, this.idUnico, 'Transacción', this.fechaActual, this.horaInicialServicio, this.servicioTotal, this.horaFinalServicio,
          this.fechaHoyInicio, 0, 0, 0, this.valueTrans, 0, 0, 0, this.valueTransTerapeuta, 0, 0, 0, this.valueTransEncargada, this.currentDate)
        return true
      }
    }

    return true
  }

  mas1SelectUpdate(formValue, piso1, piso2, terapeuta, encargada, otros, idDocument) {

    if (piso1 > 0 || piso2 > 0 || terapeuta > 0 || encargada > 0 || otros > 0) {

      // Efectivo
      if (this.formaPagos == 'Bizum' || this.formaPagos == 'Tarjeta' || this.formaPagos == 'Transaccion') {
        if (this.formTemplate.value.efectPiso1 == true || this.formTemplate.value.efectPiso2 == true || this.formTemplate.value.efectTerap == true ||
          this.formTemplate.value.efectEncarg == true || this.formTemplate.value.efectOtro == true) {

          if (this.formTemplate.value.efectPiso1 == true) this.servicioService.updateNumberPiso1(idDocument, piso1)
          if (this.formTemplate.value.efectPiso2 == true) this.servicioService.updateNumberPiso2(idDocument, piso2)
          if (this.formTemplate.value.efectEncarg == true) this.servicioService.updateNumberEncargada(idDocument, encargada)
          if (this.formTemplate.value.efectTerap == true) this.servicioService.updateNumberTerap(idDocument, terapeuta)
          if (this.formTemplate.value.efectOtro == true) this.servicioService.updateNumberOtros(idDocument, otros)

          this.todoenCero()
          this.completoEfectivo = 1

          this.servicioService.registerServicio(formValue, this.idUnico, 'Efectivo', this.fechaActual, this.horaInicialServicio, this.servicioTotal, this.horaFinalServicio,
            this.fechaHoyInicio, this.valueEfectivo, 0, 0, 0, this.valueEfectTerapeuta, 0, 0, 0,
            this.valueEfectEncargada, 0, 0, 0, this.currentDate).then((register) => {

              if (this.formTemplate.value.efectPiso1 == true) this.servicioService.updateWithValueNumberPiso1(register.id, this.idUnico, piso1)
              if (this.formTemplate.value.efectPiso2 == true) this.servicioService.updateWithValueNumberPiso2(register.id, this.idUnico, piso2)
              if (this.formTemplate.value.efectEncarg == true) this.servicioService.updateWithValueNumberEncargada(register.id, this.idUnico, encargada)
              if (this.formTemplate.value.efectTerap == true) this.servicioService.updateWithValueNumberTerap(register.id, this.idUnico, terapeuta)
              if (this.formTemplate.value.efectOtro == true) this.servicioService.updateWithValueNumberOtros(register.id, this.idUnico, otros)

            })
          return true
        }
      }

      // Bizum
      if (this.formaPagos == 'Efectivo' || this.formaPagos == 'Tarjeta' || this.formaPagos == 'Transaccion') {
        if (this.formTemplate.value.bizuPiso1 == true || this.formTemplate.value.bizuPiso2 == true || this.formTemplate.value.bizuTerap == true ||
          this.formTemplate.value.bizuEncarg == true || this.formTemplate.value.bizuOtro == true) {

          if (this.formTemplate.value.bizuPiso1 == true) this.servicioService.updateNumberPiso1(idDocument, piso1)
          if (this.formTemplate.value.bizuPiso2 == true) this.servicioService.updateNumberPiso2(idDocument, piso2)
          if (this.formTemplate.value.bizuEncarg == true) this.servicioService.updateNumberEncargada(idDocument, encargada)
          if (this.formTemplate.value.bizuTerap == true) this.servicioService.updateNumberTerap(idDocument, terapeuta)
          if (this.formTemplate.value.bizuOtro == true) this.servicioService.updateNumberOtros(idDocument, otros)

          this.todoenCero()
          this.completoBizum = 1

          this.servicioService.registerServicio(formValue, this.idUnico, 'Bizum', this.fechaActual, this.horaInicialServicio, this.servicioTotal, this.horaFinalServicio,
            this.fechaHoyInicio, 0, this.valueBizum, 0, 0, 0, this.valueBizuTerapeuta, 0, 0, 0,
            this.valueBizuEncargada, 0, 0, this.currentDate).then((register) => {

              if (this.formTemplate.value.bizuPiso1 == true) this.servicioService.updateWithValueNumberPiso1(register.id, this.idUnico, piso1)
              if (this.formTemplate.value.bizuPiso2 == true) this.servicioService.updateWithValueNumberPiso2(register.id, this.idUnico, piso2)
              if (this.formTemplate.value.bizuEncarg == true) this.servicioService.updateWithValueNumberEncargada(register.id, this.idUnico, encargada)
              if (this.formTemplate.value.bizuTerap == true) this.servicioService.updateWithValueNumberTerap(register.id, this.idUnico, terapeuta)
              if (this.formTemplate.value.bizuOtro == true) this.servicioService.updateWithValueNumberOtros(register.id, this.idUnico, otros)

            })
          return true
        }
      }

      // Tarjeta
      if (this.formaPagos == 'Efectivo' || this.formaPagos == 'Bizum' || this.formaPagos == 'Transaccion') {
        if (this.formTemplate.value.tarjPiso1 == true || this.formTemplate.value.tarjPiso2 == true || this.formTemplate.value.tarjTerap == true ||
          this.formTemplate.value.tarjEncarg == true || this.formTemplate.value.tarjOtro == true) {

          if (this.formTemplate.value.tarjPiso1 == true) this.servicioService.updateNumberPiso1(idDocument, piso1)
          if (this.formTemplate.value.tarjPiso2 == true) this.servicioService.updateNumberPiso2(idDocument, piso2)
          if (this.formTemplate.value.tarjEncarg == true) this.servicioService.updateNumberEncargada(idDocument, encargada)
          if (this.formTemplate.value.tarjTerap == true) this.servicioService.updateNumberTerap(idDocument, terapeuta)
          if (this.formTemplate.value.tarjOtro == true) this.servicioService.updateNumberOtros(idDocument, otros)

          this.todoenCero()
          this.completoTarjeta = 1

          this.servicioService.registerServicio(formValue, this.idUnico, 'Tarjeta', this.fechaActual, this.horaInicialServicio, this.servicioTotal, this.horaFinalServicio,
            this.fechaHoyInicio, 0, 0, this.valueTarjeta, 0, 0, 0, this.valueTarjeTerapeuta, 0, 0, 0,
            this.valueTarjeEncargada, 0, this.currentDate).then((register) => {

              if (this.formTemplate.value.tarjPiso1 == true) this.servicioService.updateWithValueNumberPiso1(register.id, this.idUnico, piso1)
              if (this.formTemplate.value.tarjPiso2 == true) this.servicioService.updateWithValueNumberPiso2(register.id, this.idUnico, piso2)
              if (this.formTemplate.value.tarjEncarg == true) this.servicioService.updateWithValueNumberEncargada(register.id, this.idUnico, encargada)
              if (this.formTemplate.value.tarjTerap == true) this.servicioService.updateWithValueNumberTerap(register.id, this.idUnico, terapeuta)
              if (this.formTemplate.value.tarjOtro == true) this.servicioService.updateWithValueNumberOtros(register.id, this.idUnico, otros)

            })
          return true
        }
      }

      // Transaccion
      if (this.formaPagos == 'Efectivo' || this.formaPagos == 'Bizum' || this.formaPagos == 'Tarjeta') {
        if (this.formTemplate.value.transPiso1 == true || this.formTemplate.value.transPiso2 == true || this.formTemplate.value.transTerap == true ||
          this.formTemplate.value.transEncarg == true || this.formTemplate.value.transOtro == true) {

          if (this.formTemplate.value.transPiso1 == true) this.servicioService.updateNumberPiso1(idDocument, piso1)
          if (this.formTemplate.value.transPiso2 == true) this.servicioService.updateNumberPiso2(idDocument, piso2)
          if (this.formTemplate.value.transEncarg == true) this.servicioService.updateNumberEncargada(idDocument, encargada)
          if (this.formTemplate.value.transTerap == true) this.servicioService.updateNumberTerap(idDocument, terapeuta)
          if (this.formTemplate.value.transOtro == true) this.servicioService.updateNumberOtros(idDocument, otros)

          this.todoenCero()
          this.completoTrans = 1

          this.servicioService.registerServicio(formValue, this.idUnico, 'Transacción', this.fechaActual, this.horaInicialServicio, this.servicioTotal, this.horaFinalServicio,
            this.fechaHoyInicio, 0, 0, 0, this.valueTrans, 0, 0, 0, this.valueTransTerapeuta, 0, 0, 0,
            this.valueTransEncargada, this.currentDate).then((register) => {

              if (this.formTemplate.value.transPiso1 == true) this.servicioService.updateWithValueNumberPiso1(register.id, this.idUnico, piso1)
              if (this.formTemplate.value.transPiso2 == true) this.servicioService.updateWithValueNumberPiso2(register.id, this.idUnico, piso2)
              if (this.formTemplate.value.transEncarg == true) this.servicioService.updateWithValueNumberEncargada(register.id, this.idUnico, encargada)
              if (this.formTemplate.value.transTerap == true) this.servicioService.updateWithValueNumberTerap(register.id, this.idUnico, terapeuta)
              if (this.formTemplate.value.transOtro == true) this.servicioService.updateWithValueNumberOtros(register.id, this.idUnico, otros)

            })
          return true
        }
      }
    }

    return true
  }

  efectivoUpdate(formValue, piso1, piso2, terapeuta, encargada, otros, idDocument) {
    if (this.formTemplate.value.efectPiso1 == true || this.formTemplate.value.efectPiso2 == true || this.formTemplate.value.efectTerap == true ||
      this.formTemplate.value.efectEncarg == true || this.formTemplate.value.efectOtro == true) {

      if (this.formTemplate.value.efectPiso1 == true) this.servicioService.updateNumberPiso1(idDocument, piso1)
      if (this.formTemplate.value.efectPiso2 == true) this.servicioService.updateNumberPiso2(idDocument, piso2)
      if (this.formTemplate.value.efectEncarg == true) this.servicioService.updateNumberEncargada(idDocument, encargada)
      if (this.formTemplate.value.efectTerap == true) this.servicioService.updateNumberTerap(idDocument, terapeuta)
      if (this.formTemplate.value.efectOtro == true) this.servicioService.updateNumberOtros(idDocument, otros)

      this.todoenCero()
      this.completoEfectivo = 1

      this.servicioService.registerServicio(formValue, this.idUnico, 'Efectivo', this.fechaActual, this.horaInicialServicio, this.servicioTotal, this.horaFinalServicio,
        this.fechaHoyInicio, this.valueEfectivo, 0, 0, 0, this.valueEfectTerapeuta, 0, 0, 0,
        this.valueEfectEncargada, 0, 0, 0, this.currentDate).then((register) => {

          if (this.formTemplate.value.efectPiso1 == true) this.servicioService.updateWithValueNumberPiso1(register.id, this.idUnico, piso1)
          if (this.formTemplate.value.efectPiso2 == true) this.servicioService.updateWithValueNumberPiso2(register.id, this.idUnico, piso2)
          if (this.formTemplate.value.efectEncarg == true) this.servicioService.updateWithValueNumberEncargada(register.id, this.idUnico, encargada)
          if (this.formTemplate.value.efectTerap == true) this.servicioService.updateWithValueNumberTerap(register.id, this.idUnico, terapeuta)
          if (this.formTemplate.value.efectOtro == true) this.servicioService.updateWithValueNumberOtros(register.id, this.idUnico, otros)

        })
      return true
    }
    return true
  }

  bizumUpdate(formValue, piso1, piso2, terapeuta, encargada, otros, idDocument) {
    if (this.formTemplate.value.bizuPiso1 == true || this.formTemplate.value.bizuPiso2 == true || this.formTemplate.value.bizuTerap == true ||
      this.formTemplate.value.bizuEncarg == true || this.formTemplate.value.bizuOtro == true) {

      if (this.formTemplate.value.bizuPiso1 == true) this.servicioService.updateNumberPiso1(idDocument, piso1)
      if (this.formTemplate.value.bizuPiso2 == true) this.servicioService.updateNumberPiso2(idDocument, piso2)
      if (this.formTemplate.value.bizuEncarg == true) this.servicioService.updateNumberEncargada(idDocument, encargada)
      if (this.formTemplate.value.bizuTerap == true) this.servicioService.updateNumberTerap(idDocument, terapeuta)
      if (this.formTemplate.value.bizuOtro == true) this.servicioService.updateNumberOtros(idDocument, otros)

      this.todoenCero()
      this.completoBizum = 1

      this.servicioService.registerServicio(formValue, this.idUnico, 'Bizum', this.fechaActual, this.horaInicialServicio, this.servicioTotal, this.horaFinalServicio,
        this.fechaHoyInicio, 0, this.valueBizum, 0, 0, 0, this.valueBizuTerapeuta, 0, 0, 0,
        this.valueBizuEncargada, 0, 0, this.currentDate).then((register) => {

          if (this.formTemplate.value.bizuPiso1 == true) this.servicioService.updateWithValueNumberPiso1(register.id, this.idUnico, piso1)
          if (this.formTemplate.value.bizuPiso2 == true) this.servicioService.updateWithValueNumberPiso2(register.id, this.idUnico, piso2)
          if (this.formTemplate.value.bizuEncarg == true) this.servicioService.updateWithValueNumberEncargada(register.id, this.idUnico, encargada)
          if (this.formTemplate.value.bizuTerap == true) this.servicioService.updateWithValueNumberTerap(register.id, this.idUnico, terapeuta)
          if (this.formTemplate.value.bizuOtro == true) this.servicioService.updateWithValueNumberOtros(register.id, this.idUnico, otros)

        })
      return true
    }
    return true
  }

  tarjetaUpdate(formValue, piso1, piso2, terapeuta, encargada, otros, idDocument) {
    if (this.formTemplate.value.tarjPiso1 == true || this.formTemplate.value.tarjPiso2 == true || this.formTemplate.value.tarjTerap == true ||
      this.formTemplate.value.tarjEncarg == true || this.formTemplate.value.tarjOtro == true) {

      if (this.formTemplate.value.tarjPiso1 == true) this.servicioService.updateNumberPiso1(idDocument, piso1)
      if (this.formTemplate.value.tarjPiso2 == true) this.servicioService.updateNumberPiso2(idDocument, piso2)
      if (this.formTemplate.value.tarjEncarg == true) this.servicioService.updateNumberEncargada(idDocument, encargada)
      if (this.formTemplate.value.tarjTerap == true) this.servicioService.updateNumberTerap(idDocument, terapeuta)
      if (this.formTemplate.value.tarjOtro == true) this.servicioService.updateNumberOtros(idDocument, otros)

      this.todoenCero()
      this.completoTarjeta = 1

      this.servicioService.registerServicio(formValue, this.idUnico, 'Tarjeta', this.fechaActual, this.horaInicialServicio, this.servicioTotal, this.horaFinalServicio,
        this.fechaHoyInicio, 0, 0, this.valueTarjeta, 0, 0, 0, this.valueTarjeTerapeuta, 0, 0, 0,
        this.valueTarjeEncargada, 0, this.currentDate).then((register) => {

          if (this.formTemplate.value.tarjPiso1 == true) this.servicioService.updateWithValueNumberPiso1(register.id, this.idUnico, piso1)
          if (this.formTemplate.value.tarjPiso2 == true) this.servicioService.updateWithValueNumberPiso2(register.id, this.idUnico, piso2)
          if (this.formTemplate.value.tarjEncarg == true) this.servicioService.updateWithValueNumberEncargada(register.id, this.idUnico, encargada)
          if (this.formTemplate.value.tarjTerap == true) this.servicioService.updateWithValueNumberTerap(register.id, this.idUnico, terapeuta)
          if (this.formTemplate.value.tarjOtro == true) this.servicioService.updateWithValueNumberOtros(register.id, this.idUnico, otros)

        })
      return true
    }
    return true
  }

  transaccionUpdate(formValue, piso1, piso2, terapeuta, encargada, otros, idDocument) {
    if (this.formTemplate.value.transPiso1 == true || this.formTemplate.value.transPiso2 == true || this.formTemplate.value.transTerap == true ||
      this.formTemplate.value.transEncarg == true || this.formTemplate.value.transOtro == true) {

      if (this.formTemplate.value.transPiso1 == true) this.servicioService.updateNumberPiso1(idDocument, piso1)
      if (this.formTemplate.value.transPiso2 == true) this.servicioService.updateNumberPiso2(idDocument, piso2)
      if (this.formTemplate.value.transEncarg == true) this.servicioService.updateNumberEncargada(idDocument, encargada)
      if (this.formTemplate.value.transTerap == true) this.servicioService.updateNumberTerap(idDocument, terapeuta)
      if (this.formTemplate.value.transOtro == true) this.servicioService.updateNumberOtros(idDocument, otros)

      this.todoenCero()
      this.completoTrans = 1

      this.servicioService.registerServicio(formValue, this.idUnico, 'Transacción', this.fechaActual, this.horaInicialServicio, this.servicioTotal, this.horaFinalServicio,
        this.fechaHoyInicio, 0, 0, 0, this.valueTrans, 0, 0, 0, this.valueTransTerapeuta, 0, 0, 0,
        this.valueTransEncargada, this.currentDate).then((register) => {

          if (this.formTemplate.value.transPiso1 == true) this.servicioService.updateWithValueNumberPiso1(register.id, this.idUnico, piso1)
          if (this.formTemplate.value.transPiso2 == true) this.servicioService.updateWithValueNumberPiso2(register.id, this.idUnico, piso2)
          if (this.formTemplate.value.transEncarg == true) this.servicioService.updateWithValueNumberEncargada(register.id, this.idUnico, encargada)
          if (this.formTemplate.value.transTerap == true) this.servicioService.updateWithValueNumberTerap(register.id, this.idUnico, terapeuta)
          if (this.formTemplate.value.transOtro == true) this.servicioService.updateWithValueNumberOtros(register.id, this.idUnico, otros)

        })
      return true
    }
    return true
  }

  // Agregamos los servicios
  addServicio(formValue): any {
    this.crearIdUnico()
    if (this.formTemplate.value.terapeuta != '') {
      if (this.formTemplate.value.encargada != '') {
        if (this.formTemplate.value.servicio != null) {
          this.fechadeHoy()
          if (this.restamosCobro == 0) {
            if (!this.validacionFormasPago()) return
            if (!this.validacionesFormaPagoAdd()) return
            this.totalServicio()
            this.efectCheckToggle(this.validateEfect)
            this.bizumCheckToggle(this.validateBizum)
            this.tarjCheckToggle(this.validateTarjeta)
            this.transCheckToggle(this.validateTrans)
            this.encargadaAndTerapeuta()

            let piso1 = 0, piso2 = 0, terapeuta = 0, encargada = 0, otros = 0

            piso1 = this.formTemplate.value.numberPiso1
            piso2 = this.formTemplate.value.numberPiso2
            terapeuta = this.formTemplate.value.numberTerap
            encargada = this.formTemplate.value.numberEncarg
            otros = this.formTemplate.value.numberOtro

            this.conteoNumber()

            if (!this.TodosCobroSelect(formValue)) return
            if (!this.mas4Select(formValue)) return

            if (this.formaPagos == "") {
              if (this.countEfect == 3 || this.countbizu == 3 || this.counttarj == 3 || this.counttrans == 3) {
                if (!this.mas3Select(formValue)) return
              }
            }

            if (this.formaPagos == "") {
              if (this.countEfect == 2 || this.countbizu == 2 || this.counttarj == 2 || this.counttrans == 2) {
                if (!this.mas2Select(formValue, piso1, piso2, terapeuta, encargada, otros)) return
              }
            }

            if (this.formaPagos != "") {
              if (this.countEfect == 3 || this.countbizu == 3 || this.counttarj == 3 || this.counttrans == 3 ||
                this.countEfect == 2 || this.countbizu == 2 || this.counttarj == 2 || this.counttrans == 2) {
                this.servicioService.getIdUnico(this.idUnico).then((idUnicoExit) => {
                  if (idUnicoExit.length > 0) {
                    if (!this.mas2SelectUpdate(formValue, piso1, piso2, terapeuta, encargada, otros, idUnicoExit[0]['idDocument'])) return
                  }
                })
              }
            }

            if (this.formaPagos != "") {
              if (this.countEfect == 1 || this.countbizu == 1 || this.counttarj == 1 || this.counttrans == 1)
                if (this.countEfect == 4 || this.countbizu == 4 || this.counttarj == 4 || this.counttrans == 4 ||
                  this.countEfect == 3 || this.countbizu == 3 || this.counttarj == 3 || this.counttrans == 3 ||
                  this.countEfect == 2 || this.countbizu == 2 || this.counttarj == 2 || this.counttrans == 2) {
                  this.servicioService.getIdUnico(this.idUnico).then((idUnicoExit) => {
                    if (idUnicoExit.length > 0) {
                      if (!this.mas1SelectUpdate(formValue, piso1, piso2, terapeuta, encargada, otros, idUnicoExit[0]['idDocument'])) return
                    }
                  })
                }
            }

            if (this.formaPagos == "") {
              if (this.countEfect == 1 || this.countbizu == 1 || this.counttarj == 1 || this.counttrans == 1) {
                if (!this.mas1Select(formValue, piso1, piso2, terapeuta, encargada, otros)) return
              }
            }
            
            if (this.formaPagos != "") {
              if (this.countEfect == 1 || this.countbizu == 1 || this.counttarj == 1 || this.counttrans == 1) {
                if (this.completoEfectivo == 0) {
                  this.servicioService.getIdUnico(this.idUnico).then((idUnicoExit) => {
                    if (idUnicoExit.length > 0) {
                      if (!this.efectivoUpdate(formValue, piso1, piso2, terapeuta, encargada, otros, idUnicoExit[0]['idDocument'])) return
                    }
                  })
                }

                if (this.completoBizum == 0) {
                  this.servicioService.getIdUnico(this.idUnico).then((idUnicoExit) => {
                    if (idUnicoExit.length > 0) {
                      if (!this.bizumUpdate(formValue, piso1, piso2, terapeuta, encargada, otros, idUnicoExit[0]['idDocument'])) return
                    }
                  })
                }

                if (this.completoTarjeta == 0) {
                  this.servicioService.getIdUnico(this.idUnico).then((idUnicoExit) => {
                    if (idUnicoExit.length > 0) {
                      if (!this.tarjetaUpdate(formValue, piso1, piso2, terapeuta, encargada, otros, idUnicoExit[0]['idDocument'])) return
                    }
                  })
                }

                if (this.completoTrans == 0) {
                  this.servicioService.getIdUnico(this.idUnico).then((idUnicoExit) => {
                    if (idUnicoExit.length > 0) {
                      if (!this.transaccionUpdate(formValue, piso1, piso2, terapeuta, encargada, otros, idUnicoExit[0]['idDocument'])) return
                    }
                  })
                }
              }
            }

            let idDocument

            this.trabajadorService.getTerapeuta(this.formTemplate.value.terapeuta).then((rp) => {
              const idDocument1 = rp.filter(tp => tp.nombre)
              idDocument = idDocument1[0]['idDocument']
              this.trabajadorService.update(idDocument, this.formTemplate.value.terapeuta, this.horaFinalServicio, this.formTemplate.value.salida)
            })

            // this.servicioService.getIdDocument(this.idUnico).then((rp) => {
            //   if (rp.length > 1) {
            //     this.servicioService.updateAllServicio(rp[0]['idDocument'], rp[0]['id'])
            //   }
            // })

            Swal.fire({ position: 'top-end', icon: 'success', title: '¡Insertado Correctamente!', showConfirmButton: false, timer: 1500 })

            this.router.navigate([`menu/${this.idUser['id']}/vision/${this.idUser['id']}`])
          } else {
            Swal.fire({ icon: 'error', title: 'Oops...', text: 'El total servicio no coincide con el total de cobros', showConfirmButton: false, timer: 2500 })
          }
        } else {
          Swal.fire({ icon: 'error', title: 'Oops...', text: 'El campo tratamiento se encuentra vacio', showConfirmButton: false, timer: 2500 })
        }
      } else {
        Swal.fire({ icon: 'error', title: 'Oops...', text: 'No hay ninguna encargada seleccionada', showConfirmButton: false, timer: 2500 })
      }
    } else {
      Swal.fire({ icon: 'error', title: 'Oops...', text: 'No hay ninguna terapeuta seleccionada', showConfirmButton: false, timer: 2500 })
    }
  }

  errorMetodo() {

    let errorPiso1 = 0, errorPiso2 = 0, errorTerapeuta = 0, errorEncargada = 0, errorOtro = 0

    if (this.formTemplate.value.numberPiso1 != null && this.formTemplate.value.efectPiso1 == false && this.formTemplate.value.bizuPiso1 == false &&
      this.formTemplate.value.tarjPiso1 == false && this.formTemplate.value.transPiso1 == false) {
      errorPiso1 = 1
    }

    if (this.formTemplate.value.numberPiso2 != null && this.formTemplate.value.efectPiso2 == false && this.formTemplate.value.bizuPiso2 == false &&
      this.formTemplate.value.tarjPiso2 == false && this.formTemplate.value.transPiso2 == false) {
      errorPiso2 = 1
    }

    if (this.formTemplate.value.numberTerap != null && this.formTemplate.value.efectTerap == false && this.formTemplate.value.bizuTerap == false &&
      this.formTemplate.value.tarjTerap == false && this.formTemplate.value.transTerap == false) {
      errorTerapeuta = 1
    }

    if (this.formTemplate.value.numberEncarg != null && this.formTemplate.value.efectEncarg == false && this.formTemplate.value.bizuEncarg == false &&
      this.formTemplate.value.tarjEncarg == false && this.formTemplate.value.transEncarg == false) {
      errorEncargada = 1
    }

    if (this.formTemplate.value.numberOtro != null && this.formTemplate.value.efectOtro == false && this.formTemplate.value.bizuOtro == false &&
      this.formTemplate.value.tarjOtro == false && this.formTemplate.value.transOtro == false) {
      errorOtro = 1
    }

    this.sumaErrorMetodo = errorPiso1 + errorPiso2 + errorTerapeuta + errorEncargada + errorOtro
  }

  totalServicio() {

    let piso1 = 0, piso2 = 0, terap = 0, encargada = 0, otros = 0

    if (this.formTemplate.value.numberPiso1 === null) {
      piso1 = 0
      this.formTemplate.value.numberPiso1 = 0
    } else {
      piso1 = Number(this.formTemplate.value.numberPiso1)
    }

    if (this.formTemplate.value.numberPiso2 == null) {
      piso2 = 0
      this.formTemplate.value.numberPiso2 = 0
    } else {
      piso2 = Number(this.formTemplate.value.numberPiso2)
    }

    if (this.formTemplate.value.numberTerap == null) {
      terap = 0
      this.formTemplate.value.numberTerap = 0
    } else {
      terap = Number(this.formTemplate.value.numberTerap)
    }

    if (this.formTemplate.value.numberEncarg == null) {
      encargada = 0
      this.formTemplate.value.numberEncarg = 0
    } else {
      encargada = Number(this.formTemplate.value.numberEncarg)
    }

    if (this.formTemplate.value.numberOtro == null) {
      otros = 0
      this.formTemplate.value.numberOtro = 0
    } else {
      otros = Number(this.formTemplate.value.numberOtro)
    }

    this.servicioTotal = Number(piso1 + piso2 + terap + encargada + otros)

    if (this.formTemplate.value.servicio == null) {
      otros = 0
      this.formTemplate.value.servicio = 0
    } else {
      otros = Number(this.formTemplate.value.servicio)
    }

    if (this.formTemplate.value.bebidas == null) {
      otros = 0
      this.formTemplate.value.bebidas = 0
    } else {
      otros = Number(this.formTemplate.value.bebidas)
    }

    if (this.formTemplate.value.tabaco == null) {
      otros = 0
      this.formTemplate.value.tabaco = 0
    } else {
      otros = Number(this.formTemplate.value.tabaco)
    }

    if (this.formTemplate.value.vitaminas == null) {
      otros = 0
      this.formTemplate.value.vitaminas = 0
    } else {
      otros = Number(this.formTemplate.value.vitaminas)
    }

    if (this.formTemplate.value.propina == null) {
      otros = 0
      this.formTemplate.value.propina = 0
    } else {
      otros = Number(this.formTemplate.value.propina)
    }

    if (this.formTemplate.value.otros == null) {
      otros = 0
      this.formTemplate.value.otros = 0
    } else {
      otros = Number(this.formTemplate.value.otros)
    }
  }

  efectCheckToggle(event: any) {

    let piso1 = 0, piso2 = 0, terap = 0, encarg = 0, otroservic = 0, suma = 0
    if (!this.validacionesFormaPagoAdd()) return

    if (event) {

      if (this.formTemplate.value.numberPiso1 != null && this.formTemplate.value.efectPiso1 == true) {
        piso1 = Number(this.formTemplate.value.numberPiso1)
      } else {
        piso1 = 0
      }

      if (this.formTemplate.value.numberPiso2 != null && this.formTemplate.value.efectPiso2 == true) {
        piso2 = Number(this.formTemplate.value.numberPiso2)
      } else {
        piso2 = 0
      }

      if (this.formTemplate.value.numberTerap != null && this.formTemplate.value.efectTerap == true) {
        terap = Number(this.formTemplate.value.numberTerap)
      } else {
        terap = 0
      }

      if (this.formTemplate.value.numberEncarg != null && this.formTemplate.value.efectEncarg == true) {
        terap = Number(this.formTemplate.value.numberEncarg)
      } else {
        encarg = 0
      }

      if (this.formTemplate.value.numberOtro != null && this.formTemplate.value.efectOtro == true) {
        otroservic = Number(this.formTemplate.value.numberOtro)
      } else {
        otroservic = 0
      }

      suma = piso1 + piso2 + terap + encarg + otroservic
      this.valueEfectivo = suma
      return
    }
  }

  bizumCheckToggle(event: any) {

    let piso1 = 0, piso2 = 0, terap = 0, encarg = 0, otroservic = 0, suma = 0
    if (!this.validacionesFormaPagoAdd()) return

    if (event) {

      if (this.formTemplate.value.numberPiso1 != null && this.formTemplate.value.bizuPiso1 == true) {
        piso1 = Number(this.formTemplate.value.numberPiso1)
      } else {
        piso1 = 0
      }

      if (this.formTemplate.value.numberPiso2 != null && this.formTemplate.value.bizuPiso2 == true) {
        piso2 = Number(this.formTemplate.value.numberPiso2)
      } else {
        piso2 = 0
      }

      if (this.formTemplate.value.numberTerap != null && this.formTemplate.value.bizuTerap == true) {
        terap = Number(this.formTemplate.value.numberTerap)
      } else {
        terap = 0
      }

      if (this.formTemplate.value.numberEncarg != null && this.formTemplate.value.bizuEncarg == true) {
        terap = Number(this.formTemplate.value.numberEncarg)
      } else {
        encarg = 0
      }

      if (this.formTemplate.value.numberOtro != null && this.formTemplate.value.bizuOtro == true) {
        otroservic = Number(this.formTemplate.value.numberOtro)
      } else {
        otroservic = 0
      }

      suma = piso1 + piso2 + terap + encarg + otroservic
      this.valueBizum = suma
      return
    }
  }

  tarjCheckToggle(event: any) {

    let piso1 = 0, piso2 = 0, terap = 0, encarg = 0, otroservic = 0, suma = 0

    if (!this.validacionesFormaPagoAdd()) return
    if (event) {

      if (this.formTemplate.value.numberPiso1 != null && this.formTemplate.value.tarjPiso1 == true) {
        piso1 = Number(this.formTemplate.value.numberPiso1)
      } else {
        piso1 = 0
      }

      if (this.formTemplate.value.numberPiso2 != null && this.formTemplate.value.tarjPiso2 == true) {
        piso2 = Number(this.formTemplate.value.numberPiso2)
      } else {
        piso2 = 0
      }

      if (this.formTemplate.value.numberTerap != null && this.formTemplate.value.tarjTerap == true) {
        terap = Number(this.formTemplate.value.numberTerap)
      } else {
        terap = 0
      }

      if (this.formTemplate.value.numberEncarg != null && this.formTemplate.value.tarjEncarg == true) {
        terap = Number(this.formTemplate.value.numberEncarg)
      } else {
        encarg = 0
      }

      if (this.formTemplate.value.numberOtro != null && this.formTemplate.value.tarjOtro == true) {
        otroservic = Number(this.formTemplate.value.numberOtro)
      } else {
        otroservic = 0
      }

      suma = piso1 + piso2 + terap + encarg + otroservic
      this.valueTarjeta = suma
      return
    }
  }

  transCheckToggle(event: any) {

    let piso1 = 0, piso2 = 0, terap = 0, encarg = 0, otroservic = 0, suma = 0
    if (!this.validacionesFormaPagoAdd()) return

    if (event) {
      if (this.formTemplate.value.numberPiso1 != null && this.formTemplate.value.transPiso1 == true) {
        piso1 = Number(this.formTemplate.value.numberPiso1)
      } else {
        piso1 = 0
      }

      if (this.formTemplate.value.numberPiso2 != null && this.formTemplate.value.transPiso2 == true) {
        piso2 = Number(this.formTemplate.value.numberPiso2)
      } else {
        piso2 = 0
      }

      if (this.formTemplate.value.numberTerap != null && this.formTemplate.value.transTerap == true) {
        terap = Number(this.formTemplate.value.numberTerap)
      } else {
        terap = 0
      }

      if (this.formTemplate.value.numberEncarg != null && this.formTemplate.value.transEncarg == true) {
        terap = Number(this.formTemplate.value.numberEncarg)
      } else {
        encarg = 0
      }

      if (this.formTemplate.value.numberOtro != null && this.formTemplate.value.transOtro == true) {
        otroservic = Number(this.formTemplate.value.numberOtro)
      } else {
        otroservic = 0
      }

      suma = piso1 + piso2 + terap + encarg + otroservic
      this.valueTrans = suma
      return
    }
  }

  horaInicioEdit(event: any) {

    this.horaFinalServicio = event.target.value.toString()
    this.horaInicialServicio = event.target.value.toString()

    if (this.formTemplate.value.minuto != '') {
      let sumarsesion = Number(this.formTemplate.value.minuto), horas = 0, minutos = 0, convertHora = ''

      // Create date by Date and Hour
      const splitDate = this.fechaActual.toString().split('-')
      const splitHour = this.horaInicialServicio.split(':')

      let defineDate = new Date(Number(splitDate[0]), (Number(splitDate[1]) - 1), Number(splitDate[2]), Number(splitHour[0]), Number(splitHour[1]))

      defineDate.setMinutes(defineDate.getMinutes() + sumarsesion)

      horas = defineDate.getHours()
      minutos = defineDate.getMinutes()

      if (horas > 0 && horas < 10) {
        convertHora = '0' + horas
        let hora = convertHora
        let minutes = minutos
        this.editarService[0]['horaEnd'] = hora + ':' + (Number(minutes) < 10 ? '0' : '') + minutes
      } else {
        let minutes = minutos
        this.editarService[0]['horaEnd'] = horas + ':' + (Number(minutes) < 10 ? '0' : '') + minutes
      }
    }
  }

  horaInicio(event: any) {

    this.horaFinalServicio = event.target.value.toString()
    this.horaInicialServicio = event.target.value.toString()

    if (this.formTemplate.value.minuto != '') {
      let sumarsesion = Number(this.formTemplate.value.minuto), horas = 0, minutos = 0, convertHora = ''

      // Create date by Date and Hour
      const splitDate = this.fechaActual.toString().split('-')
      const splitHour = this.horaInicialServicio.split(':')

      let defineDate = new Date(Number(splitDate[0]), (Number(splitDate[1]) - 1), Number(splitDate[2]), Number(splitHour[0]), Number(splitHour[1]))

      defineDate.setMinutes(defineDate.getMinutes() + sumarsesion)

      horas = defineDate.getHours()
      minutos = defineDate.getMinutes()

      if (horas > 0 && horas < 10) {
        convertHora = '0' + horas
        let hora = convertHora
        let minutes = minutos
        this.horaFinalServicio = hora + ':' + (Number(minutes) < 10 ? '0' : '') + minutes
      } else {
        let minutes = minutos
        this.horaFinalServicio = horas + ':' + (Number(minutes) < 10 ? '0' : '') + minutes
      }
    }
  }

  fechaEscogida(event: any) {
    this.editarService[0]['fecha'] = event.target.value
    this.fechaActual = event.target.value
  }

  minutos(event: any) {

    let sumarsesion = event, horas = 0, minutos = 0, convertHora = ''

    if (event === null) sumarsesion = 0

    // Create date by Date and Hour
    const splitDate = this.fechaActual.toString().split('-')
    const splitHour = this.horaInicialServicio.split(':')

    let defineDate = new Date(Number(splitDate[0]), (Number(splitDate[1]) - 1), Number(splitDate[2]), Number(splitHour[0]), Number(splitHour[1]))

    defineDate.setMinutes(defineDate.getMinutes() + sumarsesion)

    horas = defineDate.getHours()
    minutos = defineDate.getMinutes()

    if (horas > 0 && horas < 10) {
      convertHora = '0' + horas
      let hora = convertHora
      let minutes = minutos
      this.horaFinalServicio = hora + ':' + (Number(minutes) < 10 ? '0' : '') + minutes
    } else {
      let minutes = minutos
      this.horaFinalServicio = horas + ':' + (Number(minutes) < 10 ? '0' : '') + minutes
    }
  }

  minutosEdit(event: any) {

    let sumarsesion = event, horas = 0, minutos = 0, convertHora = ''

    if (event === null) sumarsesion = 0

    // Create date by Date and Hour
    const splitDate = this.fechaActual.toString().split('-')
    const splitHour = this.horaInicialServicio.split(':')

    let defineDate = new Date(Number(splitDate[0]), (Number(splitDate[1]) - 1), Number(splitDate[2]), Number(splitHour[0]), Number(splitHour[1]))

    defineDate.setMinutes(defineDate.getMinutes() + sumarsesion)

    horas = defineDate.getHours()
    minutos = defineDate.getMinutes()

    if (horas > 0 && horas < 10) {
      convertHora = '0' + horas
      let hora = convertHora
      let minutes = minutos
      this.editarService[0]['horaEnd'] = hora + ':' + (Number(minutes) < 10 ? '0' : '') + minutes
    } else {
      let minutes = minutos
      this.editarService[0]['horaEnd'] = horas + ':' + (Number(minutes) < 10 ? '0' : '') + minutes
    }
  }

  valueService() {

    let servicio = 0, bebida = 0, tabaco = 0, vitaminas = 0, propina = 0, otros = 0, sumatoria = 0

    if (this.formTemplate.value.servicio != null) {
      servicio = Number(this.formTemplate.value.servicio)
    } else {
      servicio = 0
    }

    if (this.formTemplate.value.bebidas != null) {
      bebida = Number(this.formTemplate.value.bebidas)
    } else {
      bebida = 0
    }

    if (this.formTemplate.value.tabaco != null) {
      tabaco = Number(this.formTemplate.value.tabaco)
    } else {
      tabaco = 0
    }

    if (this.formTemplate.value.vitaminas != null) {
      vitaminas = Number(this.formTemplate.value.vitaminas)
    } else {
      vitaminas = 0
    }

    if (this.formTemplate.value.propina != null) {
      propina = Number(this.formTemplate.value.propina)
    } else {
      propina = 0
    }

    if (this.formTemplate.value.otros != null) {
      otros = Number(this.formTemplate.value.otros)
    } else {
      otros = 0
    }

    sumatoria = servicio + bebida + tabaco + vitaminas + propina + otros
    this.sumatoriaServicios = sumatoria
    this.restamosCobro = sumatoria

    const restamos = Number(this.formTemplate.value.numberPiso1) + Number(this.formTemplate.value.numberPiso2) + Number(this.formTemplate.value.numberTerap) +
      Number(this.formTemplate.value.numberEncarg) + Number(this.formTemplate.value.numberOtro)

    if (this.formTemplate.value.numberPiso1 != null || this.formTemplate.value.numberPiso1 != '') {
      this.restamosCobro = sumatoria - restamos
    }

    if (this.formTemplate.value.numberPiso2 != null || this.formTemplate.value.numberPiso2 != '') {
      this.restamosCobro = sumatoria - restamos
    }

    if (this.formTemplate.value.numberTerap != null || this.formTemplate.value.numberTerap != '') {
      this.restamosCobro = sumatoria - restamos
    }

    if (this.formTemplate.value.numberEncarg != null || this.formTemplate.value.numberEncarg != '') {
      this.restamosCobro = sumatoria - restamos
    }

    if (this.formTemplate.value.numberOtro != null || this.formTemplate.value.numberOtro != '') {
      this.restamosCobro = sumatoria - restamos
    }
  }

  valueCobros() {

    let valuepiso1 = 0, valuepiso2 = 0, valueterapeuta = 0, valueEncarg = 0, valueotros = 0, restamos = 0, resultado = 0

    if (this.formTemplate.value.numberPiso1 != '' || this.formTemplate.value.numberPiso1 != null) {
      valuepiso1 = Number(this.formTemplate.value.numberPiso1)
    } else {
      valuepiso1 = 0
    }

    if (this.formTemplate.value.numberPiso2 != '' || this.formTemplate.value.numberPiso2 != null) {
      valuepiso2 = Number(this.formTemplate.value.numberPiso2)
    } else {
      valuepiso2 = 0
    }

    if (this.formTemplate.value.numberTerap != '' || this.formTemplate.value.numberTerap != null) {
      valueterapeuta = Number(this.formTemplate.value.numberTerap)
    } else {
      valueterapeuta = 0
    }

    if (this.formTemplate.value.numberEncarg != '' || this.formTemplate.value.numberEncarg != null) {
      valueEncarg = Number(this.formTemplate.value.numberEncarg)
    } else {
      valueEncarg = 0
    }

    if (this.formTemplate.value.numberOtro != '' && this.formTemplate.value.numberOtro != null) {
      valueotros = Number(this.formTemplate.value.numberOtro)
    } else {
      valueotros = 0
    }

    if (this.formTemplate.value.servicio != '' && this.formTemplate.value.servicio != null) {
      resultado = Number(this.formTemplate.value.servicio) - valuepiso1
    }

    this.sumatoriaCobros = valuepiso1 + valuepiso2 + valueterapeuta + valueEncarg + valueotros

    restamos = valuepiso1 + valuepiso2 + valueterapeuta + valueEncarg + valueotros
    resultado = this.sumatoriaServicios - restamos
    this.restamosCobro = resultado
  }

  terapeu(event: any) {
    this.servicioService.getTerapeutaByAsc(event).then((rp) => {
      if (rp[0] != undefined) {
        this.horaStartTerapeuta = rp[0]['horaStart']
      }

    })

    this.servicioService.getTerapeutaByDesc(event).then((rp) => {
      if (rp[0] != undefined) {
        this.horaEndTerapeuta = rp[0]['horaStart']
      }
    })
    this.horaStartTerapeuta = ''
    this.horaEndTerapeuta = ''
  }

  encargadaAndTerapeuta() {

    if (this.formTemplate.value.efectTerap == true && this.formTemplate.value.numberTerap != '') {
      this.valueEfectTerapeuta = Number(this.formTemplate.value.numberTerap)
    } else {
      this.valueEfectTerapeuta = 0
    }

    if (this.formTemplate.value.bizuTerap == true && this.formTemplate.value.numberTerap != '') {
      this.valueBizuTerapeuta = Number(this.formTemplate.value.numberTerap)
    } else {
      this.valueBizuTerapeuta = 0
    }

    if (this.formTemplate.value.tarjTerap == true && this.formTemplate.value.numberTerap != '') {
      this.valueTarjeTerapeuta = Number(this.formTemplate.value.numberTerap)
    } else {
      this.valueTarjeTerapeuta = 0
    }

    if (this.formTemplate.value.transTerap == true && this.formTemplate.value.numberTerap != '') {
      this.valueTransTerapeuta = Number(this.formTemplate.value.numberTerap)
    } else {
      this.valueTransTerapeuta = 0
    }

    // Encargada

    if (this.formTemplate.value.efectEncarg == true && this.formTemplate.value.numberEncarg != '') {
      this.valueEfectEncargada = Number(this.formTemplate.value.numberEncarg)
    } else {
      this.valueEfectEncargada = 0
    }

    if (this.formTemplate.value.bizuEncarg == true && this.formTemplate.value.numberEncarg != '') {
      this.valueBizuEncargada = Number(this.formTemplate.value.numberEncarg)
    } else {
      this.valueBizuEncargada = 0
    }

    if (this.formTemplate.value.tarjEncarg == true && this.formTemplate.value.numberEncarg != '') {
      this.valueTarjeEncargada = Number(this.formTemplate.value.numberEncarg)
    } else {
      this.valueTarjeEncargada = 0
    }

    if (this.formTemplate.value.transEncarg == true && this.formTemplate.value.numberEncarg != '') {
      this.valueTransEncargada = Number(this.formTemplate.value.numberEncarg)
    } else {
      this.valueTransEncargada = 0
    }
  }

  validacionesFormaPagoAdd() {

    // Efectivo
    if (this.formTemplate.value.efectPiso1 == true && this.formTemplate.value.bizuPiso1 == true || this.formTemplate.value.efectPiso2 == true &&
      this.formTemplate.value.bizuPiso2 == true || this.formTemplate.value.efectTerap == true && this.formTemplate.value.bizuTerap == true ||
      this.formTemplate.value.efectEncarg == true && this.formTemplate.value.bizuEncarg == true || this.formTemplate.value.efectOtro == true &&
      this.formTemplate.value.bizuOtro == true || this.formTemplate.value.efectPiso1 == true && this.formTemplate.value.tarjPiso1 == true ||
      this.formTemplate.value.efectPiso2 == true && this.formTemplate.value.tarjPiso2 == true || this.formTemplate.value.efectTerap == true &&
      this.formTemplate.value.tarjTerap == true || this.formTemplate.value.efectEncarg == true && this.formTemplate.value.tarjEncarg == true ||
      this.formTemplate.value.efectOtro == true && this.formTemplate.value.tarjOtro == true || this.formTemplate.value.efectPiso1 == true &&
      this.formTemplate.value.transPiso1 == true || this.formTemplate.value.efectPiso2 == true && this.formTemplate.value.transPiso2 == true ||
      this.formTemplate.value.efectTerap == true && this.formTemplate.value.transTerap == true || this.formTemplate.value.efectEncarg == true &&
      this.formTemplate.value.transEncarg == true || this.formTemplate.value.efectOtro == true && this.formTemplate.value.transOtro == true) {
      Swal.fire({ icon: 'error', title: 'Oops...', text: 'Se escogio mas de una forma de pago' })
      return false
    }

    // Bizum
    if (this.formTemplate.value.bizuPiso1 == true && this.formTemplate.value.efectPiso1 == true || this.formTemplate.value.bizuPiso2 == true &&
      this.formTemplate.value.efectPiso2 == true || this.formTemplate.value.bizuTerap == true && this.formTemplate.value.efectTerap == true ||
      this.formTemplate.value.bizuEncarg == true && this.formTemplate.value.efectEncarg == true || this.formTemplate.value.bizuOtro == true &&
      this.formTemplate.value.efectOtro == true || this.formTemplate.value.bizuPiso1 == true && this.formTemplate.value.tarjPiso1 == true ||
      this.formTemplate.value.bizuPiso2 == true && this.formTemplate.value.tarjPiso2 == true || this.formTemplate.value.bizuTerap == true &&
      this.formTemplate.value.tarjTerap == true || this.formTemplate.value.bizuEncarg == true && this.formTemplate.value.tarjEncarg == true ||
      this.formTemplate.value.bizuOtro == true && this.formTemplate.value.tarjOtro == true || this.formTemplate.value.bizuPiso1 == true &&
      this.formTemplate.value.transPiso1 == true || this.formTemplate.value.bizuPiso2 == true && this.formTemplate.value.transPiso2 == true ||
      this.formTemplate.value.bizuTerap == true && this.formTemplate.value.transTerap == true || this.formTemplate.value.bizuEncarg == true &&
      this.formTemplate.value.transEncarg == true || this.formTemplate.value.bizuOtro == true && this.formTemplate.value.transOtro == true) {
      Swal.fire({ icon: 'error', title: 'Oops...', text: 'Se escogio mas de una forma de pago' })
      return false
    }

    // Tarjeta
    if (this.formTemplate.value.tarjPiso1 == true && this.formTemplate.value.efectPiso1 == true || this.formTemplate.value.tarjPiso2 == true &&
      this.formTemplate.value.efectPiso2 == true || this.formTemplate.value.tarjTerap == true && this.formTemplate.value.efectTerap == true ||
      this.formTemplate.value.tarjEncarg == true && this.formTemplate.value.efectEncarg == true || this.formTemplate.value.tarjOtro == true &&
      this.formTemplate.value.efectOtro == true || this.formTemplate.value.tarjPiso1 == true && this.formTemplate.value.bizuPiso1 == true ||
      this.formTemplate.value.tarjPiso2 == true && this.formTemplate.value.bizuPiso2 == true || this.formTemplate.value.tarjTerap == true &&
      this.formTemplate.value.bizuTerap == true || this.formTemplate.value.tarjEncarg == true && this.formTemplate.value.bizuEncarg == true ||
      this.formTemplate.value.tarjOtro == true && this.formTemplate.value.bizuOtro == true || this.formTemplate.value.tarjPiso1 == true &&
      this.formTemplate.value.transPiso1 == true || this.formTemplate.value.tarjPiso2 == true && this.formTemplate.value.transPiso2 == true ||
      this.formTemplate.value.tarjTerap == true && this.formTemplate.value.transTerap == true || this.formTemplate.value.tarjEncarg == true &&
      this.formTemplate.value.transEncarg == true || this.formTemplate.value.tarjOtro == true && this.formTemplate.value.transOtro == true) {
      Swal.fire({ icon: 'error', title: 'Oops...', text: 'Se escogio mas de una forma de pago' })
      return false
    }

    // Trans
    if (this.formTemplate.value.transPiso1 == true && this.formTemplate.value.efectPiso1 == true || this.formTemplate.value.transPiso2 == true &&
      this.formTemplate.value.efectPiso2 == true || this.formTemplate.value.transTerap == true && this.formTemplate.value.efectTerap == true ||
      this.formTemplate.value.transEncarg == true && this.formTemplate.value.efectEncarg == true || this.formTemplate.value.transOtro == true &&
      this.formTemplate.value.efectOtro == true || this.formTemplate.value.transPiso1 == true && this.formTemplate.value.bizuPiso1 == true ||
      this.formTemplate.value.transPiso2 == true && this.formTemplate.value.bizuPiso2 == true || this.formTemplate.value.transTerap == true &&
      this.formTemplate.value.bizuTerap == true || this.formTemplate.value.transEncarg == true && this.formTemplate.value.bizuEncarg == true ||
      this.formTemplate.value.transOtro == true && this.formTemplate.value.bizuOtro == true || this.formTemplate.value.transPiso1 == true &&
      this.formTemplate.value.tarjPiso1 == true || this.formTemplate.value.transPiso2 == true && this.formTemplate.value.tarjPiso2 == true ||
      this.formTemplate.value.transTerap == true && this.formTemplate.value.tarjTerap == true || this.formTemplate.value.transEncarg == true &&
      this.formTemplate.value.tarjEncarg == true || this.formTemplate.value.transOtro == true && this.formTemplate.value.tarjOtro == true) {
      Swal.fire({ icon: 'error', title: 'Oops...', text: 'Se escogio mas de una forma de pago' })
      return false
    }
    return true
  }

  validacionFormasPago() {
    if (this.formTemplate.value.numberPiso1 != null && this.formTemplate.value.efectPiso1 == false && this.formTemplate.value.bizuPiso1 == false &&
      this.formTemplate.value.tarjPiso1 == false && this.formTemplate.value.transPiso1 == false) {
      Swal.fire({ icon: 'error', title: 'Oops...', text: 'No se escogio ninguna forma de pago para piso 1' })
      return false
    }
    if (this.formTemplate.value.numberPiso2 != null && this.formTemplate.value.efectPiso2 == false && this.formTemplate.value.bizuPiso2 == false &&
      this.formTemplate.value.tarjPiso2 == false && this.formTemplate.value.transPiso2 == false) {
      Swal.fire({ icon: 'error', title: 'Oops...', text: 'No se escogio ninguna forma de pago para piso 2' })
      return false
    }
    if (this.formTemplate.value.numberTerap != null && this.formTemplate.value.efectTerap == false && this.formTemplate.value.bizuTerap == false &&
      this.formTemplate.value.tarjTerap == false && this.formTemplate.value.transTerap == false) {
      Swal.fire({ icon: 'error', title: 'Oops...', text: 'No se escogio ninguna forma de pago para terapeuta' })
      return false
    }
    if (this.formTemplate.value.numberEncarg != null && this.formTemplate.value.efectEncarg == false && this.formTemplate.value.bizuEncarg == false &&
      this.formTemplate.value.tarjEncarg == false && this.formTemplate.value.transEncarg == false) {
      Swal.fire({ icon: 'error', title: 'Oops...', text: 'No se escogio ninguna forma de pago para encargada' })
      return false
    }
    if (this.formTemplate.value.numberOtro != null && this.formTemplate.value.efectOtro == false && this.formTemplate.value.bizuOtro == false &&
      this.formTemplate.value.tarjOtro == false && this.formTemplate.value.transOtro == false) {
      Swal.fire({ icon: 'error', title: 'Oops...', text: 'No se escogio ninguna forma de pago para otros' })
      return false
    }
    return true
  }

  // -------------------------------------------- Editamos  // ---------------------------------------------

  validacionesFormaPagoEdit() {
    // Efectivo Editar
    if (this.editarService[0]['efectPiso1'] == true && this.editarService[0]['bizuPiso1'] == true || this.editarService[0]['efectPiso2'] == true &&
      this.editarService[0]['bizuPiso2'] == true || this.editarService[0]['efectTerap'] == true && this.editarService[0]['bizuTerap'] == true || this.editarService[0]['efectEncarg'] == true && this.editarService[0]['bizuEncarg'] == true || this.editarService[0]['efectOtro'] == true && this.editarService[0]['bizuOtro'] == true || this.editarService[0]['efectPiso1'] == true && this.editarService[0]['tarjPiso1'] == true || this.editarService[0]['efectPiso2'] == true && this.editarService[0]['tarjPiso2'] == true || this.editarService[0]['efectTerap'] == true && this.editarService[0]['tarjTerap'] == true || this.editarService[0]['efectEncarg'] == true && this.editarService[0]['tarjEncarg'] == true || this.editarService[0]['efectOtro'] == true && this.editarService[0]['tarjOtro'] == true || this.editarService[0]['efectPiso1'] == true && this.editarService[0]['transPiso1'] == true || this.editarService[0]['efectPiso2'] == true && this.editarService[0]['transPiso2'] == true || this.editarService[0]['efectTerap'] == true && this.editarService[0]['transTerap'] == true || this.editarService[0]['efectEncarg'] == true && this.editarService[0]['transEncarg'] == true || this.editarService[0]['efectOtro'] == true && this.editarService[0]['transOtro'] == true) {
      Swal.fire({ icon: 'error', title: 'Oops...', text: 'Se escogio mas de una forma de pago' })
      return false
    }

    // Bizum Editar
    if (this.editarService[0]['bizuPiso1'] == true && this.editarService[0]['efectPiso1'] == true || this.editarService[0]['bizuPiso2'] == true &&
      this.editarService[0]['efectPiso2'] == true || this.editarService[0]['bizuTerap'] == true && this.editarService[0]['efectTerap'] == true || this.editarService[0]['bizuEncarg'] == true && this.editarService[0]['efectEncarg'] == true || this.editarService[0]['bizuOtro'] == true && this.editarService[0]['efectOtro'] == true || this.editarService[0]['bizuPiso1'] == true && this.editarService[0]['tarjPiso1'] == true || this.editarService[0]['bizuPiso2'] == true && this.editarService[0]['tarjPiso2'] == true || this.editarService[0]['bizuTerap'] == true && this.editarService[0]['tarjTerap'] == true || this.editarService[0]['bizuEncarg'] == true && this.editarService[0]['tarjEncarg'] == true || this.editarService[0]['bizuOtro'] == true && this.editarService[0]['tarjOtro'] == true || this.editarService[0]['bizuPiso1'] == true && this.editarService[0]['transPiso1'] == true || this.editarService[0]['bizuPiso2'] == true && this.editarService[0]['transPiso2'] == true || this.editarService[0]['bizuTerap'] == true && this.editarService[0]['transTerap'] == true || this.editarService[0]['bizuEncarg'] == true && this.editarService[0]['transEncarg'] == true || this.editarService[0]['bizuOtro'] == true && this.editarService[0]['transOtro'] == true) {
      Swal.fire({ icon: 'error', title: 'Oops...', text: 'Se escogio mas de una forma de pago' })
      return false
    }

    // Tarjeta Editar
    if (this.editarService[0]['tarjPiso1'] == true && this.editarService[0]['efectPiso1'] == true || this.editarService[0]['tarjPiso2'] == true &&
      this.editarService[0]['efectPiso2'] == true || this.editarService[0]['tarjTerap'] == true && this.editarService[0]['efectTerap'] == true || this.editarService[0]['tarjEncarg'] == true && this.editarService[0]['efectEncarg'] == true || this.editarService[0]['tarjOtro'] == true && this.editarService[0]['efectOtro'] == true || this.editarService[0]['tarjPiso1'] == true && this.editarService[0]['bizuPiso1'] == true || this.editarService[0]['tarjPiso2'] == true && this.editarService[0]['bizuPiso2'] == true || this.editarService[0]['tarjTerap'] == true && this.editarService[0]['bizuTerap'] == true || this.editarService[0]['tarjEncarg'] == true && this.editarService[0]['bizuEncarg'] == true || this.editarService[0]['tarjOtro'] == true && this.editarService[0]['bizuOtro'] == true || this.editarService[0]['tarjPiso1'] == true && this.editarService[0]['transPiso1'] == true || this.editarService[0]['tarjPiso2'] == true && this.editarService[0]['transPiso2'] == true || this.editarService[0]['tarjTerap'] == true && this.editarService[0]['transTerap'] == true || this.editarService[0]['tarjEncarg'] == true && this.editarService[0]['transEncarg'] == true || this.editarService[0]['tarjOtro'] == true && this.editarService[0]['transOtro'] == true) {
      Swal.fire({ icon: 'error', title: 'Oops...', text: 'Se escogio mas de una forma de pago' })
      return false
    }

    // Trans Editar
    if (this.editarService[0]['transPiso1'] == true && this.editarService[0]['efectPiso1'] == true || this.editarService[0]['transPiso2'] == true &&
      this.editarService[0]['efectPiso2'] == true || this.editarService[0]['transTerap'] == true && this.editarService[0]['efectTerap'] == true || this.editarService[0]['transEncarg'] == true && this.editarService[0]['efectEncarg'] == true || this.editarService[0]['transOtro'] == true && this.editarService[0]['efectOtro'] == true || this.editarService[0]['transPiso1'] == true && this.editarService[0]['bizuPiso1'] == true || this.editarService[0]['transPiso2'] == true && this.editarService[0]['bizuPiso2'] == true || this.editarService[0]['transTerap'] == true && this.editarService[0]['bizuTerap'] == true || this.editarService[0]['transEncarg'] == true && this.editarService[0]['bizuEncarg'] == true || this.editarService[0]['transOtro'] == true && this.editarService[0]['bizuOtro'] == true || this.editarService[0]['transPiso1'] == true && this.editarService[0]['tarjPiso1'] == true || this.editarService[0]['transPiso2'] == true && this.editarService[0]['tarjPiso2'] == true || this.editarService[0]['transTerap'] == true && this.editarService[0]['tarjTerap'] == true || this.editarService[0]['transEncarg'] == true && this.editarService[0]['tarjEncarg'] == true || this.editarService[0]['transOtro'] == true && this.editarService[0]['tarjOtro'] == true) {
      Swal.fire({ icon: 'error', title: 'Oops...', text: 'Se escogio mas de una forma de pago' })
      return false
    }
    return true
  }

  validacionFormasPagoEdit() {
    if (this.editarService[0]['numberPiso1'] != null && this.editarService[0]['efectPiso1'] == false && this.editarService[0]['bizuPiso1'] == false &&
      this.editarService[0]['tarjPiso1'] == false && this.editarService[0]['transPiso1'] == false) {
      Swal.fire({ icon: 'error', title: 'Oops...', text: 'No se escogio ninguna forma de pago para piso 1' })
      return false
    }
    if (this.editarService[0]['numberPiso2'] != null && this.editarService[0]['efectPiso2'] == false && this.editarService[0]['bizuPiso2'] == false &&
      this.editarService[0]['tarjPiso2'] == false && this.editarService[0]['transPiso2'] == false) {
      Swal.fire({ icon: 'error', title: 'Oops...', text: 'No se escogio ninguna forma de pago para piso 2' })
      return false
    }
    if (this.editarService[0]['numberTerap'] != null && this.editarService[0]['efectTerap'] == false && this.editarService[0]['bizuTerap'] == false &&
      this.editarService[0]['tarjTerap'] == false && this.editarService[0]['transTerap'] == false) {
      Swal.fire({ icon: 'error', title: 'Oops...', text: 'No se escogio ninguna forma de pago para terapeuta' })
      return false
    }
    if (this.editarService[0]['numberEncarg'] != null && this.editarService[0]['efectEncarg'] == false && this.editarService[0]['bizuEncarg'] == false &&
      this.editarService[0]['tarjEncarg'] == false && this.editarService[0]['transEncarg'] == false) {
      Swal.fire({ icon: 'error', title: 'Oops...', text: 'No se escogio ninguna forma de pago para encargada' })
      return false
    }
    if (this.editarService[0]['numberOtro'] != null && this.editarService[0]['efectOtro'] == false && this.editarService[0]['bizuOtro'] == false &&
      this.editarService[0]['tarjOtro'] == false && this.editarService[0]['transOtro'] == false) {
      Swal.fire({ icon: 'error', title: 'Oops...', text: 'No se escogio ninguna forma de pago para otros' })
      return false
    }
    return true
  }

  cargar() {

    this.idUserAdministrador = this.activeRoute.snapshot['_urlSegment']['segments'][1]['path']
    this.idEditar = this.activeRoute.snapshot.paramMap.get('id')
    this.servicioService.getByEditar(this.idEditar).then((datosServicio: any[]) => {
      if (datosServicio.length != 0) {
        this.editamos = true
        document.getElementById('idTitulo').style.display = 'block'
        document.getElementById('idTitulo').innerHTML = 'Editar servicio'
        this.editarService = datosServicio
        this.valueCobrosEdit()

        this.serviceLogin.getByIdAndAdministrador(this.idUserAdministrador).then((datoAdministrador: any[]) => {
          if (datoAdministrador.length != 0) {
            this.buttonDelete = true
          } else {
            this.buttonDelete = false
          }
        })

      } else {
        this.editamos = false
        this.idUser = this.activeRoute.snapshot['_urlSegment']['segments'][1]['path']
        this.serviceLogin.getById(this.idUser).then((datoUser: any[]) => {
          this.idUser = datoUser[0]
        })
      }
    })
  }

  totalServicioEdit() {
    let piso1 = 0, piso2 = 0, terap = 0, encargada = 0, otros = 0

    if (this.editarService[0]['numberPiso1'] === null) {
      piso1 = 0
      this.editarService[0]['numberPiso1'] = 0
    } else {
      piso1 = Number(this.editarService[0]['numberPiso1'])
    }

    if (this.editarService[0]['numberPiso2'] == null) {
      piso2 = 0
      this.editarService[0]['numberPiso2'] = 0
    } else {
      piso2 = Number(this.editarService[0]['numberPiso2'])
    }

    if (this.editarService[0]['numberTerap'] == null) {
      terap = 0
      this.editarService[0]['numberTerap'] = 0
    } else {
      terap = Number(this.editarService[0]['numberTerap'])
    }

    if (this.editarService[0]['numberEncarg'] == null) {
      encargada = 0
      this.editarService[0]['numberEncarg'] = 0
    } else {
      encargada = Number(this.editarService[0]['numberEncarg'])
    }

    if (this.editarService[0]['numberOtro'] == null) {
      otros = 0
      this.editarService[0]['numberOtro'] = 0
    } else {
      otros = Number(this.editarService[0]['numberOtro'])
    }

    this.servicioTotal = Number(piso1 + piso2 + terap + encargada + otros)

    if (this.editarService[0]['servicio'] == null) {
      otros = 0
      this.editarService[0]['servicio'] = 0
    } else {
      otros = Number(this.editarService[0]['servicio'])
    }

    if (this.editarService[0]['bebidas'] == null) {
      otros = 0
      this.editarService[0]['bebidas'] = 0
    } else {
      otros = Number(this.editarService[0]['bebidas'])
    }

    if (this.editarService[0]['tabaco'] == null) {
      otros = 0
      this.editarService[0]['tabaco'] = 0
    } else {
      otros = Number(this.editarService[0]['tabaco'])
    }

    if (this.editarService[0]['vitaminas'] == null) {
      otros = 0
      this.editarService[0]['vitaminas'] = 0
    } else {
      otros = Number(this.editarService[0]['vitaminas'])
    }

    if (this.editarService[0]['propina'] == null) {
      otros = 0
      this.editarService[0]['propina'] = 0
    } else {
      otros = Number(this.editarService[0]['propina'])
    }

    if (this.editarService[0]['otros'] == null) {
      otros = 0
      this.editarService[0]['otros'] = 0
    } else {
      otros = Number(this.editarService[0]['otros'])
    }
  }

  editarServicio(idDocument, idServicio, serv: Servicio) {

    if (!this.validarFechaVencida()) return
    if (!this.validacionFormasPagoEdit()) return
    if (!this.validacionesFormaPagoEdit()) return
    this.totalServicioEdit()
    if (this.restamosCobroEdit == 0) {
      this.efectCheckToggleEdit(this.validateEfect)
      this.bizumCheckToggleEdit(this.validateBizum)
      this.tarjCheckToggleEdit(this.validateTarjeta)
      this.transCheckToggleEdit(this.validateTrans)
      this.encargadaAndTerapeutaEdit()
      this.servicioService.updateServicio(idDocument, idServicio, serv)

      this.trabajadorService.getTerapeuta(this.editarService[0]['terapeuta']).then((rp) => {
        const idDocument1 = rp.filter(tp => tp.nombre)
        idDocument = idDocument1[0]['idDocument']
        this.trabajadorService.update(idDocument, this.editarService[0]['terapeuta'], this.horaFinalServicio, this.editarService[0]['salida'])
      })

      Swal.fire({ position: 'top-end', icon: 'success', title: '¡Editado Correctamente!', showConfirmButton: false, timer: 2500 })
      this.router.navigate([`menu/${this.encargada[0]['id']}/tabla/${this.encargada[0]['id']}`])
    } else {
      Swal.fire({ icon: 'error', title: 'Oops...', text: 'El valor debe quedar en 0 cobros', showConfirmButton: false, timer: 2500 })
    }
  }

  valueServiceEdit() {
    let servicioEdit = 0, bebidaEdit = 0, tabacoEdit = 0, vitaminasEdit = 0, propinaEdit = 0, otrosEdit = 0, sumatoriaEdit = 0

    if (this.editarService[0]['servicio'] != null) {
      servicioEdit = Number(this.editarService[0]['servicio'])
    } else {
      servicioEdit = 0
    }

    if (this.editarService[0]['bebidas'] != null) {
      bebidaEdit = Number(this.editarService[0]['bebidas'])
    } else {
      bebidaEdit = 0
    }

    if (this.editarService[0]['tabaco'] != null) {
      tabacoEdit = Number(this.editarService[0]['tabaco'])
    } else {
      tabacoEdit = 0
    }

    if (this.editarService[0]['vitaminas'] != null) {
      vitaminasEdit = Number(this.editarService[0]['vitaminas'])
    } else {
      vitaminasEdit = 0
    }

    if (this.editarService[0]['propina'] != null) {
      propinaEdit = Number(this.editarService[0]['propina'])
    } else {
      propinaEdit = 0
    }

    if (this.editarService[0]['otros'] != null) {
      otrosEdit = Number(this.editarService[0]['otros'])
    } else {
      otrosEdit = 0
    }

    sumatoriaEdit = servicioEdit + bebidaEdit + tabacoEdit + vitaminasEdit + propinaEdit + otrosEdit
    this.editarService[0]['totalServicio'] = sumatoriaEdit
    this.restamosCobroEdit = sumatoriaEdit

    const restamosEdit = Number(this.editarService[0]['numberPiso1']) + Number(this.editarService[0]['numberPiso2']) + Number(this.editarService[0]['numberTerap']) +
      Number(this.editarService[0]['numberEncarg']) + Number(this.editarService[0]['numberOtro'])

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
    let valuepiso1Edit = 0, valuepiso2Edit = 0, valueterapeutaEdit = 0, valueEncargEdit = 0, valueotrosEdit = 0, restamosEdit = 0, resultadoEdit = 0

    if (Number(this.editarService[0]['numberPiso1'] != null)) {
      valuepiso1Edit = Number(this.editarService[0]['numberPiso1'])
    } else {
      valuepiso1Edit = 0
    }

    if (Number(this.editarService[0]['numberPiso2'] != null)) {
      valuepiso2Edit = Number(this.editarService[0]['numberPiso2'])
    } else {
      valuepiso2Edit = 0
    }

    if (Number(this.editarService[0]['numberTerap'] != null)) {
      valueterapeutaEdit = Number(this.editarService[0]['numberTerap'])
    } else {
      valueterapeutaEdit = 0
    }

    if (Number(this.editarService[0]['numberEncarg'] != null)) {
      valueEncargEdit = Number(this.editarService[0]['numberEncarg'])
    } else {
      valueEncargEdit = 0
    }

    if (Number(this.editarService[0]['numberOtro'] != null)) {
      valueotrosEdit = Number(this.editarService[0]['numberOtro'])
    } else {
      valueotrosEdit = 0
    }

    if (this.editarService[0]['totalServicio'] != null) {
      resultadoEdit = Number(this.editarService[0]['totalServicio']) - valuepiso1Edit
    }

    this.sumatoriaCobrosEdit = valuepiso1Edit + valuepiso2Edit + valueterapeutaEdit + valueEncargEdit + valueotrosEdit

    restamosEdit = valuepiso1Edit + valuepiso2Edit + valueterapeutaEdit + valueEncargEdit + valueotrosEdit
    resultadoEdit = this.editarService[0]['totalServicio'] - restamosEdit
    this.restamosCobroEdit = resultadoEdit
  }

  // Efectivo
  efectCheckToggleEdit(event: any) {
    let piso1 = 0, piso2 = 0, terap = 0, encarg = 0, otroserv = 0, suma = 0

    if (!this.validacionesFormaPagoEdit()) return
    if (event) {

      if (this.editarService[0]['numberPiso1'] != null && this.editarService[0]['efectPiso1'] === true) {
        piso1 = Number(this.editarService[0]['numberPiso1'])
      } else {
        piso1 = 0
      }

      if (this.editarService[0]['numberPiso2'] != null && this.editarService[0]['efectPiso2'] === true) {
        piso2 = Number(this.editarService[0]['numberPiso2'])
      } else {
        piso2 = 0
      }

      if (this.editarService[0]['numberTerap'] != null && this.editarService[0]['efectTerap'] === true) {
        terap = Number(this.editarService[0]['numberTerap'])
      } else {
        terap = 0
      }

      if (this.editarService[0]['numberEncarg'] != null && this.editarService[0]['efectEncarg'] === true) {
        encarg = Number(this.editarService[0]['numberEncarg'])
      } else {
        encarg = 0
      }

      if (this.editarService[0]['numberOtro'] != null && this.editarService[0]['efectOtro'] === true) {
        otroserv = Number(this.editarService[0]['numberOtro'])
      } else {
        otroserv = 0
      }

      suma = piso1 + piso2 + terap + encarg + otroserv
      this.editarService[0]['valueEfectivo'] = suma
      return
    }
  }

  // Bizum
  bizumCheckToggleEdit(event: any) {
    let piso1 = 0, piso2 = 0, terap = 0, encarg = 0, otroservic = 0, suma = 0

    if (!this.validacionesFormaPagoEdit()) return
    if (event) {

      if (this.editarService[0]['numberPiso1'] != null && this.editarService[0]['bizuPiso1'] === true) {
        piso1 = Number(this.editarService[0]['numberPiso1'])
      } else {
        piso1 = 0
      }

      if (this.editarService[0]['numberPiso2'] != null && this.editarService[0]['bizuPiso2'] === true) {
        piso2 = Number(this.editarService[0]['numberPiso2'])
      } else {
        piso2 = 0
      }

      if (this.editarService[0]['numberTerap'] != null && this.editarService[0]['bizuTerap'] === true) {
        terap = Number(this.editarService[0]['numberTerap'])
      } else {
        terap = 0
      }

      if (this.editarService[0]['numberEncarg'] != null && this.editarService[0]['bizuEncarg'] === true) {
        encarg = Number(this.editarService[0]['numberEncarg'])
      } else {
        encarg = 0
      }

      if (this.editarService[0]['numberOtro'] != null && this.editarService[0]['bizuOtro'] === true) {
        otroservic = Number(this.editarService[0]['numberOtro'])
      } else {
        otroservic = 0
      }

      suma = piso1 + piso2 + terap + encarg + otroservic
      this.editarService[0]['valueBizum'] = suma
      return
    }
  }

  // Tarjeta
  tarjCheckToggleEdit(event: any) {
    let piso1 = 0, piso2 = 0, terap = 0, encarg = 0, otroservic = 0, suma = 0

    if (!this.validacionesFormaPagoEdit()) return
    if (event) {

      if (this.editarService[0]['numberPiso1'] != null && this.editarService[0]['tarjPiso1'] === true) {
        piso1 = Number(this.editarService[0]['numberPiso1'])
      } else {
        piso1 = 0
      }

      if (this.editarService[0]['numberPiso2'] != null && this.editarService[0]['tarjPiso2'] === true) {
        piso2 = Number(this.editarService[0]['numberPiso2'])
      } else {
        piso2 = 0
      }

      if (this.editarService[0]['numberTerap'] != null && this.editarService[0]['tarjTerap'] === true) {
        terap = Number(this.editarService[0]['numberTerap'])
      } else {
        terap = 0
      }

      if (this.editarService[0]['numberEncarg'] != null && this.editarService[0]['tarjEncarg'] === true) {
        encarg = Number(this.editarService[0]['numberEncarg'])
      } else {
        encarg = 0
      }

      if (this.editarService[0]['numberOtro'] != null && this.editarService[0]['tarjOtro'] === true) {
        otroservic = Number(this.editarService[0]['numberOtro'])
      } else {
        otroservic = 0
      }

      suma = piso1 + piso2 + terap + encarg + otroservic
      this.editarService[0]['valueTarjeta'] = suma
      return
    }
  }

  // Transaction
  transCheckToggleEdit(event: any) {
    let piso1 = 0, piso2 = 0, terap = 0, encarg = 0, otroservic = 0, suma = 0

    if (!this.validacionesFormaPagoEdit()) return
    if (event) {

      if (this.editarService[0]['numberPiso1'] != null && this.editarService[0]['transPiso1'] === true) {
        piso1 = Number(this.editarService[0]['numberPiso1'])
      } else {
        piso1 = 0
      }

      if (this.editarService[0]['numberPiso2'] != null && this.editarService[0]['transPiso2'] === true) {
        piso2 = Number(this.editarService[0]['numberPiso2'])
      } else {
        piso2 = 0
      }

      if (this.editarService[0]['numberTerap'] != null && this.editarService[0]['transTerap'] === true) {
        terap = Number(this.editarService[0]['numberTerap'])
      } else {
        terap = 0
      }

      if (this.editarService[0]['numberEncarg'] != null && this.editarService[0]['transEncarg'] === true) {
        encarg = Number(this.editarService[0]['numberEncarg'])
      } else {
        encarg = 0
      }

      if (this.editarService[0]['numberOtro'] != null && this.editarService[0]['transOtro'] === true) {
        otroservic = Number(this.editarService[0]['numberOtro'])
      } else {
        otroservic = 0
      }

      suma = piso1 + piso2 + terap + encarg + otroservic
      this.editarService[0]['valueTrans'] = suma
      return
    }
  }

  encargadaAndTerapeutaEdit() {

    if (this.editarService[0]['efectTerap'] == true && this.editarService[0]['numberTerap'] != null) {
      this.editarService[0]['valueEfectTerapeuta'] = Number(this.editarService[0]['numberTerap'])
    } else {
      this.editarService[0]['valueEfectTerapeuta'] = 0
    }

    if (this.editarService[0]['bizuTerap'] == true && this.editarService[0]['numberTerap'] != null) {
      this.editarService[0]['valueBizuTerapeuta'] = Number(this.editarService[0]['numberTerap'])
    } else {
      this.editarService[0]['valueBizuTerapeuta'] = 0
    }

    if (this.editarService[0]['tarjTerap'] == true && this.editarService[0]['numberTerap'] != null) {
      this.editarService[0]['valueTarjeTerapeuta'] = Number(this.editarService[0]['numberTerap'])
    } else {
      this.editarService[0]['valueTarjeTerapeuta'] = 0
    }

    if (this.editarService[0]['transTerap'] == true && this.editarService[0]['numberTerap'] != null) {
      this.editarService[0]['valueTransTerapeuta'] = Number(this.editarService[0]['numberTerap'])
    } else {
      this.editarService[0]['valueTransTerapeuta'] = 0
    }

    // Encargada

    if (this.editarService[0]['efectEncarg'] == true && this.editarService[0]['numberEncarg'] != null) {
      this.editarService[0]['valueEfectEncargada'] = Number(this.editarService[0]['numberEncarg'])
    } else {
      this.editarService[0]['valueEfectEncargada'] = 0
    }

    if (this.editarService[0]['bizuEncarg'] == true && this.editarService[0]['numberEncarg'] != null) {
      this.editarService[0]['valueBizuEncargada'] = Number(this.editarService[0]['numberEncarg'])
    } else {
      this.editarService[0]['valueBizuEncargada'] = 0
    }

    if (this.editarService[0]['tarjEncarg'] == true && this.editarService[0]['numberEncarg'] != null) {
      this.editarService[0]['valueTarjeEncargada'] = Number(this.editarService[0]['numberEncarg'])
    } else {
      this.editarService[0]['valueTarjeEncargada'] = 0
    }

    if (this.editarService[0]['transEncarg'] == true && this.editarService[0]['numberEncarg'] != null) {
      this.editarService[0]['valueTransEncargada'] = Number(this.editarService[0]['numberEncarg'])
    } else {
      this.editarService[0]['valueTransEncargada'] = 0
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
          confirmButtonText: 'Si, Deseo eliminar!'
        }).then((result) => {
          if (result.isConfirmed) {
            this.trabajadorService.getTerapeuta(datoEliminado[0]['terapeuta']).then((rp) => {
              let idDocument
              const idDocument1 = rp.filter(tp => tp.nombre)
              idDocument = idDocument1[0]['idDocument']
              this.trabajadorService.updateHoraAndSalida(idDocument, this.formTemplate.value.terapeuta)
            })

            this.servicioService.deleteServicio(datoEliminado[0]['idDocument'], id)
            this.router.navigate([`menu/${this.encargada[0]['id']}/vision/${this.encargada[0]['id']}`])
            Swal.fire({ position: 'top-end', icon: 'success', title: '¡Eliminado Correctamente!', showConfirmButton: false, timer: 2500 })
          }
        })
      }
    })
  }
}