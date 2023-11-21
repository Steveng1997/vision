import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'

// Alert
import Swal from 'sweetalert2'

// Service
import { ServiceTherapist } from 'src/app/core/services/therapist'
import { ServiceManager } from 'src/app/core/services/manager'
import { Service } from 'src/app/core/services/service'
import { ServiceLiquidationTherapist } from 'src/app/core/services/therapistCloseouts'
import { LiquidationManager } from 'src/app/core/models/liquidationManager'

// Models
import { ModelManager } from 'src/app/core/models/manager'
import { ModelTherapist } from 'src/app/core/models/therapist'
import { ModelService } from 'src/app/core/models/service'
import { LiquidationTherapist } from 'src/app/core/models/liquidationTherapist'
import { ServiceLiquidationManager } from 'src/app/core/services/managerCloseouts'

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.css']
})
export class SettingComponent implements OnInit {

  // Encargada
  managers: any
  pageEncargada!: number
  modalManager: any
  currentDate = new Date().getTime()

  liquidationManager: LiquidationManager = {
    currentDate: "",
    desdeFechaLiquidado: "",
    desdeHoraLiquidado: "",
    encargada: "",
    hastaFechaLiquidado: "",
    hastaHoraLiquidado: new Date().toTimeString().substring(0, 5),
    id: 0,
    idUnico: "",
    idEncargada: "",
    importe: 0,
    tratamiento: 0
  }

  liquidationTherapist: LiquidationTherapist = {
    currentDate: "",
    desdeFechaLiquidado: "",
    desdeHoraLiquidado: "",
    encargada: "",
    hastaFechaLiquidado: "",
    hastaHoraLiquidado: new Date().toTimeString().substring(0, 5),
    id: 0,
    idUnico: "",
    idTerapeuta: "",
    importe: 0,
    terapeuta: "",
    tratamiento: 0
  }

  modelService: ModelService = {
    idTerapeuta: "",
    idEncargada: ""
  }

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
    propina: "100",
    salida: "",
    servicio: "50",
    tabaco: "",
    vitamina: "",
  }

  // Terapeuta

  terapeuta: any
  pageTerapeuta!: number
  idTerapeuta: string

  constructor(
    public router: Router,
    public serviceTherapist: ServiceTherapist,
    public serviceManager: ServiceManager,
    public services: Service,
    public serviceLiquidationTherapist: ServiceLiquidationTherapist,
    public serviceLiquidationManager: ServiceLiquidationManager,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    this.consultTherapists()
    this.consultManager()
  }

  openManager(targetEncargada) {
    this.modalService.open(targetEncargada, {
      centered: true,
      backdrop: 'static',
    })
  }

  modalTablaManager(targetEncargada, manager) {
    this.serviceManager.getById(targetEncargada).subscribe((rp: any) => { })

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

  validateValuesOfEmptyTherapists() {
    if (this.therapist.bebida == "") this.therapist.bebida = "0"
    if (this.therapist.otros == "") this.therapist.otros = "0"
    if (this.therapist.propina == "") this.therapist.propina = "0"
    if (this.therapist.servicio == "") this.therapist.servicio = "0"
    if (this.therapist.tabaco == "") this.therapist.tabaco = "0"
    if (this.therapist.vitamina == "") this.therapist.vitamina = "0"
  }

  validateValuesOfEmptyManagers() {
    if (this.manager.bebida == "") this.manager.bebida = "0"
    if (this.manager.fijoDia == "") this.manager.fijoDia = "0"
    if (this.manager.otros == "") this.manager.otros = "0"
    if (this.manager.propina == "") this.manager.propina = "0"
    if (this.manager.servicio == "") this.manager.servicio = "0"
    if (this.manager.tabaco == "") this.manager.tabaco = "0"
    if (this.manager.vitamina == "") this.manager.vitamina = "0"
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

  createIdUnicoManager() {
    var d = new Date().getTime()
    var uuid = 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = (d + Math.random() * 16) % 16 | 0
      d = Math.floor(d / 16)
      return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16)
    })

    this.modelService.idEncargada = uuid
    this.liquidationManager.idUnico = uuid
    this.liquidationManager.idEncargada = uuid
    return this.liquidationManager.idUnico
  }

  dateManager(nombre: string) {
    let fecha = new Date(), añoHasta = 0, mesHasta = 0, diaHasta = 0, convertMes = '', convertDia = '',
      añoDesde = "", mesDesde = "", diaDesde = ""

    diaHasta = fecha.getDate()
    mesHasta = fecha.getMonth() + 1
    añoHasta = fecha.getFullYear()

    if (mesHasta > 0 && mesHasta < 10) {
      convertMes = '0' + mesHasta
      this.liquidationManager.hastaFechaLiquidado = `${añoHasta}-${convertMes}-${diaHasta}`
    } else {
      convertMes = mesHasta.toString()
      this.liquidationManager.hastaFechaLiquidado = `${añoHasta}-${convertMes}-${diaHasta}`
    }

    if (diaHasta > 0 && diaHasta < 10) {
      convertDia = '0' + diaHasta
      this.liquidationManager.hastaFechaLiquidado = `${añoHasta}-${convertMes}-${convertDia}`
    } else {
      this.liquidationManager.hastaFechaLiquidado = `${añoHasta}-${convertMes}-${diaHasta}`
    }

    this.serviceLiquidationManager.getByEncargada(nombre).subscribe((rp: any) => {
      if (rp.length > 0) {
        añoDesde = rp[0]['desdeFechaLiquidado'].toString().substring(2, 4)
        mesDesde = rp[0]['desdeFechaLiquidado'].toString().substring(5, 7)
        diaDesde = rp[0]['desdeFechaLiquidado'].toString().substring(8, 10)
        this.liquidationManager.desdeFechaLiquidado = `${añoDesde}-${mesDesde}-${diaDesde}`
        this.liquidationManager.desdeHoraLiquidado = rp[0]['hastaHoraLiquidado']
      } else {
        this.services.getManagerLiqFalse(nombre).subscribe((rp: any) => {
          añoDesde = rp[0]['fechaHoyInicio'].substring(0, 4)
          mesDesde = rp[0]['fechaHoyInicio'].substring(5, 7)
          diaDesde = rp[0]['fechaHoyInicio'].substring(8, 10)
          this.liquidationManager.desdeFechaLiquidado = `${añoDesde}-${mesDesde}-${diaDesde}`
          this.liquidationManager.desdeHoraLiquidado = rp[0]['horaStart']
        })
      }
    })
  }


  removeManager(id: number, nombre: string) {
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

            this.createIdUnicoManager()
            this.dateManager(nombre)
            this.liquidationManager.currentDate = this.currentDate.toString()
            this.liquidationManager.encargada = nombre

            this.services.getManagerLiqFalse(nombre).subscribe((rp: any) => {
              this.liquidationManager.tratamiento = rp.length
            })

            setTimeout(() => {
              this.serviceLiquidationManager.settlementRecord(this.liquidationManager).subscribe((datos) => { })
            }, 1000)

            Swal.fire({ position: 'top-end', icon: 'success', title: '¡Eliminado Correctamente!', showConfirmButton: false, timer: 2500 })
            this.serviceManager.deleteManager(id).subscribe((resp: any) => {
              this.consultManager()
              this.modalService.dismissAll()
            })
          }
        })
      }
    })
  }

  // Therapist

  openTherapist(targetModal) {
    this.modalService.open(targetModal, {
      centered: true,
      backdrop: 'static',
    })
  }

  modalTableTherapist(targetTherapist, terap) {
    this.serviceTherapist.getByIdTerapeuta(targetTherapist).subscribe((rp: any) => { })

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
    if (Number(this.therapist.servicio) > 0) this.therapist.servicio = "50"
    if (Number(this.therapist.bebida) > 0) this.therapist.bebida = ""
    if (Number(this.therapist.tabaco) > 0) this.therapist.tabaco = ""
    if (Number(this.therapist.vitamina) > 0) this.therapist.vitamina = ""
    if (Number(this.therapist.propina) > 0) this.therapist.propina = "100"
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

  editTherapist(id: number, terapeuta) {
    terapeuta.nombre = terapeuta.nombre.replace(/(^\w{1})|(\s+\w{1})/g, letra => letra.toUpperCase())
    this.serviceTherapist.updateTerapeutas(id, terapeuta).subscribe((res: any) => {
      this.consultTherapists()
      this.modalService.dismissAll()
      Swal.fire({
        position: 'top-end', icon: 'success', title: '¡Editado Correctamente!', showConfirmButton: false, timer: 2500
      })
    })
  }

  createIdUnicoTherapist() {
    var d = new Date().getTime()
    var uuid = 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = (d + Math.random() * 16) % 16 | 0
      d = Math.floor(d / 16)
      return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16)
    })

    this.modelService.idTerapeuta = uuid
    this.liquidationTherapist.idUnico = uuid
    this.liquidationTherapist.idTerapeuta = uuid
    this.modelService.idTerapeuta = uuid
    return this.liquidationTherapist.idUnico
  }

  dateTherapist(nombre: string) {
    let fecha = new Date(), añoHasta = 0, mesHasta = 0, diaHasta = 0, convertMes = '', convertDia = '',
      añoDesde = "", mesDesde = "", diaDesde = ""

    diaHasta = fecha.getDate()
    mesHasta = fecha.getMonth() + 1
    añoHasta = fecha.getFullYear()

    if (mesHasta > 0 && mesHasta < 10) {
      convertMes = '0' + mesHasta
      this.liquidationTherapist.hastaFechaLiquidado = `${añoHasta}-${convertMes}-${diaHasta}`
    } else {
      convertMes = mesHasta.toString()
      this.liquidationTherapist.hastaFechaLiquidado = `${añoHasta}-${convertMes}-${diaHasta}`
    }

    if (diaHasta > 0 && diaHasta < 10) {
      convertDia = '0' + diaHasta
      this.liquidationTherapist.hastaFechaLiquidado = `${añoHasta}-${convertMes}-${convertDia}`
    } else {
      this.liquidationTherapist.hastaFechaLiquidado = `${añoHasta}-${convertMes}-${diaHasta}`
    }

    this.serviceLiquidationTherapist.consultTherapist(nombre).subscribe((rp: any) => {
      if (rp.length > 0) {
        añoDesde = rp[0]['hastaFechaLiquidado'].toString().substring(2, 4)
        mesDesde = rp[0]['hastaFechaLiquidado'].toString().substring(5, 7)
        diaDesde = rp[0]['hastaFechaLiquidado'].toString().substring(8, 10)
        this.liquidationTherapist.desdeFechaLiquidado = `${añoDesde}-${mesDesde}-${diaDesde}`
        this.liquidationTherapist.desdeHoraLiquidado = rp[0]['hastaHoraLiquidado']
      } else {
        this.services.getTerapeutaLiqFalse(nombre).subscribe((rp: any) => {
          añoDesde = rp[0]['fechaHoyInicio'].substring(0, 4)
          mesDesde = rp[0]['fechaHoyInicio'].substring(5, 7)
          diaDesde = rp[0]['fechaHoyInicio'].substring(8, 10)
          this.liquidationTherapist.desdeFechaLiquidado = `${añoDesde}-${mesDesde}-${diaDesde}`
          this.liquidationTherapist.desdeHoraLiquidado = rp[0]['horaStart']
        })
      }
    })
  }

  removeTherapist(id: number, nombre: string) {
    this.serviceTherapist.getByIdTerapeuta(id).subscribe((rp: any) => {
      if (rp) {
        Swal.fire({
          title: '¿Deseas eliminar el registro?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Si, Deseo eliminar!',
        }).then((result) => {
          if (result.isConfirmed) {

            debugger

            this.createIdUnicoTherapist()
            this.dateTherapist(nombre)
            this.liquidationTherapist.currentDate = this.currentDate.toString()
            this.liquidationTherapist.terapeuta = nombre

            this.services.getTerapeutaLiqFalse(nombre).subscribe((rp: any) => {
              this.liquidationTherapist.tratamiento = rp.length

              for (let o = 0; o < rp.length; o++) {
                this.services.updateLiquidacionTerap(rp[0]['id'], this.modelService).subscribe((rp: any) => { })
              }
            })

            setTimeout(() => {
              this.serviceLiquidationTherapist.settlementRecord(this.liquidationTherapist).subscribe((datos) => { })
            }, 1000)

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
