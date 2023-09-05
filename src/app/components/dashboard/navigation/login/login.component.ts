import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import Swal from 'sweetalert2'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'

// Services
import { ServiceManager } from 'src/app/core/services/manager'

// Models
import { ModelManager } from 'src/app/core/models/manager'

@Component({
  selector: 'app-login',
  templateUrl: 'login.component.html',
  styleUrls: ['login.component.css'],
})
export class LoginComponent implements OnInit {

  manager: ModelManager = {
    activo: true,
    bebida: "0",
    fijoDia: "0",
    id: 0,
    nombre: "",
    otros: "0",
    pass: "",
    propina: "0",
    rol: 'encargada',
    servicio: "0",
    tabaco: "0",
    usuario: "",
    vitamina: "0"
  }

  constructor(
    public router: Router,
    public serviceManager: ServiceManager,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
  }

  onLogin(): void {
    if (this.manager.usuario != "") {
      if (this.manager.pass != "") {
        this.serviceManager.getByUsuario(this.manager.usuario).subscribe((resp: any) => {
          if (resp.length > 0) {
            if (resp[0]['activo'] == true) {
              this.serviceManager.getByUserAndPass(this.manager.usuario, this.manager.pass).subscribe((respUserPass: any[]) => {
                if (respUserPass.length > 0) {
                  this.router.navigate([`menu/${resp[0]['id']}/vision/${resp[0]['id']}`])
                } else {
                  Swal.fire({ icon: 'error', title: 'Oops...', text: 'La contraseña es incorrecta' })
                }
              })
            } else {
              Swal.fire({ icon: 'error', title: 'Oops...', text: 'Este usuario ya no esta trabajando con nosotros' })
            }
          } else {
            Swal.fire({ icon: 'error', title: 'Oops...', text: 'No existe este usuario en la base de datos' })
          }
        })
      }
      else {
        Swal.fire({ icon: 'error', title: 'Oops...', text: 'El campo de la contraseña se encuentra vacío' })
      }
    } else {
      Swal.fire({ icon: 'error', title: 'Oops...', text: 'El campo del usuario se encuentra vacío' })
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
    if (this.manager.nombre != '') {
      if (this.manager.usuario != '') {
        if (this.manager.pass != '') {
          this.manager.nombre = this.manager.nombre.replace(/(^\w{1})|(\s+\w{1})/g, letra => letra.toUpperCase())
          this.serviceManager.getByUsuario(this.manager.usuario).subscribe((nameRegistro: any) => {
            if (nameRegistro.length === 0) {
              this.serviceManager.registerEncargada(this.manager).subscribe(resp => { })
              Swal.fire({
                position: 'top-end', icon: 'success', title: '¡Insertado Correctamente!', showConfirmButton: false, timer: 500,
              })
              this.modalService.dismissAll()
            } else {
              Swal.fire({ icon: 'error', title: 'Oops...', text: 'Ya existe este usuario' })
            }
          })
        } else {
          Swal.fire({ icon: 'error', title: 'Oops...', text: 'El campo de la contraseña se encuentra vacío' })
        }
      } else {
        Swal.fire({ icon: 'error', title: 'Oops...', text: 'El campo del usuario se encuentra vacío' })
      }
    } else {
      Swal.fire({ icon: 'error', title: 'Oops...', text: 'El campo del nombre se encuentra vacío' })
    }
  }
}