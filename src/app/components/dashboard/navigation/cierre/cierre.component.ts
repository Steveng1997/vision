import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

// Servicios
import { LoginService } from 'src/app/core/services/login';
import { ServicioService } from 'src/app/core/services/servicio';
import { TrabajadoresService } from 'src/app/core/services/trabajadores';
import { CierreService } from 'src/app/core/services/cierre';

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
  cierreTrue = [];

  // Encargada
  encargada: any[] = [];
  selectedEncargada: string;
  encargadaSelect: string;

  // Fecha
  fechaInicio: string;
  fechaFinal: string;

  // Conversión
  fechaAsc: string;
  fechaDesc: string;
  hora: string;
  fechaConvertion = new Date().toISOString().substring(0, 10);
  horaConvertion = new Date().toTimeString().substring(0, 5);
  mostrarFecha: boolean;

  // Pagos
  totalValueServicio: number;
  totalValueEfectivo: number;
  totalValueBizum: number;
  totalValueTarjeta: number;
  totalValueTrans: number;
  ingresoPeriodo: number;

  // Cobros
  totalValuePiso: number;
  totalValuePiso2: number;
  totalValueTerap: number;
  totalValueEncarg: number;
  totalValueOtros: number;

  /* Caja Encargada*/
  cajaEncargEfect: number;
  cajaEncargBizum: number;
  cajaEncargTarj: number;
  cajaEncargTrans: number;

  /* Caja Terapeuta*/
  cajaTerapEfect: number;
  cajaTerapBizum: number;
  cajaTerapTarj: number;
  cajaTerapTrans: number;

  /* Totales caja */

  totalCajaEfectivo: number;
  totalCajaBizu: number;
  totalCajaTarjeta: number;
  totalCajaTransfer: number;
  sumaEfectivo = 0;
  sumaBizum = 0;
  sumaTarjeta = 0;
  sumaTransfe = 0;

  // Periodo
  sumaPeriodo: number;

  // Pagos Periodo
  totalesEfectivo: number;
  totalesBizum: number;
  totalesTarjeta: number;
  totalesTransferencia: number;

  tablas: boolean

  constructor(
    public router: Router,
    private modalService: NgbModal,
    public fb: FormBuilder,
    private servicioService: ServicioService,
    private loginService: LoginService,
    private cierreService: CierreService,
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

    this.tablas = false;
    this.liqEncargada = true;
    this.addCierre = false;

    this.getServicio();
    this.getEncargada();
    this.getCierreTrue();
  }
  editamos(id: string) {
    this.router.navigate([`menu/${id}/nuevo-servicio/${id}`,
    ]);
  }

  getCierreTrue() {
    this.servicioService.geyByCierreTrue().then((datoCierreTrue) => {
      if (datoCierreTrue.length != 0) {
        // Esta linea de codigo hace que no se repita las terapeutas
        let personasMap = datoCierreTrue.map(item => {
          return [item['idUnico'], item]
        });
        var personasMapArr = new Map(personasMap);
        this.cierreTrue = [...personasMapArr.values()];

        if (datoCierreTrue != 0) {
          this.sumaTotalServicios(this.cierreTrue);
        }
      }

    })
  }

  getServicio() {
    this.servicioService.geyByCierreFalse().then((datoServicio) => {
      this.servicio = datoServicio;
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
    this.validate();
    this.liqEncargada = false;
    this.addCierre = true;
  }

  validate() {
    if (this.fechaAsc == undefined) this.fechaAsc = this.fechaConvertion;
    if (this.fechaDesc == undefined) this.fechaDesc = this.fechaConvertion;
    if (this.hora == undefined) this.hora = this.horaConvertion;
  }

  sumaTotalServicios(datoCierreTrue) {
    const totalServ = datoCierreTrue.map(({ totalServicio }) => totalServicio).reduce((acc, value) => acc + value);
    this.totalValueServicio = totalServ;

    const totalEfec = datoCierreTrue.map(({ valueEfectivo }) => valueEfectivo).reduce((acc, value) => acc + value);
    this.totalValueEfectivo = totalEfec;

    const totalBizum = datoCierreTrue.map(({ valueBizum }) => valueBizum).reduce((acc, value) => acc + value);
    this.totalValueBizum = totalBizum;

    const totalTarj = datoCierreTrue.map(({ valueTarjeta }) => valueTarjeta).reduce((acc, value) => acc + value);
    this.totalValueTarjeta = totalTarj;

    const totalTransf = datoCierreTrue.map(({ valueTrans }) => valueTrans).reduce((acc, value) => acc + value);
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
    if (this.selectedEncargada != undefined) {
      this.tablas = true;

      const condicionEncargada = serv => {
        return (this.selectedEncargada) ? serv.encargada === this.selectedEncargada : true
      }

      const mostrarFech = this.servicio.filter(serv => condicionEncargada(serv))
      if (mostrarFech.length != 0) {
        this.mostrarFecha = true
      } else {
        this.mostrarFecha = false
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
        this.totalValueTrans;

      // Filter by Piso
      const piso1 = this.servicio.filter(serv => condicionEncargada(serv))
      this.totalValuePiso = piso1.reduce((accumulator, serv) => {
        return accumulator + serv.numberPiso1;
      }, 0)

      // Filter by Piso 2
      const piso2 = this.servicio.filter(serv => condicionEncargada(serv))
      this.totalValuePiso2 = piso2.reduce((accumulator, serv) => {
        return accumulator + serv.numberPiso2;
      }, 0)

      // Filter by Terapeuta
      const terap = this.servicio.filter(serv => condicionEncargada(serv))
      this.totalValueTerap = terap.reduce((accumulator, serv) => {
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

      // Total Periodo
      this.sumaPeriodo = this.totalValuePiso + this.totalValuePiso2 +
        this.totalValueTerap + this.totalValueEncarg + this.totalValueOtros

      this.servicioService.getEncargadaFechaAsc(this.selectedEncargada).then((fechaAsce) => {
        this.fechaAsc = fechaAsce[0]['fechaHoyInicio']
        this.hora = fechaAsce[0]['horaStart']
      })

      this.servicioService.getEncargadaFechaDesc(this.selectedEncargada).then((fechaDesce) => {
        this.fechaDesc = fechaDesce[0]['fechaHoyInicio']
      })

      // Filter by Total Efectivo
      const totalEfect = this.servicio.filter(serv => condicionEncargada(serv))
      this.totalesEfectivo = totalEfect.reduce((accumulator, serv) => {
        return accumulator + serv.valueEfectivo;
      }, 0)

      // Filter by Total Bizum
      const totalBizum = this.servicio.filter(serv => condicionEncargada(serv))
      this.totalesBizum = totalBizum.reduce((accumulator, serv) => {
        return accumulator + serv.valueBizum;
      }, 0)

      // Filter by Total Tarjeta
      const totalTarjeta = this.servicio.filter(serv => condicionEncargada(serv))
      this.totalesTarjeta = totalTarjeta.reduce((accumulator, serv) => {
        return accumulator + serv.valueTarjeta;
      }, 0)

      // Filter by Total Transferencia
      const totalTransfer = this.servicio.filter(serv => condicionEncargada(serv))
      this.totalesTransferencia = totalTransfer.reduce((accumulator, serv) => {
        return accumulator + serv.valueTrans;
      }, 0)

      // --------------------------------------------------------------------- //
      // Caja - Encargada

      // Filter by Encargada Efectivo
      const totalEncargadaEfect = this.servicio.filter(serv => condicionEncargada(serv))
      this.cajaEncargEfect = totalEncargadaEfect.reduce((accumulator, serv) => {
        return accumulator + serv.valueEfectEncargada;
      }, 0)

      // Filter by Encargada Bizu
      const totalEncargadaBizum = this.servicio.filter(serv => condicionEncargada(serv))
      this.cajaEncargBizum = totalEncargadaBizum.reduce((accumulator, serv) => {
        return accumulator + serv.valueBizuEncargada;
      }, 0)

      // Filter by Encargada Tarjeta
      const totalEncargadaTarjeta = this.servicio.filter(serv => condicionEncargada(serv))
      this.cajaEncargTarj = totalEncargadaTarjeta.reduce((accumulator, serv) => {
        return accumulator + serv.valueTarjeEncargada;
      }, 0)

      // Filter by Encargada Transferencia
      const totalEncargadaTransf = this.servicio.filter(serv => condicionEncargada(serv))
      this.cajaEncargTrans = totalEncargadaTransf.reduce((accumulator, serv) => {
        return accumulator + serv.valueTransEncargada;
      }, 0)



      // --------------------------------------------------------------------- //
      // Caja - Terapeuta

      // Filter by Terapeuta Efectivo
      const totalTerapeutaEfectivo = this.servicio.filter(serv => condicionEncargada(serv))
      this.cajaTerapEfect = totalTerapeutaEfectivo.reduce((accumulator, serv) => {
        return accumulator + serv.valueEfectTerapeuta;
      }, 0)

      // Filter by Terapeuta Bizum
      const totalTerapeutaBizum = this.servicio.filter(serv => condicionEncargada(serv))
      this.cajaTerapBizum = totalTerapeutaBizum.reduce((accumulator, serv) => {
        return accumulator + serv.valueBizuTerapeuta;
      }, 0)

      // Filter by Terapeuta Tarjeta
      const totalTerapeutaTarjeta = this.servicio.filter(serv => condicionEncargada(serv))
      this.cajaTerapTarj = totalTerapeutaTarjeta.reduce((accumulator, serv) => {
        return accumulator + serv.valueTarjeTerapeuta;
      }, 0)

      // Filter by Terapeuta Transferencia
      const totalTerapeutaTransf = this.servicio.filter(serv => condicionEncargada(serv))
      this.cajaTerapTrans = totalTerapeutaTransf.reduce((accumulator, serv) => {
        return accumulator + serv.valueTransTerapeuta;
      }, 0)

      this.sumaEfectivo = Number(this.cajaEncargEfect) + Number(this.cajaTerapEfect);
      this.totalCajaEfectivo = Number(this.totalValueServicio) - this.sumaEfectivo;

      this.sumaBizum = Number(this.cajaEncargBizum) + Number(this.cajaTerapBizum);
      this.totalCajaBizu = Number(this.totalValueServicio) - this.sumaBizum;

      this.sumaTarjeta = Number(this.cajaEncargTarj) + Number(this.cajaTerapTarj);
      this.totalCajaTarjeta = Number(this.totalValueServicio) - this.sumaTarjeta;

      this.sumaTransfe = Number(this.cajaEncargTrans) + Number(this.cajaTerapTrans);
      this.totalCajaTransfer = Number(this.totalValueServicio) - this.sumaTransfe;
    }
  }

  guardar() {
    if (this.selectedEncargada) {
      this.servicioService.getEncargadaNoLiquidada(this.selectedEncargada).then((datos) => {
        for (let index = 0; index < datos.length; index++) {
          this.servicioService.updateCierre(datos[index]['idDocument'], datos[index]['id']).then((datos) => {
            Swal.fire({
              position: 'top-end',
              icon: 'success',
              title: 'Liquidado Correctamente!',
              showConfirmButton: false,
              timer: 2500,
            });
          })
        }


        this.cierreService.registerCierre(this.selectedEncargada, this.fechaConvertion, this.fechaConvertion, this.horaConvertion,
          datos[0]['servicio'], datos[0]['totalServicio'], datos[0]['valueEfectivo'], datos[0]['valueBizum'],
          datos[0]['valueTarjeta'], datos[0]['valueTrans']).then((datos) => { });
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