import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { ServicioService } from 'src/app/core/services/servicio'
import { FormBuilder } from '@angular/forms'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'
import { LoginService } from 'src/app/core/services/login'
import { TrabajadoresService } from 'src/app/core/services/trabajadores'

@Component({
  selector: 'app-vision',
  templateUrl: './vision.component.html',
  styleUrls: ['./vision.component.css']
})

export class VisionComponent implements OnInit {

  vision: any = []
  page!: number
  fechaDiaHoy = ''
  totalServicio: number
  idUser: string
  terapeutas: any = []
  horaEnd: string
  horaHoy: string

  // TOTALES
  totalVision: number
  totalBebida: number
  totalTabaco: number
  totalVitamina: number
  totalPropina: number
  totalOtros: number

  // TOTALES formas de Pago
  totalEfectivo: number
  totalBizum: number
  totalTarjeta: number
  totalTrasnf: number
  totalTerap: number
  totalEncarg: number
  totalOtro: number
  totalPisos: number

  // Conteo fecha
  count: number = 0
  fechaHoyActual: string
  atrasCount: number = 0
  siguienteCount: number = 0
  fechaFormat = new Date()

  constructor(
    public router: Router,
    public fb: FormBuilder,
    private modalService: NgbModal,
    private activeRoute: ActivatedRoute,
    public servicioService: ServicioService,
    private loginService: LoginService,
    private terapService: TrabajadoresService
  ) { }

  ngOnInit(): void {
    document.getElementById('idTitulo').style.display = 'block'
    document.getElementById('idTitulo').innerHTML = 'VISIÓN'

    this.idUser = this.activeRoute.snapshot.paramMap.get('id')
    this.loginService.getById(this.idUser).then((rp) => {
      this.idUser = rp[0]
    })
    this.getServicio()
    this.getTerapeuta()
    this.totalUndefined()
  }

  totalesZero() {
    this.totalPisos = 0
    this.totalVision = 0
    this.totalServicio = 0
    this.totalBebida = 0
    this.totalTabaco = 0
    this.totalVitamina = 0
    this.totalPropina = 0
    this.totalOtros = 0
    this.totalEfectivo = 0
    this.totalBizum = 0
    this.totalTarjeta = 0
    this.totalTrasnf = 0
    this.totalTerap = 0
  }

  totalUndefined() {
    if (this.totalVision == undefined) this.totalVision = 0
    if (this.totalServicio == undefined) this.totalServicio = 0
    if (this.totalBebida == undefined) this.totalBebida = 0
    if (this.totalTabaco == undefined) this.totalTabaco = 0
    if (this.totalVitamina == undefined) this.totalVitamina = 0
    if (this.totalPropina == undefined) this.totalPropina = 0
    if (this.totalOtros == undefined) this.totalOtros = 0
  }

  getTerapeuta() {
    this.terapService.getAllTerapeutaByOrden().subscribe((rp) => {
      this.terapeutas = rp
      if (rp.length > 0) {
        for (let i = 0; rp.length; i++) {
          this.calculardiferencia(rp[i]['horaEnd'], rp[i]['nombre'], rp[i]['fechaEnd'])
        }
      }
    })
  }

  fechadeHoy() {
    let convertDia
    let currentDate = new Date()
    let dia = currentDate.getDate()
    let mes = currentDate.toJSON().substring(5, 7)
    if (dia > 0 && dia < 10) {
      convertDia = '0' + dia
      this.fechaDiaHoy = `${currentDate.getFullYear()}/${mes}/${convertDia}`
    } else {
      this.fechaDiaHoy = `${currentDate.getFullYear()}/${mes}/${dia}`
    }
  }

  getServicio() {
    this.fechadeHoy()
    this.fechaHoyActual = 'Hoy'
    this.servicioService.getFechaHoy(this.fechaDiaHoy).then((datoServicio) => {
      this.vision = datoServicio

      if (datoServicio.length != 0) {
        this.sumaTotalVision()
      }
    })
  }

  notas(targetModal, modal) {
    var notaMensaje = []
    this.servicioService.getById(targetModal).then((datoServicio) => {
      notaMensaje = datoServicio[0]

      if (notaMensaje['nota'] != '')
        this.modalService.open(modal, {
          centered: true,
          backdrop: 'static',
        })
    })
  }

  calculardiferencia(horaFin: string, nombre: string, fecha: string): string {
    let hora_actual: any = new Date(), convertHora = '', fechaEnd = '', convertFecha = '',
      fechaHoy = new Date(), dia = 0, mes = 0, año = 0, convertMes = '', convertDia = ''

    dia = fechaHoy.getDate()
    mes = fechaHoy.getMonth() + 1
    año = fechaHoy.getFullYear()

    let minutes = hora_actual.getMinutes().toString().length === 1 ?
      '0' + hora_actual.getMinutes() : hora_actual.getMinutes()
    hora_actual = hora_actual.getHours() + ':' + minutes
    let hora_inicio = hora_actual
    const hora_final: any = horaFin

    if (mes > 0 && mes < 10) {
      convertMes = '0' + mes
      fechaEnd = `${año}-${convertMes}-${dia}`
    } else {
      fechaEnd = `${año}-${mes}-${dia}`
    }

    if (dia > 0 && dia < 10) {
      convertDia = '0' + dia
      fechaEnd = `${año}-${convertMes}-${convertDia}`
    } else {
      fechaEnd = `${año}-${convertMes}-${dia}`
    }

    // Convertimos fecha
    if (fecha != "") convertFecha = fecha.replace("/", "-").replace("/", "-")
    // if (fecha != "") convertFecha = fecha

    // Expresión regular para comprobar formato
    var formatohora = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/

    if (horaFin != "" && convertFecha != "") {

      if (hora_inicio.length == 4) {
        hora_inicio = '0' + hora_inicio
      }

      if (convertFecha < fechaEnd) {
        this.terapService.getByNombre(nombre).then((datoMinute) => {
          for (let i = 0; i < datoMinute.length; i++) {
            this.terapService.updateHoraAndSalida(datoMinute[i]['idDocument'], nombre)
          }
        })
      }

      if (convertFecha != "" && hora_final <= hora_inicio) {
        this.terapService.getByNombre(nombre).then((datoMinute) => {
          for (let i = 0; i < datoMinute.length; i++) {
            if (datoMinute[i]['horaEnd'] <= hora_inicio) {
              this.terapService.updateHoraAndSalida(datoMinute[i]['idDocument'], nombre)
            }
          }
        })
      }
    }

    // Si algún valor no tiene formato correcto sale
    if (!(hora_inicio.match(formatohora)
      && hora_final.match(formatohora))) {
      return ''
    }

    // Calcula los minutos de cada hora
    var minutos_inicio = hora_inicio.split(':').reduce((p, c) => parseInt(p) * 60 + parseInt(c))
    var minutos_final = hora_final.split(':').reduce((p, c) => parseInt(p) * 60 + parseInt(c))

    if (hora_inicio.length === 4) {
      convertHora = '0' + hora_inicio
    } else {
      convertHora = hora_inicio
    }

    // Si la hora final es anterior a la hora inicial sale
    if (minutos_final < minutos_inicio) return ''

    // Diferencia de minutos
    var diferencia = parseInt(minutos_final) - minutos_inicio

    // Cálculo de horas y minutos de la diferencia
    var horas = Math.floor(diferencia / 60)
    var minutos = diferencia % 60
    // this.horaEnd = horas + ':' + (minutos < 10 ? '0' : '') + minutos
    this.horaHoy = horas + ':' + (minutos < 10 ? '0' : '') + minutos

    if (this.horaHoy.slice(0, 1) === "0") {
      this.horaEnd = this.horaHoy.slice(2, 4)
    } else {
      this.horaEnd = this.horaHoy
    }
    return this.horaEnd
  }

  editamos(id: string) {
    this.router.navigate([
      `menu/${this.idUser['id']}/nuevo-servicio/${id}`
    ])
  }

  // Suma de TOTALES
  sumaTotalVision() {
    const totalServ = this.vision.map(({ servicio }) => servicio).reduce((acc, value) => acc + value, 0)
    this.totalServicio = totalServ

    const totalValorBebida = this.vision.map(({ bebidas }) => bebidas).reduce((acc, value) => acc + value, 0)
    this.totalBebida = totalValorBebida

    const totalValorTab = this.vision.map(({ tabaco }) => tabaco).reduce((acc, value) => acc + value, 0)
    this.totalTabaco = totalValorTab

    const totalValorVitamina = this.vision.map(({ vitaminas }) => vitaminas).reduce((acc, value) => acc + value, 0)
    this.totalVitamina = totalValorVitamina

    const totalValorProp = this.vision.map(({ propina }) => propina).reduce((acc, value) => acc + value, 0)
    this.totalPropina = totalValorProp

    const totalValorOtroServicio = this.vision.map(({ otros }) => otros).reduce((acc, value) => acc + value, 0)
    this.totalOtros = totalValorOtroServicio

    this.totalVision = this.totalServicio + this.totalBebida + this.totalTabaco +
      this.totalVitamina + this.totalPropina + this.totalOtros

    // total de las Formas de pagos

    const totalValorEfectivo = this.vision.map(({ valueEfectivo }) => valueEfectivo).reduce((acc, value) => acc + value, 0)
    this.totalEfectivo = totalValorEfectivo

    const totalValorBizum = this.vision.map(({ valueBizum }) => valueBizum).reduce((acc, value) => acc + value, 0)
    this.totalBizum = totalValorBizum

    const totalValorTarjeta = this.vision.map(({ valueTarjeta }) => valueTarjeta).reduce((acc, value) => acc + value, 0)
    this.totalTarjeta = totalValorTarjeta

    const totalValorTransferencia = this.vision.map(({ valueTrans }) => valueTrans).reduce((acc, value) => acc + value, 0)
    this.totalTrasnf = totalValorTransferencia

    const totalValorTerapeuta = this.vision.map(({ numberTerap }) => numberTerap).reduce((acc, value) => acc + value, 0)
    this.totalTerap = totalValorTerapeuta

    const totalValorEncargada = this.vision.map(({ numberEncarg }) => numberEncarg).reduce((acc, value) => acc + value, 0)
    this.totalEncarg = totalValorEncargada

    this.totalPisos = this.totalEfectivo + this.totalBizum + this.totalTarjeta + this.totalTrasnf
  }

  atras() {

    let fechHoy = new Date(), fechaEnd = '', convertDiaHoy = '', diaHoy = 0, mesHoy = 0,
      añoHoy = 0, convertMesHoy = '', convertAno = ''

    diaHoy = fechHoy.getDate()
    mesHoy = fechHoy.getMonth() + 1
    añoHoy = fechHoy.getFullYear()

    if (mesHoy > 0 && mesHoy < 10) {
      convertMesHoy = '0' + mesHoy
      fechaEnd = `${añoHoy}/${convertMesHoy}/${diaHoy}`
    } else {
      fechaEnd = `${añoHoy}/${mesHoy}/${diaHoy}`
    }

    if (diaHoy > 0 && diaHoy < 10) {
      convertDiaHoy = '0' + diaHoy
      fechaEnd = `${añoHoy}/${convertMesHoy}/${convertDiaHoy}`
    } else {
      fechaEnd = `${añoHoy}/${convertMesHoy}/${diaHoy}`
    }

    if (this.siguienteCount > 0) {
      this.siguienteCount = 0
      this.count = 0
      this.count++
      let convertmes = '', convertDia = '', convertAño = '', fechaHoy = '', mes = '', fechaActualmente = ''

      for (let i = 0; i < this.count; i++) {
        this.fechaFormat.setDate(this.fechaFormat.getDate() - this.count)
        convertDia = this.fechaFormat.toString().substring(8, 10)
        convertmes = this.fechaFormat.toString().substring(4, 7)
        convertAño = this.fechaFormat.toString().substring(11, 15)

        if (convertmes == 'Dec') mes = "12"
        if (convertmes == 'Nov') mes = "11"
        if (convertmes == 'Oct') mes = "10"
        if (convertmes == 'Sep') mes = "09"
        if (convertmes == 'Aug') mes = "08"
        if (convertmes == 'Jul') mes = "07"
        if (convertmes == 'Jun') mes = "06"
        if (convertmes == 'May') mes = "05"
        if (convertmes == 'Apr') mes = "04"
        if (convertmes == 'Mar') mes = "03"
        if (convertmes == 'Feb') mes = "02"
        if (convertmes == 'Jan') mes = "01"

        fechaHoy = `${convertAño}/${mes}/${convertDia}`

        if (fechaEnd == fechaHoy) {
          this.fechaHoyActual = 'Hoy'
        }
        else {
          this.fechaHoyActual = `${mes}/${convertDia}`
        }

        fechaActualmente = `${convertAño}/${mes}/${convertDia}`

        this.servicioService.getFechaHoy(fechaActualmente).then((datoServicio) => {
          this.vision = datoServicio

          if (datoServicio.length > 0) {
            this.sumaTotalVision()
          } else {
            this.totalesZero()
          }
        })

        this.atrasCount = this.count

        return true
      }
    } else {
      this.atrasCount = 0
      this.siguienteCount = 0
      this.count = 0
      this.count++
      let convertmes = '', convertDia = '', convertAño = '', mes = '', fechaHoy = '',
        convertFecha = '', fechaActualmente = ''

      for (let i = 0; i < this.count; i++) {

        this.fechaFormat.setDate(this.fechaFormat.getDate() - this.count)
        convertFecha = this.fechaFormat.toString()
        this.fechaFormat = new Date(convertFecha)
        convertDia = this.fechaFormat.toString().substring(8, 10)
        convertmes = this.fechaFormat.toString().substring(4, 7)
        convertAño = this.fechaFormat.toString().substring(11, 15)

        if (convertmes == 'Dec') mes = "12"
        if (convertmes == 'Nov') mes = "11"
        if (convertmes == 'Oct') mes = "10"
        if (convertmes == 'Sep') mes = "09"
        if (convertmes == 'Aug') mes = "08"
        if (convertmes == 'Jul') mes = "07"
        if (convertmes == 'Jun') mes = "06"
        if (convertmes == 'May') mes = "05"
        if (convertmes == 'Apr') mes = "04"
        if (convertmes == 'Mar') mes = "03"
        if (convertmes == 'Feb') mes = "02"
        if (convertmes == 'Jan') mes = "01"

        fechaHoy = `${convertAño}/${mes}/${convertDia}`

        if (fechaEnd == fechaHoy) {
          this.fechaHoyActual = 'Hoy'
        }
        else {
          this.fechaHoyActual = `${mes}/${convertDia}`
        }

        fechaActualmente = `${convertAño}/${mes}/${convertDia}`

        this.servicioService.getFechaHoy(fechaActualmente).then((datoServicio) => {
          this.vision = datoServicio

          if (datoServicio.length > 0) {
            this.sumaTotalVision()
          } else {
            this.totalesZero()
          }
        })

        this.atrasCount = this.count

        return true
      }
    }
    return false
  }

  siguiente() {

    let fechaDia = new Date(), mesDelDia = 0, convertMess = '', messs = '', convertimosMes = 0
    mesDelDia = fechaDia.getMonth() + 1

    let fechHoy = new Date(), fechaEnd = '', convertDiaHoy = '', diaHoy = 0, mesHoy = 0, añoHoy = 0, convertMesHoy = ''

    diaHoy = fechHoy.getDate()
    mesHoy = fechHoy.getMonth() + 1
    añoHoy = fechHoy.getFullYear()

    if (mesHoy > 0 && mesHoy < 10) {
      convertMesHoy = '0' + mesHoy
      fechaEnd = `${añoHoy}/${convertMesHoy}/${diaHoy}`
    } else {
      fechaEnd = `${añoHoy}/${mesHoy}/${diaHoy}`
    }

    if (diaHoy > 0 && diaHoy < 10) {
      convertDiaHoy = '0' + diaHoy
      fechaEnd = `${añoHoy}/${convertMesHoy}/${convertDiaHoy}`
    } else {
      fechaEnd = `${añoHoy}/${convertMesHoy}/${diaHoy}`
    }

    if (this.atrasCount > 0) {
      this.atrasCount = 0
      this.count = 0
      this.count++
      convertMess = this.fechaFormat.toString().substring(4, 7)
      if (convertMess == 'Dec') messs = "12"
      if (convertMess == 'Nov') messs = "11"
      if (convertMess == 'Oct') messs = "10"
      if (convertMess == 'Sep') messs = "09"
      if (convertMess == 'Aug') messs = "08"
      if (convertMess == 'Jul') messs = "07"
      if (convertMess == 'Jun') messs = "06"
      if (convertMess == 'May') messs = "05"
      if (convertMess == 'Apr') messs = "04"
      if (convertMess == 'Mar') messs = "03"
      if (convertMess == 'Feb') messs = "02"
      if (convertMess == 'Jan') messs = "01"

      convertimosMes = Number(messs)
      this.atrasCount = 0
      this.count = 0
      this.count++

      let convertmes = '', convertDia = '', convertAño = '', mes = '', fechaHoy = '', fechaActualmente = ''

      for (let i = 0; i < this.count; i++) {
        this.fechaFormat.setDate(this.fechaFormat.getDate() + this.count)
        convertDia = this.fechaFormat.toString().substring(8, 10)
        convertmes = this.fechaFormat.toString().substring(4, 7)
        convertAño = this.fechaFormat.toString().substring(11, 15)

        if (convertmes == 'Dec') mes = "12"
        if (convertmes == 'Nov') mes = "11"
        if (convertmes == 'Oct') mes = "10"
        if (convertmes == 'Sep') mes = "09"
        if (convertmes == 'Aug') mes = "08"
        if (convertmes == 'Jul') mes = "07"
        if (convertmes == 'Jun') mes = "06"
        if (convertmes == 'May') mes = "05"
        if (convertmes == 'Apr') mes = "04"
        if (convertmes == 'Mar') mes = "03"
        if (convertmes == 'Feb') mes = "02"
        if (convertmes == 'Jan') mes = "01"

        fechaHoy = `${convertAño}/${mes}/${convertDia}`

        if (fechaEnd == fechaHoy) {
          this.fechaHoyActual = 'Hoy'
        }
        else {
          this.fechaHoyActual = `${mes}/${convertDia}`
        }

        fechaActualmente = `${convertAño}/${mes}/${convertDia}`

        this.servicioService.getFechaHoy(fechaActualmente).then((datoServicio) => {
          this.vision = datoServicio

          if (datoServicio.length > 0) {
            this.sumaTotalVision()
          } else {
            this.totalesZero()
          }
        })

        this.atrasCount = 0
        this.count = 0
        return true
      }
    }
    // }

    else {
      this.atrasCount = 0
      this.siguienteCount = 0
      this.count = 0
      this.count++
      let convertmes = '', convertDia = '', convertAño = '', mes = '', fechaHoy = '',
        convertFecha = '', fechaActualmente = ''

      var result = new Date(new Date().toISOString())
      for (let i = 0; i < this.count; i++) {

        this.fechaFormat.setDate(this.fechaFormat.getDate() + this.count)
        convertFecha = this.fechaFormat.toString()
        this.fechaFormat = new Date(convertFecha)

        convertDia = this.fechaFormat.toString().substring(8, 10)
        convertmes = this.fechaFormat.toString().substring(4, 7)
        convertAño = this.fechaFormat.toString().substring(11, 15)

        if (convertmes == 'Dec') mes = "12"
        if (convertmes == 'Nov') mes = "11"
        if (convertmes == 'Oct') mes = "10"
        if (convertmes == 'Sep') mes = "09"
        if (convertmes == 'Aug') mes = "08"
        if (convertmes == 'Jul') mes = "07"
        if (convertmes == 'Jun') mes = "06"
        if (convertmes == 'May') mes = "05"
        if (convertmes == 'Apr') mes = "04"
        if (convertmes == 'Mar') mes = "03"
        if (convertmes == 'Feb') mes = "02"
        if (convertmes == 'Jan') mes = "01"

        fechaHoy = `${convertAño}/${mes}/${convertDia}`

        if (fechaEnd == fechaHoy) {
          this.fechaHoyActual = 'Hoy'
        }
        else {
          this.fechaHoyActual = `${mes}/${convertDia}`
        }

        fechaActualmente = `${convertAño}/${mes}/${convertDia}`

        this.servicioService.getFechaHoy(fechaActualmente).then((datoServicio) => {
          this.vision = datoServicio

          if (datoServicio.length > 0) {
            this.sumaTotalVision()
          } else {
            this.totalesZero()
          }
        })

        this.siguienteCount = this.count

        return true
      }
    }


    return false
  }
}