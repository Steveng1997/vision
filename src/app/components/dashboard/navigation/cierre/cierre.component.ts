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
  addCierre: boolean;
  filtredBusqueda: string;
  servicio: any;
  page!: number;

  // Encargada
  encargada: any[] = [];
  selectedEncargada: string;

  // Fecha
  fechaInicio: string;
  fechaFinal: string;

  // Pagos
  totalValueServicio: number;
  totalValueEfectivo: number;
  totalValueBizum: number;
  totalValueTarjeta: number;
  totalValueTrans: number;
  ingresoPeriodo: number;

  // Cobros
  totalValuePiso: number;
  totalValueTerap: number;
  totalValueEncarg: number;
  totalValueOtros: number;

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
    this.addCierre = false;
    this.getServicio();
    this.getEncargada();
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
    this.addCierre = true
  }

  sumaTotalServicios() {
    const totalServ = this.servicio.map(({ totalServicio }) => totalServicio).reduce((acc, value) => acc + value);
    this.totalValueServicio = totalServ;

    const totalEfec = this.servicio.map(({ valueEfectivo }) => valueEfectivo).reduce((acc, value) => acc + value);
    this.totalValueEfectivo = totalEfec;

    const totalBizum = this.servicio.map(({ valueBizum }) => valueBizum).reduce((acc, value) => acc + value);
    this.totalValueBizum = totalBizum;

    const totalTarj = this.servicio.map(({ valueTarjeta }) => valueTarjeta).reduce((acc, value) => acc + value);
    this.totalValueTarjeta = totalTarj;

    const totalTransf = this.servicio.map(({ valueTrans }) => valueTrans).reduce((acc, value) => acc + value);
    this.totalValueTrans = totalTransf;
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

  calcularSumaDeServicios() {
    const condicionEncargada = serv => {
      return (this.selectedEncargada) ? serv.encargada === this.selectedEncargada : true
    }

    // Filter by totalCobros
    const total = this.servicio.filter(serv => condicionEncargada(serv))
    this.totalValueServicio = total.reduce((accumulator, serv) => {
      return accumulator + serv.totalServicio;
    }, 0)

    // Filter by totalEfectivo
    const efect = this.servicio.filter(serv => condicionEncargada(serv))
    this.totalValueEfectivo = efect.reduce((accumulator, serv) => {
      return accumulator + serv.valueEfectivo;
    }, 0)

    // Filter by totalBizum
    const bizu = this.servicio.filter(serv => condicionEncargada(serv))
    this.totalValueBizum = bizu.reduce((accumulator, serv) => {
      return accumulator + serv.valueBizum;
    }, 0)

    // Filter by totalTarjeta
    const tarjeta = this.servicio.filter(serv => condicionEncargada(serv))
    this.totalValueTarjeta = tarjeta.reduce((accumulator, serv) => {
      return accumulator + serv.valueTarjeta;
    }, 0)

    // Filter by totalTransferencia
    const transfe = this.servicio.filter(serv => condicionEncargada(serv))
    this.totalValueTrans = transfe.reduce((accumulator, serv) => {
      return accumulator + serv.valueTrans;
    }, 0)

    this.ingresoPeriodo = this.totalValueEfectivo + this.totalValueBizum + this.totalValueTarjeta +
      this.totalValueTrans

    // Filter by Piso
    const terap = this.servicio.filter(serv => condicionEncargada(serv))
    this.totalValuePiso = terap.reduce((accumulator, serv) => {
      return accumulator + serv.numberPiso1;
    }, 0)

    // Filter by Terapeuta
    const piso1 = this.servicio.filter(serv => condicionEncargada(serv))
    this.totalValueTerap = piso1.reduce((accumulator, serv) => {
      return accumulator + serv.numberTerap;
    }, 0)

    // Filter by Encargada
    const encarg = this.servicio.filter(serv => condicionEncargada(serv))
    this.totalValueEncarg = encarg.reduce((accumulator, serv) => {
      return accumulator + serv.numberEncarg;
    }, 0)

    // Filter by Otro
    const otros = this.servicio.filter(serv => condicionEncargada(serv))
    this.totalValueOtros = otros.reduce((accumulator, serv) => {
      return accumulator + serv.numberOtro;
    }, 0)
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