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

  public usuarioRegistro: string;
  public passRegistro: string;
  usuarios: Usuario[];

  formTemplate = new FormGroup({
    nombre: new FormControl(''),
    usuario: new FormControl(''),
    pass: new FormControl(''),
  });


  constructor(
    public router: Router,
    public serviceLogin: LoginService,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
  }

  onLogin(): void {
    debugger
    if (this.usuarioRegistro != '') {
      if (this.passRegistro != '') {
        this.serviceLogin.getByUsuario(this.usuarioRegistro).then((resp => {
          if (resp[0] != undefined) {
            this.router.navigate([
              `menu/${resp[0]['id']}/vision/${resp[0]['id']}`,
            ]);
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

  registro(formValue) {
    debugger
    if (this.formTemplate.value.nombre) {
      if (this.formTemplate.value.usuario) {
        if (this.formTemplate.value.pass) {
          this.serviceLogin.getByUsuario(this.formTemplate.value.usuario).then((nameRegistro) => {
            if (nameRegistro[0] == undefined) {
              this.serviceLogin.registerUser(formValue);
              Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: '¡Insertado Correctamente!',
                showConfirmButton: false,
                timer: 2500,
              });
              this.modalService.dismissAll();
            } else {
              Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Ya existe este usuario',
              });
            }
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