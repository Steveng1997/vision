import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

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

  public nombre: string = '';
  idUser: string;

  constructor(
    public router: Router,
    public trabajadorService: TrabajadoresService,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
  }

  openModal(targetModal) {
    this.modalService.open(targetModal, {
      centered: true,
      backdrop: 'static',
    });
  }

  onAddUser(): void {
    if (this.nombre != '') {
      this.trabajadorService.geyByName(this.nombre).then((nameExit) => {
        if (nameExit.length != 0) {
          Swal.fire({
            title: 'Ya hay una persona con ese nombre, desea agregar este nombre?',
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: 'Save',
            denyButtonText: `Don't save`,
          }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
              this.trabajadorService.registerPersona(this.nombre);
              Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: '¡Insertado Correctamente!',
                showConfirmButton: false,
                timer: 2500,
              });
              this.router.navigate([`trabajadores`]);
            } else if (result.isDenied) {
              // Swal.fire('Changes are not saved', '', 'info')
              this.router.navigate([`trabajadores`]);
            }
          })

        } else {
          this.trabajadorService.registerPersona(this.nombre);
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: '¡Insertado Correctamente!',
            showConfirmButton: false,
            timer: 2500,
          });
          this.router.navigate([`trabajadores`]);
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
}