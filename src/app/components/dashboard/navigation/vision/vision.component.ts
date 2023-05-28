import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ServicioService } from 'src/app/core/services/servicio';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-vision',
  templateUrl: './vision.component.html',
  styleUrls: ['./vision.component.css']
})

export class VisionComponent implements OnInit {

  vision: any;
  page!: number;

  constructor(
    public router: Router,
    public servicioService: ServicioService,
    public fb: FormBuilder
  ) {
  }

  ngOnInit(): void {
    this.getServicio();
  }

  getServicio() {
    this.servicioService.getServicio().subscribe((datoServicio) => {
      this.vision = datoServicio;
      console.log(this.vision)
    });
  }
}