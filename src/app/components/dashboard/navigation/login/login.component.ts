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
              this.serviceManager.getByUserAndPass(this.manager.usuario, this.manager.pass).subscribe((res: any) => {
                if (res.token != "") {
                  localStorage.setItem('token', res.token);
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
}