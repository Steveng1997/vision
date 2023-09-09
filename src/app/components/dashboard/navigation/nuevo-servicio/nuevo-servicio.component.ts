import { Component, OnInit, ViewEncapsulation } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap'
import Swal from 'sweetalert2'

// Service
import { ServiceTherapist } from 'src/app/core/services/therapist'
import { Service } from 'src/app/core/services/service'
import { ServiceManager } from 'src/app/core/services/manager'

// Models
import { ModelTherapist } from 'src/app/core/models/therapist'
import { ModelService } from 'src/app/core/models/service'

@Component({
  selector: 'app-nuevo-servicio',
  templateUrl: './nuevo-servicio.component.html',
  styleUrls: ['./nuevo-servicio.component.css'],
  encapsulation: ViewEncapsulation.None
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
  editarService: ModelService[]
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

  cargamos: boolean
  addService = false

  services: ModelService = {
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
    fechaFin: "",
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

  therapist: ModelTherapist = {
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
    public serviceTherapist: ServiceTherapist,
    public service: Service,
    public serviceManager: ServiceManager,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    document.getElementById('idTitulo').style.display = 'block'
    document.getElementById('idTitulo').innerHTML = 'NUEVO SERVICIO'

    this.addService = true
    this.cargamos = false

    this.getTherapist()
    this.getManager()
    this.date()
    this.cargar()
    this.horaInicialServicio = this.horaStarted
    this.services.horaEnd = this.horaStarted
    this.services.horaStart = this.horaStarted
  }

  date() {
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
    let dia = '', mes = '', año = '', currentDate = new Date()

    dia = this.fechaActual.substring(8, 10)
    mes = this.fechaActual.substring(5, 7)
    año = this.fechaActual.substring(2, 4)

    this.fechaActual = `${dia}-${mes}-${año}`
    this.services.fecha = this.fechaActual
    this.services.fechaFin = this.fechaActual

    this.services.fechaHoyInicio = `${currentDate.getFullYear()}-${mes}-${dia}`
  }

  getLastDate() {
    this.service.getServicio().subscribe((datoLastDate: any) => {
      if (datoLastDate.length > 0) this.fechaLast[0] = datoLastDate[0]
      else this.fechaLast = datoLastDate['00:00']
    })
  }

  getTherapist() {
    this.serviceTherapist.getAllTerapeuta().subscribe((datosTerapeuta: any) => {
      this.terapeuta = datosTerapeuta
    })
  }

  getManager() {
    this.serviceManager.getUsuarios().subscribe((datosEncargada: any) => {
      this.encargada = datosEncargada
    })
  }

  isDisabled(date: NgbDateStruct, current: { month: number }) {
    return date.month !== current.month
  }

  changeFecha(event) {
    this.chageDate = event.target.value.substring(5, 10)
  }

  expiredDateValidations() {
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

  createUniqueId() {
    var d = new Date().getTime()
    var uuid = 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = (d + Math.random() * 16) % 16 | 0
      d = Math.floor(d / 16)
      return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16)
    })

    this.services.idUnico = uuid
    this.idUnico = uuid
    return this.idUnico
  }

  selectFive() {

    this.validateTheEmptyField()

    if (Number(this.services.numberPiso1) > 0 || Number(this.services.numberPiso2) > 0 || Number(this.services.numberTerap) > 0
      || Number(this.services.numberEncarg) > 0 || Number(this.services.numberOtro) > 0) {

      // Efectivo
      if (this.services.efectPiso1 == true && this.services.efectPiso2 == true && this.services.efectTerap == true &&
        this.services.efectEncarg == true && this.services.efectOtro == true) {

        if (this.services.efectPiso1 == true) this.services.valuePiso1Efectivo = Number(this.services.numberPiso1)
        if (this.services.efectPiso2 == true) this.services.valuePiso2Efectivo = Number(this.services.numberPiso2)

        this.completoEfectivo = 1
        this.services.formaPago = "Efectivo"

        this.service.registerServicio(this.services).subscribe((res: any) => { })
        return true
      }

      // Bizum
      if (this.services.bizuPiso1 == true && this.services.bizuPiso2 == true && this.services.bizuTerap == true &&
        this.services.bizuEncarg == true && this.services.bizuOtro == true) {

        if (this.services.bizuPiso1 == true) this.services.valuePiso1Bizum = Number(this.services.numberPiso1)
        if (this.services.bizuPiso2 == true) this.services.valuePiso2Bizum = Number(this.services.numberPiso2)

        this.completoBizum = 1
        this.services.formaPago = "Bizum"

        this.service.registerServicio(this.services).subscribe((res: any) => { })
        return true
      }

      // Tarjeta
      if (this.services.tarjPiso1 == true && this.services.tarjPiso2 == true && this.services.tarjTerap == true &&
        this.services.tarjEncarg == true && this.services.tarjOtro == true) {

        if (this.services.tarjPiso1 == true) this.services.valuePiso1Tarjeta = Number(this.services.numberPiso1)
        if (this.services.tarjPiso2 == true) this.services.valuePiso2Tarjeta = Number(this.services.numberPiso2)

        this.completoTarjeta = 1
        this.services.formaPago = "Tarjeta"

        this.service.registerServicio(this.services).subscribe((res: any) => { })
        return true
      }

      // Transaccion
      if (this.services.transPiso1 == true && this.services.transPiso2 == true && this.services.transTerap == true &&
        this.services.transEncarg == true && this.services.transOtro == true) {

        if (this.services.transPiso1 == true) this.services.valuePiso1Transaccion = Number(this.services.numberPiso1)
        if (this.services.transPiso2 == true) this.services.valuePiso2Transaccion = Number(this.services.numberPiso2)

        this.completoTrans = 1
        this.services.formaPago = "Transaccion"


        this.service.registerServicio(this.services).subscribe((res: any) => { })
        return true
      }
    }
    return true
  }

  selectFour() {

    this.validateTheEmptyField()

    if (Number(this.services.numberPiso1) > 0 || Number(this.services.numberPiso2) > 0 || Number(this.services.numberTerap) > 0
      || Number(this.services.numberEncarg) > 0 || Number(this.services.numberOtro) > 0) {

      // Efectivo
      if (this.services.efectPiso1 == true && this.services.efectPiso2 == true && this.services.efectTerap == true
        && this.services.efectEncarg == true || this.services.efectPiso2 == true && this.services.efectTerap == true &&
        this.services.efectEncarg == true && this.services.efectOtro == true || this.services.efectPiso1 == true &&
        this.services.efectTerap == true && this.services.efectEncarg == true && this.services.efectOtro == true ||
        this.services.efectPiso1 == true && this.services.efectPiso2 == true && this.services.efectEncarg == true &&
        this.services.efectOtro == true || this.services.efectPiso1 == true && this.services.efectPiso2 == true &&
        this.services.efectTerap == true && this.services.efectOtro == true) {

        if (this.services.efectPiso1 == true) this.services.valuePiso1Efectivo = Number(this.services.numberPiso1)
        if (this.services.efectPiso2 == true) this.services.valuePiso2Efectivo = Number(this.services.numberPiso2)

        this.completoEfectivo = 1
        this.services.formaPago = "Efectivo"

        this.service.registerServicio(this.services).subscribe((res: any) => { })
        return true
      }

      // Bizum
      if (this.services.bizuPiso1 == true && this.services.bizuPiso2 == true && this.services.bizuTerap == true
        && this.services.bizuEncarg == true || this.services.bizuPiso2 == true && this.services.bizuTerap == true &&
        this.services.bizuEncarg == true && this.services.bizuOtro == true || this.services.bizuPiso1 == true &&
        this.services.bizuTerap == true && this.services.bizuEncarg == true && this.services.bizuOtro == true ||
        this.services.bizuPiso1 == true && this.services.bizuPiso2 == true && this.services.bizuEncarg == true &&
        this.services.bizuOtro == true || this.services.bizuPiso1 == true && this.services.bizuPiso2 == true &&
        this.services.bizuTerap == true && this.services.bizuOtro == true) {

        if (this.services.bizuPiso1 == true) this.services.valuePiso1Bizum = Number(this.services.numberPiso1)
        if (this.services.bizuPiso2 == true) this.services.valuePiso2Bizum = Number(this.services.numberPiso2)

        this.completoBizum = 1
        this.services.formaPago = "Bizum"

        this.service.registerServicio(this.services).subscribe((res: any) => { })
        return true
      }

      // Tarjeta
      if (this.services.tarjPiso1 == true && this.services.tarjPiso2 == true && this.services.tarjTerap == true
        && this.services.tarjEncarg == true || this.services.tarjPiso2 == true && this.services.tarjTerap == true &&
        this.services.tarjEncarg == true && this.services.tarjOtro == true || this.services.tarjPiso1 == true &&
        this.services.tarjTerap == true && this.services.tarjEncarg == true && this.services.tarjOtro == true ||
        this.services.tarjPiso1 == true && this.services.tarjPiso2 == true && this.services.tarjEncarg == true &&
        this.services.tarjOtro == true || this.services.tarjPiso1 == true && this.services.tarjPiso2 == true &&
        this.services.tarjTerap == true && this.services.tarjOtro == true) {

        if (this.services.tarjPiso1 == true) this.services.valuePiso1Tarjeta = Number(this.services.numberPiso1)
        if (this.services.tarjPiso2 == true) this.services.valuePiso2Tarjeta = Number(this.services.numberPiso2)

        this.completoTarjeta = 1
        this.services.formaPago = "Tarjeta"

        this.service.registerServicio(this.services).subscribe((res: any) => { })
        return true
      }

      // Transaccion
      if (this.services.transPiso1 == true && this.services.transPiso2 == true && this.services.transTerap == true
        && this.services.transEncarg == true || this.services.transPiso2 == true && this.services.transTerap == true &&
        this.services.transEncarg == true && this.services.transOtro == true || this.services.transPiso1 == true &&
        this.services.transTerap == true && this.services.transEncarg == true && this.services.transOtro == true ||
        this.services.transPiso1 == true && this.services.transPiso2 == true && this.services.transEncarg == true &&
        this.services.transOtro == true || this.services.transPiso1 == true && this.services.transPiso2 == true &&
        this.services.transTerap == true && this.services.transOtro == true) {

        if (this.services.transPiso1 == true) this.services.valuePiso1Transaccion = Number(this.services.numberPiso1)
        if (this.services.transPiso2 == true) this.services.valuePiso2Transaccion = Number(this.services.numberPiso2)

        this.completoTrans = 1
        this.services.formaPago = "Transaccion"

        this.service.registerServicio(this.services).subscribe((res: any) => { })
        return true
      }
    }
    return true
  }

  selectThree() {

    this.validateTheEmptyField()

    if (Number(this.services.numberPiso1) > 0 || Number(this.services.numberPiso2) > 0 || Number(this.services.numberTerap) > 0
      || Number(this.services.numberEncarg) > 0 || Number(this.services.numberOtro) > 0) {

      // Efectivo
      if (this.services.efectPiso1 == true && this.services.efectPiso2 == true && this.services.efectTerap == true ||
        this.services.efectPiso2 == true && this.services.efectTerap == true && this.services.efectEncarg == true ||
        this.services.efectTerap == true && this.services.efectEncarg == true && this.services.efectOtro == true ||
        this.services.efectPiso1 == true && this.services.efectTerap == true && this.services.efectOtro == true ||
        this.services.efectPiso1 == true && this.services.efectTerap == true && this.services.efectEncarg == true ||
        this.services.efectPiso1 == true && this.services.efectPiso2 == true && this.services.efectEncarg == true ||
        this.services.efectPiso1 == true && this.services.efectEncarg == true && this.services.efectOtro == true ||
        this.services.efectPiso1 == true && this.services.efectPiso2 == true && this.services.efectOtro == true ||
        this.services.efectPiso2 == true && this.services.efectEncarg == true && this.services.efectOtro == true ||
        this.services.efectPiso2 == true && this.services.efectTerap == true && this.services.efectOtro == true) {

        if (this.services.efectPiso1 == true) this.services.valuePiso1Efectivo = Number(this.services.numberPiso1)
        if (this.services.efectPiso2 == true) this.services.valuePiso2Efectivo = Number(this.services.numberPiso2)

        this.completoEfectivo = 1
        this.services.formaPago = "Efectivo"

        this.service.registerServicio(this.services).subscribe((res: any) => { })
        return true
      }

      // Bizum
      if (this.services.bizuPiso1 == true && this.services.bizuPiso2 == true && this.services.bizuTerap == true ||
        this.services.bizuPiso2 == true && this.services.bizuTerap == true && this.services.bizuEncarg == true ||
        this.services.bizuTerap == true && this.services.bizuEncarg == true && this.services.bizuOtro == true ||
        this.services.bizuPiso1 == true && this.services.bizuTerap == true && this.services.bizuOtro == true ||
        this.services.bizuPiso1 == true && this.services.bizuTerap == true && this.services.bizuEncarg == true ||
        this.services.bizuPiso1 == true && this.services.bizuPiso2 == true && this.services.bizuEncarg == true ||
        this.services.bizuPiso1 == true && this.services.bizuEncarg == true && this.services.bizuOtro == true ||
        this.services.bizuPiso1 == true && this.services.bizuPiso2 == true && this.services.bizuOtro == true ||
        this.services.bizuPiso2 == true && this.services.bizuEncarg == true && this.services.bizuOtro == true ||
        this.services.bizuPiso2 == true && this.services.bizuTerap == true && this.services.bizuOtro == true) {

        if (this.services.bizuPiso1 == true) this.services.valuePiso1Bizum = Number(this.services.numberPiso1)
        if (this.services.bizuPiso2 == true) this.services.valuePiso2Bizum = Number(this.services.numberPiso2)

        this.completoBizum = 1
        this.services.formaPago = "Bizum"

        this.service.registerServicio(this.services).subscribe((res: any) => { })
        return true
      }

      // Tarjeta
      if (this.services.tarjPiso1 == true && this.services.tarjPiso2 == true && this.services.tarjTerap == true ||
        this.services.tarjPiso2 == true && this.services.tarjTerap == true && this.services.tarjEncarg == true ||
        this.services.tarjTerap == true && this.services.tarjEncarg == true && this.services.tarjOtro == true ||
        this.services.tarjPiso1 == true && this.services.tarjTerap == true && this.services.tarjOtro == true ||
        this.services.tarjPiso1 == true && this.services.tarjTerap == true && this.services.tarjEncarg == true ||
        this.services.tarjPiso1 == true && this.services.tarjPiso2 == true && this.services.tarjEncarg == true ||
        this.services.tarjPiso1 == true && this.services.tarjEncarg == true && this.services.tarjOtro == true ||
        this.services.tarjPiso1 == true && this.services.tarjPiso2 == true && this.services.tarjOtro == true ||
        this.services.tarjPiso2 == true && this.services.tarjEncarg == true && this.services.tarjOtro == true ||
        this.services.tarjPiso2 == true && this.services.tarjTerap == true && this.services.tarjOtro == true) {

        if (this.services.tarjPiso1 == true) this.services.valuePiso1Tarjeta = Number(this.services.numberPiso1)
        if (this.services.tarjPiso2 == true) this.services.valuePiso2Tarjeta = Number(this.services.numberPiso2)

        this.completoTarjeta = 1
        this.services.formaPago = "Tarjeta"

        this.service.registerServicio(this.services).subscribe((res: any) => { })
        return true
      }

      // Transaccion
      if (this.services.transPiso1 == true && this.services.transPiso2 == true && this.services.transTerap == true ||
        this.services.transPiso2 == true && this.services.transTerap == true && this.services.transEncarg == true ||
        this.services.transTerap == true && this.services.transEncarg == true && this.services.transOtro == true ||
        this.services.transPiso1 == true && this.services.transTerap == true && this.services.transOtro == true ||
        this.services.transPiso1 == true && this.services.transTerap == true && this.services.transEncarg == true ||
        this.services.transPiso1 == true && this.services.transPiso2 == true && this.services.transEncarg == true ||
        this.services.transPiso1 == true && this.services.transEncarg == true && this.services.transOtro == true ||
        this.services.transPiso1 == true && this.services.transPiso2 == true && this.services.transOtro == true ||
        this.services.transPiso2 == true && this.services.transEncarg == true && this.services.transOtro == true ||
        this.services.transPiso2 == true && this.services.transTerap == true && this.services.transOtro == true) {

        if (this.services.transPiso1 == true) this.services.valuePiso1Transaccion = Number(this.services.numberPiso1)
        if (this.services.transPiso2 == true) this.services.valuePiso2Transaccion = Number(this.services.numberPiso2)

        this.completoTrans = 1
        this.services.formaPago = "Transaccion"

        this.service.registerServicio(this.services).subscribe((res: any) => { })
        return true
      }
    }

    return true
  }

  convertZero() {
    this.services.numberPiso1 = "0"
    this.services.numberPiso2 = "0"
    this.services.numberEncarg = "0"
    this.services.numberTerap = "0"
    this.services.numberOtro = "0"
    this.services.servicio = "0"
    this.services.bebidas = "0"
    this.services.tabaco = "0"
    this.services.vitaminas = "0"
    this.services.propina = "0"
    this.services.otros = "0"
    this.services.totalServicio = 0
  }

  validateTheEmptyField() {
    if (this.services.bebidas == "") this.services.bebidas = "0"
    if (this.services.numberEncarg == "") this.services.numberEncarg = "0"
    if (this.services.numberOtro == "") this.services.numberOtro = "0"
    if (this.services.numberPiso1 == "") this.services.numberPiso1 = "0"
    if (this.services.numberPiso2 == "") this.services.numberPiso2 = "0"
    if (this.services.numberTerap == "") this.services.numberTerap = "0"
    if (this.services.otros == "") this.services.otros = "0"
    if (this.services.propina == "") this.services.propina = "0"
    if (this.services.tabaco == "") this.services.tabaco = "0"
    if (this.services.vitaminas == "") this.services.vitaminas = "0"
  }

  conteoNumber() {
    if (this.services.efectPiso1 == true) this.countEfect += 1
    if (this.services.efectPiso2 == true) this.countEfect += 1
    if (this.services.efectTerap == true) this.countEfect += 1
    if (this.services.efectEncarg == true) this.countEfect += 1
    if (this.services.efectOtro == true) this.countEfect += 1

    if (this.services.bizuPiso1 == true) this.countbizu += 1
    if (this.services.bizuPiso2 == true) this.countbizu += 1
    if (this.services.bizuTerap == true) this.countbizu += 1
    if (this.services.bizuEncarg == true) this.countbizu += 1
    if (this.services.bizuOtro == true) this.countbizu += 1

    if (this.services.tarjPiso1 == true) this.counttarj += 1
    if (this.services.tarjPiso2 == true) this.counttarj += 1
    if (this.services.tarjTerap == true) this.counttarj += 1
    if (this.services.tarjEncarg == true) this.counttarj += 1
    if (this.services.tarjOtro == true) this.counttarj += 1

    if (this.services.transPiso1 == true) this.counttrans += 1
    if (this.services.transPiso2 == true) this.counttrans += 1
    if (this.services.transTerap == true) this.counttrans += 1
    if (this.services.transEncarg == true) this.counttrans += 1
    if (this.services.transOtro == true) this.counttrans += 1
  }

  selectTwo(piso1, piso2, terapeuta, encargada, otros) {

    this.validateTheEmptyField()

    if (piso1 > 0 || piso2 > 0 || terapeuta > 0 || encargada > 0 || otros > 0) {

      // Efectivo
      if (this.services.efectPiso1 == true && this.services.efectPiso2 == true || this.services.efectPiso1 == true &&
        this.services.efectTerap == true || this.services.efectPiso1 == true && this.services.efectEncarg == true ||
        this.services.efectPiso1 == true && this.services.efectOtro == true || this.services.efectPiso2 == true &&
        this.services.efectTerap == true || this.services.efectPiso2 == true && this.services.efectEncarg == true ||
        this.services.efectPiso2 == true && this.services.efectOtro == true || this.services.efectTerap == true &&
        this.services.efectOtro == true || this.services.efectEncarg == true && this.services.efectOtro == true ||
        this.services.efectTerap == true && this.services.efectEncarg == true) {

        if (this.services.efectPiso1 == true) this.services.valuePiso1Efectivo = Number(this.services.numberPiso1)
        if (this.services.efectPiso2 == true) this.services.valuePiso2Efectivo = Number(this.services.numberPiso2)

        this.completoEfectivo = 1
        this.services.formaPago = "Efectivo"

        this.service.registerServicio(this.services).subscribe((res: any) => { })
        return true
      }

      // Bizum
      if (this.services.bizuPiso1 == true && this.services.bizuPiso2 == true || this.services.bizuPiso1 == true &&
        this.services.bizuTerap == true || this.services.bizuPiso1 == true && this.services.bizuEncarg == true ||
        this.services.bizuPiso1 == true && this.services.bizuOtro == true || this.services.bizuPiso2 == true &&
        this.services.bizuTerap == true || this.services.bizuPiso2 == true && this.services.bizuEncarg == true ||
        this.services.bizuPiso2 == true && this.services.bizuOtro == true || this.services.bizuTerap == true &&
        this.services.bizuOtro == true || this.services.bizuEncarg == true && this.services.bizuOtro == true ||
        this.services.bizuTerap == true && this.services.bizuEncarg == true) {

        if (this.services.bizuPiso1 == true) this.services.valuePiso1Bizum = Number(this.services.numberPiso1)
        if (this.services.bizuPiso2 == true) this.services.valuePiso2Bizum = Number(this.services.numberPiso2)

        this.completoBizum = 1
        this.services.formaPago = "Bizum"

        this.service.registerServicio(this.services).subscribe((res: any) => { })
        return true
      }

      // Tarjeta
      if (this.services.tarjPiso1 == true && this.services.tarjPiso2 == true || this.services.tarjPiso1 == true &&
        this.services.tarjTerap == true || this.services.tarjPiso1 == true && this.services.tarjEncarg == true ||
        this.services.tarjPiso1 == true && this.services.tarjOtro == true || this.services.tarjPiso2 == true &&
        this.services.tarjTerap == true || this.services.tarjPiso2 == true && this.services.tarjEncarg == true ||
        this.services.tarjPiso2 == true && this.services.tarjOtro == true || this.services.tarjTerap == true &&
        this.services.tarjOtro == true || this.services.tarjEncarg == true && this.services.tarjOtro == true ||
        this.services.tarjTerap == true && this.services.tarjEncarg == true) {

        if (this.services.tarjPiso1 == true) this.services.valuePiso1Tarjeta = Number(this.services.numberPiso1)
        if (this.services.tarjPiso2 == true) this.services.valuePiso2Tarjeta = Number(this.services.numberPiso2)

        this.completoTarjeta = 1
        this.services.formaPago = "Tarjeta"

        this.service.registerServicio(this.services).subscribe((res: any) => { })
        return true
      }

      // Transaccion
      if (this.services.transPiso1 == true && this.services.transPiso2 == true || this.services.transPiso1 == true &&
        this.services.transTerap == true || this.services.transPiso1 == true && this.services.transEncarg == true ||
        this.services.transPiso1 == true && this.services.transOtro == true || this.services.transPiso2 == true &&
        this.services.transTerap == true || this.services.transPiso2 == true && this.services.transEncarg == true ||
        this.services.transPiso2 == true && this.services.transOtro == true || this.services.transTerap == true &&
        this.services.transOtro == true || this.services.transEncarg == true && this.services.transOtro == true ||
        this.services.transTerap == true && this.services.transEncarg == true) {

        if (this.services.transPiso1 == true) this.services.valuePiso1Transaccion = Number(this.services.numberPiso1)
        if (this.services.transPiso2 == true) this.services.valuePiso2Transaccion = Number(this.services.numberPiso2)

        this.completoTrans = 1
        this.services.formaPago = "Transaccion"

        this.service.registerServicio(this.services).subscribe((res: any) => { })
        return true
      }
    }

    return true
  }

  selectMoreThanTwo(piso1, piso2, terapeuta, encargada, otros, idsUnico) {

    this.services.numberPiso1 = piso1
    this.services.numberPiso2 = piso2
    this.services.numberTerap = terapeuta
    this.services.numberEncarg = encargada
    this.services.numberOtro = otros

    if (piso1 > 0 || piso2 > 0 || terapeuta > 0 || encargada > 0 || otros > 0) {

      // Efectivo
      if (this.services.formaPago == 'Bizum' || this.services.formaPago == 'Tarjeta' || this.services.formaPago == 'Transaccion') {
        if (this.services.efectPiso1 == true && this.services.efectPiso2 == true || this.services.efectPiso1 == true &&
          this.services.efectTerap == true || this.services.efectPiso1 == true && this.services.efectEncarg == true ||
          this.services.efectPiso1 == true && this.services.efectOtro == true || this.services.efectPiso2 == true &&
          this.services.efectTerap == true || this.services.efectPiso2 == true && this.services.efectEncarg == true ||
          this.services.efectPiso2 == true && this.services.efectOtro == true || this.services.efectTerap == true &&
          this.services.efectOtro == true || this.services.efectEncarg == true && this.services.efectOtro == true ||
          this.services.efectTerap == true && this.services.efectEncarg == true) {

          if (this.services.efectPiso1 == true) this.service.updateNumberPiso1(idsUnico, this.services).subscribe((rp) => { })
          if (this.services.efectPiso2 == true) this.service.updateNumberPiso2(idsUnico, this.services).subscribe((rp) => { })
          if (this.services.efectEncarg == true) this.service.updateNumberEncargada(idsUnico, this.services).subscribe((rp) => { })
          if (this.services.efectTerap == true) this.service.updateNumberTerap(idsUnico, this.services).subscribe((rp) => { })
          if (this.services.efectOtro == true) this.service.updateNumberOtros(idsUnico, this.services).subscribe((rp) => { })

          this.convertZero()
          this.services.formaPago = 'Efectivo'
          this.completoEfectivo = 1

          this.service.registerServicio(this.services).subscribe((register) => { })

          setTimeout(() => {
            this.service.getIdDescendente(idsUnico).subscribe((resp: any) => {
              if (resp.length > 0) {

                this.services.numberPiso1 = piso1
                this.services.numberPiso2 = piso2
                this.services.numberEncarg = encargada
                this.services.numberTerap = terapeuta
                this.services.numberOtro = otros

                if (this.services.efectPiso1 == true) this.service.updateWithValueNumberPiso1(resp[0]['id'], idsUnico, this.services).subscribe((rp) => { })
                if (this.services.efectPiso2 == true) this.service.updateWithValueNumberPiso2(resp[0]['id'], idsUnico, this.services).subscribe((rp) => { })
                if (this.services.efectEncarg == true) this.service.updateWithValueNumberEncargada(resp[0]['id'], idsUnico, this.services).subscribe((rp) => { })
                if (this.services.efectTerap == true) this.service.updateWithValueNumberTerap(resp[0]['id'], idsUnico, this.services).subscribe((rp) => { })
                if (this.services.efectOtro == true) this.service.updateWithValueNumberOtros(resp[0]['id'], idsUnico, this.services).subscribe((rp) => { })
                this.service.updatePisos(resp[0]['id'], idsUnico, this.services).subscribe((rp) => { })
              }
            })
          }, 1000)
          return true
        }
      }

      // Bizum
      if (this.services.formaPago == 'Efectivo' || this.services.formaPago == 'Tarjeta' || this.services.formaPago == 'Transaccion') {
        if (this.services.bizuPiso1 == true && this.services.bizuPiso2 == true || this.services.bizuPiso1 == true &&
          this.services.bizuTerap == true || this.services.bizuPiso1 == true && this.services.bizuEncarg == true ||
          this.services.bizuPiso1 == true && this.services.bizuOtro == true || this.services.bizuPiso2 == true &&
          this.services.bizuTerap == true || this.services.bizuPiso2 == true && this.services.bizuEncarg == true ||
          this.services.bizuPiso2 == true && this.services.bizuOtro == true || this.services.bizuTerap == true &&
          this.services.bizuOtro == true || this.services.bizuEncarg == true && this.services.bizuOtro == true ||
          this.services.bizuTerap == true && this.services.bizuEncarg == true) {

          if (this.services.bizuPiso1 == true) this.service.updateNumberPiso1(idsUnico, this.services).subscribe((rp) => { })
          if (this.services.bizuPiso2 == true) this.service.updateNumberPiso2(idsUnico, this.services).subscribe((rp) => { })
          if (this.services.bizuEncarg == true) this.service.updateNumberEncargada(idsUnico, this.services).subscribe((rp) => { })
          if (this.services.bizuTerap == true) this.service.updateNumberTerap(idsUnico, this.services).subscribe((rp) => { })
          if (this.services.bizuOtro == true) this.service.updateNumberOtros(idsUnico, this.services).subscribe((rp) => { })

          this.convertZero()
          this.services.formaPago = 'Bizum'
          this.completoBizum = 1

          this.service.registerServicio(this.services).subscribe((register) => { })

          setTimeout(() => {
            this.service.getIdDescendente(idsUnico).subscribe((resp: any) => {
              if (resp.length > 0) {

                this.services.numberPiso1 = piso1
                this.services.numberPiso2 = piso2
                this.services.numberEncarg = encargada
                this.services.numberTerap = terapeuta
                this.services.numberOtro = otros

                if (this.services.bizuPiso1 == true) this.service.updateWithValueNumberPiso1(resp[0]['id'], idsUnico, this.services).subscribe((rp) => { })
                if (this.services.bizuPiso2 == true) this.service.updateWithValueNumberPiso2(resp[0]['id'], idsUnico, this.services).subscribe((rp) => { })
                if (this.services.bizuEncarg == true) this.service.updateWithValueNumberEncargada(resp[0]['id'], idsUnico, this.services).subscribe((rp) => { })
                if (this.services.bizuTerap == true) this.service.updateWithValueNumberTerap(resp[0]['id'], idsUnico, this.services).subscribe((rp) => { })
                if (this.services.bizuOtro == true) this.service.updateWithValueNumberOtros(resp[0]['id'], idsUnico, this.services).subscribe((rp) => { })
                this.service.updatePisos(resp[0]['id'], idsUnico, this.services).subscribe((rp) => { })
              }
            })
          }, 1000)
          return true
        }
      }

      // Tarjeta
      if (this.services.formaPago == 'Efectivo' || this.services.formaPago == 'Bizum' || this.services.formaPago == 'Transaccion') {
        if (this.services.tarjPiso1 == true && this.services.tarjPiso2 == true || this.services.tarjPiso1 == true &&
          this.services.tarjTerap == true || this.services.tarjPiso1 == true && this.services.tarjEncarg == true ||
          this.services.tarjPiso1 == true && this.services.tarjOtro == true || this.services.tarjPiso2 == true &&
          this.services.tarjTerap == true || this.services.tarjPiso2 == true && this.services.tarjEncarg == true ||
          this.services.tarjPiso2 == true && this.services.tarjOtro == true || this.services.tarjTerap == true &&
          this.services.tarjOtro == true || this.services.tarjEncarg == true && this.services.tarjOtro == true ||
          this.services.tarjTerap == true && this.services.tarjEncarg == true) {

          if (this.services.tarjPiso1 == true) this.service.updateNumberPiso1(idsUnico, this.services).subscribe((rp) => { })
          if (this.services.tarjPiso2 == true) this.service.updateNumberPiso2(idsUnico, this.services).subscribe((rp) => { })
          if (this.services.tarjEncarg == true) this.service.updateNumberEncargada(idsUnico, this.services).subscribe((rp) => { })
          if (this.services.tarjTerap == true) this.service.updateNumberTerap(idsUnico, this.services).subscribe((rp) => { })
          if (this.services.tarjOtro == true) this.service.updateNumberOtros(idsUnico, this.services).subscribe((rp) => { })

          this.convertZero()
          this.services.formaPago = 'Tarjeta'
          this.completoTarjeta = 1

          this.service.registerServicio(this.services).subscribe((register) => { })

          setTimeout(() => {
            this.service.getIdDescendente(idsUnico).subscribe((resp: any) => {
              if (resp.length > 0) {

                this.services.numberPiso1 = piso1
                this.services.numberPiso2 = piso2
                this.services.numberEncarg = encargada
                this.services.numberTerap = terapeuta
                this.services.numberOtro = otros

                if (this.services.tarjPiso1 == true) this.service.updateWithValueNumberPiso1(resp[0]['id'], idsUnico, this.services).subscribe((rp) => { })
                if (this.services.tarjPiso2 == true) this.service.updateWithValueNumberPiso2(resp[0]['id'], idsUnico, this.services).subscribe((rp) => { })
                if (this.services.tarjEncarg == true) this.service.updateWithValueNumberEncargada(resp[0]['id'], idsUnico, this.services).subscribe((rp) => { })
                if (this.services.tarjTerap == true) this.service.updateWithValueNumberTerap(resp[0]['id'], idsUnico, this.services).subscribe((rp) => { })
                if (this.services.tarjOtro == true) this.service.updateWithValueNumberOtros(resp[0]['id'], idsUnico, this.services).subscribe((rp) => { })
                this.service.updatePisos(resp[0]['id'], idsUnico, this.services).subscribe((rp) => { })
              }
            })
          }, 1000)
          return true
        }
      }

      // Transaccion
      if (this.services.formaPago == 'Efectivo' || this.services.formaPago == 'Bizum' || this.services.formaPago == 'Tarjeta') {
        if (this.services.transPiso1 == true && this.services.transPiso2 == true || this.services.transPiso1 == true &&
          this.services.transTerap == true || this.services.transPiso1 == true && this.services.transEncarg == true ||
          this.services.transPiso1 == true && this.services.transOtro == true || this.services.transPiso2 == true &&
          this.services.transTerap == true || this.services.transPiso2 == true && this.services.transEncarg == true ||
          this.services.transPiso2 == true && this.services.transOtro == true || this.services.transTerap == true &&
          this.services.transOtro == true || this.services.transEncarg == true && this.services.transOtro == true ||
          this.services.transTerap == true && this.services.transEncarg == true) {

          if (this.services.transPiso1 == true) this.service.updateNumberPiso1(idsUnico, this.services).subscribe((rp) => { })
          if (this.services.transPiso2 == true) this.service.updateNumberPiso2(idsUnico, this.services).subscribe((rp) => { })
          if (this.services.transEncarg == true) this.service.updateNumberEncargada(idsUnico, this.services).subscribe((rp) => { })
          if (this.services.transTerap == true) this.service.updateNumberTerap(idsUnico, this.services).subscribe((rp) => { })
          if (this.services.transOtro == true) this.service.updateNumberOtros(idsUnico, this.services).subscribe((rp) => { })

          this.convertZero()
          this.services.formaPago = 'Transaccion'
          this.completoTrans = 1

          this.service.registerServicio(this.services).subscribe((register) => { })

          setTimeout(() => {
            this.service.getIdDescendente(idsUnico).subscribe((resp: any) => {
              if (resp.length > 0) {

                this.services.numberPiso1 = piso1
                this.services.numberPiso2 = piso2
                this.services.numberEncarg = encargada
                this.services.numberTerap = terapeuta
                this.services.numberOtro = otros

                if (this.services.transPiso1 == true) this.service.updateWithValueNumberPiso1(resp[0]['id'], idsUnico, this.services).subscribe((rp) => { })
                if (this.services.transPiso2 == true) this.service.updateWithValueNumberPiso2(resp[0]['id'], idsUnico, this.services).subscribe((rp) => { })
                if (this.services.transEncarg == true) this.service.updateWithValueNumberEncargada(resp[0]['id'], idsUnico, this.services).subscribe((rp) => { })
                if (this.services.transTerap == true) this.service.updateWithValueNumberTerap(resp[0]['id'], idsUnico, this.services).subscribe((rp) => { })
                if (this.services.transOtro == true) this.service.updateWithValueNumberOtros(resp[0]['id'], idsUnico, this.services).subscribe((rp) => { })
                this.service.updatePisos(resp[0]['id'], idsUnico, this.services).subscribe((rp) => { })
              }
            })
          }, 1000)
          return true
        }
      }
    }

    return true
  }

  selectMoreThanOne() {

    this.validateTheEmptyField()

    if (Number(this.services.numberPiso1) > 0 || Number(this.services.numberPiso2) > 0 || Number(this.services.numberTerap) > 0
      || Number(this.services.numberEncarg) > 0 || Number(this.services.numberOtro) > 0) {

      if (this.services.efectPiso1 == true) this.services.valuePiso1Efectivo = Number(this.services.numberPiso1)
      if (this.services.efectPiso2 == true) this.services.valuePiso2Efectivo = Number(this.services.numberPiso2)
      if (this.services.bizuPiso1 == true) this.services.valuePiso1Bizum = Number(this.services.numberPiso1)
      if (this.services.bizuPiso2 == true) this.services.valuePiso2Bizum = Number(this.services.numberPiso2)
      if (this.services.tarjPiso1 == true) this.services.valuePiso1Tarjeta = Number(this.services.numberPiso1)
      if (this.services.tarjPiso2 == true) this.services.valuePiso2Tarjeta = Number(this.services.numberPiso2)
      if (this.services.transPiso1 == true) this.services.valuePiso1Transaccion = Number(this.services.numberPiso1)
      if (this.services.transPiso2 == true) this.services.valuePiso2Transaccion = Number(this.services.numberPiso2)

      // Efectivo

      if (this.services.efectPiso1 == true || this.services.efectPiso2 == true || this.services.efectTerap == true ||
        this.services.efectEncarg == true || this.services.efectOtro == true) {

        this.services.formaPago = 'Efectivo'
        this.completoEfectivo = 1
        this.service.registerServicio(this.services).subscribe((register) => { })
        return true
      }

      // Bizum
      if (this.services.bizuPiso1 == true || this.services.bizuPiso2 == true || this.services.bizuTerap == true ||
        this.services.bizuEncarg == true || this.services.bizuOtro == true) {

        this.services.formaPago = 'Bizum'
        this.completoBizum = 1
        this.service.registerServicio(this.services).subscribe((res: any) => { })
        return true
      }

      // Tarjeta
      if (this.services.tarjPiso1 == true || this.services.tarjPiso2 == true || this.services.tarjTerap == true ||
        this.services.tarjEncarg == true || this.services.tarjOtro == true) {

        this.services.formaPago = 'Tarjeta'
        this.completoTarjeta = 1
        this.service.registerServicio(this.services).subscribe((res: any) => { })
        return true
      }

      // Transaccion
      if (this.services.transPiso1 == true || this.services.transPiso2 == true || this.services.transTerap == true ||
        this.services.transEncarg == true || this.services.transOtro == true) {

        this.services.formaPago = 'Transaccion'
        this.completoTrans = 1
        this.service.registerServicio(this.services).subscribe((res: any) => { })
        return true
      }
    }

    return true
  }

  mas1SelectUpdate(piso1, piso2, terapeuta, encargada, otros, idsUnico) {

    this.services.numberPiso1 = piso1
    this.services.numberPiso2 = piso2
    this.services.numberTerap = terapeuta
    this.services.numberEncarg = encargada
    this.services.numberOtro = otros

    if (piso1 > 0 || piso2 > 0 || terapeuta > 0 || encargada > 0 || otros > 0) {

      // Efectivo
      if (this.services.formaPago == 'Bizum' || this.services.formaPago == 'Tarjeta' || this.services.formaPago == 'Transaccion') {
        if (this.services.efectPiso1 == true || this.services.efectPiso2 == true || this.services.efectTerap == true ||
          this.services.efectEncarg == true || this.services.efectOtro == true) {

          if (this.services.efectPiso1 == true) this.service.updateNumberPiso1(idsUnico, this.services).subscribe((rp) => { })
          if (this.services.efectPiso2 == true) this.service.updateNumberPiso2(idsUnico, this.services).subscribe((rp) => { })
          if (this.services.efectEncarg == true) this.service.updateNumberEncargada(idsUnico, this.services).subscribe((rp) => { })
          if (this.services.efectTerap == true) this.service.updateNumberTerap(idsUnico, this.services).subscribe((rp) => { })
          if (this.services.efectOtro == true) this.service.updateNumberOtros(idsUnico, this.services).subscribe((rp) => { })

          this.convertZero()
          this.completoEfectivo = 1
          this.services.formaPago = "Efectivo"

          this.service.registerServicio(this.services).subscribe((register: any) => { })

          setTimeout(() => {
            this.service.getIdDescendente(idsUnico).subscribe((resp: any) => {
              if (resp.length > 0) {

                this.services.numberPiso1 = piso1
                this.services.numberPiso2 = piso2
                this.services.numberEncarg = encargada
                this.services.numberTerap = terapeuta
                this.services.numberOtro = otros

                if (this.services.efectPiso1 == true) this.service.updateWithValueNumberPiso1(resp[0]['id'], idsUnico, this.services).subscribe((rp) => { })
                if (this.services.efectPiso2 == true) this.service.updateWithValueNumberPiso2(resp[0]['id'], idsUnico, this.services).subscribe((rp) => { })
                if (this.services.efectEncarg == true) this.service.updateWithValueNumberEncargada(resp[0]['id'], idsUnico, this.services).subscribe((rp) => { })
                if (this.services.efectTerap == true) this.service.updateWithValueNumberTerap(resp[0]['id'], idsUnico, this.services).subscribe((rp) => { })
                if (this.services.efectOtro == true) this.service.updateWithValueNumberOtros(resp[0]['id'], idsUnico, this.services).subscribe((rp) => { })
                this.service.updatePisos(resp[0]['id'], idsUnico, this.services).subscribe((rp) => { })
              }
            })
          }, 1000)
          return true
        }
      }

      // Bizum
      if (this.services.formaPago == 'Efectivo' || this.services.formaPago == 'Tarjeta' || this.services.formaPago == 'Transaccion') {
        if (this.services.bizuPiso1 == true || this.services.bizuPiso2 == true || this.services.bizuTerap == true ||
          this.services.bizuEncarg == true || this.services.bizuOtro == true) {

          if (this.services.bizuPiso1 == true) this.service.updateNumberPiso1(idsUnico, this.services).subscribe((rp) => { })
          if (this.services.bizuPiso2 == true) this.service.updateNumberPiso2(idsUnico, this.services).subscribe((rp) => { })
          if (this.services.bizuEncarg == true) this.service.updateNumberEncargada(idsUnico, this.services).subscribe((rp) => { })
          if (this.services.bizuTerap == true) this.service.updateNumberTerap(idsUnico, this.services).subscribe((rp) => { })
          if (this.services.bizuOtro == true) this.service.updateNumberOtros(idsUnico, this.services).subscribe((rp) => { })

          this.convertZero()
          this.completoBizum = 1
          this.services.formaPago = 'Bizum'

          this.service.registerServicio(this.services).subscribe((register: any) => { })

          setTimeout(() => {
            this.service.getIdDescendente(idsUnico).subscribe((resp: any) => {
              if (resp.length > 0) {

                this.services.numberPiso1 = piso1
                this.services.numberPiso2 = piso2
                this.services.numberEncarg = encargada
                this.services.numberTerap = terapeuta
                this.services.numberOtro = otros

                if (this.services.bizuPiso1 == true) this.service.updateWithValueNumberPiso1(resp[0]['id'], idsUnico, this.services).subscribe((rp) => { })
                if (this.services.bizuPiso2 == true) this.service.updateWithValueNumberPiso2(resp[0]['id'], idsUnico, this.services).subscribe((rp) => { })
                if (this.services.bizuEncarg == true) this.service.updateWithValueNumberEncargada(resp[0]['id'], idsUnico, this.services).subscribe((rp) => { })
                if (this.services.bizuTerap == true) this.service.updateWithValueNumberTerap(resp[0]['id'], idsUnico, this.services).subscribe((rp) => { })
                if (this.services.bizuOtro == true) this.service.updateWithValueNumberOtros(resp[0]['id'], idsUnico, this.services).subscribe((rp) => { })
                this.service.updatePisos(resp[0]['id'], idsUnico, this.services).subscribe((rp) => { })
              }
            })
          }, 1000)
          return true
        }
      }

      // Tarjeta
      if (this.services.formaPago == 'Efectivo' || this.services.formaPago == 'Bizum' || this.services.formaPago == 'Transaccion') {
        if (this.services.tarjPiso1 == true || this.services.tarjPiso2 == true || this.services.tarjTerap == true ||
          this.services.tarjEncarg == true || this.services.tarjOtro == true) {

          if (this.services.tarjPiso1 == true) this.service.updateNumberPiso1(idsUnico, this.services).subscribe((rp) => { })
          if (this.services.tarjPiso2 == true) this.service.updateNumberPiso2(idsUnico, this.services).subscribe((rp) => { })
          if (this.services.tarjEncarg == true) this.service.updateNumberEncargada(idsUnico, this.services).subscribe((rp) => { })
          if (this.services.tarjTerap == true) this.service.updateNumberTerap(idsUnico, this.services).subscribe((rp) => { })
          if (this.services.tarjOtro == true) this.service.updateNumberOtros(idsUnico, this.services).subscribe((rp) => { })

          this.convertZero()
          this.completoTarjeta = 1
          this.services.formaPago = 'Tarjeta'

          this.service.registerServicio(this.services).subscribe((register) => { })

          setTimeout(() => {
            this.service.getIdDescendente(idsUnico).subscribe((resp: any) => {
              if (resp.length > 0) {

                this.services.numberPiso1 = piso1
                this.services.numberPiso2 = piso2
                this.services.numberEncarg = encargada
                this.services.numberTerap = terapeuta
                this.services.numberOtro = otros

                if (this.services.tarjPiso1 == true) this.service.updateWithValueNumberPiso1(resp[0]['id'], idsUnico, this.services).subscribe((rp) => { })
                if (this.services.tarjPiso2 == true) this.service.updateWithValueNumberPiso2(resp[0]['id'], idsUnico, this.services).subscribe((rp) => { })
                if (this.services.tarjEncarg == true) this.service.updateWithValueNumberEncargada(resp[0]['id'], idsUnico, this.services).subscribe((rp) => { })
                if (this.services.tarjTerap == true) this.service.updateWithValueNumberTerap(resp[0]['id'], idsUnico, this.services).subscribe((rp) => { })
                if (this.services.tarjOtro == true) this.service.updateWithValueNumberOtros(resp[0]['id'], idsUnico, this.services).subscribe((rp) => { })
                this.service.updatePisos(resp[0]['id'], idsUnico, this.services).subscribe((rp) => { })
              }
            })
          }, 1000)
          return true
        }
      }

      // Transaccion
      if (this.services.formaPago == 'Efectivo' || this.services.formaPago == 'Bizum' || this.services.formaPago == 'Tarjeta') {
        if (this.services.transPiso1 == true || this.services.transPiso2 == true || this.services.transTerap == true ||
          this.services.transEncarg == true || this.services.transOtro == true) {

          if (this.services.transPiso1 == true) this.service.updateNumberPiso1(idsUnico, this.services).subscribe((rp) => { })
          if (this.services.transPiso2 == true) this.service.updateNumberPiso2(idsUnico, this.services).subscribe((rp) => { })
          if (this.services.transEncarg == true) this.service.updateNumberEncargada(idsUnico, this.services).subscribe((rp) => { })
          if (this.services.transTerap == true) this.service.updateNumberTerap(idsUnico, this.services).subscribe((rp) => { })
          if (this.services.transOtro == true) this.service.updateNumberOtros(idsUnico, this.services).subscribe((rp) => { })

          this.convertZero()
          this.completoTrans = 1

          this.service.registerServicio(this.services).subscribe((register) => { })

          setTimeout(() => {
            this.service.getIdDescendente(idsUnico).subscribe((resp: any) => {
              if (resp.length > 0) {

                this.services.numberPiso1 = piso1
                this.services.numberPiso2 = piso2
                this.services.numberEncarg = encargada
                this.services.numberTerap = terapeuta
                this.services.numberOtro = otros

                if (this.services.transPiso1 == true) this.service.updateWithValueNumberPiso1(resp[0]['id'], idsUnico, this.services).subscribe((rp) => { })
                if (this.services.transPiso2 == true) this.service.updateWithValueNumberPiso2(resp[0]['id'], idsUnico, this.services).subscribe((rp) => { })
                if (this.services.transEncarg == true) this.service.updateWithValueNumberEncargada(resp[0]['id'], idsUnico, this.services).subscribe((rp) => { })
                if (this.services.transTerap == true) this.service.updateWithValueNumberTerap(resp[0]['id'], idsUnico, this.services).subscribe((rp) => { })
                if (this.services.transOtro == true) this.service.updateWithValueNumberOtros(resp[0]['id'], idsUnico, this.services).subscribe((rp) => { })
                this.service.updatePisos(resp[0]['id'], idsUnico, this.services).subscribe((rp) => { })
              }
            })
          }, 1000)
          return true
        }
      }
    }

    return true
  }

  efectivoUpdate(piso1, piso2, encargada, terapeuta, otros, idUnico) {
    if (this.services.efectPiso1 == true || this.services.efectPiso2 == true || this.services.efectTerap == true ||
      this.services.efectEncarg == true || this.services.efectOtro == true) {

      if (this.services.efectPiso1 == true) this.service.updateNumberPiso1(idUnico, this.services).subscribe((rp) => { })
      if (this.services.efectPiso2 == true) this.service.updateNumberPiso2(idUnico, this.services).subscribe((rp) => { })
      if (this.services.efectEncarg == true) this.service.updateNumberEncargada(idUnico, this.services).subscribe((rp) => { })
      if (this.services.efectTerap == true) this.service.updateNumberTerap(idUnico, this.services).subscribe((rp) => { })
      if (this.services.efectOtro == true) this.service.updateNumberOtros(idUnico, this.services).subscribe((rp) => { })

      this.convertZero()
      this.completoEfectivo = 1
      this.services.formaPago = "Efectivo"

      this.service.registerServicio(this.services).subscribe((register) => { })

      setTimeout(() => {
        this.service.getIdDescendente(idUnico).subscribe((resp: any) => {
          if (resp.length > 0) {

            this.services.numberPiso1 = piso1
            this.services.numberPiso2 = piso2
            this.services.numberEncarg = encargada
            this.services.numberTerap = terapeuta
            this.services.numberOtro = otros

            if (this.services.efectPiso1 == true) this.service.updateWithValueNumberPiso1(resp[0]['id'], idUnico, this.services).subscribe((rp) => { })
            if (this.services.efectPiso2 == true) this.service.updateWithValueNumberPiso2(resp[0]['id'], idUnico, this.services).subscribe((rp) => { })
            if (this.services.efectEncarg == true) this.service.updateWithValueNumberEncargada(resp[0]['id'], idUnico, this.services).subscribe((rp) => { })
            if (this.services.efectTerap == true) this.service.updateWithValueNumberTerap(resp[0]['id'], idUnico, this.services).subscribe((rp) => { })
            if (this.services.efectOtro == true) this.service.updateWithValueNumberOtros(resp[0]['id'], idUnico, this.services).subscribe((rp) => { })
            this.service.updatePisos(resp[0]['id'], idUnico, this.services).subscribe((rp) => { })
          }
        })
      }, 1000)
      return true
    }
    return true
  }

  bizumUpdate(piso1, piso2, encargada, terapeuta, otros, idUnico) {
    if (this.services.bizuPiso1 == true || this.services.bizuPiso2 == true || this.services.bizuTerap == true ||
      this.services.bizuEncarg == true || this.services.bizuOtro == true) {

      if (this.services.bizuPiso1 == true) this.service.updateNumberPiso1(idUnico, this.services).subscribe((rp) => { })
      if (this.services.bizuPiso2 == true) this.service.updateNumberPiso2(idUnico, this.services).subscribe((rp) => { })
      if (this.services.bizuEncarg == true) this.service.updateNumberEncargada(idUnico, this.services).subscribe((rp) => { })
      if (this.services.bizuTerap == true) this.service.updateNumberTerap(idUnico, this.services).subscribe((rp) => { })
      if (this.services.bizuOtro == true) this.service.updateNumberOtros(idUnico, this.services).subscribe((rp) => { })

      this.convertZero()
      this.completoBizum = 1
      this.services.formaPago = "Bizum"

      this.service.registerServicio(this.services).subscribe((register) => { })

      setTimeout(() => {
        this.service.getIdDescendente(idUnico).subscribe((resp: any) => {
          if (resp.length > 0) {

            this.services.numberPiso1 = piso1
            this.services.numberPiso2 = piso2
            this.services.numberEncarg = encargada
            this.services.numberTerap = terapeuta
            this.services.numberOtro = otros

            if (this.services.bizuPiso1 == true) this.service.updateWithValueNumberPiso1(resp[0]['id'], idUnico, this.services).subscribe((rp) => { })
            if (this.services.bizuPiso2 == true) this.service.updateWithValueNumberPiso2(resp[0]['id'], idUnico, this.services).subscribe((rp) => { })
            if (this.services.bizuEncarg == true) this.service.updateWithValueNumberEncargada(resp[0]['id'], idUnico, this.services).subscribe((rp) => { })
            if (this.services.bizuTerap == true) this.service.updateWithValueNumberTerap(resp[0]['id'], idUnico, this.services).subscribe((rp) => { })
            if (this.services.bizuOtro == true) this.service.updateWithValueNumberOtros(resp[0]['id'], idUnico, this.services).subscribe((rp) => { })
            this.service.updatePisos(resp[0]['id'], idUnico, this.services).subscribe((rp) => { })
          }
        })
      }, 1000)
      return true
    }
    return true
  }

  tarjetaUpdate(piso1, piso2, terapeuta, encargada, otros, idUnico) {
    if (this.services.tarjPiso1 == true || this.services.tarjPiso2 == true || this.services.tarjTerap == true ||
      this.services.tarjEncarg == true || this.services.tarjOtro == true) {

      if (this.services.tarjPiso1 == true) this.service.updateNumberPiso1(idUnico, this.services).subscribe((rp) => { })
      if (this.services.tarjPiso2 == true) this.service.updateNumberPiso2(idUnico, this.services).subscribe((rp) => { })
      if (this.services.tarjEncarg == true) this.service.updateNumberEncargada(idUnico, this.services).subscribe((rp) => { })
      if (this.services.tarjTerap == true) this.service.updateNumberTerap(idUnico, this.services).subscribe((rp) => { })
      if (this.services.tarjOtro == true) this.service.updateNumberOtros(idUnico, this.services).subscribe((rp) => { })

      this.convertZero()
      this.completoTarjeta = 1
      this.services.formaPago = "Tarjeta"

      this.service.registerServicio(this.services).subscribe((register) => { })

      setTimeout(() => {
        this.service.getIdDescendente(idUnico).subscribe((resp: any) => {
          if (resp.length > 0) {

            this.services.numberPiso1 = piso1
            this.services.numberPiso2 = piso2
            this.services.numberEncarg = encargada
            this.services.numberTerap = terapeuta
            this.services.numberOtro = otros

            if (this.services.tarjPiso1 == true) this.service.updateWithValueNumberPiso1(resp[0]['id'], idUnico, this.services).subscribe((rp) => { })
            if (this.services.tarjPiso2 == true) this.service.updateWithValueNumberPiso2(resp[0]['id'], idUnico, this.services).subscribe((rp) => { })
            if (this.services.tarjEncarg == true) this.service.updateWithValueNumberEncargada(resp[0]['id'], idUnico, this.services).subscribe((rp) => { })
            if (this.services.tarjTerap == true) this.service.updateWithValueNumberTerap(resp[0]['id'], idUnico, this.services).subscribe((rp) => { })
            if (this.services.tarjOtro == true) this.service.updateWithValueNumberOtros(resp[0]['id'], idUnico, this.services).subscribe((rp) => { })
            this.service.updatePisos(resp[0]['id'], idUnico, this.services).subscribe((rp) => { })
          }
        })
      }, 1000)
      return true
    }
    return true
  }

  transaccionUpdate(piso1, piso2, terapeuta, encargada, otros, idUnico) {
    if (this.services.transPiso1 == true || this.services.transPiso2 == true || this.services.transTerap == true ||
      this.services.transEncarg == true || this.services.transOtro == true) {

      if (this.services.transPiso1 == true) this.service.updateNumberPiso1(idUnico, piso1).subscribe((rp) => { })
      if (this.services.transPiso2 == true) this.service.updateNumberPiso2(idUnico, piso2).subscribe((rp) => { })
      if (this.services.transEncarg == true) this.service.updateNumberEncargada(idUnico, encargada).subscribe((rp) => { })
      if (this.services.transTerap == true) this.service.updateNumberTerap(idUnico, terapeuta).subscribe((rp) => { })
      if (this.services.transOtro == true) this.service.updateNumberOtros(idUnico, otros).subscribe((rp) => { })

      this.convertZero()
      this.completoTrans = 1
      this.services.formaPago = "Transaccion"

      this.service.registerServicio(this.services).subscribe((register) => { })

      setTimeout(() => {
        this.service.getIdDescendente(idUnico).subscribe((resp: any) => {
          if (resp.length > 0) {

            this.services.numberPiso1 = piso1
            this.services.numberPiso2 = piso2
            this.services.numberEncarg = encargada
            this.services.numberTerap = terapeuta
            this.services.numberOtro = otros

            if (this.services.transPiso1 == true) this.service.updateWithValueNumberPiso1(resp[0]['id'], idUnico, this.services).subscribe((rp) => { })
            if (this.services.transPiso2 == true) this.service.updateWithValueNumberPiso2(resp[0]['id'], idUnico, this.services).subscribe((rp) => { })
            if (this.services.transEncarg == true) this.service.updateWithValueNumberEncargada(resp[0]['id'], idUnico, this.services).subscribe((rp) => { })
            if (this.services.transTerap == true) this.service.updateWithValueNumberTerap(resp[0]['id'], idUnico, this.services).subscribe((rp) => { })
            if (this.services.transOtro == true) this.service.updateWithValueNumberOtros(resp[0]['id'], idUnico, this.services).subscribe((rp) => { })
            this.service.updatePisos(resp[0]['id'], idUnico, this.services).subscribe((rp) => { })
          }
        })
      }, 1000)
      return true
    }
    return true
  }

  addServicio() {
    if (this.services.terapeuta != '') {
      if (this.services.encargada != '') {
        if (Number(this.services.servicio) > 0) {

          // Methods 
          this.createUniqueId()
          if (!this.expiredDateValidations()) return
          if (!this.validacionFormasPago()) return
          if (!this.validatePaymentMethod()) return
          this.sumService()
          this.efectCheckToggle(this.validateEfect)
          this.bizumCheckToggle(this.validateBizum)
          this.tarjCheckToggle(this.validateTarjeta)
          this.transCheckToggle(this.validateTrans)
          this.encargadaAndTerapeuta()

          if (this.restamosCobro == 0) {
            this.addService = false

            let piso1 = 0, piso2 = 0, terapeuta = 0, encargada = 0, otros = 0, fecha = '', idsUnico = ''

            piso1 = Number(this.services.numberPiso1)
            piso2 = Number(this.services.numberPiso2)
            terapeuta = Number(this.services.numberTerap)
            encargada = Number(this.services.numberEncarg)
            otros = Number(this.services.numberOtro)
            fecha = this.fechaActual.replace("-", "/").replace("-", "/")
            idsUnico = this.services.idUnico
            this.services.currentDate = this.currentDate.toString()

            this.conteoNumber()
            this.fechaOrdenada()

            this.cargamos = true
            this.services.editar = true

            if (!this.selectFive()) return

            if (this.services.formaPago == "") {
              if (this.countEfect == 4 || this.countbizu == 4 || this.counttarj == 4 || this.counttrans == 4) {
                if (!this.selectFour()) return
              }
            }

            if (this.services.formaPago == "") {
              if (this.countEfect == 3 || this.countbizu == 3 || this.counttarj == 3 || this.counttrans == 3) {
                if (!this.selectThree()) return
              }
            }

            if (this.services.formaPago == "") {
              if (this.countEfect == 2 || this.countbizu == 2 || this.counttarj == 2 || this.counttrans == 2) {
                if (!this.selectTwo(piso1, piso2, terapeuta, encargada, otros)) return
              }
            }

            setTimeout(() => {
              if (this.services.formaPago != "") {
                if (this.countEfect == 3 || this.countbizu == 3 || this.counttarj == 3 || this.counttrans == 3 ||
                  this.countEfect == 2 || this.countbizu == 2 || this.counttarj == 2 || this.counttrans == 2) {
                  if (this.completoEfectivo == 1 || this.completoBizum == 1 || this.completoTarjeta == 1 || this.completoTrans == 1) {
                    this.service.getIdUnico(idsUnico).subscribe((idUnicoExit: any) => {
                      if (idUnicoExit.length > 0) {
                        if (!this.selectMoreThanTwo(piso1, piso2, terapeuta, encargada, otros, idsUnico)) return
                      }
                    })
                  }
                }
              }
            }, 3000)


            setTimeout(() => {
              if (this.services.formaPago != "") {
                if (this.countEfect == 4 || this.countbizu == 4 || this.counttarj == 4 || this.counttrans == 4 ||
                  this.countEfect == 3 || this.countbizu == 3 || this.counttarj == 3 || this.counttrans == 3 ||
                  this.countEfect == 2 || this.countbizu == 2 || this.counttarj == 2 || this.counttrans == 2) {
                  if (this.countEfect == 1 || this.countbizu == 1 || this.counttarj == 1 || this.counttrans == 1) {
                    if (this.completoEfectivo == 1 || this.completoBizum == 1 || this.completoTarjeta == 1 || this.completoTrans == 1) {
                      this.service.getIdUnico(idsUnico).subscribe((idUnicoExit: any) => {
                        if (idUnicoExit.length > 0) {
                          if (!this.mas1SelectUpdate(piso1, piso2, terapeuta, encargada, otros, idsUnico)) return
                        }
                      })
                    }
                  }
                }
              }
            }, 3000)

            if (this.services.formaPago == "") {
              if (this.countEfect == 1 || this.countbizu == 1 || this.counttarj == 1 || this.counttrans == 1) {
                if (!this.selectMoreThanOne()) return

                setTimeout(() => {
                  if (this.services.formaPago != "") {
                    if (this.countEfect == 1 || this.countbizu == 1 || this.counttarj == 1 || this.counttrans == 1) {

                      if (this.completoEfectivo == 0) {
                        this.service.getIdUnico(idsUnico).subscribe((idUnicoExit: any) => {
                          if (idUnicoExit.length > 0) {
                            if (!this.efectivoUpdate(piso1, piso2, encargada, terapeuta, otros, idsUnico)) return
                          }
                        })
                      }

                      if (this.completoBizum == 0) {
                        this.service.getIdUnico(idsUnico).subscribe((idUnicoExit: any) => {
                          if (idUnicoExit.length > 0) {
                            if (!this.bizumUpdate(piso1, piso2, encargada, terapeuta, otros, idsUnico)) return
                          }
                        })
                      }

                      if (this.completoTarjeta == 0) {
                        this.service.getIdUnico(idsUnico).subscribe((idUnicoExit: any) => {
                          if (idUnicoExit.length > 0) {
                            if (!this.tarjetaUpdate(piso1, piso2, terapeuta, encargada, otros, idsUnico)) return
                          }
                        })
                      }

                      if (this.completoTrans == 0) {
                        this.service.getIdUnico(idsUnico).subscribe((idUnicoExit: any) => {
                          if (idUnicoExit.length > 0) {
                            if (!this.transaccionUpdate(piso1, piso2, terapeuta, encargada, otros, idsUnico)) return
                          }
                        })
                      }
                    }
                  }
                }, 3000)
              }
            }

            this.therapist.horaEnd = this.services.horaEnd
            this.therapist.salida = this.services.salida
            this.therapist.fechaEnd = this.services.fechaHoyInicio

            this.serviceTherapist.update(this.services.terapeuta, this.therapist).subscribe((rp: any) => { })

            setTimeout(() => {
              this.idUser = Number(this.activeRoute.snapshot['_urlSegment']['segments'][1]['path'])
              this.router.navigate([`menu/${this.idUser}/vision/${this.idUser}`])
              Swal.fire({ position: 'top-end', icon: 'success', title: '¡Insertado Correctamente!', showConfirmButton: false, timer: 1500 })
            }, 5000)

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

  sumService() {
    this.services.totalServicio = Number(this.services.numberPiso1) + Number(this.services.numberPiso2) +
      Number(this.services.numberTerap) + Number(this.services.numberEncarg) + Number(this.services.numberOtro)
  }

  efectCheckToggle(event: any) {
    let piso1 = 0, piso2 = 0, terap = 0, encarg = 0, otroservic = 0, suma = 0
    if (!this.validatePaymentMethod()) return

    if (event) {

      if (Number(this.services.numberPiso1) > 0 && this.services.efectPiso1 == true) {
        piso1 = Number(this.services.numberPiso1)
      } else {
        piso1 = 0
      }

      if (Number(this.services.numberPiso2) > 0 && this.services.efectPiso2 == true) {
        piso2 = Number(this.services.numberPiso2)
      } else {
        piso2 = 0
      }

      if (Number(this.services.numberTerap) > 0 && this.services.efectTerap == true) {
        terap = Number(this.services.numberTerap)
      } else {
        terap = 0
      }

      if (Number(this.services.numberEncarg) > 0 && this.services.efectEncarg == true) {
        terap = Number(this.services.numberEncarg)
      } else {
        encarg = 0
      }

      if (Number(this.services.numberOtro) > 0 && this.services.efectOtro == true) {
        otroservic = Number(this.services.numberOtro)
      } else {
        otroservic = 0
      }

      suma = piso1 + piso2 + terap + encarg + otroservic
      this.services.valueEfectivo = suma
      return
    }
  }

  bizumCheckToggle(event: any) {
    let piso1 = 0, piso2 = 0, terap = 0, encarg = 0, otroservic = 0, suma = 0
    if (!this.validatePaymentMethod()) return

    if (event) {

      if (Number(this.services.numberPiso1) > 0 && this.services.bizuPiso1 == true) {
        piso1 = Number(this.services.numberPiso1)
      } else {
        piso1 = 0
      }

      if (Number(this.services.numberPiso2) > 0 && this.services.bizuPiso2 == true) {
        piso2 = Number(this.services.numberPiso2)
      } else {
        piso2 = 0
      }

      if (Number(this.services.numberTerap) > 0 && this.services.bizuTerap == true) {
        terap = Number(this.services.numberTerap)
      } else {
        terap = 0
      }

      if (Number(this.services.numberEncarg) > 0 && this.services.bizuEncarg == true) {
        terap = Number(this.services.numberEncarg)
      } else {
        encarg = 0
      }

      if (Number(this.services.numberOtro) > 0 && this.services.bizuOtro == true) {
        otroservic = Number(this.services.numberOtro)
      } else {
        otroservic = 0
      }

      suma = piso1 + piso2 + terap + encarg + otroservic
      this.services.valueBizum = suma
      return
    }
  }

  tarjCheckToggle(event: any) {
    let piso1 = 0, piso2 = 0, terap = 0, encarg = 0, otroservic = 0, suma = 0
    if (!this.validatePaymentMethod()) return

    if (event) {

      if (Number(this.services.numberPiso1) > 0 && this.services.tarjPiso1 == true) {
        piso1 = Number(this.services.numberPiso1)
      } else {
        piso1 = 0
      }

      if (Number(this.services.numberPiso2) > 0 && this.services.tarjPiso2 == true) {
        piso2 = Number(this.services.numberPiso2)
      } else {
        piso2 = 0
      }

      if (Number(this.services.numberTerap) > 0 && this.services.tarjTerap == true) {
        terap = Number(this.services.numberTerap)
      } else {
        terap = 0
      }

      if (Number(this.services.numberEncarg) > 0 && this.services.tarjEncarg == true) {
        terap = Number(this.services.numberEncarg)
      } else {
        encarg = 0
      }

      if (Number(this.services.numberOtro) > 0 && this.services.tarjOtro == true) {
        otroservic = Number(this.services.numberOtro)
      } else {
        otroservic = 0
      }

      suma = piso1 + piso2 + terap + encarg + otroservic
      this.services.valueTarjeta = suma
      return
    }
  }

  transCheckToggle(event: any) {
    let piso1 = 0, piso2 = 0, terap = 0, encarg = 0, otroservic = 0, suma = 0

    if (!this.validatePaymentMethod()) return

    if (event) {
      if (Number(this.services.numberPiso1) > 0 && this.services.transPiso1 == true) {
        piso1 = Number(this.services.numberPiso1)
      } else {
        piso1 = 0
      }

      if (Number(this.services.numberPiso2) > 0 && this.services.transPiso2 == true) {
        piso2 = Number(this.services.numberPiso2)
      } else {
        piso2 = 0
      }

      if (Number(this.services.numberTerap) > 0 && this.services.transTerap == true) {
        terap = Number(this.services.numberTerap)
      } else {
        terap = 0
      }

      if (Number(this.services.numberEncarg) > 0 && this.services.transEncarg == true) {
        terap = Number(this.services.numberEncarg)
      } else {
        encarg = 0
      }

      if (Number(this.services.numberOtro) > 0 && this.services.transOtro == true) {
        otroservic = Number(this.services.numberOtro)
      } else {
        otroservic = 0
      }

      suma = piso1 + piso2 + terap + encarg + otroservic
      this.services.valueTrans = suma
      return
    }
  }

  horaInicioEdit(event: any) {
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

    if (Number(this.services.minuto) > 0) {
      let sumarsesion = Number(this.services.minuto), horas = 0, minutos = 0, convertHora = ''

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
    this.services.horaEnd = event.target.value.toString()
    this.horaInicialServicio = event.target.value.toString()

    if (Number(this.services.minuto) > 0) {
      let sumarsesion = Number(this.services.minuto), horas = 0, minutos = 0, convertHora = ''

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
        this.services.horaEnd = hora + ':' + (Number(minutes) < 10 ? '0' : '') + minutes
      } else {
        let minutes = minutos
        this.services.horaEnd = horas + ':' + (Number(minutes) < 10 ? '0' : '') + minutes
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
      this.services.horaEnd = hora + ':' + (Number(minutes) < 10 ? '0' : '') + minutes
    } else {
      let minutes = minutos
      this.services.horaEnd = horas + ':' + (Number(minutes) < 10 ? '0' : '') + minutes
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

    this.sumatoriaServicios = Number(this.services.servicio) + Number(this.services.bebidas) + Number(this.services.tabaco) +
      Number(this.services.vitaminas) + Number(this.services.propina) + Number(this.services.otros)

    restamos = Number(this.services.numberPiso1) + Number(this.services.numberPiso2) + Number(this.services.numberTerap) +
      Number(this.services.numberEncarg) + Number(this.services.numberOtro)

    if (Number(this.services.numberPiso1) > 0 || this.services.numberPiso1 != '') {
      this.restamosCobro = this.sumatoriaServicios - restamos
    }

    if (Number(this.services.numberPiso2) > 0 || this.services.numberPiso2 != '') {
      this.restamosCobro = this.sumatoriaServicios - restamos
    }

    if (Number(this.services.numberTerap) > 0 || this.services.numberTerap != '') {
      this.restamosCobro = this.sumatoriaServicios - restamos
    }

    if (Number(this.services.numberEncarg) > 0 || this.services.numberEncarg != '') {
      this.restamosCobro = this.sumatoriaServicios - restamos
    }

    if (Number(this.services.numberOtro) > 0 || this.services.numberOtro != '') {
      this.restamosCobro = this.sumatoriaServicios - restamos
    }
  }

  valueCobros() {
    let resultado = 0

    this.sumatoriaCobros = Number(this.services.numberPiso1) + Number(this.services.numberPiso2) +
      Number(this.services.numberTerap) + Number(this.services.numberEncarg) + Number(this.services.numberOtro)

    resultado = this.sumatoriaServicios - this.sumatoriaCobros
    this.restamosCobro = resultado
  }

  terapeu(event: any) {
    this.getLastDate()
    this.service.getTerapeutaByAsc(event).subscribe((rp: any) => {
      if (rp.length > 0) this.horaStartTerapeuta = rp[0]['horaStart']
      else this.horaStartTerapeuta = ''
    })

    this.service.getTerapeutaByDesc(event).subscribe((rp: any) => {
      if (rp.length > 0) this.horaEndTerapeuta = rp[0]['horaStart']
      else this.horaEndTerapeuta = ''
    })
  }

  encargadaAndTerapeuta() {

    // Terapeuta
    if (this.services.efectTerap == true && Number(this.services.numberTerap) > 0) this.services.valueEfectTerapeuta = Number(this.services.numberTerap)
    if (this.services.bizuTerap == true && Number(this.services.numberTerap) > 0) this.services.valueBizuTerapeuta = Number(this.services.numberTerap)
    if (this.services.tarjTerap == true && Number(this.services.numberTerap) > 0) this.services.valueTarjeTerapeuta = Number(this.services.numberTerap)
    if (this.services.transTerap == true && Number(this.services.numberTerap) > 0) this.services.valueTransTerapeuta = Number(this.services.numberTerap)

    // Encargada
    if (this.services.efectEncarg == true && Number(this.services.numberEncarg) > 0) this.services.valueEfectEncargada = Number(this.services.numberEncarg)
    if (this.services.bizuEncarg == true && Number(this.services.numberEncarg) > 0) this.services.valueBizuEncargada = Number(this.services.numberEncarg)
    if (this.services.tarjEncarg == true && Number(this.services.numberEncarg) > 0) this.services.valueTarjeEncargada = Number(this.services.numberEncarg)
    if (this.services.transEncarg == true && Number(this.services.numberEncarg) > 0) this.services.valueTransEncargada = Number(this.services.numberEncarg)
  }

  validatePaymentMethod() {

    // Efectivo
    if (this.services.efectPiso1 == true && this.services.bizuPiso1 == true || this.services.efectPiso2 == true &&
      this.services.bizuPiso2 == true || this.services.efectTerap == true && this.services.bizuTerap == true ||
      this.services.efectEncarg == true && this.services.bizuEncarg == true || this.services.efectOtro == true &&
      this.services.bizuOtro == true || this.services.efectPiso1 == true && this.services.tarjPiso1 == true ||
      this.services.efectPiso2 == true && this.services.tarjPiso2 == true || this.services.efectTerap == true &&
      this.services.tarjTerap == true || this.services.efectEncarg == true && this.services.tarjEncarg == true ||
      this.services.efectOtro == true && this.services.tarjOtro == true || this.services.efectPiso1 == true &&
      this.services.transPiso1 == true || this.services.efectPiso2 == true && this.services.transPiso2 == true ||
      this.services.efectTerap == true && this.services.transTerap == true || this.services.efectEncarg == true &&
      this.services.transEncarg == true || this.services.efectOtro == true && this.services.transOtro == true) {
      Swal.fire({ icon: 'error', title: 'Oops...', text: 'Se escogio mas de una forma de pago' })
      return false
    }

    // Bizum
    if (this.services.bizuPiso1 == true && this.services.efectPiso1 == true || this.services.bizuPiso2 == true &&
      this.services.efectPiso2 == true || this.services.bizuTerap == true && this.services.efectTerap == true ||
      this.services.bizuEncarg == true && this.services.efectEncarg == true || this.services.bizuOtro == true &&
      this.services.efectOtro == true || this.services.bizuPiso1 == true && this.services.tarjPiso1 == true ||
      this.services.bizuPiso2 == true && this.services.tarjPiso2 == true || this.services.bizuTerap == true &&
      this.services.tarjTerap == true || this.services.bizuEncarg == true && this.services.tarjEncarg == true ||
      this.services.bizuOtro == true && this.services.tarjOtro == true || this.services.bizuPiso1 == true &&
      this.services.transPiso1 == true || this.services.bizuPiso2 == true && this.services.transPiso2 == true ||
      this.services.bizuTerap == true && this.services.transTerap == true || this.services.bizuEncarg == true &&
      this.services.transEncarg == true || this.services.bizuOtro == true && this.services.transOtro == true) {
      Swal.fire({ icon: 'error', title: 'Oops...', text: 'Se escogio mas de una forma de pago' })
      return false
    }

    // Tarjeta
    if (this.services.tarjPiso1 == true && this.services.efectPiso1 == true || this.services.tarjPiso2 == true &&
      this.services.efectPiso2 == true || this.services.tarjTerap == true && this.services.efectTerap == true ||
      this.services.tarjEncarg == true && this.services.efectEncarg == true || this.services.tarjOtro == true &&
      this.services.efectOtro == true || this.services.tarjPiso1 == true && this.services.bizuPiso1 == true ||
      this.services.tarjPiso2 == true && this.services.bizuPiso2 == true || this.services.tarjTerap == true &&
      this.services.bizuTerap == true || this.services.tarjEncarg == true && this.services.bizuEncarg == true ||
      this.services.tarjOtro == true && this.services.bizuOtro == true || this.services.tarjPiso1 == true &&
      this.services.transPiso1 == true || this.services.tarjPiso2 == true && this.services.transPiso2 == true ||
      this.services.tarjTerap == true && this.services.transTerap == true || this.services.tarjEncarg == true &&
      this.services.transEncarg == true || this.services.tarjOtro == true && this.services.transOtro == true) {
      Swal.fire({ icon: 'error', title: 'Oops...', text: 'Se escogio mas de una forma de pago' })
      return false
    }

    // Trans
    if (this.services.transPiso1 == true && this.services.efectPiso1 == true || this.services.transPiso2 == true &&
      this.services.efectPiso2 == true || this.services.transTerap == true && this.services.efectTerap == true ||
      this.services.transEncarg == true && this.services.efectEncarg == true || this.services.transOtro == true &&
      this.services.efectOtro == true || this.services.transPiso1 == true && this.services.bizuPiso1 == true ||
      this.services.transPiso2 == true && this.services.bizuPiso2 == true || this.services.transTerap == true &&
      this.services.bizuTerap == true || this.services.transEncarg == true && this.services.bizuEncarg == true ||
      this.services.transOtro == true && this.services.bizuOtro == true || this.services.transPiso1 == true &&
      this.services.tarjPiso1 == true || this.services.transPiso2 == true && this.services.tarjPiso2 == true ||
      this.services.transTerap == true && this.services.tarjTerap == true || this.services.transEncarg == true &&
      this.services.tarjEncarg == true || this.services.transOtro == true && this.services.tarjOtro == true) {
      Swal.fire({ icon: 'error', title: 'Oops...', text: 'Se escogio mas de una forma de pago' })
      return false
    }
    return true
  }

  validacionFormasPago() {
    if (Number(this.services.numberPiso1) > 0 && this.services.efectPiso1 == false && this.services.bizuPiso1 == false &&
      this.services.tarjPiso1 == false && this.services.transPiso1 == false) {
      Swal.fire({ icon: 'error', title: 'Oops...', text: 'No se escogio ninguna forma de pago para piso 1' })
      return false
    }
    if (Number(this.services.numberPiso2) > 0 && this.services.efectPiso2 == false && this.services.bizuPiso2 == false &&
      this.services.tarjPiso2 == false && this.services.transPiso2 == false) {
      Swal.fire({ icon: 'error', title: 'Oops...', text: 'No se escogio ninguna forma de pago para piso 2' })
      return false
    }
    if (Number(this.services.numberTerap) > 0 && this.services.efectTerap == false && this.services.bizuTerap == false &&
      this.services.tarjTerap == false && this.services.transTerap == false) {
      Swal.fire({ icon: 'error', title: 'Oops...', text: 'No se escogio ninguna forma de pago para terapeuta' })
      return false
    }
    if (Number(this.services.numberEncarg) > 0 && this.services.efectEncarg == false && this.services.bizuEncarg == false &&
      this.services.tarjEncarg == false && this.services.transEncarg == false) {
      Swal.fire({ icon: 'error', title: 'Oops...', text: 'No se escogio ninguna forma de pago para encargada' })
      return false
    }
    if (Number(this.services.numberOtro) > 0 && this.services.efectOtro == false && this.services.bizuOtro == false &&
      this.services.tarjOtro == false && this.services.transOtro == false) {
      Swal.fire({ icon: 'error', title: 'Oops...', text: 'No se escogio ninguna forma de pago para otros' })
      return false
    }
    return true
  }

  // -------------------------------------------- Editamos  // ---------------------------------------------

  validationsFormOfPaymentToEdit() {
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

  validationsToSelectAPaymentMethod() {

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

  sortDateToEdit() {
    let dia = '', mes = '', año = ''

    dia = this.editarService[0]['fecha'].substring(8, 10)
    mes = this.editarService[0]['fecha'].substring(5, 7)
    año = this.editarService[0]['fecha'].substring(2, 4)

    this.editarService[0]['fecha'] = `${dia}-${mes}-${año}`
    this.editarService[0]['fechaFin'] = this.editarService[0]['fecha']
  }

  getTerapeutaEdit(nombre: string) {
    this.serviceTherapist.getByNombre(nombre).subscribe((resp) => {
      this.terapeutaSelect = resp
    })
  }

  cargar() {
    let fecha = new Date(), dia = '', mes = '', año = 0

    año = fecha.getFullYear()

    const paramEditar = this.activatedRoute.snapshot.params['editar']
    this.idUserAdministrador = Number(this.activeRoute.snapshot['_urlSegment']['segments'][1]['path'])
    this.idEditar = Number(this.activeRoute.snapshot.paramMap.get('id'))
    if (paramEditar == "true") {
      this.service.getByEditar(this.idEditar).subscribe((datosServicio: any) => {
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

          this.serviceManager.getByIdAndAdministrador(this.idUserAdministrador).subscribe((datoAdministrador: any[]) => {
            if (datoAdministrador.length > 0) {
              this.buttonDelete = true
            } else {
              this.buttonDelete = false
            }
          })

        } else {
          this.editamos = false
          this.idUser = this.activeRoute.snapshot['_urlSegment']['segments'][1]['path']
          this.serviceManager.getById(this.idUser).subscribe((datoUser: any[]) => {
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

  editService(idServicio, serv: ModelService) {
    if (this.restamosCobroEdit == 0) {
      let idUsuario = ''
      idUsuario = this.activeRoute.snapshot['_urlSegment']['segments'][1]['path']

      if (!this.expiredDateValidations()) return
      if (!this.validationsToSelectAPaymentMethod()) return
      if (!this.validationsFormOfPaymentToEdit()) return
      this.totalServicioEdit()
      this.efectCheckToggleEdit(this.validateEfect)
      this.bizumCheckToggleEdit(this.validateBizum)
      this.tarjCheckToggleEdit(this.validateTarjeta)
      this.transCheckToggleEdit(this.validateTrans)
      this.encargadaAndTerapeutaEdit()
      this.sortDateToEdit()
      this.editValue()

      this.service.updateServicio(idServicio, serv).subscribe((rp: any) => { })

      this.therapist.horaEnd = serv.horaEnd
      this.therapist.fechaEnd = serv.fechaFin
      this.therapist.salida = serv.salida

      this.serviceTherapist.update(this.editarService[0]['terapeuta'], this.therapist).subscribe((rp: any) => { })

      setTimeout(() => {
        Swal.fire({ position: 'top-end', icon: 'success', title: '¡Editado Correctamente!', showConfirmButton: false, timer: 2500 })
        this.router.navigate([`menu/${idUsuario}/vision/${idUsuario}`])
      }, 3000);

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

    if (!this.validationsFormOfPaymentToEdit()) return
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

    if (!this.validationsFormOfPaymentToEdit()) return
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

    if (!this.validationsFormOfPaymentToEdit()) return
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

    if (!this.validationsFormOfPaymentToEdit()) return
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

  deleteService(id) {
    let idUsuario = ''
    idUsuario = this.activeRoute.snapshot['_urlSegment']['segments'][1]['path']
    this.service.getById(id).subscribe((datoEliminado) => {
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
            this.serviceTherapist.getTerapeuta(datoEliminado[0]['terapeuta']).subscribe((rp: any) => {
              this.serviceTherapist.updateHoraAndSalida(this.services.terapeuta, this.therapist)
            })

            this.service.deleteServicio(id).subscribe((rp: any) => {
              this.idUser = this.activeRoute.snapshot['_urlSegment']['segments'][1]['path']
              this.router.navigate([`menu/${this.idUser}/vision/${this.idUser}`])
              Swal.fire({ position: 'top-end', icon: 'success', title: '¡Eliminado Correctamente!', showConfirmButton: false, timer: 2500 })
            })
          }
        })
      }
    })
  }

  cancel() {
    this.idUser = this.activeRoute.snapshot['_urlSegment']['segments'][1]['path']
    this.router.navigate([`menu/${this.idUser}/vision/${this.idUser}`])
  }
}