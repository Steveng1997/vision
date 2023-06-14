import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

// Servicios
import { LoginService } from 'src/app/core/services/login';
import { ServicioService } from 'src/app/core/services/servicio';
import { TrabajadoresService } from 'src/app/core/services/trabajadores';

@Component({
  selector: 'app-cierre',
  templateUrl: './cierre.component.html',
  styleUrls: ['./cierre.component.css']
})
export class CierreComponent implements OnInit {

  liqEncargada: boolean;
  addEncarg: boolean;
  filtredBusqueda: string;
  servicio: any;
  page!: number;

  // Encargada
  encargada: any[] = [];
  selectedEncargada: string;

  // Terapeuta
  terapeutaName: any[] = []

  // Fecha
  fechaInicio: string;
  fechaFinal: string;

  // Servicios
  totalValueServicio: number;
  totalValueEfectivo: number;
  totalValueBizum: number;
  totalValueTarjeta: number;
  totalValueTrans: number;

  recibidoTerap: any;
  totalComision: number;

  constructor(
    public router: Router,
    public trabajadorService: TrabajadoresService,
    public servicioService: ServicioService,
    public fb: FormBuilder,
    public loginService: LoginService,
    private modalService: NgbModal,
  ) { }

  formTemplate = new FormGroup({
    fechaInicio: new FormControl(''),
    FechaFin: new FormControl(''),
    terapeuta: new FormControl(''),
    encargada: new FormControl(''),
    busqueda: new FormControl(''),
  });

  ngOnInit(): void {
    document.getElementById('idTitulo').style.display = 'block'
    document.getElementById('idTitulo').innerHTML = 'CIERRE'

    this.liqEncargada = true;
    this.addEncarg = false;
    this.getServicio();
    this.getEncargada();
    this.tableComision();
  }

  tableComision() {
    if (this.terapeutaName['totalServicio'] == undefined) this.terapeutaName['totalServicio'] = 0;
    if (this.terapeutaName['valueEfectivo'] == undefined) this.terapeutaName['valueEfectivo'] = 0;
    if (this.terapeutaName['valueBizum'] == undefined) this.terapeutaName['valueBizum'] = 0;
    if (this.terapeutaName['valueTarjeta'] == undefined) this.terapeutaName['valueTarjeta'] = 0;
    if (this.terapeutaName['valueTrans'] == undefined) this.terapeutaName['valueTrans'] = 0;
    if (this.totalValueServicio == undefined) this.totalValueServicio = 0;
    if (this.totalValueEfectivo == undefined) this.totalValueEfectivo = 0;
    if (this.totalValueBizum == undefined) this.totalValueBizum = 0;
    if (this.totalValueTarjeta == undefined) this.totalValueTarjeta = 0;
    if (this.totalValueTrans == undefined) this.totalValueTrans = 0;
  }

  editamos(id: string) {
    this.router.navigate([`menu/${id}/nuevo-servicio/${id}`,
    ]);
  }

  getServicio() {
    this.servicioService.getByLiquidFalse().subscribe((datoServicio) => {
      this.servicio = datoServicio;
      if (datoServicio.length != 0) {
        this.sumaTotalServicios();
      }
    })
  }

  getEncargada() {
    this.loginService.getUsuarios().subscribe((datosEncargada) => {
      this.encargada = datosEncargada;
    });
  }

  dateStart(event: any) {
    this.fechaInicio = event.target.value;
  }

  dateEnd(event: any) {
    this.fechaFinal = event.target.value
  }

  busqueda(event: any) {
    this.filtredBusqueda = event.replace(/(^\w{1})|(\s+\w{1})/g, letra => letra);
  }

  addLiquidacion() {
    this.liqEncargada = false;
    this.addEncarg = true
    this.pagos();
  }

  sumaTotalServicios() {
    const totalServ = this.servicio.map(({ totalServicio }) => totalServicio).reduce((acc, value) => acc + value);
    this.totalValueServicio = totalServ;

    const totalValorProp = this.servicio.map(({ valueEfectivo }) => valueEfectivo).reduce((acc, value) => acc + value);
    this.totalValueEfectivo = totalValorProp;

    const totalTera = this.servicio.map(({ valueBizum }) => valueBizum).reduce((acc, value) => acc + value);
    this.totalValueBizum = totalTera;

    const totalValorBebida = this.servicio.map(({ valueTarjeta }) => valueTarjeta).reduce((acc, value) => acc + value);
    this.totalValueTarjeta = totalValorBebida;

    const totalValorTab = this.servicio.map(({ valueTrans }) => valueTrans).reduce((acc, value) => acc + value);
    this.totalValueTrans = totalValorTab;
  }

  notas(targetModal, modal) {
    var notaMensaje = [];
    this.servicioService.getById(targetModal).then((datoServicio) => {
      notaMensaje = datoServicio[0];

      if (notaMensaje['nota'] != '')
        this.modalService.open(modal, {
          centered: true,
          backdrop: 'static',
        });
    });
  }

  pagos() {
    this.totalValueEfectivo = Number(this.servicio[0]['valueEfectivo']) - 100;
  }

  guardar() {
    if (this.selectedEncargada) {
      this.servicioService.getEncargadaNoLiquidada(this.selectedEncargada).then((datos) => {
        for (let index = 0; index < datos.length; index++) {
          this.servicioService.updateLiquidacion(datos[index]['idDocument'], datos[index]['id']).then((datos) => {
            Swal.fire({
              position: 'top-end',
              icon: 'success',
              title: 'Liquidado Correctamente!',
              showConfirmButton: false,
              timer: 2500,
            });
          })
        }
      })
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'No hay ninguna encargada seleccionada',
        showConfirmButton: false,
        timer: 2500,
      });
    }
  }
}