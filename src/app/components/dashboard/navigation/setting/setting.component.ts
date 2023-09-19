import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'
import Swal from 'sweetalert2'

// Service
import { ServiceTherapist } from 'src/app/core/services/therapist'
import { ServiceManager } from 'src/app/core/services/manager'

// Alert

import { ModelManager } from 'src/app/core/models/manager'
import { ModelTherapist } from 'src/app/core/models/therapist'

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.css']
})
export class SettingComponent implements OnInit {

  // Encargada
  managers: any[] = []
  pageEncargada!: number
  modalManager: any[] = []

  manager: ModelManager = {
    activo: true,
    bebida: "",
    fijoDia: "",
    id: 0,
    nombre: "",
    otros: "",
    pass: "",
    propina: "",
    rol: 'encargada',
    servicio: "",
    tabaco: "",
    usuario: "",
    vitamina: ""
  }

  therapist: ModelTherapist = {
    activo: true,
    bebida: "",
    fechaEnd: "",
    horaEnd: "",
    id: 0,
    nombre: "",
    otros: "",
    propina: "",
    salida: "",
    servicio: "",
    tabaco: "",
    vitamina: "",
  }

  // Terapeuta

  terapeuta: any[] = []
  pageTerapeuta!: number
  idTerapeuta: string
  terapeutaModal: any[] = []

  constructor(
    public router: Router,
    public serviceTherapist: ServiceTherapist,
    public serviceManager: ServiceManager,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    this.consultTherapists()
    this.consultManager()

    document.getElementById('idTitulo').style.display = 'block'
    document.getElementById('idTitulo').innerHTML = 'CONFIGURACIÓN'
  }

  openManager(targetEncargada) {
    this.modalService.open(targetEncargada, {
      centered: true,
      backdrop: 'static',
    })
  }

  modalTablaManager(targetEncargada, manager) {
    this.serviceManager.getById(targetEncargada).subscribe((datosNameEncargada: any) => {
      return (this.modalManager = datosNameEncargada)
    })

    this.modalService.open(manager, {
      centered: true,
      backdrop: 'static',
    })
  }

  consultManager() {
    this.serviceManager.getUsuarios().subscribe((dataInCharge: any) => {
      this.managers = dataInCharge
    })
  }

  resetManager() {
    if (this.manager.nombre != '') this.manager.nombre = ''
    if (this.manager.usuario != '') this.manager.usuario = ''
    if (this.manager.pass != '') this.manager.pass = ''
    if (Number(this.manager.fijoDia) > 0) this.manager.fijoDia = ''
    if (Number(this.manager.servicio) > 0) this.manager.servicio = ''
    if (Number(this.manager.bebida) > 0) this.manager.bebida = ''
    if (Number(this.manager.tabaco) > 0) this.manager.tabaco = ''
    if (Number(this.manager.vitamina) > 0) this.manager.vitamina = ''
    if (Number(this.manager.propina) > 0) this.manager.propina = ''
    if (Number(this.manager.otros) > 0) this.manager.otros = ''
  }

  validateValuesOfEmptyTherapists(){
    if(this.therapist.bebida == "") this.therapist.bebida = "0"
    if(this.therapist.otros == "") this.therapist.otros = "0"
    if(this.therapist.propina == "") this.therapist.propina = "0"
    if(this.therapist.servicio == "") this.therapist.servicio = "0"
    if(this.therapist.tabaco == "") this.therapist.tabaco = "0"
    if(this.therapist.vitamina == "") this.therapist.vitamina = "0"
  }

  validateValuesOfEmptyManagers(){
    if(this.manager.bebida == "") this.manager.bebida = "0"
    if(this.manager.fijoDia == "") this.manager.fijoDia = "0"
    if(this.manager.otros == "") this.manager.otros = "0"
    if(this.manager.propina == "") this.manager.propina = "0"
    if(this.manager.servicio == "") this.manager.servicio = "0"
    if(this.manager.tabaco == "") this.manager.tabaco = "0"
    if(this.manager.vitamina == "") this.manager.vitamina = "0"
  }

  closeManager() {
    this.resetManager()
  }

  registerManager() {
    if (this.manager.nombre) {
      if (this.manager.usuario) {
        if (this.manager.pass) {
          this.manager.nombre = this.manager.nombre.replace(/(^\w{1})|(\s+\w{1})/g, letra => letra.toUpperCase())
          this.serviceManager.getByUsuario(this.manager.usuario).subscribe((nameRegistro: any) => {
            if (nameRegistro.length == 0) {
              this.validateValuesOfEmptyManagers()
              this.serviceManager.registerEncargada(this.manager).subscribe((resp: any) => {
                this.consultManager()
                Swal.fire({
                  position: 'top-end', icon: 'success', title: '¡Insertado Correctamente!', showConfirmButton: false, timer: 500
                })
                this.modalService.dismissAll()
                this.resetManager()
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

  editManager(id: number, encargada) {
    encargada.nombre = encargada.nombre.replace(/(^\w{1})|(\s+\w{1})/g, letra => letra.toUpperCase())
    this.serviceManager.updateUser(id, encargada).subscribe((res: any) => {
      this.consultManager()
      this.modalService.dismissAll()
      Swal.fire({
        position: 'top-end', icon: 'success', title: '¡Editado Correctamente!', showConfirmButton: false, timer: 2500
      })
    })
  }

  removeManager(id) {
    this.serviceManager.getById(id).subscribe((resp: any) => {
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

            this.serviceManager.deleteManager(id).subscribe((resp: any) => {
              this.consultManager()
              this.modalService.dismissAll()
            })
          }
        })
      }
    })
  }

  // Terapeuta

  openTherapist(targetModal) {
    this.modalService.open(targetModal, {
      centered: true,
      backdrop: 'static',
    })
  }

  modalTableTherapist(targetModal, terap) {
    this.serviceTherapist.getByIdTerapeuta(targetModal).subscribe((datosNameTerapeuta: any) => {
      return (this.terapeutaModal = datosNameTerapeuta)
    })

    this.modalService.open(terap, {
      centered: true,
      backdrop: 'static',
    })
  }

  consultTherapists() {
    this.serviceTherapist.getAllTerapeuta().subscribe((datosTerapeuta: any) => {
      this.terapeuta = datosTerapeuta
    })
  }

  resetTherapist() {
    if (this.therapist.nombre != '') this.therapist.nombre = ''
    if (Number(this.therapist.servicio) > 0) this.therapist.servicio = ""
    if (Number(this.therapist.bebida) > 0) this.therapist.bebida = ""
    if (Number(this.therapist.tabaco) > 0) this.therapist.tabaco = ""
    if (Number(this.therapist.vitamina) > 0) this.therapist.vitamina = ""
    if (Number(this.therapist.propina) > 0) this.therapist.propina = ""
    if (Number(this.therapist.otros) > 0) this.therapist.otros = ""
  }

  closeTherapist() {
    this.resetTherapist()
  }

  therapistRegistration() {
    if (this.therapist.nombre != '') {
      this.therapist.nombre = this.therapist.nombre.replace(/(^\w{1})|(\s+\w{1})/g, letra => letra.toUpperCase())
      this.validateValuesOfEmptyTherapists()
      this.serviceTherapist.getTerapeuta(this.therapist.nombre).subscribe((res: any) => {
        if (res.length > 0) {
          Swal.fire({
            title: 'Ya hay una persona con ese nombre, desea agregar este nombre?', showDenyButton: true, confirmButtonText: 'Si', denyButtonText: `No`
          }).then((result) => {
            if (result.isConfirmed) {
              this.serviceTherapist.save(this.therapist).subscribe((resp: any) => {
                this.consultTherapists()
                Swal.fire({
                  position: 'top-end', icon: 'success', title: '¡Insertado Correctamente!', showConfirmButton: false, timer: 500
                })
                this.modalService.dismissAll()
                this.resetTherapist()
              })
            } else if (result.isDenied) {
              this.modalService.dismissAll()
              this.resetTherapist()
            }
          })

        } else {
          this.serviceTherapist.save(this.therapist).subscribe((res: any) => {
            this.consultTherapists()
            Swal.fire({
              position: 'top-end', icon: 'success', title: '¡Insertado Correctamente!', showConfirmButton: false, timer: 500
            })
            this.modalService.dismissAll()
            this.resetTherapist()
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

  editTherapist (id, terapeuta) {
    terapeuta.nombre = terapeuta.nombre.replace(/(^\w{1})|(\s+\w{1})/g, letra => letra.toUpperCase())
    this.serviceTherapist.updateTerapeutas(id, terapeuta).subscribe((res: any) => {
      this.consultTherapists()
      this.modalService.dismissAll()
      Swal.fire({
        position: 'top-end', icon: 'success', title: '¡Editado Correctamente!', showConfirmButton: false, timer: 2500
      })
    })
  }

  removeTherapist(id: number) {
    this.serviceTherapist.getByIdTerapeuta(id).subscribe((datoTerapeuta: any) => {
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
            this.serviceTherapist.deleteTerapeuta(id).subscribe((resp: any) => {
              this.consultTherapists()
              this.modalService.dismissAll()
            })
          }
        })
      }
    })
  }
}
