import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ServicioService } from 'src/app/core/services/servicio';
import { FormBuilder } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

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

  constructor(
    public router: Router,
    public servicioService: ServicioService,
    public fb: FormBuilder,
    private modalService: NgbModal
  ) {
  }

  ngOnInit(): void {
    this.getServicio();
  }

  getServicio() {
    this.servicioService.getFechaHoy(this.fechaDiaHoy).then((datoServicio) => {
      this.vision = datoServicio;
    });
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
}