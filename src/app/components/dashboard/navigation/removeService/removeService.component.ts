import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'

// Models
import { ModelManager } from 'src/app/core/models/manager'
import { ModelTherapist } from 'src/app/core/models/therapist'

// Service
import { ServiceManager } from 'src/app/core/services/manager'
import { ServiceLiquidationManager } from 'src/app/core/services/managerCloseouts'
import { Service } from 'src/app/core/services/service'
import { ServiceTherapist } from 'src/app/core/services/therapist'
import { ServiceLiquidationTherapist } from 'src/app/core/services/therapistCloseouts'

@Component({
  selector: 'app-removeService',
  templateUrl: './removeService.component.html',
  styleUrls: ['./removeService.component.css']
})
export class RemoveServiceComponent implements OnInit {

  manager: any
  therapist: any
  liqudationTherapist: boolean = false
  data: any
  exist: boolean = false

  managerModel: ModelManager = {
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

  therapistModel: ModelTherapist = {
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

  constructor(
    public router: Router,
    public serviceManager: ServiceManager,
    public serviceTherapist: ServiceTherapist,
    public service: Service,
    public liquidationTherapistService: ServiceLiquidationTherapist,
    public liquidationManagerService: ServiceLiquidationManager
  ) { }

  ngOnInit(): void {
    this.consultTherapists()
    this.consultManager()
  }

  ejemplo(event: any) {
    this.exist = false

    if (event.value == 'service') {
      this.service.getEncargada(this.managerModel.nombre).subscribe((rp: any) => {
        this.data = rp
        this.exist = true
      })
    }

    if (event.value == 'liquidationTherapist') this.liqudationTherapist = true
    else this.liqudationTherapist = false

    if (event.value == 'liquidationManager') {
      this.liquidationManagerService.getByEncargada(this.managerModel.nombre).subscribe((rp: any) => {
        this.data = rp
        this.exist = true
      })
    }
  }

  consultTherapist() {
    if (this.therapistModel.nombre != "") {
      this.liquidationTherapistService.consultTherapistAndManager(this.therapistModel.nombre, this.managerModel.nombre).subscribe((rp: any) => {
        this.data = rp
      })
    }
  }

  consultTherapists() {
    this.serviceTherapist.getAllTerapeuta().subscribe((rp: any) => {
      this.therapist = rp
    })
  }

  consultManager() {
    this.serviceManager.getUsuarios().subscribe((rp: any) => {
      this.manager = rp
    })
  }
}
