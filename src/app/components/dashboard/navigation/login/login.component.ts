import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Usuario } from 'src/app/core/models/usuarios';
import { LoginService } from 'src/app/core/services/login';
import Swal from 'sweetalert2';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: 'login.component.html',
  styleUrls: ['login.component.css'],
})
export class LoginComponent implements OnInit {

  public usuario: string;
  public pass: string;
  usuarios: Usuario[];

  formTemplate = new FormGroup({
    nombreRegistro: new FormControl(''),
    usuarioRegistro: new FormControl(''),
    passRegistro: new FormControl(''),
  });


  constructor(
    public router: Router,
    public serviceLogin: LoginService,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
  }

  onLogin(): void {

    if (this.usuario != '') {
      if (this.pass != '') {
        this.serviceLogin.getByUsuario(this.usuario).then((resp => {
          if (resp[0] != undefined) {

          } else {
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'No existe este usuario en la base de datos',
            })
          }
        }))
      }
      else {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'El campo de la contraseña se encuentra vacío',
        });
      }
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'El campo del usuario se encuentra vacío',
      });
    }
  }


  openModal(targetModal) {
    this.modalService.open(targetModal, {
      centered: true,
      backdrop: 'static',
    });
  }

  openRegistro(targetModal) {
    this.modalService.open(targetModal, {
      centered: true,
      backdrop: 'static',
    });
  }

  registro() {
    if (this.formTemplate.value.nombreRegistro) {
      if (this.formTemplate.value.usuarioRegistro) {
        if (this.formTemplate.value.passRegistro) {
          this.trabajadorService.getEncargada(this.nombreEncargada).then((nameExit) => {

          })

        } else {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'El campo de la contraseña se encuentra vacío',
          });
        }

      } else {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'El campo del usuario se encuentra vacío',
        });
      }

    } else {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'El campo del nombre se encuentra vacío',
      });
    }
  }
}