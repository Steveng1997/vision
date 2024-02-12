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

  dateTmp = ''
  login: boolean = false
  registre: boolean = false

  manager: ModelManager = {
    activo: true,
    bebida: "0",
    bebidaTerap: "0",
    fijoDia: "0",
    id: 0,
    nombre: "",
    otros: "0",
    pass: "",
    propina: "0",
    rol: "",
    servicio: "0",
    tabaco: "0",
    usuario: "",
    vitamina: "0"
  }

  constructor(
    public router: Router,
    public serviceManager: ServiceManager
  ) { }

  ngOnInit(): void {
    this.login = true
    this.registre = false
  }

  dateTpm() {
    let fecha = new Date(), dia = 0, mes = 0, año = 0, convertMes = '', convertDia = ''

    dia = fecha.getDate()
    mes = fecha.getMonth() + 1
    año = fecha.getFullYear()

    if (mes > 0 && mes < 10) {
      convertMes = '0' + mes
      this.dateTmp = `${dia}/${convertMes}/${año}`
    } else {
      convertMes = mes.toString()
      this.dateTmp = `${dia}/${mes}/${año}`
    }

    if (dia > 0 && dia < 10) {
      convertDia = '0' + dia
      this.dateTmp = `${convertDia}/${convertMes}/${año}`
    } else {
      convertDia = dia.toString()
      this.dateTmp = `${dia}/${convertMes}/${año}`
    }
  }

  onLogin(): void {
    if (this.manager.usuario != "") {
      if (this.manager.pass != "") {
        this.serviceManager.getByUsuario(this.manager.usuario).subscribe((resp: any) => {
          if (resp.length > 0) {
            if (resp[0]['activo'] == true) {
              this.dateTpm()
              this.serviceManager.getByUserAndPass(this.manager.usuario, this.manager.pass).subscribe((res: any) => {
                if (res.token != "") {
                  if (res.token != undefined || res != "Usuario o clave incorrectos") {
                    localStorage.setItem('token', res.token);
                    localStorage.setItem('dateTmp', this.dateTmp);
                    this.router.navigate([`menu/${resp[0]['id']}/vision/${resp[0]['id']}`])
                  } else {
                    Swal.fire({ icon: 'error', title: 'Oops...', text: 'La contraseña es incorrecta' })
                  }
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

  registrer() {
    this.login = false
    this.registre = true
  }

  cancel() {
    this.login = true
    this.registre = false
  }

  save() {
    if (this.manager.nombre != "") {
      if (this.manager.usuario != "") {
        if (this.manager.pass != "") {
          this.serviceManager.getUsuarios().subscribe((rp: any) => {
            if (rp.length > 0) {
              this.serviceManager.getByUsuario(this.manager.usuario).subscribe((rp: any) => {
                if (rp.length == 0) {
                  this.manager.rol = 'encargada'
                  this.serviceManager.registerEncargada(this.manager).subscribe((resp: any) => {
                    this.login = true
                    this.registre = false
                    Swal.fire({
                      position: 'top-end', icon: 'success', title: '¡Insertado Correctamente!', showConfirmButton: false, timer: 500
                    })
                  })
                } else {
                  Swal.fire({ icon: 'error', title: 'Oops...', text: 'Ya hay un usuario con ese nombre' })
                }
              })
            } else {
              this.manager.rol = 'administrador'
              this.serviceManager.registerEncargada(this.manager).subscribe((resp: any) => {
                Swal.fire({
                  position: 'top-end', icon: 'success', title: '¡Insertado Correctamente!', showConfirmButton: false, timer: 500
                })
              })
            }
          })
        } else {
          Swal.fire({ icon: 'error', title: 'Oops...', text: 'El campo contraseña se encuentra vacío' })
        }
      } else {
        Swal.fire({ icon: 'error', title: 'Oops...', text: 'El campo usuario se encuentra vacío' })
      }
    } else {
      Swal.fire({ icon: 'error', title: 'Oops...', text: 'El campo nombre se encuentra vacío' })
    }

  }
}