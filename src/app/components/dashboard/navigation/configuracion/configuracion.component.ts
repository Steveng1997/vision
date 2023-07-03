import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'
import { FormGroup, FormControl } from '@angular/forms'
import { Trabajadores } from 'src/app/core/models/trabajadores'
import { LoginService } from 'src/app/core/services/login'
// Service
import { TrabajadoresService } from 'src/app/core/services/trabajadores'

// Alert
import Swal from 'sweetalert2'
import { Usuario } from 'src/app/core/models/usuarios'

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

  formTemplate = new FormGroup({
    nombre: new FormControl(''),
    usuario: new FormControl(''),
    pass: new FormControl(''),
    fijoDia: new FormControl(''),
    servicio: new FormControl(''),
    bebida: new FormControl(''),
    tabaco: new FormControl(''),
    vitamina: new FormControl(''),
    propina: new FormControl(''),
    otros: new FormControl('')
  })

  // Terapeuta

  nombreTerapeuta: string = ''
  numberServicio: string = ''
  numberBebida: string = ''
  numberTabaco: string = ''
  numberVitamina: string = ''
  numberOtrosTep: string = ''
  numberPropinaTep: string = ''
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
    this.usuarioService.getById(targetEncargada).then((datosNameEncargada) => {
      return (this.encargadaModal = datosNameEncargada)
    })

    this.modalService.open(encargadas, {
      centered: true,
      backdrop: 'static',
    })
  }

  getEncargada() {
    this.usuarioService.getUsuarios().subscribe((datosEncargada) => {
      this.encargada = datosEncargada
    })
  }

  numberEncargada() {
    if (this.formTemplate.value.fijoDia == '') {
      this.formTemplate.value.fijoDia = '0'
    }

    if (this.formTemplate.value.servicio == '') {
      this.formTemplate.value.servicio = '0'
    }

    if (this.formTemplate.value.bebida == '') {
      this.formTemplate.value.bebida = '0'
    }

    if (this.formTemplate.value.tabaco == '') {
      this.formTemplate.value.tabaco = '0'
    }

    if (this.formTemplate.value.vitamina == '') {
      this.formTemplate.value.vitamina = '0'
    }

    if (this.formTemplate.value.propina == '') {
      this.formTemplate.value.propina = '0'
    }

    if (this.formTemplate.value.otros == '') {
      this.formTemplate.value.otros = '0'
    }
  }

  resetEncargada() {
    this.formTemplate.reset()
  }

  cerrarEncargada() {
    this.resetEncargada()
  }

  registro(formValue) {
    if (this.formTemplate.value.nombre) {
      if (this.formTemplate.value.usuario) {
        if (this.formTemplate.value.pass) {
          this.numberEncargada()
          this.usuarioService.getByUsuario(this.formTemplate.value.usuario).then((nameRegistro) => {
            if (nameRegistro[0] == undefined) {
              this.usuarioService.registerEncargada(formValue)
              Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: '¡Insertado Correctamente!',
                showConfirmButton: false,
                timer: 2500,
              })
              this.modalService.dismissAll()
              this.resetEncargada()
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

  editarEncargada(idDocument, idEstudiante, encargad: Usuario) {
    this.usuarioService.updateUser(idDocument, idEstudiante, encargad)
    this.modalService.dismissAll()
    Swal.fire({
      position: 'top-end',
      icon: 'success',
      title: '¡Editado Correctamente!',
      showConfirmButton: false,
      timer: 2500,
    })
  }

  deleteEncargada(id) {
    this.usuarioService.getById(id).then((datoEncargada) => {
      if (datoEncargada) {
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
              position: 'top-end',
              icon: 'success',
              title: '¡Eliminado Correctamente!',
              showConfirmButton: false,
              timer: 2500,
            })

            this.usuarioService.deleteEncargadas(datoEncargada[0]['idDocument'], id)
            this.getEncargada()
            this.modalService.dismissAll()
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
    this.trabajadorService.getByIdTerapeuta(targetModal).then((datosNameTerapeuta) => {
      return (this.terapeutaModal = datosNameTerapeuta)
    })

    this.modalService.open(terap, {
      centered: true,
      backdrop: 'static',
    })
  }

  getTerapeuta() {
    this.trabajadorService.getAllTerapeuta().subscribe((datosTerapeuta) => {
      this.terapeuta = datosTerapeuta
    })
  }

  resetTerapeuta() {
    this.nombreTerapeuta = ''
    this.numberServicio = ''
    this.numberBebida = ''
    this.numberTabaco = ''
    this.numberVitamina = ''
    this.numberOtrosTep = ''
    this.numberPropinaTep = ''
  }

  cerrarTerapeuta() {
    this.resetTerapeuta()
  }

  numberTerapeuta() {
    if (this.numberServicio == undefined) {
      this.numberServicio = ''
    }

    if (this.numberBebida == undefined) {
      this.numberBebida = ''
    }

    if (this.numberTabaco == undefined) {
      this.numberTabaco = ''
    }

    if (this.numberVitamina == undefined) {
      this.numberVitamina = ''
    }

    if (this.numberOtrosTep == undefined) {
      this.numberOtrosTep = ''
    }

    if (this.numberPropinaTep == undefined) {
      this.numberPropinaTep = ''
    }
  }

  addTerapeuta() {
    if (this.nombreTerapeuta != '') {
      this.numberTerapeuta()
      this.trabajadorService.getTerapeuta(this.nombreTerapeuta).then((nameExit) => {
        if (nameExit.length != 0) {
          Swal.fire({
            title: 'Ya hay una persona con ese nombre, desea agregar este nombre?',
            showDenyButton: true,
            confirmButtonText: 'Si',
            denyButtonText: `No`,
          }).then((result) => {
            if (result.isConfirmed) {
              this.trabajadorService.registerTerapeuta(this.nombreTerapeuta, this.numberServicio, this.numberBebida, this.numberTabaco,
                this.numberVitamina, this.numberOtrosTep, this.numberPropinaTep)
              Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: '¡Insertado Correctamente!',
                showConfirmButton: false,
                timer: 2500,
              })
              this.modalService.dismissAll()
              this.resetTerapeuta()
            } else if (result.isDenied) {
              this.modalService.dismissAll()
              this.resetTerapeuta()
            }
          })

        } else {
          this.trabajadorService.registerTerapeuta(this.nombreTerapeuta, this.numberServicio, this.numberBebida, this.numberTabaco,
            this.numberVitamina, this.numberOtrosTep, this.numberPropinaTep)
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: '¡Insertado Correctamente!',
            showConfirmButton: false,
            timer: 2500,
          })
          this.modalService.dismissAll()
          this.resetTerapeuta()
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

  editarTerapeuta(idDocument, idEstudiante, terap: Trabajadores) {
    this.trabajadorService.updateTerapeutas(idDocument, idEstudiante, terap)
    this.modalService.dismissAll()
    Swal.fire({
      position: 'top-end',
      icon: 'success',
      title: '¡Editado Correctamente!',
      showConfirmButton: false,
      timer: 2500,
    })
  }

  deleteTerapeuta(id) {
    this.trabajadorService.getByIdTerapeuta(id).then((datoTerapeuta) => {
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
            Swal.fire({
              position: 'top-end',
              icon: 'success',
              title: '¡Eliminado Correctamente!',
              showConfirmButton: false,
              timer: 2500,
            })

            this.trabajadorService.deleteTerapeuta(datoTerapeuta[0]['idDocument'], id)
            this.getTerapeuta()
            this.modalService.dismissAll()
          }
        })
      }
    })
  }
}
