import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import Swal from 'sweetalert2'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'

// Services
import { LoginService } from 'src/app/core/services/login'

// Models
import { Encargada } from 'src/app/core/models/encargada'

@Component({
  selector: 'app-login',
  templateUrl: 'login.component.html',
  styleUrls: ['login.component.css'],
})
export class LoginComponent implements OnInit {

  usuarios: Encargada = {
    activo: true,
    bebida: "",
    fijoDia: "",
    id: 0,
    nombre: "",
    otros: "",
    pass: "",
    propina: "",
    rol: "encargada",
    servicio: "",
    tabaco: "",
    usuario: "",
    vitamina: ""
  }

  constructor(
    public router: Router,
    public serviceLogin: LoginService,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
  }

  onLogin(): void {
    if (this.usuarios.usuario != "") {
      if (this.usuarios.pass != "") {
        this.serviceLogin.getByUsuario(this.usuarios.usuario).subscribe((resp: any) => {
          if (resp.length > 0) {
            if (resp[0]['activo'] == true) {
              this.serviceLogin.getByUserAndPass(this.usuarios.usuario, this.usuarios.pass).subscribe((respUserPass: any[]) => {
                if (respUserPass.length > 0) {
                  this.router.navigate([
                    `menu/${resp[0]['id']}/vision/${resp[0]['id']}`,
                  ])
                } else {
                  Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'La contraseña es incorrecta',
                  })
                }
              })
            } else {
              Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Este usuario ya no esta trabajando con nosotros',
              })
            }
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'No existe este usuario en la base de datos',
            })
          }
        })
      }
      else {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'El campo de la contraseña se encuentra vacío',
        })
      }
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'El campo del usuario se encuentra vacío',
      })
    }
  }

  openModal(targetModal) {
    this.modalService.open(targetModal, {
      centered: true,
      backdrop: 'static',
    })
  }

  openRegistro(targetModal) {
    this.modalService.open(targetModal, {
      centered: true,
      backdrop: 'static',
    })
  }

  registro() {
    if (this.usuarios.nombre != '') {
      if (this.usuarios.usuario != '') {
        if (this.usuarios.pass != '') {
          this.serviceLogin.getByUsuario(this.usuarios.usuario).subscribe((nameRegistro: any) => {
            if (nameRegistro.length === 0) {
              this.serviceLogin.registerEncargada(this.usuarios).subscribe(resp => {
                Swal.fire({
                  position: 'top-end',
                  icon: 'success',
                  title: '¡Insertado Correctamente!',
                  showConfirmButton: false,
                  timer: 500,
                })
                this.modalService.dismissAll()
              })
            } else {
              Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Ya existe este usuario',
              })
            }
          })
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'El campo de la contraseña se encuentra vacío',
          })
        }
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'El campo del usuario se encuentra vacío',
        })
      }
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'El campo del nombre se encuentra vacío',
      })
    }
  }
}