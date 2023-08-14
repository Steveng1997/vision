import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'
import Swal from 'sweetalert2'

// Service
import { TrabajadoresService } from 'src/app/core/services/trabajadores'
import { LoginService } from 'src/app/core/services/login'

// Alert

import { Encargada } from 'src/app/core/models/encargada'
import { Terapeutas } from 'src/app/core/models/terapeutas'

@Component({
  selector: 'app-configuracion',
  templateUrl: './configuracion.component.html',
  styleUrls: ['./configuracion.component.css']
})
export class ConfiguracionComponent implements OnInit {

  // Encargada

  nombreEncargada: string = ''
  encargada: any[] = []
  pageEncargada!: number
  idEncargada: string
  encargadaModal: any[] = []

  encargadas: Encargada = {
    activo: true,
    bebida: 0,
    fijoDia: 0,
    id: 0,
    nombre: "",
    otros: 0,
    pass: "",
    propina: 0,
    rol: 'encargada',
    servicio: 0,
    tabaco: 0,
    usuario: "",
    vitamina: 0
  }

  terapeutas: Terapeutas = {
    activo: true,
    bebida: 0,
    fechaEnd: "",
    horaEnd: "",
    id: 0,
    nombre: "",
    otros: 0,
    propina: 0,
    salida: "",
    servicio: 0,
    tabaco: 0,
    vitamina: 0,
  }

  // Terapeuta

  terapeuta: any[] = []
  pageTerapeuta!: number
  idTerapeuta: string
  terapeutaModal: any[] = []

  constructor(
    public router: Router,
    public trabajadorService: TrabajadoresService,
    public usuarioService: LoginService,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    this.getTerapeuta()
    this.getEncargada()

    document.getElementById('idTitulo').style.display = 'block'
    document.getElementById('idTitulo').innerHTML = 'CONFIGURACIÓN'
  }

  openEncargada(targetEncargada) {
    this.modalService.open(targetEncargada, {
      centered: true,
      backdrop: 'static',
    })
  }

  modalTablaEncargada(targetEncargada, encargadas) {
    this.usuarioService.getById(targetEncargada).subscribe((datosNameEncargada: any) => {
      return (this.encargadaModal = datosNameEncargada)
    })

    this.modalService.open(encargadas, {
      centered: true,
      backdrop: 'static',
    })
  }

  getEncargada() {
    this.usuarioService.getUsuarios().subscribe((datosEncargada: any) => {
      this.encargada = datosEncargada
    })
  }

  resetEncargada() {
    if (this.encargadas.nombre != '') this.encargadas.nombre = ''
    if (this.encargadas.usuario != '') this.encargadas.usuario = ''
    if (this.encargadas.pass != '') this.encargadas.pass = ''
    if (this.encargadas.fijoDia > 0) this.encargadas.fijoDia = 0
    if (this.encargadas.servicio > 0) this.encargadas.servicio = 0
    if (this.encargadas.bebida > 0) this.encargadas.bebida = 0
    if (this.encargadas.tabaco > 0) this.encargadas.tabaco = 0
    if (this.encargadas.vitamina > 0) this.encargadas.vitamina = 0
    if (this.encargadas.propina > 0) this.encargadas.propina = 0
    if (this.encargadas.otros > 0) this.encargadas.otros = 0
  }

  cerrarEncargada() {
    this.resetEncargada()
  }

  registroEncargada() {
    if (this.encargadas.nombre) {
      if (this.encargadas.usuario) {
        if (this.encargadas.pass) {
          this.encargadas.nombre = this.encargadas.nombre.replace(/(^\w{1})|(\s+\w{1})/g, letra => letra.toUpperCase())
          this.usuarioService.getByUsuario(this.encargadas.usuario).subscribe((nameRegistro: any) => {
            if (nameRegistro.length == 0) {
              this.usuarioService.registerEncargada(this.encargadas).subscribe((resp: any) => {
                this.getEncargada()
                Swal.fire({
                  position: 'top-end', icon: 'success', title: '¡Insertado Correctamente!', showConfirmButton: false, timer: 500
                })
                this.modalService.dismissAll()
                this.resetEncargada()
              })
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

  editarEncargada(id: number, encargada) {
    encargada.nombre = encargada.nombre.replace(/(^\w{1})|(\s+\w{1})/g, letra => letra.toUpperCase())
    this.usuarioService.updateUser(id, encargada).subscribe((res: any) => {
      this.getEncargada()
      this.modalService.dismissAll()
      Swal.fire({
        position: 'top-end', icon: 'success', title: '¡Editado Correctamente!', showConfirmButton: false, timer: 2500
      })
    })
  }

  deleteEncargada(id) {
    this.usuarioService.getById(id).subscribe((resp: any) => {
      if (resp) {
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
              position: 'top-end', icon: 'success', title: '¡Eliminado Correctamente!', showConfirmButton: false, timer: 2500
            })

            this.usuarioService.deleteEncargadas(id).subscribe((resp: any) => {
              this.getEncargada()
              this.modalService.dismissAll()
            })
          }
        })
      }
    })
  }

  // Terapeuta

  openTerapeuta(targetModal) {
    this.modalService.open(targetModal, {
      centered: true,
      backdrop: 'static',
    })
  }

  modalTablaTerapeuta(targetModal, terap) {
    this.trabajadorService.getByIdTerapeuta(targetModal).subscribe((datosNameTerapeuta: any) => {
      return (this.terapeutaModal = datosNameTerapeuta)
    })

    this.modalService.open(terap, {
      centered: true,
      backdrop: 'static',
    })
  }

  getTerapeuta() {
    this.trabajadorService.getAllTerapeuta().subscribe((datosTerapeuta: any) => {
      this.terapeuta = datosTerapeuta
    })
  }

  resetTerapeuta() {
    if (this.terapeutas.nombre != '') this.terapeutas.nombre = ''
    if (this.terapeutas.servicio > 0) this.terapeutas.servicio = 0
    if (this.terapeutas.bebida > 0) this.terapeutas.bebida = 0
    if (this.terapeutas.tabaco > 0) this.terapeutas.tabaco = 0
    if (this.terapeutas.vitamina > 0) this.terapeutas.vitamina = 0
    if (this.terapeutas.propina > 0) this.terapeutas.propina = 0
    if (this.terapeutas.otros > 0) this.terapeutas.otros = 0
  }

  cerrarTerapeuta() {
    this.resetTerapeuta()
  }

  registroTerapeuta() {
    if (this.terapeutas.nombre != '') {
      this.terapeutas.nombre = this.terapeutas.nombre.replace(/(^\w{1})|(\s+\w{1})/g, letra => letra.toUpperCase())
      this.trabajadorService.getTerapeuta(this.terapeutas.nombre).subscribe((res: any) => {
        if (res.length > 0) {
          Swal.fire({
            title: 'Ya hay una persona con ese nombre, desea agregar este nombre?', showDenyButton: true, confirmButtonText: 'Si', denyButtonText: `No`
          }).then((result) => {
            if (result.isConfirmed) {
              this.trabajadorService.registerTerapeuta(this.terapeutas).subscribe((resp: any) => {
                this.getTerapeuta()
                Swal.fire({
                  position: 'top-end', icon: 'success', title: '¡Insertado Correctamente!', showConfirmButton: false, timer: 500
                })
                this.modalService.dismissAll()
                this.resetTerapeuta()
              })
            } else if (result.isDenied) {
              this.modalService.dismissAll()
              this.resetTerapeuta()
            }
          })

        } else {
          this.trabajadorService.registerTerapeuta(this.terapeutas).subscribe((res: any) => {
            this.getTerapeuta()
            Swal.fire({
              position: 'top-end', icon: 'success', title: '¡Insertado Correctamente!', showConfirmButton: false, timer: 500
            })
            this.modalService.dismissAll()
            this.resetTerapeuta()
          })
        }
      })
    }
    else {
      Swal.fire({
        icon: 'error',
        title: 'El campo nombre se encuentra vacío.',
      })
    }
  }

  editarTerapeuta(id, terapeuta) {
    terapeuta.nombre = terapeuta.nombre.replace(/(^\w{1})|(\s+\w{1})/g, letra => letra.toUpperCase())
    this.trabajadorService.updateTerapeutas(id, terapeuta).subscribe((res: any) => {
      this.getTerapeuta()
      this.modalService.dismissAll()
      Swal.fire({
        position: 'top-end', icon: 'success', title: '¡Editado Correctamente!', showConfirmButton: false, timer: 2500
      })
    })
  }

  deleteTerapeuta(id: number) {
    this.trabajadorService.getByIdTerapeuta(id).subscribe((datoTerapeuta: any) => {
      if (datoTerapeuta) {
        Swal.fire({
          title: '¿Deseas eliminar el registro?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Si, Deseo eliminar!',
        }).then((result) => {
          if (result.isConfirmed) {
            Swal.fire({ position: 'top-end', icon: 'success', title: '¡Eliminado Correctamente!', showConfirmButton: false, timer: 2500 })
            this.trabajadorService.deleteTerapeuta(id).subscribe((resp: any) => {
              this.getTerapeuta()
              this.modalService.dismissAll()
            })
          }
        })
      }
    })
  }
}
