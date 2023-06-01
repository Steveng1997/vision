import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ServicioService } from 'src/app/core/services/servicio';
import { FormBuilder } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LoginService } from 'src/app/core/services/login';

@Component({
  selector: 'app-vision',
  templateUrl: './vision.component.html',
  styleUrls: ['./vision.component.css']
})

export class VisionComponent implements OnInit {

  vision: any = [];
  page!: number;
  dateConvertion = new Date();
  fechaDiaHoy = new Intl.DateTimeFormat("az").format(this.dateConvertion);
  restante: string;
  totalServicio: number;
  idUser: string;

  constructor(
    public router: Router,
    public servicioService: ServicioService,
    public fb: FormBuilder,
    private modalService: NgbModal,
    private activeRoute: ActivatedRoute,
    private loginService: LoginService
  ) {
  }

  ngOnInit(): void {
    this.idUser = this.activeRoute.snapshot.paramMap.get('id');
    this.loginService.getById(this.idUser).then((rp) => {
      this.idUser = rp[0]
    })
    this.getServicio();
  }

  getServicio() {
    this.servicioService.getFechaHoy(this.fechaDiaHoy).then((datoServicio) => {
      this.vision = datoServicio;
      this.calculardiferencia(datoServicio[0]['horaEnd']);
      this.sumaTotalServicio();
    });
  }

  sumaTotalServicio() {
    const totalServ = this.vision.map(({ totalServicio }) => totalServicio).reduce((acc, value) => acc + value, 0);
    this.totalServicio = totalServ;
  }

  notas(targetModal, modal) {
    var notaMensaje = [];
    this.servicioService.getById(targetModal).then((datoServicio) => {
      notaMensaje = datoServicio[0];

      if (notaMensaje['nota'] != '')
        this.modalService.open(modal, {
          centered: true,
          backdrop: 'static',
        });
    });
  }

  calculardiferencia(horaFin: string): string {
    let hora_actual: any = new Date()
    let minutes = hora_actual.getMinutes().toString().length === 1 ?
      '0' + hora_actual.getMinutes() : hora_actual.getMinutes()
    hora_actual = hora_actual.getHours() + ':' + minutes
    const hora_inicio = hora_actual
    const hora_final: any = horaFin

    // Expresión regular para comprobar formato
    var formatohora = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/

    // Si algún valor no tiene formato correcto sale
    if (!(hora_inicio.match(formatohora)
      && hora_final.match(formatohora))) {
      return ''
    }

    // Calcula los minutos de cada hora
    var minutos_inicio = hora_inicio.split(':')
      .reduce((p, c) => parseInt(p) * 60 + parseInt(c))
    var minutos_final = hora_final.split(':')
      .reduce((p, c) => parseInt(p) * 60 + parseInt(c))

    // Si la hora final es anterior a la hora inicial sale
    if (minutos_final < minutos_inicio) return ''

    // Diferencia de minutos
    var diferencia = parseInt(minutos_final) - minutos_inicio

    // Cálculo de horas y minutos de la diferencia
    var horas = Math.floor(diferencia / 60)
    var minutos = diferencia % 60
    return horas + ':' + (minutos < 10 ? '0' : '') + minutos
  }

  editamos(id: string) {
    this.router.navigate([
      `menu/${this.idUser['id']}/nuevo-servicio/${id}`
    ]);
  }
}