import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Usuario } from 'src/app/core/models/usuarios';
import { LoginService } from 'src/app/core/services/login.service';
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
    // this.router.navigate([`menu/`])
    // if (this.email != '') {
    //   if (this.password != '') {
    //     this.serviceLogin.getEmailYPassword(this.email, this.password).then((resp => {
    //       this.serviceLogin
    //         .emailExistAndPassword(this.email, this.password)
    //         .then((dataCategoria) => {
    //           this.usuarios = dataCategoria;
    //           if (this.usuarios[0]['rol'] == 'administrador') {
    //             this.router.navigate([
    //               `admin/${this.usuarios[0]['id']}/usuarios/${this.usuarios[0]['id']}`,
    //             ]);
    //           } else {
    //             this.router.navigate([`menu/${this.usuarios[0]['id']}`]);
    //           }
    //         })
    //     })).catch((err) => {
    //       if (err.code == AuthErrorCodes.INVALID_PASSWORD || err.code == AuthErrorCodes.TOO_MANY_ATTEMPTS_TRY_LATER) {
    //         this.restorePassword();
    //       }
    //       else {
    //         Swal.fire({
    //           icon: 'error',
    //           title: 'Oops...',
    //           text: 'El correo no esta registrado',
    //         });
    //       }
    //     })
    //   }
    //   else {
    //     Swal.fire({
    //       icon: 'error',
    //       title: 'Oops...',
    //       text: 'El campo de la contraseña se encuentra vacío',
    //     });
    //   }
    // } else {
    //   Swal.fire({
    //     icon: 'error',
    //     title: 'Oops...',
    //     text: 'El campo del correo se encuentra vacío',
    //   });
    // }
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
    console.log(this.formTemplate.value.nombreRegistro)

  }
}