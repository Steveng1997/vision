import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Trabajadores } from 'src/app/core/models/trabajadores';
// Service
import { TrabajadoresService } from 'src/app/core/services/trabajadores';

// Alert
import Swal from 'sweetalert2';

@Component({
  selector: 'app-trabajadores',
  templateUrl: './trabajadores.component.html',
  styleUrls: ['./trabajadores.component.css']
})
export class TrabajadoresComponent implements OnInit {

  // Terapeuta

  nombreTerapeuta: string = '';
  terapeuta: any[] = [];
  pageTerapeuta!: number;
  idTerapeuta: string;
  terapeutaModal: any[] = [];

  // Encargada

  nombreEncargada: string = '';
  encargada: any[] = [];
  idEncargada: string;
  encargadaModal: any[] = [];
  pageEncargada!: number;

  constructor(
    public router: Router,
    public trabajadorService: TrabajadoresService,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    this.getEncargada();
    this.getTerapeuta();
  }

  openTerapeuta(targetModal) {
    this.modalService.open(targetModal, {
      centered: true,
      backdrop: 'static',
    });
  }

  openEncargada(targetModal) {
    this.modalService.open(targetModal, {
      centered: true,
      backdrop: 'static',
    });
  }

  modalTablaTerapeuta(targetModal, terap) {

    this.trabajadorService.getByIdTerapeuta(targetModal).then((datosNameTerapeuta) => {
      console.log(datosNameTerapeuta)
      return (this.terapeutaModal = datosNameTerapeuta);
    });

    this.modalService.open(terap, {
      centered: true,
      backdrop: 'static',
    });
  }

  modalTablaEncargada(targetModal, terap) {

    this.trabajadorService.getByIdEncargada(targetModal).then((datosNameEncargada) => {
      console.log(datosNameEncargada)
      return (this.encargadaModal = datosNameEncargada);
    });

    this.modalService.open(terap, {
      centered: true,
      backdrop: 'static',
    });
  }

  getTerapeuta() {
    this.trabajadorService.getAllTerapeuta().subscribe((datosTerapeuta) => {
      this.terapeuta = datosTerapeuta;
    });
  }

  getEncargada() {
    this.trabajadorService.getAllEncargada().subscribe((datosEncargada) => {
      this.encargada = datosEncargada;
    });
  }

  addEncargada() {
    if (this.nombreEncargada != '') {
      this.trabajadorService.getEncargada(this.nombreEncargada).then((nameExit) => {
        if (nameExit.length != 0) {
          Swal.fire({
            title: 'Ya hay una persona con ese nombre, desea agregar este nombre?',
            showDenyButton: true,
            confirmButtonText: 'Si',
            denyButtonText: `No`,
          }).then((result) => {
            if (result.isConfirmed) {
              this.trabajadorService.registerEncargada(this.nombreEncargada);
              Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: '¡Insertado Correctamente!',
                showConfirmButton: false,
                timer: 2500,
              });
              this.modalService.dismissAll();
            } else if (result.isDenied) {
              this.modalService.dismissAll();
            }
          })

        } else {
          this.trabajadorService.registerEncargada(this.nombreEncargada);
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: '¡Insertado Correctamente!',
            showConfirmButton: false,
            timer: 2500,
          });
          this.modalService.dismissAll();
        }
      });
    }
    else {
      Swal.fire({
        icon: 'error',
        title: 'El campo nombre se encuentra vacío.',
      });
    }
  }

  editarEncargada(idDocument, idEstudiante, estud: Trabajadores) {
    console.log(idDocument, idEstudiante, estud)
    this.trabajadorService.updateEncargadas(idDocument, idEstudiante, estud);
    this.modalService.dismissAll();
    Swal.fire({
      position: 'top-end',
      icon: 'success',
      title: '¡Editado Correctamente!',
      showConfirmButton: false,
      timer: 2500,
    });
  }

  deleteEncargada(id) {
    this.trabajadorService.getByIdEncargada(id).then((datoReto) => {
      if (datoReto) {
        Swal.fire({
          title: '¿Deseas eliminar el registro?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Si, Deseo eliminar!',
        }).then((result) => {
          if (result.isConfirmed) {
            Swal.fire({
              position: 'top-end',
              icon: 'success',
              title: '¡Eliminado Correctamente!',
              showConfirmButton: false,
              timer: 2500,
            });

            this.trabajadorService.deleteEncargadas(datoReto[0]['idDocument'], id);
            this.getEncargada();
            this.modalService.dismissAll();
          }
        });
      }
    });
  }

  // Terapeuta

  addTerapeuta() {
    if (this.nombreTerapeuta != '') {
      this.trabajadorService.getTerapeuta(this.nombreTerapeuta).then((nameExit) => {
        if (nameExit.length != 0) {
          Swal.fire({
            title: 'Ya hay una persona con ese nombre, desea agregar este nombre?',
            showDenyButton: true,
            confirmButtonText: 'Si',
            denyButtonText: `No`,
          }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
              this.trabajadorService.registerTerapeuta(this.nombreTerapeuta);
              Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: '¡Insertado Correctamente!',
                showConfirmButton: false,
                timer: 2500,
              });
              // this.router.navigate([`trabajadores`]);
              this.modalService.dismissAll();
            } else if (result.isDenied) {
              this.modalService.dismissAll();
            }
          })

        } else {
          this.trabajadorService.registerTerapeuta(this.nombreTerapeuta);
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: '¡Insertado Correctamente!',
            showConfirmButton: false,
            timer: 2500,
          });
          this.modalService.dismissAll();
        }
      });
    }
    else {
      Swal.fire({
        icon: 'error',
        title: 'El campo nombre se encuentra vacío.',
      });
    }
  }


  editarTerapeuta(idDocument, idEstudiante, estud: Trabajadores) {
    this.trabajadorService.updateTerapeutas(idDocument, idEstudiante, estud);
    this.modalService.dismissAll();
    Swal.fire({
      position: 'top-end',
      icon: 'success',
      title: '¡Editado Correctamente!',
      showConfirmButton: false,
      timer: 2500,
    });
  }


  deleteTerapeuta(id) {
    this.trabajadorService.getByIdTerapeuta(id).then((datoReto) => {
      if (datoReto) {
        Swal.fire({
          title: '¿Deseas eliminar el registro?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Si, Deseo eliminar!',
        }).then((result) => {
          if (result.isConfirmed) {
            Swal.fire({
              position: 'top-end',
              icon: 'success',
              title: '¡Eliminado Correctamente!',
              showConfirmButton: false,
              timer: 2500,
            });

            this.trabajadorService.deleteTerapeuta(datoReto[0]['idDocument'], id);
            this.getTerapeuta();
            this.modalService.dismissAll();
          }
        });
      }
    });
  }
}