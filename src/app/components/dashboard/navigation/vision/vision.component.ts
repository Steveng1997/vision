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


      debugger
      var fechaDiaHoy = new Date().toISOString().substring(0, 10);

      for (let index = 0; index < datoServicio.length; index++) {


        // posicion = index

        console.log(datoServicio[index]['fechaHoy'])


        if (datoServicio[index]['fechaHoy'] === fechaDiaHoy) {
          this.vision = datoServicio[1];
        } else {
          console.log('chupala')
        }


        // var filterFecha = datoServicio.filter(p => p[index]['fechaHoy'] === fechaDiaHoy);


        // if (filterFecha.length > 0) {
        //   this.vision = datoServicio;
        // } else {
        //   console.log('chupala')
        // }


        // var fechaDiaHoy = new Intl.DateTimeFormat("az").format(dateConvertion);
        // console.log(fechaDiaHoy)



        // Esto filtra por el nombre de ciente

        // var ejemplo = 'holaaa'

        // var filterFecha = datoServicio.filter(p => p['cliente'] === ejemplo);



        // AQUI HAY EJEMPLOOOOOOOS NO BORRAR

        // var filterFecha = datoServicio.filter(p => p['fechaHoy'] === fechaDiaHoy);

        // console.log(filterFecha)


        // if (filterFecha.length > 0) {
        //   this.vision = datoServicio;
        // } else {
        //   console.log('chupala')
        // }
      }
    });


  }
}