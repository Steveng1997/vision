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

  vision: any = [];
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
      console.log(datoServicio[0])
      this.vision = datoServicio[0]


      var fechaDiaHoy = new Date().toISOString().substring(0, 10);

      // for (let index = 1; index < datoServicio.length; ++index) {

      //   console.log(datoServicio[index]['fechaHoy'])

      //   if(datoServicio[index] == undefined){
      //     console.log('indefinido')
      //   }


      //   if (datoServicio[index]['fechaHoy'] === fechaDiaHoy) {
      //     this.vision = datoServicio[index]
      //     // console.log(datoServicio[index])
      //   } else {
      //     console.log('chupala')
      //   }
      // }
    });


  }
}