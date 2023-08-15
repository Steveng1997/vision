import { Component, OnInit, ViewEncapsulation } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap'
import Swal from 'sweetalert2'

// Service
import { TrabajadoresService } from 'src/app/core/services/trabajadores'
import { ServicioService } from 'src/app/core/services/servicio'
import { LoginService } from 'src/app/core/services/login'

// Models
import { Terapeutas } from 'src/app/core/models/terapeutas'
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

  fechaActual = ''
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

  // Editar
  restamosCobroEdit = 0
  sumatoriaCobrosEdit = 0

  idEditar: number
  editarService: Servicio[]
  editamos = false
  idUserAdministrador: number
  idUser: number
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

  terapEdit: any
  terapeutaSelect: any

  servicio: Servicio = {
    bebidas: "",
    bizuEncarg: false,
    bizuOtro: false,
    bizuPiso1: false,
    bizuPiso2: false,
    bizuTerap: false,
    cierre: false,
    cliente: "",
    currentDate: "",
    editar: false,
    efectEncarg: false,
    efectOtro: false,
    efectPiso1: false,
    efectPiso2: false,
    efectTerap: false,
    encargada: "",
    fecha: "",
    fechaHoyInicio: "",
    formaPago: "",
    horaEnd: "",
    horaStart: "",
    id: 0,
    idCierre: 0,
    idEncargada: 0,
    idTerapeuta: 0,
    idUnico: "",
    liquidadoEncargada: false,
    liquidadoTerapeuta: false,
    minuto: "",
    nota: "",
    numberEncarg: "",
    numberOtro: "",
    numberPiso1: "",
    numberPiso2: "",
    numberTerap: "",
    otros: "",
    propina: "",
    salida: "",
    servicio: "",
    tabaco: "",
    tarjEncarg: false,
    tarjOtro: false,
    tarjPiso1: false,
    tarjPiso2: false,
    tarjTerap: false,
    terapeuta: "",
    totalServicio: 0,
    transEncarg: false,
    transOtro: false,
    transPiso1: false,
    transPiso2: false,
    transTerap: false,
    valueBizuEncargada: 0,
    valueBizum: 0,
    valueBizuTerapeuta: 0,
    valueEfectEncargada: 0,
    valueEfectivo: 0,
    valueEfectTerapeuta: 0,
    valuePiso1Bizum: 0,
    valuePiso1Efectivo: 0,
    valuePiso1Tarjeta: 0,
    valuePiso1Transaccion: 0,
    valuePiso2Bizum: 0,
    valuePiso2Efectivo: 0,
    valuePiso2Tarjeta: 0,
    valuePiso2Transaccion: 0,
    valueTarjeEncargada: 0,
    valueTarjeta: 0,
    valueTarjeTerapeuta: 0,
    valueTrans: 0,
    valueTransEncargada: 0,
    valueTransTerapeuta: 0,
    vitaminas: "",
  }

  terapeutas: Terapeutas = {
    activo: true,
    bebida: "",
    fechaEnd: "",
    horaEnd: "",
    id: 0,
    nombre: "",
    otros: "",
    propina: "",
    salida: "",
    servicio: "",
    tabaco: "",
    vitamina: "",
  }

  constructor(
    public router: Router,
    private activeRoute: ActivatedRoute,
    public trabajadorService: TrabajadoresService,
    public servicioService: ServicioService,
    public serviceLogin: LoginService,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    document.getElementById('idTitulo').style.display = 'block'
    document.getElementById('idTitulo').innerHTML = 'NUEVO SERVICIO'

    this.getTerapeuta()
    this.getEncargada()
    this.fecha()
    this.cargar()
    this.getLastDate()
    this.horaInicialServicio = this.horaStarted
    this.horaFinalServicio = this.horaStarted
  }

  fecha() {
    let fecha = new Date(), dia = 0, mes = 0, año = 0, convertMes = '', convertDia = ''

    dia = fecha.getDate()
    mes = fecha.getMonth() + 1
    año = fecha.getFullYear()

    if (mes > 0 && mes < 10) {
      convertMes = '0' + mes
      this.fechaActual = `${año}-${convertMes}-${dia}`
    } else {
      this.fechaActual = `${año}-${mes}-${dia}`
    }

    if (dia > 0 && dia < 10) {
      convertDia = '0' + dia
      this.fechaActual = `${año}-${convertMes}-${convertDia}`
    } else {
      this.fechaActual = `${año}-${convertMes}-${dia}`
    }
  }

  fechaOrdenada() {
    let dia = '', mes = '', año = ''

    dia = this.fechaActual.substring(8, 10)
    mes = this.fechaActual.substring(5, 7)
    año = this.fechaActual.substring(2, 4)

    this.fechaActual = `${dia}-${mes}-${año}`
    this.servicio.fecha = this.fechaActual
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
    this.trabajadorService.getAllTerapeuta().subscribe((datosTerapeuta: any) => {
      this.terapeuta = datosTerapeuta
    })
  }

  getEncargada() {
    this.serviceLogin.getUsuarios().subscribe((datosEncargada: any) => {
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

    this.servicio.idUnico = uuid
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
    this.servicio.fechaHoyInicio = `${currentDate.getFullYear()}-${mes}-${convertDia}`
  }

  TodosCobroSelect() {
    if (Number(this.servicio.numberPiso1) > 0 || Number(this.servicio.numberPiso2) > 0 || Number(this.servicio.numberTerap) > 0
      || Number(this.servicio.numberEncarg) > 0 || Number(this.servicio.numberOtro) > 0) {

      // Efectivo
      if (this.servicio.efectPiso1 == true && this.servicio.efectPiso2 == true && this.servicio.efectTerap == true &&
        this.servicio.efectEncarg == true && this.servicio.efectOtro == true) {

        if (this.servicio.efectPiso1 == true) this.servicio.valuePiso1Efectivo = Number(this.servicio.numberPiso1)
        if (this.servicio.efectPiso2 == true) this.servicio.valuePiso2Efectivo = Number(this.servicio.numberPiso2)

        this.completoEfectivo = 1
        this.servicio.formaPago = "Efectivo"

        this.servicioService.registerServicio(this.servicio).subscribe((res: any) => { })
        return true
      }

      // Bizum
      if (this.servicio.bizuPiso1 == true && this.servicio.bizuPiso2 == true && this.servicio.bizuTerap == true &&
        this.servicio.bizuEncarg == true && this.servicio.bizuOtro == true) {

        if (this.servicio.bizuPiso1 == true) this.servicio.valuePiso1Bizum = Number(this.servicio.numberPiso1)
        if (this.servicio.bizuPiso2 == true) this.servicio.valuePiso2Bizum = Number(this.servicio.numberPiso2)

        this.completoBizum = 1
        this.servicio.formaPago = "Bizum"

        this.servicioService.registerServicio(this.servicio).subscribe((res: any) => { })
        return true
      }

      // Tarjeta
      if (this.servicio.tarjPiso1 == true && this.servicio.tarjPiso2 == true && this.servicio.tarjTerap == true &&
        this.servicio.tarjEncarg == true && this.servicio.tarjOtro == true) {

        if (this.servicio.tarjPiso1 == true) this.servicio.valuePiso1Tarjeta = Number(this.servicio.numberPiso1)
        if (this.servicio.tarjPiso2 == true) this.servicio.valuePiso2Tarjeta = Number(this.servicio.numberPiso2)

        this.completoTarjeta = 1
        this.servicio.formaPago = "Tarjeta"

        this.servicioService.registerServicio(this.servicio).subscribe((res: any) => { })
        return true
      }

      // Transaccion
      if (this.servicio.transPiso1 == true && this.servicio.transPiso2 == true && this.servicio.transTerap == true &&
        this.servicio.transEncarg == true && this.servicio.transOtro == true) {

        if (this.servicio.transPiso1 == true) this.servicio.valuePiso1Transaccion = Number(this.servicio.numberPiso1)
        if (this.servicio.transPiso2 == true) this.servicio.valuePiso2Transaccion = Number(this.servicio.numberPiso2)

        this.completoTrans = 1
        this.servicio.formaPago = "Transaccion"


        this.servicioService.registerServicio(this.servicio).subscribe((res: any) => { })
        return true
      }
    }
    return true
  }

  mas4Select() {

    if (Number(this.servicio.numberPiso1) > 0 || Number(this.servicio.numberPiso2) > 0 || Number(this.servicio.numberTerap) > 0
      || Number(this.servicio.numberEncarg) > 0 || Number(this.servicio.numberOtro) > 0) {

      // Efectivo
      if (this.servicio.efectPiso1 == true && this.servicio.efectPiso2 == true && this.servicio.efectTerap == true
        && this.servicio.efectEncarg == true || this.servicio.efectPiso2 == true && this.servicio.efectTerap == true &&
        this.servicio.efectEncarg == true && this.servicio.efectOtro == true || this.servicio.efectPiso1 == true &&
        this.servicio.efectTerap == true && this.servicio.efectEncarg == true && this.servicio.efectOtro == true ||
        this.servicio.efectPiso1 == true && this.servicio.efectPiso2 == true && this.servicio.efectEncarg == true &&
        this.servicio.efectOtro == true || this.servicio.efectPiso1 == true && this.servicio.efectPiso2 == true &&
        this.servicio.efectTerap == true && this.servicio.efectOtro == true) {

        if (this.servicio.efectPiso1 == true) this.servicio.valuePiso1Efectivo = Number(this.servicio.numberPiso1)
        if (this.servicio.efectPiso2 == true) this.servicio.valuePiso2Efectivo = Number(this.servicio.numberPiso2)

        this.completoEfectivo = 1
        this.servicio.formaPago = "Efectivo"

        this.servicioService.registerServicio(this.servicio).subscribe((res: any) => { })
        return true
      }

      // Bizum
      if (this.servicio.bizuPiso1 == true && this.servicio.bizuPiso2 == true && this.servicio.bizuTerap == true
        && this.servicio.bizuEncarg == true || this.servicio.bizuPiso2 == true && this.servicio.bizuTerap == true &&
        this.servicio.bizuEncarg == true && this.servicio.bizuOtro == true || this.servicio.bizuPiso1 == true &&
        this.servicio.bizuTerap == true && this.servicio.bizuEncarg == true && this.servicio.bizuOtro == true ||
        this.servicio.bizuPiso1 == true && this.servicio.bizuPiso2 == true && this.servicio.bizuEncarg == true &&
        this.servicio.bizuOtro == true || this.servicio.bizuPiso1 == true && this.servicio.bizuPiso2 == true &&
        this.servicio.bizuTerap == true && this.servicio.bizuOtro == true) {

        if (this.servicio.bizuPiso1 == true) this.servicio.valuePiso1Bizum = Number(this.servicio.numberPiso1)
        if (this.servicio.bizuPiso2 == true) this.servicio.valuePiso2Bizum = Number(this.servicio.numberPiso2)

        this.completoBizum = 1
        this.servicio.formaPago = "Bizum"

        this.servicioService.registerServicio(this.servicio).subscribe((res: any) => { })
        return true
      }

      // Tarjeta
      if (this.servicio.tarjPiso1 == true && this.servicio.tarjPiso2 == true && this.servicio.tarjTerap == true
        && this.servicio.tarjEncarg == true || this.servicio.tarjPiso2 == true && this.servicio.tarjTerap == true &&
        this.servicio.tarjEncarg == true && this.servicio.tarjOtro == true || this.servicio.tarjPiso1 == true &&
        this.servicio.tarjTerap == true && this.servicio.tarjEncarg == true && this.servicio.tarjOtro == true ||
        this.servicio.tarjPiso1 == true && this.servicio.tarjPiso2 == true && this.servicio.tarjEncarg == true &&
        this.servicio.tarjOtro == true || this.servicio.tarjPiso1 == true && this.servicio.tarjPiso2 == true &&
        this.servicio.tarjTerap == true && this.servicio.tarjOtro == true) {

        if (this.servicio.tarjPiso1 == true) this.servicio.valuePiso1Tarjeta = Number(this.servicio.numberPiso1)
        if (this.servicio.tarjPiso2 == true) this.servicio.valuePiso2Tarjeta = Number(this.servicio.numberPiso2)

        this.completoTarjeta = 1
        this.servicio.formaPago = "Tarjeta"

        this.servicioService.registerServicio(this.servicio).subscribe((res: any) => { })
        return true
      }

      // Transaccion
      if (this.servicio.transPiso1 == true && this.servicio.transPiso2 == true && this.servicio.transTerap == true
        && this.servicio.transEncarg == true || this.servicio.transPiso2 == true && this.servicio.transTerap == true &&
        this.servicio.transEncarg == true && this.servicio.transOtro == true || this.servicio.transPiso1 == true &&
        this.servicio.transTerap == true && this.servicio.transEncarg == true && this.servicio.transOtro == true ||
        this.servicio.transPiso1 == true && this.servicio.transPiso2 == true && this.servicio.transEncarg == true &&
        this.servicio.transOtro == true || this.servicio.transPiso1 == true && this.servicio.transPiso2 == true &&
        this.servicio.transTerap == true && this.servicio.transOtro == true) {

        if (this.servicio.transPiso1 == true) this.servicio.valuePiso1Transaccion = Number(this.servicio.numberPiso1)
        if (this.servicio.transPiso2 == true) this.servicio.valuePiso2Transaccion = Number(this.servicio.numberPiso2)

        this.completoTrans = 1
        this.servicio.formaPago = "Transaccion"

        this.servicioService.registerServicio(this.servicio).subscribe((res: any) => { })
        return true
      }
    }
    return true
  }

  mas3Select() {

    if (Number(this.servicio.numberPiso1) > 0 || Number(this.servicio.numberPiso2) > 0 || Number(this.servicio.numberTerap) > 0
      || Number(this.servicio.numberEncarg) > 0 || Number(this.servicio.numberOtro) > 0) {

      // Efectivo
      if (this.servicio.efectPiso1 == true && this.servicio.efectPiso2 == true && this.servicio.efectTerap == true ||
        this.servicio.efectPiso2 == true && this.servicio.efectTerap == true && this.servicio.efectEncarg == true ||
        this.servicio.efectTerap == true && this.servicio.efectEncarg == true && this.servicio.efectOtro == true ||
        this.servicio.efectPiso1 == true && this.servicio.efectTerap == true && this.servicio.efectOtro == true ||
        this.servicio.efectPiso1 == true && this.servicio.efectTerap == true && this.servicio.efectEncarg == true ||
        this.servicio.efectPiso1 == true && this.servicio.efectPiso2 == true && this.servicio.efectEncarg == true ||
        this.servicio.efectPiso1 == true && this.servicio.efectEncarg == true && this.servicio.efectOtro == true ||
        this.servicio.efectPiso1 == true && this.servicio.efectPiso2 == true && this.servicio.efectOtro == true ||
        this.servicio.efectPiso2 == true && this.servicio.efectEncarg == true && this.servicio.efectOtro == true ||
        this.servicio.efectPiso2 == true && this.servicio.efectTerap == true && this.servicio.efectOtro == true) {

        if (this.servicio.efectPiso1 == true) this.servicio.valuePiso1Efectivo = Number(this.servicio.numberPiso1)
        if (this.servicio.efectPiso2 == true) this.servicio.valuePiso2Efectivo = Number(this.servicio.numberPiso2)

        this.completoEfectivo = 1
        this.servicio.formaPago = "Efectivo"

        this.servicioService.registerServicio(this.servicio).subscribe((res: any) => { })
        return true
      }

      // Bizum
      if (this.servicio.bizuPiso1 == true && this.servicio.bizuPiso2 == true && this.servicio.bizuTerap == true ||
        this.servicio.bizuPiso2 == true && this.servicio.bizuTerap == true && this.servicio.bizuEncarg == true ||
        this.servicio.bizuTerap == true && this.servicio.bizuEncarg == true && this.servicio.bizuOtro == true ||
        this.servicio.bizuPiso1 == true && this.servicio.bizuTerap == true && this.servicio.bizuOtro == true ||
        this.servicio.bizuPiso1 == true && this.servicio.bizuTerap == true && this.servicio.bizuEncarg == true ||
        this.servicio.bizuPiso1 == true && this.servicio.bizuPiso2 == true && this.servicio.bizuEncarg == true ||
        this.servicio.bizuPiso1 == true && this.servicio.bizuEncarg == true && this.servicio.bizuOtro == true ||
        this.servicio.bizuPiso1 == true && this.servicio.bizuPiso2 == true && this.servicio.bizuOtro == true ||
        this.servicio.bizuPiso2 == true && this.servicio.bizuEncarg == true && this.servicio.bizuOtro == true ||
        this.servicio.bizuPiso2 == true && this.servicio.bizuTerap == true && this.servicio.bizuOtro == true) {

        if (this.servicio.bizuPiso1 == true) this.servicio.valuePiso1Bizum = Number(this.servicio.numberPiso1)
        if (this.servicio.bizuPiso2 == true) this.servicio.valuePiso2Bizum = Number(this.servicio.numberPiso2)

        this.completoBizum = 1
        this.servicio.formaPago = "Bizum"

        this.servicioService.registerServicio(this.servicio).subscribe((res: any) => { })
        return true
      }

      // Tarjeta
      if (this.servicio.tarjPiso1 == true && this.servicio.tarjPiso2 == true && this.servicio.tarjTerap == true ||
        this.servicio.tarjPiso2 == true && this.servicio.tarjTerap == true && this.servicio.tarjEncarg == true ||
        this.servicio.tarjTerap == true && this.servicio.tarjEncarg == true && this.servicio.tarjOtro == true ||
        this.servicio.tarjPiso1 == true && this.servicio.tarjTerap == true && this.servicio.tarjOtro == true ||
        this.servicio.tarjPiso1 == true && this.servicio.tarjTerap == true && this.servicio.tarjEncarg == true ||
        this.servicio.tarjPiso1 == true && this.servicio.tarjPiso2 == true && this.servicio.tarjEncarg == true ||
        this.servicio.tarjPiso1 == true && this.servicio.tarjEncarg == true && this.servicio.tarjOtro == true ||
        this.servicio.tarjPiso1 == true && this.servicio.tarjPiso2 == true && this.servicio.tarjOtro == true ||
        this.servicio.tarjPiso2 == true && this.servicio.tarjEncarg == true && this.servicio.tarjOtro == true ||
        this.servicio.tarjPiso2 == true && this.servicio.tarjTerap == true && this.servicio.tarjOtro == true) {

        if (this.servicio.tarjPiso1 == true) this.servicio.valuePiso1Tarjeta = Number(this.servicio.numberPiso1)
        if (this.servicio.tarjPiso2 == true) this.servicio.valuePiso2Tarjeta = Number(this.servicio.numberPiso2)

        this.completoTarjeta = 1
        this.servicio.formaPago = "Tarjeta"

        this.servicioService.registerServicio(this.servicio).subscribe((res: any) => { })
        return true
      }

      // Transaccion
      if (this.servicio.transPiso1 == true && this.servicio.transPiso2 == true && this.servicio.transTerap == true ||
        this.servicio.transPiso2 == true && this.servicio.transTerap == true && this.servicio.transEncarg == true ||
        this.servicio.transTerap == true && this.servicio.transEncarg == true && this.servicio.transOtro == true ||
        this.servicio.transPiso1 == true && this.servicio.transTerap == true && this.servicio.transOtro == true ||
        this.servicio.transPiso1 == true && this.servicio.transTerap == true && this.servicio.transEncarg == true ||
        this.servicio.transPiso1 == true && this.servicio.transPiso2 == true && this.servicio.transEncarg == true ||
        this.servicio.transPiso1 == true && this.servicio.transEncarg == true && this.servicio.transOtro == true ||
        this.servicio.transPiso1 == true && this.servicio.transPiso2 == true && this.servicio.transOtro == true ||
        this.servicio.transPiso2 == true && this.servicio.transEncarg == true && this.servicio.transOtro == true ||
        this.servicio.transPiso2 == true && this.servicio.transTerap == true && this.servicio.transOtro == true) {

        if (this.servicio.transPiso1 == true) this.servicio.valuePiso1Transaccion = Number(this.servicio.numberPiso1)
        if (this.servicio.transPiso2 == true) this.servicio.valuePiso2Transaccion = Number(this.servicio.numberPiso2)

        this.completoTrans = 1
        this.servicio.formaPago = "Transaccion"

        this.servicioService.registerServicio(this.servicio).subscribe((res: any) => { })
        return true
      }
    }

    return true
  }

  todoenCero() {
    this.servicio.numberPiso1 = "0"
    this.servicio.numberPiso2 = "0"
    this.servicio.numberEncarg = "0"
    this.servicio.numberTerap = "0"
    this.servicio.numberOtro = "0"
    this.servicio.servicio = "0"
    this.servicio.bebidas = "0"
    this.servicio.tabaco = "0"
    this.servicio.vitaminas = "0"
    this.servicio.propina = "0"
    this.servicio.otros = "0"
    this.servicio.totalServicio = 0
  }

  conteoNumber() {
    if (this.servicio.efectPiso1 == true) this.countEfect += 1
    if (this.servicio.efectPiso2 == true) this.countEfect += 1
    if (this.servicio.efectTerap == true) this.countEfect += 1
    if (this.servicio.efectEncarg == true) this.countEfect += 1
    if (this.servicio.efectOtro == true) this.countEfect += 1

    if (this.servicio.bizuPiso1 == true) this.countbizu += 1
    if (this.servicio.bizuPiso2 == true) this.countbizu += 1
    if (this.servicio.bizuTerap == true) this.countbizu += 1
    if (this.servicio.bizuEncarg == true) this.countbizu += 1
    if (this.servicio.bizuOtro == true) this.countbizu += 1

    if (this.servicio.tarjPiso1 == true) this.counttarj += 1
    if (this.servicio.tarjPiso2 == true) this.counttarj += 1
    if (this.servicio.tarjTerap == true) this.counttarj += 1
    if (this.servicio.tarjEncarg == true) this.counttarj += 1
    if (this.servicio.tarjOtro == true) this.counttarj += 1

    if (this.servicio.transPiso1 == true) this.counttrans += 1
    if (this.servicio.transPiso2 == true) this.counttrans += 1
    if (this.servicio.transTerap == true) this.counttrans += 1
    if (this.servicio.transEncarg == true) this.counttrans += 1
    if (this.servicio.transOtro == true) this.counttrans += 1
  }

  mas2Select(piso1, piso2, terapeuta, encargada, otros) {

    if (piso1 > 0 || piso2 > 0 || terapeuta > 0 || encargada > 0 || otros > 0) {

      // Efectivo
      if (this.servicio.efectPiso1 == true && this.servicio.efectPiso2 == true || this.servicio.efectPiso1 == true &&
        this.servicio.efectTerap == true || this.servicio.efectPiso1 == true && this.servicio.efectEncarg == true ||
        this.servicio.efectPiso1 == true && this.servicio.efectOtro == true || this.servicio.efectPiso2 == true &&
        this.servicio.efectTerap == true || this.servicio.efectPiso2 == true && this.servicio.efectEncarg == true ||
        this.servicio.efectPiso2 == true && this.servicio.efectOtro == true || this.servicio.efectTerap == true &&
        this.servicio.efectOtro == true || this.servicio.efectEncarg == true && this.servicio.efectOtro == true ||
        this.servicio.efectTerap == true && this.servicio.efectEncarg == true) {

        if (this.servicio.efectPiso1 == true) this.servicio.valuePiso1Efectivo = Number(this.servicio.numberPiso1)
        if (this.servicio.efectPiso2 == true) this.servicio.valuePiso2Efectivo = Number(this.servicio.numberPiso2)

        this.completoEfectivo = 1
        this.servicio.formaPago = "Efectivo"

        this.servicioService.registerServicio(this.servicio).subscribe((res: any) => { })
        return true
      }

      // Bizum
      if (this.servicio.bizuPiso1 == true && this.servicio.bizuPiso2 == true || this.servicio.bizuPiso1 == true &&
        this.servicio.bizuTerap == true || this.servicio.bizuPiso1 == true && this.servicio.bizuEncarg == true ||
        this.servicio.bizuPiso1 == true && this.servicio.bizuOtro == true || this.servicio.bizuPiso2 == true &&
        this.servicio.bizuTerap == true || this.servicio.bizuPiso2 == true && this.servicio.bizuEncarg == true ||
        this.servicio.bizuPiso2 == true && this.servicio.bizuOtro == true || this.servicio.bizuTerap == true &&
        this.servicio.bizuOtro == true || this.servicio.bizuEncarg == true && this.servicio.bizuOtro == true ||
        this.servicio.bizuTerap == true && this.servicio.bizuEncarg == true) {

        if (this.servicio.bizuPiso1 == true) this.servicio.valuePiso1Bizum = Number(this.servicio.numberPiso1)
        if (this.servicio.bizuPiso2 == true) this.servicio.valuePiso2Bizum = Number(this.servicio.numberPiso2)

        this.completoBizum = 1
        this.servicio.formaPago = "Bizum"

        this.servicioService.registerServicio(this.servicio).subscribe((res: any) => { })
        return true
      }

      // Tarjeta
      if (this.servicio.tarjPiso1 == true && this.servicio.tarjPiso2 == true || this.servicio.tarjPiso1 == true &&
        this.servicio.tarjTerap == true || this.servicio.tarjPiso1 == true && this.servicio.tarjEncarg == true ||
        this.servicio.tarjPiso1 == true && this.servicio.tarjOtro == true || this.servicio.tarjPiso2 == true &&
        this.servicio.tarjTerap == true || this.servicio.tarjPiso2 == true && this.servicio.tarjEncarg == true ||
        this.servicio.tarjPiso2 == true && this.servicio.tarjOtro == true || this.servicio.tarjTerap == true &&
        this.servicio.tarjOtro == true || this.servicio.tarjEncarg == true && this.servicio.tarjOtro == true ||
        this.servicio.tarjTerap == true && this.servicio.tarjEncarg == true) {

        if (this.servicio.tarjPiso1 == true) this.servicio.valuePiso1Tarjeta = Number(this.servicio.numberPiso1)
        if (this.servicio.tarjPiso2 == true) this.servicio.valuePiso2Tarjeta = Number(this.servicio.numberPiso2)

        this.completoTarjeta = 1
        this.servicio.formaPago = "Tarjeta"

        this.servicioService.registerServicio(this.servicio).subscribe((res: any) => { })
        return true
      }

      // Transaccion
      if (this.servicio.transPiso1 == true && this.servicio.transPiso2 == true || this.servicio.transPiso1 == true &&
        this.servicio.transTerap == true || this.servicio.transPiso1 == true && this.servicio.transEncarg == true ||
        this.servicio.transPiso1 == true && this.servicio.transOtro == true || this.servicio.transPiso2 == true &&
        this.servicio.transTerap == true || this.servicio.transPiso2 == true && this.servicio.transEncarg == true ||
        this.servicio.transPiso2 == true && this.servicio.transOtro == true || this.servicio.transTerap == true &&
        this.servicio.transOtro == true || this.servicio.transEncarg == true && this.servicio.transOtro == true ||
        this.servicio.transTerap == true && this.servicio.transEncarg == true) {

        if (this.servicio.transPiso1 == true) this.servicio.valuePiso1Transaccion = Number(this.servicio.numberPiso1)
        if (this.servicio.transPiso2 == true) this.servicio.valuePiso2Transaccion = Number(this.servicio.numberPiso2)

        this.completoTrans = 1
        this.servicio.formaPago = "Transaccion"

        this.servicioService.registerServicio(this.servicio).subscribe((res: any) => { })
        return true
      }
    }

    return true
  }

  mas2SelectUpdate(piso1, piso2, terapeuta, encargada, otros, idsUnico) {

    if (piso1 > 0 || piso2 > 0 || terapeuta > 0 || encargada > 0 || otros > 0) {

      // Efectivo
      if (this.servicio.formaPago == 'Bizum' || this.servicio.formaPago == 'Tarjeta' || this.servicio.formaPago == 'Transaccion') {
        if (this.servicio.efectPiso1 == true && this.servicio.efectPiso2 == true || this.servicio.efectPiso1 == true &&
          this.servicio.efectTerap == true || this.servicio.efectPiso1 == true && this.servicio.efectEncarg == true ||
          this.servicio.efectPiso1 == true && this.servicio.efectOtro == true || this.servicio.efectPiso2 == true &&
          this.servicio.efectTerap == true || this.servicio.efectPiso2 == true && this.servicio.efectEncarg == true ||
          this.servicio.efectPiso2 == true && this.servicio.efectOtro == true || this.servicio.efectTerap == true &&
          this.servicio.efectOtro == true || this.servicio.efectEncarg == true && this.servicio.efectOtro == true ||
          this.servicio.efectTerap == true && this.servicio.efectEncarg == true) {

          if (this.servicio.efectPiso1 == true) this.servicioService.updateNumberPiso1(idsUnico, this.servicio).subscribe((rp) => { })
          if (this.servicio.efectPiso2 == true) this.servicioService.updateNumberPiso2(idsUnico, this.servicio).subscribe((rp) => { })
          if (this.servicio.efectEncarg == true) this.servicioService.updateNumberEncargada(idsUnico, this.servicio).subscribe((rp) => { })
          if (this.servicio.efectTerap == true) this.servicioService.updateNumberTerap(idsUnico, this.servicio).subscribe((rp) => { })
          if (this.servicio.efectOtro == true) this.servicioService.updateNumberOtros(idsUnico, this.servicio).subscribe((rp) => { })

          this.todoenCero()
          this.servicio.formaPago = 'Efectivo'
          this.completoEfectivo = 1

          this.servicioService.registerServicio(this.servicio).subscribe((register) => { })

          this.servicioService.getIdDescendente(idsUnico).subscribe((resp: any) => {
            if (resp.length > 0) {

              this.servicio.numberPiso1 = piso1
              this.servicio.numberPiso2 = piso2
              this.servicio.numberEncarg = encargada
              this.servicio.numberTerap = terapeuta
              this.servicio.numberOtro = otros

              if (this.servicio.efectPiso1 == true) this.servicioService.updateWithValueNumberPiso1(resp[0]['id'], idsUnico, this.servicio).subscribe((rp) => { })
              if (this.servicio.efectPiso2 == true) this.servicioService.updateWithValueNumberPiso2(resp[0]['id'], idsUnico, this.servicio).subscribe((rp) => { })
              if (this.servicio.efectEncarg == true) this.servicioService.updateWithValueNumberEncargada(resp[0]['id'], idsUnico, this.servicio).subscribe((rp) => { })
              if (this.servicio.efectTerap == true) this.servicioService.updateWithValueNumberTerap(resp[0]['id'], idsUnico, this.servicio).subscribe((rp) => { })
              if (this.servicio.efectOtro == true) this.servicioService.updateWithValueNumberOtros(resp[0]['id'], idsUnico, this.servicio).subscribe((rp) => { })
              this.servicioService.updatePisos(resp[0]['id'], idsUnico, this.servicio).subscribe((rp) => { })
            }
          })
          return true
        }
      }

      // Bizum
      if (this.servicio.formaPago == 'Efectivo' || this.servicio.formaPago == 'Tarjeta' || this.servicio.formaPago == 'Transaccion') {
        if (this.servicio.bizuPiso1 == true && this.servicio.bizuPiso2 == true || this.servicio.bizuPiso1 == true &&
          this.servicio.bizuTerap == true || this.servicio.bizuPiso1 == true && this.servicio.bizuEncarg == true ||
          this.servicio.bizuPiso1 == true && this.servicio.bizuOtro == true || this.servicio.bizuPiso2 == true &&
          this.servicio.bizuTerap == true || this.servicio.bizuPiso2 == true && this.servicio.bizuEncarg == true ||
          this.servicio.bizuPiso2 == true && this.servicio.bizuOtro == true || this.servicio.bizuTerap == true &&
          this.servicio.bizuOtro == true || this.servicio.bizuEncarg == true && this.servicio.bizuOtro == true ||
          this.servicio.bizuTerap == true && this.servicio.bizuEncarg == true) {

          if (this.servicio.bizuPiso1 == true) this.servicioService.updateNumberPiso1(idsUnico, this.servicio).subscribe((rp) => { })
          if (this.servicio.bizuPiso2 == true) this.servicioService.updateNumberPiso2(idsUnico, this.servicio).subscribe((rp) => { })
          if (this.servicio.bizuEncarg == true) this.servicioService.updateNumberEncargada(idsUnico, this.servicio).subscribe((rp) => { })
          if (this.servicio.bizuTerap == true) this.servicioService.updateNumberTerap(idsUnico, this.servicio).subscribe((rp) => { })
          if (this.servicio.bizuOtro == true) this.servicioService.updateNumberOtros(idsUnico, this.servicio).subscribe((rp) => { })

          this.todoenCero()
          this.servicio.formaPago = 'Bizum'
          this.completoBizum = 1

          this.servicioService.registerServicio(this.servicio).subscribe((register) => { })

          this.servicioService.getIdDescendente(idsUnico).subscribe((resp: any) => {
            if (resp.length > 0) {

              this.servicio.numberPiso1 = piso1
              this.servicio.numberPiso2 = piso2
              this.servicio.numberEncarg = encargada
              this.servicio.numberTerap = terapeuta
              this.servicio.numberOtro = otros

              if (this.servicio.bizuPiso1 == true) this.servicioService.updateWithValueNumberPiso1(resp[0]['id'], idsUnico, this.servicio).subscribe((rp) => { })
              if (this.servicio.bizuPiso2 == true) this.servicioService.updateWithValueNumberPiso2(resp[0]['id'], idsUnico, this.servicio).subscribe((rp) => { })
              if (this.servicio.bizuEncarg == true) this.servicioService.updateWithValueNumberEncargada(resp[0]['id'], idsUnico, this.servicio).subscribe((rp) => { })
              if (this.servicio.bizuTerap == true) this.servicioService.updateWithValueNumberTerap(resp[0]['id'], idsUnico, this.servicio).subscribe((rp) => { })
              if (this.servicio.bizuOtro == true) this.servicioService.updateWithValueNumberOtros(resp[0]['id'], idsUnico, this.servicio).subscribe((rp) => { })
              this.servicioService.updatePisos(resp[0]['id'], idsUnico, this.servicio).subscribe((rp) => { })
            }
          })
          return true
        }
      }

      // Tarjeta
      if (this.servicio.formaPago == 'Efectivo' || this.servicio.formaPago == 'Bizum' || this.servicio.formaPago == 'Transaccion') {
        if (this.servicio.tarjPiso1 == true && this.servicio.tarjPiso2 == true || this.servicio.tarjPiso1 == true &&
          this.servicio.tarjTerap == true || this.servicio.tarjPiso1 == true && this.servicio.tarjEncarg == true ||
          this.servicio.tarjPiso1 == true && this.servicio.tarjOtro == true || this.servicio.tarjPiso2 == true &&
          this.servicio.tarjTerap == true || this.servicio.tarjPiso2 == true && this.servicio.tarjEncarg == true ||
          this.servicio.tarjPiso2 == true && this.servicio.tarjOtro == true || this.servicio.tarjTerap == true &&
          this.servicio.tarjOtro == true || this.servicio.tarjEncarg == true && this.servicio.tarjOtro == true ||
          this.servicio.tarjTerap == true && this.servicio.tarjEncarg == true) {

          if (this.servicio.tarjPiso1 == true) this.servicioService.updateNumberPiso1(idsUnico, this.servicio).subscribe((rp) => { })
          if (this.servicio.tarjPiso2 == true) this.servicioService.updateNumberPiso2(idsUnico, this.servicio).subscribe((rp) => { })
          if (this.servicio.tarjEncarg == true) this.servicioService.updateNumberEncargada(idsUnico, this.servicio).subscribe((rp) => { })
          if (this.servicio.tarjTerap == true) this.servicioService.updateNumberTerap(idsUnico, this.servicio).subscribe((rp) => { })
          if (this.servicio.tarjOtro == true) this.servicioService.updateNumberOtros(idsUnico, this.servicio).subscribe((rp) => { })

          this.todoenCero()
          this.servicio.formaPago = 'Tarjeta'
          this.completoTarjeta = 1

          this.servicioService.registerServicio(this.servicio).subscribe((register) => { })

          this.servicioService.getIdDescendente(idsUnico).subscribe((resp: any) => {
            if (resp.length > 0) {

              this.servicio.numberPiso1 = piso1
              this.servicio.numberPiso2 = piso2
              this.servicio.numberEncarg = encargada
              this.servicio.numberTerap = terapeuta
              this.servicio.numberOtro = otros

              if (this.servicio.tarjPiso1 == true) this.servicioService.updateWithValueNumberPiso1(resp[0]['id'], idsUnico, this.servicio).subscribe((rp) => { })
              if (this.servicio.tarjPiso2 == true) this.servicioService.updateWithValueNumberPiso2(resp[0]['id'], idsUnico, this.servicio).subscribe((rp) => { })
              if (this.servicio.tarjEncarg == true) this.servicioService.updateWithValueNumberEncargada(resp[0]['id'], idsUnico, this.servicio).subscribe((rp) => { })
              if (this.servicio.tarjTerap == true) this.servicioService.updateWithValueNumberTerap(resp[0]['id'], idsUnico, this.servicio).subscribe((rp) => { })
              if (this.servicio.tarjOtro == true) this.servicioService.updateWithValueNumberOtros(resp[0]['id'], idsUnico, this.servicio).subscribe((rp) => { })
              this.servicioService.updatePisos(resp[0]['id'], idsUnico, this.servicio).subscribe((rp) => { })
            }
          })
          return true
        }
      }

      // Transaccion
      if (this.servicio.formaPago == 'Efectivo' || this.servicio.formaPago == 'Bizum' || this.servicio.formaPago == 'Tarjeta') {
        if (this.servicio.transPiso1 == true && this.servicio.transPiso2 == true || this.servicio.transPiso1 == true &&
          this.servicio.transTerap == true || this.servicio.transPiso1 == true && this.servicio.transEncarg == true ||
          this.servicio.transPiso1 == true && this.servicio.transOtro == true || this.servicio.transPiso2 == true &&
          this.servicio.transTerap == true || this.servicio.transPiso2 == true && this.servicio.transEncarg == true ||
          this.servicio.transPiso2 == true && this.servicio.transOtro == true || this.servicio.transTerap == true &&
          this.servicio.transOtro == true || this.servicio.transEncarg == true && this.servicio.transOtro == true ||
          this.servicio.transTerap == true && this.servicio.transEncarg == true) {

          if (this.servicio.transPiso1 == true) this.servicioService.updateNumberPiso1(idsUnico, this.servicio).subscribe((rp) => { })
          if (this.servicio.transPiso2 == true) this.servicioService.updateNumberPiso2(idsUnico, this.servicio).subscribe((rp) => { })
          if (this.servicio.transEncarg == true) this.servicioService.updateNumberEncargada(idsUnico, this.servicio).subscribe((rp) => { })
          if (this.servicio.transTerap == true) this.servicioService.updateNumberTerap(idsUnico, this.servicio).subscribe((rp) => { })
          if (this.servicio.transOtro == true) this.servicioService.updateNumberOtros(idsUnico, this.servicio).subscribe((rp) => { })

          this.todoenCero()
          this.servicio.formaPago = 'Transaccion'
          this.completoTrans = 1

          this.servicioService.registerServicio(this.servicio).subscribe((register) => { })

          this.servicioService.getIdDescendente(idsUnico).subscribe((resp: any) => {
            if (resp.length > 0) {

              this.servicio.numberPiso1 = piso1
              this.servicio.numberPiso2 = piso2
              this.servicio.numberEncarg = encargada
              this.servicio.numberTerap = terapeuta
              this.servicio.numberOtro = otros

              if (this.servicio.transPiso1 == true) this.servicioService.updateWithValueNumberPiso1(resp[0]['id'], idsUnico, this.servicio).subscribe((rp) => { })
              if (this.servicio.transPiso2 == true) this.servicioService.updateWithValueNumberPiso2(resp[0]['id'], idsUnico, this.servicio).subscribe((rp) => { })
              if (this.servicio.transEncarg == true) this.servicioService.updateWithValueNumberEncargada(resp[0]['id'], idsUnico, this.servicio).subscribe((rp) => { })
              if (this.servicio.transTerap == true) this.servicioService.updateWithValueNumberTerap(resp[0]['id'], idsUnico, this.servicio).subscribe((rp) => { })
              if (this.servicio.transOtro == true) this.servicioService.updateWithValueNumberOtros(resp[0]['id'], idsUnico, this.servicio).subscribe((rp) => { })
              this.servicioService.updatePisos(resp[0]['id'], idsUnico, this.servicio).subscribe((rp) => { })
            }
          })
          return true
        }
      }
    }

    return true
  }

  mas1Select() {

    if (Number(this.servicio.numberPiso1) > 0 || Number(this.servicio.numberPiso2) > 0 || Number(this.servicio.numberTerap) > 0
      || Number(this.servicio.numberEncarg) > 0 || Number(this.servicio.numberOtro) > 0) {

      if (this.servicio.efectPiso1 == true) this.servicio.valuePiso1Efectivo = Number(this.servicio.numberPiso1)
      if (this.servicio.efectPiso2 == true) this.servicio.valuePiso2Efectivo = Number(this.servicio.numberPiso2)
      if (this.servicio.bizuPiso1 == true) this.servicio.valuePiso1Bizum = Number(this.servicio.numberPiso1)
      if (this.servicio.bizuPiso2 == true) this.servicio.valuePiso2Bizum = Number(this.servicio.numberPiso2)
      if (this.servicio.tarjPiso1 == true) this.servicio.valuePiso1Tarjeta = Number(this.servicio.numberPiso1)
      if (this.servicio.tarjPiso2 == true) this.servicio.valuePiso2Tarjeta = Number(this.servicio.numberPiso2)
      if (this.servicio.transPiso1 == true) this.servicio.valuePiso1Transaccion = Number(this.servicio.numberPiso1)
      if (this.servicio.transPiso2 == true) this.servicio.valuePiso2Transaccion = Number(this.servicio.numberPiso2)

      // Efectivo

      if (this.servicio.efectPiso1 == true || this.servicio.efectPiso2 == true || this.servicio.efectTerap == true ||
        this.servicio.efectEncarg == true || this.servicio.efectOtro == true) {

        this.servicio.formaPago = 'Efectivo'
        this.completoEfectivo = 1
        this.servicioService.registerServicio(this.servicio).subscribe((register) => { })
        return true
      }

      // Bizum
      if (this.servicio.bizuPiso1 == true || this.servicio.bizuPiso2 == true || this.servicio.bizuTerap == true ||
        this.servicio.bizuEncarg == true || this.servicio.bizuOtro == true) {

        this.servicio.formaPago = 'Bizum'
        this.completoBizum = 1
        this.servicioService.registerServicio(this.servicio).subscribe((res: any) => { })
        return true
      }

      // Tarjeta
      if (this.servicio.tarjPiso1 == true || this.servicio.tarjPiso2 == true || this.servicio.tarjTerap == true ||
        this.servicio.tarjEncarg == true || this.servicio.tarjOtro == true) {

        this.servicio.formaPago = 'Tarjeta'
        this.completoTarjeta = 1
        this.servicioService.registerServicio(this.servicio).subscribe((res: any) => { })
        return true
      }

      // Transaccion
      if (this.servicio.transPiso1 == true || this.servicio.transPiso2 == true || this.servicio.transTerap == true ||
        this.servicio.transEncarg == true || this.servicio.transOtro == true) {

        this.servicio.formaPago = 'Transaccion'
        this.completoTrans = 1
        this.servicioService.registerServicio(this.servicio).subscribe((res: any) => { })
        return true
      }
    }

    return true
  }

  mas1SelectUpdate(piso1, piso2, terapeuta, encargada, otros, idsUnico) {

    if (piso1 > 0 || piso2 > 0 || terapeuta > 0 || encargada > 0 || otros > 0) {

      // Efectivo
      if (this.servicio.formaPago == 'Bizum' || this.servicio.formaPago == 'Tarjeta' || this.servicio.formaPago == 'Transaccion') {
        if (this.servicio.efectPiso1 == true || this.servicio.efectPiso2 == true || this.servicio.efectTerap == true ||
          this.servicio.efectEncarg == true || this.servicio.efectOtro == true) {

          if (this.servicio.efectPiso1 == true) this.servicioService.updateNumberPiso1(idsUnico, this.servicio).subscribe((rp) => { })
          if (this.servicio.efectPiso2 == true) this.servicioService.updateNumberPiso2(idsUnico, this.servicio).subscribe((rp) => { })
          if (this.servicio.efectEncarg == true) this.servicioService.updateNumberEncargada(idsUnico, this.servicio).subscribe((rp) => { })
          if (this.servicio.efectTerap == true) this.servicioService.updateNumberTerap(idsUnico, this.servicio).subscribe((rp) => { })
          if (this.servicio.efectOtro == true) this.servicioService.updateNumberOtros(idsUnico, this.servicio).subscribe((rp) => { })

          this.todoenCero()
          this.completoEfectivo = 1
          this.servicio.formaPago = "Efectivo"

          this.servicioService.registerServicio(this.servicio).subscribe((register: any) => { })

          this.servicioService.getIdDescendente(idsUnico).subscribe((resp: any) => {
            if (resp.length > 0) {

              this.servicio.numberPiso1 = piso1
              this.servicio.numberPiso2 = piso2
              this.servicio.numberEncarg = encargada
              this.servicio.numberTerap = terapeuta
              this.servicio.numberOtro = otros

              if (this.servicio.efectPiso1 == true) this.servicioService.updateWithValueNumberPiso1(resp[0]['id'], idsUnico, this.servicio).subscribe((rp) => { })
              if (this.servicio.efectPiso2 == true) this.servicioService.updateWithValueNumberPiso2(resp[0]['id'], idsUnico, this.servicio).subscribe((rp) => { })
              if (this.servicio.efectEncarg == true) this.servicioService.updateWithValueNumberEncargada(resp[0]['id'], idsUnico, this.servicio).subscribe((rp) => { })
              if (this.servicio.efectTerap == true) this.servicioService.updateWithValueNumberTerap(resp[0]['id'], idsUnico, this.servicio).subscribe((rp) => { })
              if (this.servicio.efectOtro == true) this.servicioService.updateWithValueNumberOtros(resp[0]['id'], idsUnico, this.servicio).subscribe((rp) => { })
              this.servicioService.updatePisos(resp[0]['id'], idsUnico, this.servicio).subscribe((rp) => { })
            }
          })
          return true
        }
      }

      // Bizum
      if (this.servicio.formaPago == 'Efectivo' || this.servicio.formaPago == 'Tarjeta' || this.servicio.formaPago == 'Transaccion') {
        if (this.servicio.bizuPiso1 == true || this.servicio.bizuPiso2 == true || this.servicio.bizuTerap == true ||
          this.servicio.bizuEncarg == true || this.servicio.bizuOtro == true) {

          if (this.servicio.bizuPiso1 == true) this.servicioService.updateNumberPiso1(idsUnico, this.servicio).subscribe((rp) => { })
          if (this.servicio.bizuPiso2 == true) this.servicioService.updateNumberPiso2(idsUnico, this.servicio).subscribe((rp) => { })
          if (this.servicio.bizuEncarg == true) this.servicioService.updateNumberEncargada(idsUnico, this.servicio).subscribe((rp) => { })
          if (this.servicio.bizuTerap == true) this.servicioService.updateNumberTerap(idsUnico, this.servicio).subscribe((rp) => { })
          if (this.servicio.bizuOtro == true) this.servicioService.updateNumberOtros(idsUnico, this.servicio).subscribe((rp) => { })

          this.todoenCero()
          this.completoBizum = 1
          this.servicio.formaPago = 'Bizum'

          this.servicioService.registerServicio(this.servicio).subscribe((register: any) => { })

          this.servicioService.getIdDescendente(idsUnico).subscribe((resp: any) => {
            if (resp.length > 0) {

              this.servicio.numberPiso1 = piso1
              this.servicio.numberPiso2 = piso2
              this.servicio.numberEncarg = encargada
              this.servicio.numberTerap = terapeuta
              this.servicio.numberOtro = otros

              if (this.servicio.bizuPiso1 == true) this.servicioService.updateWithValueNumberPiso1(resp[0]['id'], idsUnico, this.servicio).subscribe((rp) => { })
              if (this.servicio.bizuPiso2 == true) this.servicioService.updateWithValueNumberPiso2(resp[0]['id'], idsUnico, this.servicio).subscribe((rp) => { })
              if (this.servicio.bizuEncarg == true) this.servicioService.updateWithValueNumberEncargada(resp[0]['id'], idsUnico, this.servicio).subscribe((rp) => { })
              if (this.servicio.bizuTerap == true) this.servicioService.updateWithValueNumberTerap(resp[0]['id'], idsUnico, this.servicio).subscribe((rp) => { })
              if (this.servicio.bizuOtro == true) this.servicioService.updateWithValueNumberOtros(resp[0]['id'], idsUnico, this.servicio).subscribe((rp) => { })
              this.servicioService.updatePisos(resp[0]['id'], idsUnico, this.servicio).subscribe((rp) => { })
            }
          })
          return true
        }
      }

      // Tarjeta
      if (this.servicio.formaPago == 'Efectivo' || this.servicio.formaPago == 'Bizum' || this.servicio.formaPago == 'Transaccion') {
        if (this.servicio.tarjPiso1 == true || this.servicio.tarjPiso2 == true || this.servicio.tarjTerap == true ||
          this.servicio.tarjEncarg == true || this.servicio.tarjOtro == true) {

          if (this.servicio.tarjPiso1 == true) this.servicioService.updateNumberPiso1(idsUnico, this.servicio).subscribe((rp) => { })
          if (this.servicio.tarjPiso2 == true) this.servicioService.updateNumberPiso2(idsUnico, this.servicio).subscribe((rp) => { })
          if (this.servicio.tarjEncarg == true) this.servicioService.updateNumberEncargada(idsUnico, this.servicio).subscribe((rp) => { })
          if (this.servicio.tarjTerap == true) this.servicioService.updateNumberTerap(idsUnico, this.servicio).subscribe((rp) => { })
          if (this.servicio.tarjOtro == true) this.servicioService.updateNumberOtros(idsUnico, this.servicio).subscribe((rp) => { })

          this.todoenCero()
          this.completoTarjeta = 1
          this.servicio.formaPago = 'Tarjeta'

          this.servicioService.registerServicio(this.servicio).subscribe((register) => { })

          this.servicioService.getIdDescendente(idsUnico).subscribe((resp: any) => {
            if (resp.length > 0) {

              this.servicio.numberPiso1 = piso1
              this.servicio.numberPiso2 = piso2
              this.servicio.numberEncarg = encargada
              this.servicio.numberTerap = terapeuta
              this.servicio.numberOtro = otros

              if (this.servicio.tarjPiso1 == true) this.servicioService.updateWithValueNumberPiso1(resp[0]['id'], idsUnico, this.servicio).subscribe((rp) => { })
              if (this.servicio.tarjPiso2 == true) this.servicioService.updateWithValueNumberPiso2(resp[0]['id'], idsUnico, this.servicio).subscribe((rp) => { })
              if (this.servicio.tarjEncarg == true) this.servicioService.updateWithValueNumberEncargada(resp[0]['id'], idsUnico, this.servicio).subscribe((rp) => { })
              if (this.servicio.tarjTerap == true) this.servicioService.updateWithValueNumberTerap(resp[0]['id'], idsUnico, this.servicio).subscribe((rp) => { })
              if (this.servicio.tarjOtro == true) this.servicioService.updateWithValueNumberOtros(resp[0]['id'], idsUnico, this.servicio).subscribe((rp) => { })
              this.servicioService.updatePisos(resp[0]['id'], idsUnico, this.servicio).subscribe((rp) => { })
            }
          })
          return true
        }
      }

      // Transaccion
      if (this.servicio.formaPago == 'Efectivo' || this.servicio.formaPago == 'Bizum' || this.servicio.formaPago == 'Tarjeta') {
        if (this.servicio.transPiso1 == true || this.servicio.transPiso2 == true || this.servicio.transTerap == true ||
          this.servicio.transEncarg == true || this.servicio.transOtro == true) {

          if (this.servicio.transPiso1 == true) this.servicioService.updateNumberPiso1(idsUnico, this.servicio).subscribe((rp) => { })
          if (this.servicio.transPiso2 == true) this.servicioService.updateNumberPiso2(idsUnico, this.servicio).subscribe((rp) => { })
          if (this.servicio.transEncarg == true) this.servicioService.updateNumberEncargada(idsUnico, this.servicio).subscribe((rp) => { })
          if (this.servicio.transTerap == true) this.servicioService.updateNumberTerap(idsUnico, this.servicio).subscribe((rp) => { })
          if (this.servicio.transOtro == true) this.servicioService.updateNumberOtros(idsUnico, this.servicio).subscribe((rp) => { })

          this.todoenCero()
          this.completoTrans = 1

          this.servicioService.registerServicio(this.servicio).subscribe((register) => { })

          this.servicioService.getIdDescendente(idsUnico).subscribe((resp: any) => {
            if (resp.length > 0) {

              this.servicio.numberPiso1 = piso1
              this.servicio.numberPiso2 = piso2
              this.servicio.numberEncarg = encargada
              this.servicio.numberTerap = terapeuta
              this.servicio.numberOtro = otros

              if (this.servicio.transPiso1 == true) this.servicioService.updateWithValueNumberPiso1(resp[0]['id'], idsUnico, this.servicio).subscribe((rp) => { })
              if (this.servicio.transPiso2 == true) this.servicioService.updateWithValueNumberPiso2(resp[0]['id'], idsUnico, this.servicio).subscribe((rp) => { })
              if (this.servicio.transEncarg == true) this.servicioService.updateWithValueNumberEncargada(resp[0]['id'], idsUnico, this.servicio).subscribe((rp) => { })
              if (this.servicio.transTerap == true) this.servicioService.updateWithValueNumberTerap(resp[0]['id'], idsUnico, this.servicio).subscribe((rp) => { })
              if (this.servicio.transOtro == true) this.servicioService.updateWithValueNumberOtros(resp[0]['id'], idsUnico, this.servicio).subscribe((rp) => { })
              this.servicioService.updatePisos(resp[0]['id'], idsUnico, this.servicio).subscribe((rp) => { })
            }
          })
          return true
        }
      }
    }

    return true
  }

  efectivoUpdate(piso1, piso2, encargada, terapeuta, otros, idUnico) {
    if (this.servicio.efectPiso1 == true || this.servicio.efectPiso2 == true || this.servicio.efectTerap == true ||
      this.servicio.efectEncarg == true || this.servicio.efectOtro == true) {

      if (this.servicio.efectPiso1 == true) this.servicioService.updateNumberPiso1(idUnico, this.servicio).subscribe((rp) => { })
      if (this.servicio.efectPiso2 == true) this.servicioService.updateNumberPiso2(idUnico, this.servicio).subscribe((rp) => { })
      if (this.servicio.efectEncarg == true) this.servicioService.updateNumberEncargada(idUnico, this.servicio).subscribe((rp) => { })
      if (this.servicio.efectTerap == true) this.servicioService.updateNumberTerap(idUnico, this.servicio).subscribe((rp) => { })
      if (this.servicio.efectOtro == true) this.servicioService.updateNumberOtros(idUnico, this.servicio).subscribe((rp) => { })

      this.todoenCero()
      this.completoEfectivo = 1
      this.servicio.formaPago = "Efectivo"

      this.servicioService.registerServicio(this.servicio).subscribe((register) => { })

      this.servicioService.getIdDescendente(idUnico).subscribe((resp: any) => {
        if (resp.length > 0) {

          this.servicio.numberPiso1 = piso1
          this.servicio.numberPiso2 = piso2
          this.servicio.numberEncarg = encargada
          this.servicio.numberTerap = terapeuta
          this.servicio.numberOtro = otros

          if (this.servicio.efectPiso1 == true) this.servicioService.updateWithValueNumberPiso1(resp[0]['id'], idUnico, this.servicio).subscribe((rp) => { })
          if (this.servicio.efectPiso2 == true) this.servicioService.updateWithValueNumberPiso2(resp[0]['id'], idUnico, this.servicio).subscribe((rp) => { })
          if (this.servicio.efectEncarg == true) this.servicioService.updateWithValueNumberEncargada(resp[0]['id'], idUnico, this.servicio).subscribe((rp) => { })
          if (this.servicio.efectTerap == true) this.servicioService.updateWithValueNumberTerap(resp[0]['id'], idUnico, this.servicio).subscribe((rp) => { })
          if (this.servicio.efectOtro == true) this.servicioService.updateWithValueNumberOtros(resp[0]['id'], idUnico, this.servicio).subscribe((rp) => { })
          this.servicioService.updatePisos(resp[0]['id'], idUnico, this.servicio).subscribe((rp) => { })
        }
      })
      return true
    }
    return true
  }

  bizumUpdate(piso1, piso2, encargada, terapeuta, otros, idUnico) {
    if (this.servicio.bizuPiso1 == true || this.servicio.bizuPiso2 == true || this.servicio.bizuTerap == true ||
      this.servicio.bizuEncarg == true || this.servicio.bizuOtro == true) {

      if (this.servicio.bizuPiso1 == true) this.servicioService.updateNumberPiso1(idUnico, this.servicio).subscribe((rp) => { })
      if (this.servicio.bizuPiso2 == true) this.servicioService.updateNumberPiso2(idUnico, this.servicio).subscribe((rp) => { })
      if (this.servicio.bizuEncarg == true) this.servicioService.updateNumberEncargada(idUnico, this.servicio).subscribe((rp) => { })
      if (this.servicio.bizuTerap == true) this.servicioService.updateNumberTerap(idUnico, this.servicio).subscribe((rp) => { })
      if (this.servicio.bizuOtro == true) this.servicioService.updateNumberOtros(idUnico, this.servicio).subscribe((rp) => { })

      this.todoenCero()
      this.completoBizum = 1
      this.servicio.formaPago = "Bizum"

      this.servicioService.registerServicio(this.servicio).subscribe((register) => { })

      this.servicioService.getIdDescendente(idUnico).subscribe((resp: any) => {
        if (resp.length > 0) {

          this.servicio.numberPiso1 = piso1
          this.servicio.numberPiso2 = piso2
          this.servicio.numberEncarg = encargada
          this.servicio.numberTerap = terapeuta
          this.servicio.numberOtro = otros

          if (this.servicio.bizuPiso1 == true) this.servicioService.updateWithValueNumberPiso1(resp[0]['id'], idUnico, this.servicio).subscribe((rp) => { })
          if (this.servicio.bizuPiso2 == true) this.servicioService.updateWithValueNumberPiso2(resp[0]['id'], idUnico, this.servicio).subscribe((rp) => { })
          if (this.servicio.bizuEncarg == true) this.servicioService.updateWithValueNumberEncargada(resp[0]['id'], idUnico, this.servicio).subscribe((rp) => { })
          if (this.servicio.bizuTerap == true) this.servicioService.updateWithValueNumberTerap(resp[0]['id'], idUnico, this.servicio).subscribe((rp) => { })
          if (this.servicio.bizuOtro == true) this.servicioService.updateWithValueNumberOtros(resp[0]['id'], idUnico, this.servicio).subscribe((rp) => { })
          this.servicioService.updatePisos(resp[0]['id'], idUnico, this.servicio).subscribe((rp) => { })
        }
      })
      return true
    }
    return true
  }

  tarjetaUpdate(piso1, piso2, terapeuta, encargada, otros, idUnico) {
    if (this.servicio.tarjPiso1 == true || this.servicio.tarjPiso2 == true || this.servicio.tarjTerap == true ||
      this.servicio.tarjEncarg == true || this.servicio.tarjOtro == true) {

      if (this.servicio.tarjPiso1 == true) this.servicioService.updateNumberPiso1(idUnico, this.servicio).subscribe((rp) => { })
      if (this.servicio.tarjPiso2 == true) this.servicioService.updateNumberPiso2(idUnico, this.servicio).subscribe((rp) => { })
      if (this.servicio.tarjEncarg == true) this.servicioService.updateNumberEncargada(idUnico, this.servicio).subscribe((rp) => { })
      if (this.servicio.tarjTerap == true) this.servicioService.updateNumberTerap(idUnico, this.servicio).subscribe((rp) => { })
      if (this.servicio.tarjOtro == true) this.servicioService.updateNumberOtros(idUnico, this.servicio).subscribe((rp) => { })

      this.todoenCero()
      this.completoTarjeta = 1
      this.servicio.formaPago = "Tarjeta"

      this.servicioService.registerServicio(this.servicio).subscribe((register) => { })

      this.servicioService.getIdDescendente(idUnico).subscribe((resp: any) => {
        if (resp.length > 0) {

          this.servicio.numberPiso1 = piso1
          this.servicio.numberPiso2 = piso2
          this.servicio.numberEncarg = encargada
          this.servicio.numberTerap = terapeuta
          this.servicio.numberOtro = otros

          if (this.servicio.tarjPiso1 == true) this.servicioService.updateWithValueNumberPiso1(resp[0]['id'], idUnico, this.servicio).subscribe((rp) => { })
          if (this.servicio.tarjPiso2 == true) this.servicioService.updateWithValueNumberPiso2(resp[0]['id'], idUnico, this.servicio).subscribe((rp) => { })
          if (this.servicio.tarjEncarg == true) this.servicioService.updateWithValueNumberEncargada(resp[0]['id'], idUnico, this.servicio).subscribe((rp) => { })
          if (this.servicio.tarjTerap == true) this.servicioService.updateWithValueNumberTerap(resp[0]['id'], idUnico, this.servicio).subscribe((rp) => { })
          if (this.servicio.tarjOtro == true) this.servicioService.updateWithValueNumberOtros(resp[0]['id'], idUnico, this.servicio).subscribe((rp) => { })
          this.servicioService.updatePisos(resp[0]['id'], idUnico, this.servicio).subscribe((rp) => { })
        }
      })
      return true
    }
    return true
  }

  transaccionUpdate(piso1, piso2, terapeuta, encargada, otros, idUnico) {
    if (this.servicio.transPiso1 == true || this.servicio.transPiso2 == true || this.servicio.transTerap == true ||
      this.servicio.transEncarg == true || this.servicio.transOtro == true) {

      if (this.servicio.transPiso1 == true) this.servicioService.updateNumberPiso1(idUnico, piso1).subscribe((rp) => { })
      if (this.servicio.transPiso2 == true) this.servicioService.updateNumberPiso2(idUnico, piso2).subscribe((rp) => { })
      if (this.servicio.transEncarg == true) this.servicioService.updateNumberEncargada(idUnico, encargada).subscribe((rp) => { })
      if (this.servicio.transTerap == true) this.servicioService.updateNumberTerap(idUnico, terapeuta).subscribe((rp) => { })
      if (this.servicio.transOtro == true) this.servicioService.updateNumberOtros(idUnico, otros).subscribe((rp) => { })

      this.todoenCero()
      this.completoTrans = 1
      this.servicio.formaPago = "Transaccion"

      this.servicioService.registerServicio(this.servicio).subscribe((register) => { })

      this.servicioService.getIdDescendente(idUnico).subscribe((resp: any) => {
        if (resp.length > 0) {

          this.servicio.numberPiso1 = piso1
          this.servicio.numberPiso2 = piso2
          this.servicio.numberEncarg = encargada
          this.servicio.numberTerap = terapeuta
          this.servicio.numberOtro = otros

          if (this.servicio.transPiso1 == true) this.servicioService.updateWithValueNumberPiso1(resp[0]['id'], idUnico, this.servicio).subscribe((rp) => { })
          if (this.servicio.transPiso2 == true) this.servicioService.updateWithValueNumberPiso2(resp[0]['id'], idUnico, this.servicio).subscribe((rp) => { })
          if (this.servicio.transEncarg == true) this.servicioService.updateWithValueNumberEncargada(resp[0]['id'], idUnico, this.servicio).subscribe((rp) => { })
          if (this.servicio.transTerap == true) this.servicioService.updateWithValueNumberTerap(resp[0]['id'], idUnico, this.servicio).subscribe((rp) => { })
          if (this.servicio.transOtro == true) this.servicioService.updateWithValueNumberOtros(resp[0]['id'], idUnico, this.servicio).subscribe((rp) => { })
          this.servicioService.updatePisos(resp[0]['id'], idUnico, this.servicio).subscribe((rp) => { })
        }
      })
      return true
    }
    return true
  }

  addServicio() {
    if (this.servicio.terapeuta != '') {
      if (this.servicio.encargada != '') {
        if (Number(this.servicio.servicio) > 0) {
          this.crearIdUnico()
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

            let piso1 = 0, piso2 = 0, terapeuta = 0, encargada = 0, otros = 0, fecha = '', idsUnico = ''

            piso1 = Number(this.servicio.numberPiso1)
            piso2 = Number(this.servicio.numberPiso2)
            terapeuta = Number(this.servicio.numberTerap)
            encargada = Number(this.servicio.numberEncarg)
            otros = Number(this.servicio.numberOtro)
            fecha = this.fechaActual.replace("-", "/").replace("-", "/")
            idsUnico = this.servicio.idUnico
            this.servicio.currentDate = this.currentDate.toString()

            this.conteoNumber()
            this.fechaOrdenada()

            this.servicio.horaStart = this.horaStarted
            this.servicio.editar = true

            debugger

            if (!this.TodosCobroSelect()) return

            if (this.servicio.formaPago == "") {
              if (this.countEfect == 4 || this.countbizu == 4 || this.counttarj == 4 || this.counttrans == 4) {
                if (!this.mas4Select()) return
              }
            }

            if (this.servicio.formaPago == "") {
              if (this.countEfect == 3 || this.countbizu == 3 || this.counttarj == 3 || this.counttrans == 3) {
                if (!this.mas3Select()) return
              }
            }

            if (this.servicio.formaPago == "") {
              if (this.countEfect == 2 || this.countbizu == 2 || this.counttarj == 2 || this.counttrans == 2) {
                if (!this.mas2Select(piso1, piso2, terapeuta, encargada, otros)) return
              }
            }

            if (this.servicio.formaPago != "") {
              if (this.countEfect == 3 || this.countbizu == 3 || this.counttarj == 3 || this.counttrans == 3 ||
                this.countEfect == 2 || this.countbizu == 2 || this.counttarj == 2 || this.counttrans == 2) {
                if (this.completoEfectivo == 1 || this.completoBizum == 1 || this.completoTarjeta == 1 || this.completoTrans == 1) {
                  this.servicioService.getIdUnico(idsUnico).subscribe((idUnicoExit: any) => {
                    if (idUnicoExit.length > 0) {
                      if (!this.mas2SelectUpdate(piso1, piso2, terapeuta, encargada, otros, idsUnico)) return
                    }
                  })
                }
              }
            }

            if (this.servicio.formaPago != "") {
              if (this.countEfect == 4 || this.countbizu == 4 || this.counttarj == 4 || this.counttrans == 4 ||
                this.countEfect == 3 || this.countbizu == 3 || this.counttarj == 3 || this.counttrans == 3 ||
                this.countEfect == 2 || this.countbizu == 2 || this.counttarj == 2 || this.counttrans == 2) {
                if (this.countEfect == 1 || this.countbizu == 1 || this.counttarj == 1 || this.counttrans == 1) {
                  if (this.completoEfectivo == 1 || this.completoBizum == 1 || this.completoTarjeta == 1 || this.completoTrans == 1) {
                    this.servicioService.getIdUnico(idsUnico).subscribe((idUnicoExit: any) => {
                      if (idUnicoExit.length > 0) {
                        if (!this.mas1SelectUpdate(piso1, piso2, terapeuta, encargada, otros, idsUnico)) return
                      }
                    })
                  }
                }
              }
            }

            if (this.servicio.formaPago == "") {
              if (this.countEfect == 1 || this.countbizu == 1 || this.counttarj == 1 || this.counttrans == 1) {
                if (!this.mas1Select()) return
                console.log('aqui')

                if (this.servicio.formaPago != "") {
                  if (this.countEfect == 1 || this.countbizu == 1 || this.counttarj == 1 || this.counttrans == 1) {

                    if (this.completoEfectivo == 0) {
                      this.servicioService.getIdUnico(idsUnico).subscribe((idUnicoExit: any) => {
                        if (idUnicoExit.length > 0) {
                          if (!this.efectivoUpdate(piso1, piso2, encargada, terapeuta, otros, idsUnico)) return
                        }
                      })
                    }

                    if (this.completoBizum == 0) {
                      this.servicioService.getIdUnico(idsUnico).subscribe((idUnicoExit: any) => {
                        if (idUnicoExit.length > 0) {
                          if (!this.bizumUpdate(piso1, piso2, encargada, terapeuta, otros, idsUnico)) return
                        }
                      })
                    }

                    if (this.completoTarjeta == 0) {
                      this.servicioService.getIdUnico(idsUnico).subscribe((idUnicoExit: any) => {
                        if (idUnicoExit.length > 0) {
                          if (!this.tarjetaUpdate(piso1, piso2, terapeuta, encargada, otros, idsUnico)) return
                        }
                      })
                    }

                    if (this.completoTrans == 0) {
                      this.servicioService.getIdUnico(idsUnico).subscribe((idUnicoExit: any) => {
                        if (idUnicoExit.length > 0) {
                          if (!this.transaccionUpdate(piso1, piso2, terapeuta, encargada, otros, idsUnico)) return
                        }
                      })
                    }
                  }
                }
              }
            }

            this.terapeutas.horaEnd = this.servicio.horaEnd
            this.terapeutas.salida = this.servicio.salida
            this.terapeutas.fechaEnd = this.servicio.fechaHoyInicio

            this.trabajadorService.update(this.servicio.terapeuta, this.terapeutas).subscribe((rp: any) => { })

            this.idUser = Number(this.activeRoute.snapshot['_urlSegment']['segments'][1]['path'])
            this.router.navigate([`menu/${this.idUser}/vision/${this.idUser}`])

            Swal.fire({ position: 'top-end', icon: 'success', title: '¡Insertado Correctamente!', showConfirmButton: false, timer: 1500 })
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

  totalServicio() {
    this.servicio.totalServicio = Number(this.servicio.numberPiso1) + Number(this.servicio.numberPiso2) +
      Number(this.servicio.numberTerap) + Number(this.servicio.numberEncarg) + Number(this.servicio.numberOtro)
  }

  efectCheckToggle(event: any) {
    let piso1 = 0, piso2 = 0, terap = 0, encarg = 0, otroservic = 0, suma = 0
    if (!this.validacionesFormaPagoAdd()) return

    if (event) {

      if (Number(this.servicio.numberPiso1) > 0 && this.servicio.efectPiso1 == true) {
        piso1 = Number(this.servicio.numberPiso1)
      } else {
        piso1 = 0
      }

      if (Number(this.servicio.numberPiso2) > 0 && this.servicio.efectPiso2 == true) {
        piso2 = Number(this.servicio.numberPiso2)
      } else {
        piso2 = 0
      }

      if (Number(this.servicio.numberTerap) > 0 && this.servicio.efectTerap == true) {
        terap = Number(this.servicio.numberTerap)
      } else {
        terap = 0
      }

      if (Number(this.servicio.numberEncarg) > 0 && this.servicio.efectEncarg == true) {
        terap = Number(this.servicio.numberEncarg)
      } else {
        encarg = 0
      }

      if (Number(this.servicio.numberOtro) > 0 && this.servicio.efectOtro == true) {
        otroservic = Number(this.servicio.numberOtro)
      } else {
        otroservic = 0
      }

      suma = piso1 + piso2 + terap + encarg + otroservic
      this.servicio.valueEfectivo = suma
      return
    }
  }

  bizumCheckToggle(event: any) {
    let piso1 = 0, piso2 = 0, terap = 0, encarg = 0, otroservic = 0, suma = 0
    if (!this.validacionesFormaPagoAdd()) return

    if (event) {

      if (Number(this.servicio.numberPiso1) > 0 && this.servicio.bizuPiso1 == true) {
        piso1 = Number(this.servicio.numberPiso1)
      } else {
        piso1 = 0
      }

      if (Number(this.servicio.numberPiso2) > 0 && this.servicio.bizuPiso2 == true) {
        piso2 = Number(this.servicio.numberPiso2)
      } else {
        piso2 = 0
      }

      if (Number(this.servicio.numberTerap) > 0 && this.servicio.bizuTerap == true) {
        terap = Number(this.servicio.numberTerap)
      } else {
        terap = 0
      }

      if (Number(this.servicio.numberEncarg) > 0 && this.servicio.bizuEncarg == true) {
        terap = Number(this.servicio.numberEncarg)
      } else {
        encarg = 0
      }

      if (Number(this.servicio.numberOtro) > 0 && this.servicio.bizuOtro == true) {
        otroservic = Number(this.servicio.numberOtro)
      } else {
        otroservic = 0
      }

      suma = piso1 + piso2 + terap + encarg + otroservic
      this.servicio.valueBizum = suma
      return
    }
  }

  tarjCheckToggle(event: any) {
    let piso1 = 0, piso2 = 0, terap = 0, encarg = 0, otroservic = 0, suma = 0
    if (!this.validacionesFormaPagoAdd()) return

    if (event) {

      if (Number(this.servicio.numberPiso1) > 0 && this.servicio.tarjPiso1 == true) {
        piso1 = Number(this.servicio.numberPiso1)
      } else {
        piso1 = 0
      }

      if (Number(this.servicio.numberPiso2) > 0 && this.servicio.tarjPiso2 == true) {
        piso2 = Number(this.servicio.numberPiso2)
      } else {
        piso2 = 0
      }

      if (Number(this.servicio.numberTerap) > 0 && this.servicio.tarjTerap == true) {
        terap = Number(this.servicio.numberTerap)
      } else {
        terap = 0
      }

      if (Number(this.servicio.numberEncarg) > 0 && this.servicio.tarjEncarg == true) {
        terap = Number(this.servicio.numberEncarg)
      } else {
        encarg = 0
      }

      if (Number(this.servicio.numberOtro) > 0 && this.servicio.tarjOtro == true) {
        otroservic = Number(this.servicio.numberOtro)
      } else {
        otroservic = 0
      }

      suma = piso1 + piso2 + terap + encarg + otroservic
      this.servicio.valueTarjeta = suma
      return
    }
  }

  transCheckToggle(event: any) {
    let piso1 = 0, piso2 = 0, terap = 0, encarg = 0, otroservic = 0, suma = 0

    if (!this.validacionesFormaPagoAdd()) return

    if (event) {
      if (Number(this.servicio.numberPiso1) > 0 && this.servicio.transPiso1 == true) {
        piso1 = Number(this.servicio.numberPiso1)
      } else {
        piso1 = 0
      }

      if (Number(this.servicio.numberPiso2) > 0 && this.servicio.transPiso2 == true) {
        piso2 = Number(this.servicio.numberPiso2)
      } else {
        piso2 = 0
      }

      if (Number(this.servicio.numberTerap) > 0 && this.servicio.transTerap == true) {
        terap = Number(this.servicio.numberTerap)
      } else {
        terap = 0
      }

      if (Number(this.servicio.numberEncarg) > 0 && this.servicio.transEncarg == true) {
        terap = Number(this.servicio.numberEncarg)
      } else {
        encarg = 0
      }

      if (Number(this.servicio.numberOtro) > 0 && this.servicio.transOtro == true) {
        otroservic = Number(this.servicio.numberOtro)
      } else {
        otroservic = 0
      }

      suma = piso1 + piso2 + terap + encarg + otroservic
      this.servicio.valueTrans = suma
      return
    }
  }

  horaInicioEdit(event: any) {
    this.horaFinalServicio = event.target.value.toString()
    this.horaInicialServicio = event.target.value.toString()

    if (Number(this.editarService[0]['minuto']) > 0) {
      let sumarsesion = Number(this.editarService[0]['minuto']), horas = 0, minutos = 0, convertHora = ''

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

    if (Number(this.servicio.minuto) > 0) {
      let sumarsesion = Number(this.servicio.minuto), horas = 0, minutos = 0, convertHora = ''

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

    if (Number(this.servicio.minuto) > 0) {
      let sumarsesion = Number(this.servicio.minuto), horas = 0, minutos = 0, convertHora = ''

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
    this.fechaActual = event.target.value
  }

  fechaEscogidaEdit(event: any) {
    this.editarService[0]['fecha'] = event.target.value
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

    if (horas >= 0 && horas < 10) {
      convertHora = '0' + horas
      let hora = convertHora
      let minutes = minutos
      this.horaFinalServicio = hora + ':' + (Number(minutes) < 10 ? '0' : '') + minutes
      this.servicio.horaEnd = this.horaFinalServicio
    } else {
      let minutes = minutos
      this.horaFinalServicio = horas + ':' + (Number(minutes) < 10 ? '0' : '') + minutes
      this.servicio.horaEnd = this.horaFinalServicio
    }
  }

  minutosEdit(event: any) {

    let sumarsesion = event, horas = 0, minutos = 0, convertHora = ''

    if (event === null) sumarsesion = 0

    // Create date by Date and Hour
    const splitDate = this.fechaActual.toString().split('-')
    // const splitHour = this.horaInicialServicio.split(':')
    const splitHour = this.editarService[0]['horaStart'].split(':')

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

    let restamos = 0

    this.sumatoriaServicios = Number(this.servicio.servicio) + Number(this.servicio.bebidas) + Number(this.servicio.tabaco) +
      Number(this.servicio.vitaminas) + Number(this.servicio.propina) + Number(this.servicio.otros)

    restamos = Number(this.servicio.numberPiso1) + Number(this.servicio.numberPiso2) + Number(this.servicio.numberTerap) +
      Number(this.servicio.numberEncarg) + Number(this.servicio.numberOtro)

    if (Number(this.servicio.numberPiso1) > 0 || this.servicio.numberPiso1 != '') {
      this.restamosCobro = this.sumatoriaServicios - restamos
    }

    if (Number(this.servicio.numberPiso2) > 0 || this.servicio.numberPiso2 != '') {
      this.restamosCobro = this.sumatoriaServicios - restamos
    }

    if (Number(this.servicio.numberTerap) > 0 || this.servicio.numberTerap != '') {
      this.restamosCobro = this.sumatoriaServicios - restamos
    }

    if (Number(this.servicio.numberEncarg) > 0 || this.servicio.numberEncarg != '') {
      this.restamosCobro = this.sumatoriaServicios - restamos
    }

    if (Number(this.servicio.numberOtro) > 0 || this.servicio.numberOtro != '') {
      this.restamosCobro = this.sumatoriaServicios - restamos
    }
  }

  valueCobros() {
    let resultado = 0

    this.sumatoriaCobros = Number(this.servicio.numberPiso1) + Number(this.servicio.numberPiso2) +
      Number(this.servicio.numberTerap) + Number(this.servicio.numberEncarg) + Number(this.servicio.numberOtro)

    resultado = this.sumatoriaServicios - this.sumatoriaCobros
    this.restamosCobro = resultado
  }

  terapeu(event: any) {
    this.servicioService.getTerapeutaByAsc(event).subscribe((rp: any) => {
      if (rp[0] != undefined) {
        this.horaStartTerapeuta = rp[0]['horaStart']
      }
    })

    this.servicioService.getTerapeutaByDesc(event).subscribe((rp: any) => {
      if (rp[0] != undefined) {
        this.horaEndTerapeuta = rp[0]['horaStart']
      }
    })
    this.horaStartTerapeuta = ''
    this.horaEndTerapeuta = ''
  }

  encargadaAndTerapeuta() {

    // Terapeuta
    if (this.servicio.efectTerap == true && Number(this.servicio.numberTerap) > 0) this.servicio.valueEfectTerapeuta = Number(this.servicio.numberTerap)
    if (this.servicio.bizuTerap == true && Number(this.servicio.numberTerap) > 0) this.servicio.valueBizuTerapeuta = Number(this.servicio.numberTerap)
    if (this.servicio.tarjTerap == true && Number(this.servicio.numberTerap) > 0) this.servicio.valueTarjeTerapeuta = Number(this.servicio.numberTerap)
    if (this.servicio.transTerap == true && Number(this.servicio.numberTerap) > 0) this.servicio.valueTransTerapeuta = Number(this.servicio.numberTerap)

    // Encargada
    if (this.servicio.efectEncarg == true && Number(this.servicio.numberEncarg) > 0) this.servicio.valueEfectEncargada = Number(this.servicio.numberEncarg)
    if (this.servicio.bizuEncarg == true && Number(this.servicio.numberEncarg) > 0) this.servicio.valueBizuEncargada = Number(this.servicio.numberEncarg)
    if (this.servicio.tarjEncarg == true && Number(this.servicio.numberEncarg) > 0) this.servicio.valueTarjeEncargada = Number(this.servicio.numberEncarg)
    if (this.servicio.transEncarg == true && Number(this.servicio.numberEncarg) > 0) this.servicio.valueTransEncargada = Number(this.servicio.numberEncarg)
  }

  validacionesFormaPagoAdd() {

    // Efectivo
    if (this.servicio.efectPiso1 == true && this.servicio.bizuPiso1 == true || this.servicio.efectPiso2 == true &&
      this.servicio.bizuPiso2 == true || this.servicio.efectTerap == true && this.servicio.bizuTerap == true ||
      this.servicio.efectEncarg == true && this.servicio.bizuEncarg == true || this.servicio.efectOtro == true &&
      this.servicio.bizuOtro == true || this.servicio.efectPiso1 == true && this.servicio.tarjPiso1 == true ||
      this.servicio.efectPiso2 == true && this.servicio.tarjPiso2 == true || this.servicio.efectTerap == true &&
      this.servicio.tarjTerap == true || this.servicio.efectEncarg == true && this.servicio.tarjEncarg == true ||
      this.servicio.efectOtro == true && this.servicio.tarjOtro == true || this.servicio.efectPiso1 == true &&
      this.servicio.transPiso1 == true || this.servicio.efectPiso2 == true && this.servicio.transPiso2 == true ||
      this.servicio.efectTerap == true && this.servicio.transTerap == true || this.servicio.efectEncarg == true &&
      this.servicio.transEncarg == true || this.servicio.efectOtro == true && this.servicio.transOtro == true) {
      Swal.fire({ icon: 'error', title: 'Oops...', text: 'Se escogio mas de una forma de pago' })
      return false
    }

    // Bizum
    if (this.servicio.bizuPiso1 == true && this.servicio.efectPiso1 == true || this.servicio.bizuPiso2 == true &&
      this.servicio.efectPiso2 == true || this.servicio.bizuTerap == true && this.servicio.efectTerap == true ||
      this.servicio.bizuEncarg == true && this.servicio.efectEncarg == true || this.servicio.bizuOtro == true &&
      this.servicio.efectOtro == true || this.servicio.bizuPiso1 == true && this.servicio.tarjPiso1 == true ||
      this.servicio.bizuPiso2 == true && this.servicio.tarjPiso2 == true || this.servicio.bizuTerap == true &&
      this.servicio.tarjTerap == true || this.servicio.bizuEncarg == true && this.servicio.tarjEncarg == true ||
      this.servicio.bizuOtro == true && this.servicio.tarjOtro == true || this.servicio.bizuPiso1 == true &&
      this.servicio.transPiso1 == true || this.servicio.bizuPiso2 == true && this.servicio.transPiso2 == true ||
      this.servicio.bizuTerap == true && this.servicio.transTerap == true || this.servicio.bizuEncarg == true &&
      this.servicio.transEncarg == true || this.servicio.bizuOtro == true && this.servicio.transOtro == true) {
      Swal.fire({ icon: 'error', title: 'Oops...', text: 'Se escogio mas de una forma de pago' })
      return false
    }

    // Tarjeta
    if (this.servicio.tarjPiso1 == true && this.servicio.efectPiso1 == true || this.servicio.tarjPiso2 == true &&
      this.servicio.efectPiso2 == true || this.servicio.tarjTerap == true && this.servicio.efectTerap == true ||
      this.servicio.tarjEncarg == true && this.servicio.efectEncarg == true || this.servicio.tarjOtro == true &&
      this.servicio.efectOtro == true || this.servicio.tarjPiso1 == true && this.servicio.bizuPiso1 == true ||
      this.servicio.tarjPiso2 == true && this.servicio.bizuPiso2 == true || this.servicio.tarjTerap == true &&
      this.servicio.bizuTerap == true || this.servicio.tarjEncarg == true && this.servicio.bizuEncarg == true ||
      this.servicio.tarjOtro == true && this.servicio.bizuOtro == true || this.servicio.tarjPiso1 == true &&
      this.servicio.transPiso1 == true || this.servicio.tarjPiso2 == true && this.servicio.transPiso2 == true ||
      this.servicio.tarjTerap == true && this.servicio.transTerap == true || this.servicio.tarjEncarg == true &&
      this.servicio.transEncarg == true || this.servicio.tarjOtro == true && this.servicio.transOtro == true) {
      Swal.fire({ icon: 'error', title: 'Oops...', text: 'Se escogio mas de una forma de pago' })
      return false
    }

    // Trans
    if (this.servicio.transPiso1 == true && this.servicio.efectPiso1 == true || this.servicio.transPiso2 == true &&
      this.servicio.efectPiso2 == true || this.servicio.transTerap == true && this.servicio.efectTerap == true ||
      this.servicio.transEncarg == true && this.servicio.efectEncarg == true || this.servicio.transOtro == true &&
      this.servicio.efectOtro == true || this.servicio.transPiso1 == true && this.servicio.bizuPiso1 == true ||
      this.servicio.transPiso2 == true && this.servicio.bizuPiso2 == true || this.servicio.transTerap == true &&
      this.servicio.bizuTerap == true || this.servicio.transEncarg == true && this.servicio.bizuEncarg == true ||
      this.servicio.transOtro == true && this.servicio.bizuOtro == true || this.servicio.transPiso1 == true &&
      this.servicio.tarjPiso1 == true || this.servicio.transPiso2 == true && this.servicio.tarjPiso2 == true ||
      this.servicio.transTerap == true && this.servicio.tarjTerap == true || this.servicio.transEncarg == true &&
      this.servicio.tarjEncarg == true || this.servicio.transOtro == true && this.servicio.tarjOtro == true) {
      Swal.fire({ icon: 'error', title: 'Oops...', text: 'Se escogio mas de una forma de pago' })
      return false
    }
    return true
  }

  validacionFormasPago() {

    if (Number(this.servicio.numberPiso1) > 0 && this.servicio.efectPiso1 == false && this.servicio.bizuPiso1 == false &&
      this.servicio.tarjPiso1 == false && this.servicio.transPiso1 == false) {
      Swal.fire({ icon: 'error', title: 'Oops...', text: 'No se escogio ninguna forma de pago para piso 1' })
      return false
    }
    if (Number(this.servicio.numberPiso2) > 0 && this.servicio.efectPiso2 == false && this.servicio.bizuPiso2 == false &&
      this.servicio.tarjPiso2 == false && this.servicio.transPiso2 == false) {
      Swal.fire({ icon: 'error', title: 'Oops...', text: 'No se escogio ninguna forma de pago para piso 2' })
      return false
    }
    if (Number(this.servicio.numberTerap) > 0 && this.servicio.efectTerap == false && this.servicio.bizuTerap == false &&
      this.servicio.tarjTerap == false && this.servicio.transTerap == false) {
      Swal.fire({ icon: 'error', title: 'Oops...', text: 'No se escogio ninguna forma de pago para terapeuta' })
      return false
    }
    if (Number(this.servicio.numberEncarg) > 0 && this.servicio.efectEncarg == false && this.servicio.bizuEncarg == false &&
      this.servicio.tarjEncarg == false && this.servicio.transEncarg == false) {
      Swal.fire({ icon: 'error', title: 'Oops...', text: 'No se escogio ninguna forma de pago para encargada' })
      return false
    }
    if (Number(this.servicio.numberOtro) > 0 && this.servicio.efectOtro == false && this.servicio.bizuOtro == false &&
      this.servicio.tarjOtro == false && this.servicio.transOtro == false) {
      Swal.fire({ icon: 'error', title: 'Oops...', text: 'No se escogio ninguna forma de pago para otros' })
      return false
    }
    return true
  }

  // -------------------------------------------- Editamos  // ---------------------------------------------

  validacionesFormaPagoEdit() {
    // Efectivo Editar
    if (this.editarService[0]['efectPiso1'] == true && this.editarService[0]['bizuPiso1'] == true ||
      this.editarService[0]['efectPiso2'] == true && this.editarService[0]['bizuPiso2'] == true ||
      this.editarService[0]['efectTerap'] == true && this.editarService[0]['bizuTerap'] == true ||
      this.editarService[0]['efectEncarg'] == true && this.editarService[0]['bizuEncarg'] == true ||
      this.editarService[0]['efectOtro'] == true && this.editarService[0]['bizuOtro'] == true ||
      this.editarService[0]['efectPiso1'] == true && this.editarService[0]['tarjPiso1'] == true ||
      this.editarService[0]['efectPiso2'] == true && this.editarService[0]['tarjPiso2'] == true ||
      this.editarService[0]['efectTerap'] == true && this.editarService[0]['tarjTerap'] == true ||
      this.editarService[0]['efectEncarg'] == true && this.editarService[0]['tarjEncarg'] == true ||
      this.editarService[0]['efectOtro'] == true && this.editarService[0]['tarjOtro'] == true ||
      this.editarService[0]['efectPiso1'] == true && this.editarService[0]['transPiso1'] == true ||
      this.editarService[0]['efectPiso2'] == true && this.editarService[0]['transPiso2'] == true ||
      this.editarService[0]['efectTerap'] == true && this.editarService[0]['transTerap'] == true ||
      this.editarService[0]['efectEncarg'] == true && this.editarService[0]['transEncarg'] == true ||
      this.editarService[0]['efectOtro'] == true && this.editarService[0]['transOtro'] == true) {
      Swal.fire({ icon: 'error', title: 'Oops...', text: 'Se escogio mas de una forma de pago' })
      return false
    }

    // Bizum Editar
    if (this.editarService[0]['bizuPiso1'] == true && this.editarService[0]['efectPiso1'] == true ||
      this.editarService[0]['bizuPiso2'] == true && this.editarService[0]['efectPiso2'] == true ||
      this.editarService[0]['bizuTerap'] == true && this.editarService[0]['efectTerap'] == true ||
      this.editarService[0]['bizuEncarg'] == true && this.editarService[0]['efectEncarg'] == true ||
      this.editarService[0]['bizuOtro'] == true && this.editarService[0]['efectOtro'] == true ||
      this.editarService[0]['bizuPiso1'] == true && this.editarService[0]['tarjPiso1'] == true ||
      this.editarService[0]['bizuPiso2'] == true && this.editarService[0]['tarjPiso2'] == true ||
      this.editarService[0]['bizuTerap'] == true && this.editarService[0]['tarjTerap'] == true ||
      this.editarService[0]['bizuEncarg'] == true && this.editarService[0]['tarjEncarg'] == true ||
      this.editarService[0]['bizuOtro'] == true && this.editarService[0]['tarjOtro'] == true ||
      this.editarService[0]['bizuPiso1'] == true && this.editarService[0]['transPiso1'] == true ||
      this.editarService[0]['bizuPiso2'] == true && this.editarService[0]['transPiso2'] == true ||
      this.editarService[0]['bizuTerap'] == true && this.editarService[0]['transTerap'] == true ||
      this.editarService[0]['bizuEncarg'] == true && this.editarService[0]['transEncarg'] == true ||
      this.editarService[0]['bizuOtro'] == true && this.editarService[0]['transOtro'] == true) {
      Swal.fire({ icon: 'error', title: 'Oops...', text: 'Se escogio mas de una forma de pago' })
      return false
    }

    // Tarjeta Editar
    if (this.editarService[0]['tarjPiso1'] == true && this.editarService[0]['efectPiso1'] == true ||
      this.editarService[0]['tarjPiso2'] == true && this.editarService[0]['efectPiso2'] == true ||
      this.editarService[0]['tarjTerap'] == true && this.editarService[0]['efectTerap'] == true ||
      this.editarService[0]['tarjEncarg'] == true && this.editarService[0]['efectEncarg'] == true ||
      this.editarService[0]['tarjOtro'] == true && this.editarService[0]['efectOtro'] == true ||
      this.editarService[0]['tarjPiso1'] == true && this.editarService[0]['bizuPiso1'] == true ||
      this.editarService[0]['tarjPiso2'] == true && this.editarService[0]['bizuPiso2'] == true ||
      this.editarService[0]['tarjTerap'] == true && this.editarService[0]['bizuTerap'] == true ||
      this.editarService[0]['tarjEncarg'] == true && this.editarService[0]['bizuEncarg'] == true ||
      this.editarService[0]['tarjOtro'] == true && this.editarService[0]['bizuOtro'] == true ||
      this.editarService[0]['tarjPiso1'] == true && this.editarService[0]['transPiso1'] == true ||
      this.editarService[0]['tarjPiso2'] == true && this.editarService[0]['transPiso2'] == true ||
      this.editarService[0]['tarjTerap'] == true && this.editarService[0]['transTerap'] == true ||
      this.editarService[0]['tarjEncarg'] == true && this.editarService[0]['transEncarg'] == true ||
      this.editarService[0]['tarjOtro'] == true && this.editarService[0]['transOtro'] == true) {
      Swal.fire({ icon: 'error', title: 'Oops...', text: 'Se escogio mas de una forma de pago' })
      return false
    }

    // Trans Editar
    if (this.editarService[0]['transPiso1'] == true && this.editarService[0]['efectPiso1'] == true ||
      this.editarService[0]['transPiso2'] == true && this.editarService[0]['efectPiso2'] == true ||
      this.editarService[0]['transTerap'] == true && this.editarService[0]['efectTerap'] == true ||
      this.editarService[0]['transEncarg'] == true && this.editarService[0]['efectEncarg'] == true ||
      this.editarService[0]['transOtro'] == true && this.editarService[0]['efectOtro'] == true ||
      this.editarService[0]['transPiso1'] == true && this.editarService[0]['bizuPiso1'] == true ||
      this.editarService[0]['transPiso2'] == true && this.editarService[0]['bizuPiso2'] == true ||
      this.editarService[0]['transTerap'] == true && this.editarService[0]['bizuTerap'] == true ||
      this.editarService[0]['transEncarg'] == true && this.editarService[0]['bizuEncarg'] == true ||
      this.editarService[0]['transOtro'] == true && this.editarService[0]['bizuOtro'] == true ||
      this.editarService[0]['transPiso1'] == true && this.editarService[0]['tarjPiso1'] == true ||
      this.editarService[0]['transPiso2'] == true && this.editarService[0]['tarjPiso2'] == true ||
      this.editarService[0]['transTerap'] == true && this.editarService[0]['tarjTerap'] == true ||
      this.editarService[0]['transEncarg'] == true && this.editarService[0]['tarjEncarg'] == true ||
      this.editarService[0]['transOtro'] == true && this.editarService[0]['tarjOtro'] == true) {
      Swal.fire({ icon: 'error', title: 'Oops...', text: 'Se escogio mas de una forma de pago' })
      return false
    }
    return true
  }

  validacionFormasPagoEdit() {

    if (Number(this.editarService[0]['numberPiso1']) > 0 && this.editarService[0]['efectPiso1'] == false &&
      this.editarService[0]['bizuPiso1'] == false && this.editarService[0]['tarjPiso1'] == false &&
      this.editarService[0]['transPiso1'] == false) {
      Swal.fire({ icon: 'error', title: 'Oops...', text: 'No se escogio ninguna forma de pago para piso 1' })
      return false
    }
    if (Number(this.editarService[0]['numberPiso2']) > 0 && this.editarService[0]['efectPiso2'] == false &&
      this.editarService[0]['bizuPiso2'] == false && this.editarService[0]['tarjPiso2'] == false &&
      this.editarService[0]['transPiso2'] == false) {
      Swal.fire({ icon: 'error', title: 'Oops...', text: 'No se escogio ninguna forma de pago para piso 2' })
      return false
    }
    if (Number(this.editarService[0]['numberTerap']) > 0 && this.editarService[0]['efectTerap'] == false &&
      this.editarService[0]['bizuTerap'] == false && this.editarService[0]['tarjTerap'] == false &&
      this.editarService[0]['transTerap'] == false) {
      Swal.fire({ icon: 'error', title: 'Oops...', text: 'No se escogio ninguna forma de pago para terapeuta' })
      return false
    }
    if (Number(this.editarService[0]['numberEncarg']) > 0 && this.editarService[0]['efectEncarg'] == false &&
      this.editarService[0]['bizuEncarg'] == false && this.editarService[0]['tarjEncarg'] == false &&
      this.editarService[0]['transEncarg'] == false) {
      Swal.fire({ icon: 'error', title: 'Oops...', text: 'No se escogio ninguna forma de pago para encargada' })
      return false
    }
    if (Number(this.editarService[0]['numberOtro']) > 0 && this.editarService[0]['efectOtro'] == false &&
      this.editarService[0]['bizuOtro'] == false && this.editarService[0]['tarjOtro'] == false &&
      this.editarService[0]['transOtro'] == false) {
      Swal.fire({ icon: 'error', title: 'Oops...', text: 'No se escogio ninguna forma de pago para otros' })
      return false
    }
    return true
  }

  fechaOrdenadaEdit() {
    let dia = '', mes = '', año = ''

    dia = this.editarService[0]['fecha'].substring(8, 10)
    mes = this.editarService[0]['fecha'].substring(5, 7)
    año = this.editarService[0]['fecha'].substring(2, 4)

    this.editarService[0]['fecha'] = `${dia}-${mes}-${año}`
  }

  getTerapeutaEdit(nombre: string) {
    this.trabajadorService.getByNombre(nombre).subscribe((resp) => {
      this.terapeutaSelect = resp
    })
  }

  cargar() {
    let fecha = new Date(), dia = '', mes = '', año = 0

    año = fecha.getFullYear()

    const paramEditar = this.activatedRoute.snapshot.params['editar'];
    this.idUserAdministrador = Number(this.activeRoute.snapshot['_urlSegment']['segments'][1]['path'])
    this.idEditar = Number(this.activeRoute.snapshot.paramMap.get('id'))
    if (paramEditar == "true") {
      this.servicioService.getByEditar(this.idEditar).subscribe((datosServicio: any) => {
        if (datosServicio.length > 0) {
          this.editamos = true
          document.getElementById('idTitulo').style.display = 'block'
          document.getElementById('idTitulo').innerHTML = 'Editar servicio'

          this.editarService = datosServicio
          this.getTerapeutaEdit(datosServicio[0].terapeuta)

          // Fechas
          dia = this.editarService[0].fecha.substring(0, 2)
          mes = this.editarService[0].fecha.substring(3, 5)
          this.editarService[0].fecha = `${año}-${mes}-${dia}`

          this.valueCobrosEdit()

          this.serviceLogin.getByIdAndAdministrador(this.idUserAdministrador).subscribe((datoAdministrador: any[]) => {
            if (datoAdministrador.length > 0) {
              this.buttonDelete = true
            } else {
              this.buttonDelete = false
            }
          })

        } else {
          this.editamos = false
          this.idUser = this.activeRoute.snapshot['_urlSegment']['segments'][1]['path']
          this.serviceLogin.getById(this.idUser).subscribe((datoUser: any[]) => {
            this.idUser = datoUser[0]
          })
        }
      })
    }
  }

  totalServicioEdit() {
    let piso1 = 0, piso2 = 0, terap = 0, encargada = 0, otros = 0

    if (Number(this.editarService[0]['numberPiso1']) === 0) {
      piso1 = 0
      this.editarService[0]['numberPiso1'] = "0"
    } else {
      piso1 = Number(this.editarService[0]['numberPiso1'])
    }

    if (Number(this.editarService[0]['numberPiso2']) == 0) {
      piso2 = 0
      this.editarService[0]['numberPiso2'] = "0"
    } else {
      piso2 = Number(this.editarService[0]['numberPiso2'])
    }

    if (Number(this.editarService[0]['numberTerap']) == 0) {
      terap = 0
      this.editarService[0]['numberTerap'] = "0"
    } else {
      terap = Number(this.editarService[0]['numberTerap'])
    }

    if (Number(this.editarService[0]['numberEncarg']) == 0) {
      encargada = 0
      this.editarService[0]['numberEncarg'] = "0"
    } else {
      encargada = Number(this.editarService[0]['numberEncarg'])
    }

    if (Number(this.editarService[0]['numberOtro']) == 0) {
      otros = 0
      this.editarService[0]['numberOtro'] = "0"
    } else {
      otros = Number(this.editarService[0]['numberOtro'])
    }

    this.servicioTotal = Number(piso1 + piso2 + terap + encargada + otros)

    if (Number(this.editarService[0]['servicio']) == 0) {
      otros = 0
      this.editarService[0]['servicio'] = "0"
    } else {
      otros = Number(this.editarService[0]['servicio'])
    }

    if (Number(this.editarService[0]['bebidas']) == 0) {
      otros = 0
      this.editarService[0]['bebidas'] = "0"
    } else {
      otros = Number(this.editarService[0]['bebidas'])
    }

    if (Number(this.editarService[0]['tabaco']) == 0) {
      otros = 0
      this.editarService[0]['tabaco'] = "0"
    } else {
      otros = Number(this.editarService[0]['tabaco'])
    }

    if (Number(this.editarService[0]['vitaminas']) == 0) {
      otros = 0
      this.editarService[0]['vitaminas'] = "0"
    } else {
      otros = Number(this.editarService[0]['vitaminas'])
    }

    if (Number(this.editarService[0]['propina']) == 0) {
      otros = 0
      this.editarService[0]['propina'] = "0"
    } else {
      otros = Number(this.editarService[0]['propina'])
    }

    if (Number(this.editarService[0]['otros']) == 0) {
      otros = 0
      this.editarService[0]['otros'] = "0"
    } else {
      otros = Number(this.editarService[0]['otros'])
    }
  }

  editarServicio(idServicio, serv: Servicio) {
    if (this.restamosCobroEdit == 0) {
      let idUsuario = ''
      idUsuario = this.activeRoute.snapshot['_urlSegment']['segments'][1]['path']

      if (!this.validarFechaVencida()) return
      if (!this.validacionFormasPagoEdit()) return
      if (!this.validacionesFormaPagoEdit()) return
      this.totalServicioEdit()
      this.efectCheckToggleEdit(this.validateEfect)
      this.bizumCheckToggleEdit(this.validateBizum)
      this.tarjCheckToggleEdit(this.validateTarjeta)
      this.transCheckToggleEdit(this.validateTrans)
      this.encargadaAndTerapeutaEdit()
      this.fechaOrdenadaEdit()
      this.editValue()

      this.servicioService.updateServicio(idServicio, serv)

      this.trabajadorService.getTerapeuta(this.editarService[0]['terapeuta']).subscribe((rp: any) => {
        const idDocument1 = rp.filter(tp => tp.nombre)

        this.trabajadorService.update(this.editarService[0]['terapeuta'], this.terapeutas)
      })

      Swal.fire({ position: 'top-end', icon: 'success', title: '¡Editado Correctamente!', showConfirmButton: false, timer: 2500 })
      this.router.navigate([`menu/${idUsuario}/vision/${idUsuario}`])

    } else {
      Swal.fire({ icon: 'error', title: 'Oops...', text: 'El total servicio no coincide con el total de cobros', showConfirmButton: false, timer: 2500 })
    }
  }

  valueServiceEdit() {
    let servicioEdit = 0, bebidaEdit = 0, tabacoEdit = 0, vitaminasEdit = 0, propinaEdit = 0, otrosEdit = 0, sumatoriaEdit = 0

    if (Number(this.editarService[0]['servicio']) > 0) {
      servicioEdit = Number(this.editarService[0]['servicio'])
    } else {
      servicioEdit = 0
    }

    if (Number(this.editarService[0]['bebidas']) > 0) {
      bebidaEdit = Number(this.editarService[0]['bebidas'])
    } else {
      bebidaEdit = 0
    }

    if (Number(this.editarService[0]['tabaco']) > 0) {
      tabacoEdit = Number(this.editarService[0]['tabaco'])
    } else {
      tabacoEdit = 0
    }

    if (Number(this.editarService[0]['vitaminas']) > 0) {
      vitaminasEdit = Number(this.editarService[0]['vitaminas'])
    } else {
      vitaminasEdit = 0
    }

    if (Number(this.editarService[0]['propina']) > 0) {
      propinaEdit = Number(this.editarService[0]['propina'])
    } else {
      propinaEdit = 0
    }

    if (Number(this.editarService[0]['otros']) > 0) {
      otrosEdit = Number(this.editarService[0]['otros'])
    } else {
      otrosEdit = 0
    }

    sumatoriaEdit = servicioEdit + bebidaEdit + tabacoEdit + vitaminasEdit + propinaEdit + otrosEdit
    this.editarService[0]['totalServicio'] = sumatoriaEdit
    this.restamosCobroEdit = sumatoriaEdit

    const restamosEdit = Number(this.editarService[0]['numberPiso1']) + Number(this.editarService[0]['numberPiso2']) + Number(this.editarService[0]['numberTerap']) +
      Number(this.editarService[0]['numberEncarg']) + Number(this.editarService[0]['numberOtro'])

    if (Number(this.editarService[0]['numberPiso1']) > 0) {
      this.restamosCobroEdit = sumatoriaEdit - restamosEdit
    }

    if (Number(this.editarService[0]['numberPiso2']) > 0) {
      this.restamosCobroEdit = sumatoriaEdit - restamosEdit
    }

    if (Number(this.editarService[0]['numberTerap']) > 0) {
      this.restamosCobroEdit = sumatoriaEdit - restamosEdit
    }

    if (Number(this.editarService[0]['numberEncarg']) > 0) {
      this.restamosCobroEdit = sumatoriaEdit - restamosEdit
    }

    if (Number(this.editarService[0]['numberOtro']) > 0) {
      this.restamosCobroEdit = sumatoriaEdit - restamosEdit
    }
  }

  valueCobrosEdit() {
    let valuepiso1Edit = 0, valuepiso2Edit = 0, valueterapeutaEdit = 0, valueEncargEdit = 0, valueotrosEdit = 0, restamosEdit = 0, resultadoEdit = 0

    if (Number(this.editarService[0]['numberPiso1']) > 0) {
      valuepiso1Edit = Number(this.editarService[0]['numberPiso1'])
    } else {
      valuepiso1Edit = 0
    }

    if (Number(this.editarService[0]['numberPiso2']) > 0) {
      valuepiso2Edit = Number(this.editarService[0]['numberPiso2'])
    } else {
      valuepiso2Edit = 0
    }

    if (Number(this.editarService[0]['numberTerap']) > 0) {
      valueterapeutaEdit = Number(this.editarService[0]['numberTerap'])
    } else {
      valueterapeutaEdit = 0
    }

    if (Number(this.editarService[0]['numberEncarg']) > 0) {
      valueEncargEdit = Number(this.editarService[0]['numberEncarg'])
    } else {
      valueEncargEdit = 0
    }

    if (Number(this.editarService[0]['numberOtro']) > 0) {
      valueotrosEdit = Number(this.editarService[0]['numberOtro'])
    } else {
      valueotrosEdit = 0
    }

    if (this.editarService[0]['totalServicio'] > 0) {
      resultadoEdit = Number(this.editarService[0]['totalServicio']) - valuepiso1Edit
    }

    this.sumatoriaCobrosEdit = valuepiso1Edit + valuepiso2Edit + valueterapeutaEdit + valueEncargEdit + valueotrosEdit

    restamosEdit = valuepiso1Edit + valuepiso2Edit + valueterapeutaEdit + valueEncargEdit + valueotrosEdit
    resultadoEdit = this.sumatoriaCobrosEdit - restamosEdit
    this.restamosCobroEdit = resultadoEdit
  }

  // Efectivo
  efectCheckToggleEdit(event: any) {
    let piso1 = 0, piso2 = 0, terap = 0, encarg = 0, otroserv = 0, suma = 0

    if (!this.validacionesFormaPagoEdit()) return
    if (event) {

      if (Number(this.editarService[0]['numberPiso1']) > 0 && this.editarService[0]['efectPiso1'] === true) {
        piso1 = Number(this.editarService[0]['numberPiso1'])
      } else {
        piso1 = 0
      }

      if (Number(this.editarService[0]['numberPiso2']) > 0 && this.editarService[0]['efectPiso2'] === true) {
        piso2 = Number(this.editarService[0]['numberPiso2'])
      } else {
        piso2 = 0
      }

      if (Number(this.editarService[0]['numberTerap']) > 0 && this.editarService[0]['efectTerap'] === true) {
        terap = Number(this.editarService[0]['numberTerap'])
      } else {
        terap = 0
      }

      if (Number(this.editarService[0]['numberEncarg']) > 0 && this.editarService[0]['efectEncarg'] === true) {
        encarg = Number(this.editarService[0]['numberEncarg'])
      } else {
        encarg = 0
      }

      if (Number(this.editarService[0]['numberOtro']) > 0 && this.editarService[0]['efectOtro'] === true) {
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

      if (Number(this.editarService[0]['numberPiso1']) > 0 && this.editarService[0]['bizuPiso1'] === true) {
        piso1 = Number(this.editarService[0]['numberPiso1'])
      } else {
        piso1 = 0
      }

      if (Number(this.editarService[0]['numberPiso2']) > 0 && this.editarService[0]['bizuPiso2'] === true) {
        piso2 = Number(this.editarService[0]['numberPiso2'])
      } else {
        piso2 = 0
      }

      if (Number(this.editarService[0]['numberTerap']) > 0 && this.editarService[0]['bizuTerap'] === true) {
        terap = Number(this.editarService[0]['numberTerap'])
      } else {
        terap = 0
      }

      if (Number(this.editarService[0]['numberEncarg']) > 0 && this.editarService[0]['bizuEncarg'] === true) {
        encarg = Number(this.editarService[0]['numberEncarg'])
      } else {
        encarg = 0
      }

      if (Number(this.editarService[0]['numberOtro']) > 0 && this.editarService[0]['bizuOtro'] === true) {
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

      if (Number(this.editarService[0]['numberPiso1']) > 0 && this.editarService[0]['tarjPiso1'] === true) {
        piso1 = Number(this.editarService[0]['numberPiso1'])
      } else {
        piso1 = 0
      }

      if (Number(this.editarService[0]['numberPiso2']) > 0 && this.editarService[0]['tarjPiso2'] === true) {
        piso2 = Number(this.editarService[0]['numberPiso2'])
      } else {
        piso2 = 0
      }

      if (Number(this.editarService[0]['numberTerap']) > 0 && this.editarService[0]['tarjTerap'] === true) {
        terap = Number(this.editarService[0]['numberTerap'])
      } else {
        terap = 0
      }

      if (Number(this.editarService[0]['numberEncarg']) > 0 && this.editarService[0]['tarjEncarg'] === true) {
        encarg = Number(this.editarService[0]['numberEncarg'])
      } else {
        encarg = 0
      }

      if (Number(this.editarService[0]['numberOtro']) > 0 && this.editarService[0]['tarjOtro'] === true) {
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

      if (Number(this.editarService[0]['numberPiso1']) > 0 && this.editarService[0]['transPiso1'] === true) {
        piso1 = Number(this.editarService[0]['numberPiso1'])
      } else {
        piso1 = 0
      }

      if (Number(this.editarService[0]['numberPiso2']) > 0 && this.editarService[0]['transPiso2'] === true) {
        piso2 = Number(this.editarService[0]['numberPiso2'])
      } else {
        piso2 = 0
      }

      if (Number(this.editarService[0]['numberTerap']) > 0 && this.editarService[0]['transTerap'] === true) {
        terap = Number(this.editarService[0]['numberTerap'])
      } else {
        terap = 0
      }

      if (Number(this.editarService[0]['numberEncarg']) > 0 && this.editarService[0]['transEncarg'] === true) {
        encarg = Number(this.editarService[0]['numberEncarg'])
      } else {
        encarg = 0
      }

      if (Number(this.editarService[0]['numberOtro']) > 0 && this.editarService[0]['transOtro'] === true) {
        otroservic = Number(this.editarService[0]['numberOtro'])
      } else {
        otroservic = 0
      }

      suma = piso1 + piso2 + terap + encarg + otroservic
      this.editarService[0]['valueTrans'] = suma
      return
    }
  }

  editValue() {
    if (this.editarService[0]['efectPiso1'] == true) (this.editarService[0]['valuePiso1Efectivo']) = Number(this.editarService[0]['numberPiso1'])
    if (this.editarService[0]['efectPiso2'] == true) this.editarService[0]['valuePiso2Efectivo'] = Number(this.editarService[0]['numberPiso2'])

    if (this.editarService[0]['bizuPiso1'] == true) this.editarService[0]['valuePiso1Bizum'] = Number(this.editarService[0]['numberPiso1'])
    if (this.editarService[0]['bizuPiso2'] == true) this.editarService[0]['valuePiso2Bizum'] = Number(this.editarService[0]['numberPiso2'])

    if (this.editarService[0]['tarjPiso1'] == true) this.editarService[0]['valuePiso1Tarjeta'] = Number(this.editarService[0]['numberPiso1'])
    if (this.editarService[0]['tarjPiso2'] == true) this.editarService[0]['valuePiso2Tarjeta'] = Number(this.editarService[0]['numberPiso2'])

    if (this.editarService[0]['transPiso1'] == true) this.editarService[0]['valuePiso1Transaccion'] = Number(this.editarService[0]['numberPiso1'])
    if (this.editarService[0]['transPiso2'] == true) this.editarService[0]['valuePiso2Transaccion'] = Number(this.editarService[0]['numberPiso2'])
  }

  encargadaAndTerapeutaEdit() {

    if (this.editarService[0]['efectTerap'] == true && Number(this.editarService[0]['numberTerap']) > 0) {
      this.editarService[0]['valueEfectTerapeuta'] = Number(this.editarService[0]['numberTerap'])
    } else {
      this.editarService[0]['valueEfectTerapeuta'] = 0
    }

    if (this.editarService[0]['bizuTerap'] == true && Number(this.editarService[0]['numberTerap']) > 0) {
      this.editarService[0]['valueBizuTerapeuta'] = Number(this.editarService[0]['numberTerap'])
    } else {
      this.editarService[0]['valueBizuTerapeuta'] = 0
    }

    if (this.editarService[0]['tarjTerap'] == true && Number(this.editarService[0]['numberTerap']) > 0) {
      this.editarService[0]['valueTarjeTerapeuta'] = Number(this.editarService[0]['numberTerap'])
    } else {
      this.editarService[0]['valueTarjeTerapeuta'] = 0
    }

    if (this.editarService[0]['transTerap'] == true && Number(this.editarService[0]['numberTerap']) > 0) {
      this.editarService[0]['valueTransTerapeuta'] = Number(this.editarService[0]['numberTerap'])
    } else {
      this.editarService[0]['valueTransTerapeuta'] = 0
    }

    // Encargada

    if (this.editarService[0]['efectEncarg'] == true && Number(this.editarService[0]['numberEncarg']) > 0) {
      this.editarService[0]['valueEfectEncargada'] = Number(this.editarService[0]['numberEncarg'])
    } else {
      this.editarService[0]['valueEfectEncargada'] = 0
    }

    if (this.editarService[0]['bizuEncarg'] == true && Number(this.editarService[0]['numberEncarg']) > 0) {
      this.editarService[0]['valueBizuEncargada'] = Number(this.editarService[0]['numberEncarg'])
    } else {
      this.editarService[0]['valueBizuEncargada'] = 0
    }

    if (this.editarService[0]['tarjEncarg'] == true && Number(this.editarService[0]['numberEncarg']) > 0) {
      this.editarService[0]['valueTarjeEncargada'] = Number(this.editarService[0]['numberEncarg'])
    } else {
      this.editarService[0]['valueTarjeEncargada'] = 0
    }

    if (this.editarService[0]['transEncarg'] == true && Number(this.editarService[0]['numberEncarg']) > 0) {
      this.editarService[0]['valueTransEncargada'] = Number(this.editarService[0]['numberEncarg'])
    } else {
      this.editarService[0]['valueTransEncargada'] = 0
    }
  }

  eliminarServicio(id) {
    let idUsuario = ''
    idUsuario = this.activeRoute.snapshot['_urlSegment']['segments'][1]['path']
    this.servicioService.getById(id).subscribe((datoEliminado) => {
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
            this.trabajadorService.getTerapeuta(datoEliminado[0]['terapeuta']).subscribe((rp: any) => {
              this.trabajadorService.updateHoraAndSalida(this.servicio.terapeuta, this.terapeutas)
            })

            this.servicioService.deleteServicio(id).subscribe((rp: any) => {
              this.idUser = this.activeRoute.snapshot['_urlSegment']['segments'][1]['path']
              this.router.navigate([`menu/${this.idUser}/vision/${this.idUser}`])
              Swal.fire({ position: 'top-end', icon: 'success', title: '¡Eliminado Correctamente!', showConfirmButton: false, timer: 2500 })
            })
          }
        })
      }
    })
  }

  cancelar() {
    this.idUser = this.activeRoute.snapshot['_urlSegment']['segments'][1]['path']
    this.router.navigate([`menu/${this.idUser}/vision/${this.idUser}`])
  }
}