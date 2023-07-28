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
  dateConvertion = new Date()
  fechaDiaHoy = ''
  totalServicio: number
  idUser: string
  terapeutas: any = []
  horaEnd: string

  // TOTALES
  totalVision: number
  totalBebida: number
  totalTabaco: number
  totalVitamina: number
  totalPropina: number
  totalOtros: number

  aqui: string;
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

  totalUndefined() {
    if (this.totalVision == undefined) this.totalVision = 0
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
    this.servicioService.getFechaHoy(this.fechaDiaHoy).then((datoServicio) => {
      this.vision = datoServicio

      if (datoServicio.length != 0) {
        this.sumaTotalServicio()
        this.sumaTotalVision()
      }
    })
  }

  sumaTotalServicio() {
    const totalServ = this.vision.map(({ servicio }) => servicio).reduce((acc, value) => acc + value, 0)
    this.totalServicio = totalServ
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
    let hora_actual: any = new Date(), convertHora = '', fechaEnd = new Date().toISOString().substring(0, 10), convertFecha = ''

    let minutes = hora_actual.getMinutes().toString().length === 1 ?
      '0' + hora_actual.getMinutes() : hora_actual.getMinutes();
    hora_actual = hora_actual.getHours() + ':' + minutes;
    let hora_inicio = hora_actual;
    const hora_final: any = horaFin;

    // Convertimos fecha
    if (fecha != "") convertFecha = fecha.replace("/", "-").replace("/", "-")

    // Expresión regular para comprobar formato
    var formatohora = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;

    if (horaFin != "") {
      if (hora_inicio.length == 4) {
        hora_inicio = '0' + hora_inicio
      }
      if (convertFecha != "" && convertFecha <= fechaEnd) {
        if (hora_final === "00:00" && hora_inicio > "00:00") {
          this.terapService.getByNombre(nombre).then((datoMinute) => {
            for (let i = 0; i < datoMinute.length; i++) {
              if (datoMinute[i]['horaEnd'] <= hora_actual) {
                this.terapService.updateHoraAndSalida(datoMinute[i]['idDocument'], nombre)
              }
            }
          })
          if (hora_final <= hora_inicio) {
            this.terapService.getByNombre(nombre).then((datoMinute) => {
              for (let i = 0; i < datoMinute.length; i++) {
                if (datoMinute[i]['horaEnd'] <= hora_actual) {
                  this.terapService.updateHoraAndSalida(datoMinute[i]['idDocument'], nombre)
                }
              }
            })
          }
        }
      }
    }

    // Si algún valor no tiene formato correcto sale
    if (!(hora_inicio.match(formatohora)
      && hora_final.match(formatohora))) {
      return ''
    }

    // Calcula los minutos de cada hora
    var minutos_inicio = hora_inicio.split(':').reduce((p, c) => parseInt(p) * 60 + parseInt(c));
    var minutos_final = hora_final.split(':').reduce((p, c) => parseInt(p) * 60 + parseInt(c));

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
    this.aqui = horas + ':' + (minutos < 10 ? '0' : '') + minutos

    if (this.aqui.slice(0, 1) === "0") {
      this.horaEnd = this.aqui.slice(2, 4)
    } else {
      this.horaEnd = this.aqui
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
    this.totalVision = totalServ

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
  }
}