import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

// Servicios
import { LoginService } from 'src/app/core/services/login';
import { ServicioService } from 'src/app/core/services/servicio';
import { TrabajadoresService } from 'src/app/core/services/trabajadores';
import { LiquidacioneEncargService } from 'src/app/core/services/liquidacionesEncarg';

@Component({
  selector: 'app-encargados',
  templateUrl: './encargados.component.html',
  styleUrls: ['./encargados.component.css']
})
export class EncargadosComponent implements OnInit {

  liqEncargada: boolean;
  addEncarg: boolean;
  filtredBusqueda: string;
  servicio: any;
  liquidaciones: any;
  page!: number;
  selected: boolean;

  // Encargada
  encargada: any[] = [];
  selectedEncargada: string;

  // Terapeuta
  terapeutaName: any[] = []

  // Fecha
  fechaInicio: string;
  fechaFinal: string;

  // Conversión
  fechaAsc: string;
  fechaDesc: string;
  fechaConvertion = new Date().toISOString().substring(0, 10);
  horaConvertion = new Date().toTimeString().substring(0, 5);
  mostrarFecha: boolean;

  // Servicios
  totalServicio: number;
  totalValorPropina: number;
  totalValorTerapeuta: number;
  TotalValorBebida: number;
  TotalValorTabaco: number;
  totalValorVitaminas: number;
  totalValorOtroServ: number;

  // Comision
  comisionServicio: number;
  comisionPropina: number;
  comisionBebida: number;
  comisionTabaco: number;
  comisionVitamina: number;
  comisionOtros: number;
  sumaComision: number;

  recibidoTerap: any;
  totalComision: number;

  constructor(
    public router: Router,
    public fb: FormBuilder,
    private modalService: NgbModal,
    public loginService: LoginService,
    public trabajadorService: TrabajadoresService,
    public servicioService: ServicioService,
    public liquidacionService: LiquidacioneEncargService,
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
    document.getElementById('idTitulo').innerHTML = 'LIQUIDACIÓNES ENCARGADAS'

    this.liqEncargada = true;
    this.addEncarg = false;
    this.selected = false;
    this.getLiquidaciones();
    this.getServicio();
    this.getEncargada();
    this.tableComision();
  }

  tableComision() {
    if (this.terapeutaName['servicio'] == undefined) this.terapeutaName['servicio'] = 0;
    if (this.terapeutaName['propina'] == undefined) this.terapeutaName['propina'] = 0;
    if (this.terapeutaName['bebida'] == undefined) this.terapeutaName['bebida'] = 0;
    if (this.terapeutaName['tabaco'] == undefined) this.terapeutaName['tabaco'] = 0;
    if (this.terapeutaName['vitamina'] == undefined) this.terapeutaName['vitamina'] = 0;
    if (this.terapeutaName['otros'] == undefined) this.terapeutaName['otros'] = 0;
    if (this.comisionServicio == undefined) this.comisionServicio = 0;
    if (this.comisionPropina == undefined) this.comisionPropina = 0;
    if (this.comisionBebida == undefined) this.comisionBebida = 0;
    if (this.comisionTabaco == undefined) this.comisionTabaco = 0;
    if (this.comisionVitamina == undefined) this.comisionVitamina = 0;
    if (this.comisionOtros == undefined) this.comisionOtros = 0;
    if (this.sumaComision == undefined) this.sumaComision = 0;
    if (this.totalComision == undefined) this.totalComision = 0;
  }

  editamos(id: string) {
    this.router.navigate([`menu/${id}/nuevo-servicio/${id}`,
    ]);
  }

  getLiquidaciones() {
    this.liquidacionService.getLiquidacionesEncargada().subscribe((datoLiquidaciones) => {
      this.liquidaciones = datoLiquidaciones;
    })
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
    this.validate();
    this.addEncarg = true;
  }

  validate() {
    if (this.fechaAsc == undefined) this.fechaAsc = this.fechaConvertion;
    if (this.fechaDesc == undefined) this.fechaDesc = this.fechaConvertion;
  }

  sumaTotalServicios() {
    const totalServ = this.servicio.map(({ servicio }) => servicio).reduce((acc, value) => acc + value);
    this.totalServicio = totalServ;

    const totalValorProp = this.servicio.map(({ propina }) => propina).reduce((acc, value) => acc + value);
    this.totalValorPropina = totalValorProp;

    const totalTera = this.servicio.map(({ numberEncarg }) => numberEncarg).reduce((acc, value) => acc + value);
    this.totalValorTerapeuta = totalTera;

    const totalValorBebida = this.servicio.map(({ bebidas }) => bebidas).reduce((acc, value) => acc + value);
    this.TotalValorBebida = totalValorBebida;

    const totalValorTab = this.servicio.map(({ tabaco }) => tabaco).reduce((acc, value) => acc + value);
    this.TotalValorTabaco = totalValorTab;

    const totalValorVitamina = this.servicio.map(({ vitaminas }) => vitaminas).reduce((acc, value) => acc + value);
    this.totalValorVitaminas = totalValorVitamina;

    const totalValorOtroServicio = this.servicio.map(({ otros }) => otros).reduce((acc, value) => acc + value);
    this.totalValorOtroServ = totalValorOtroServicio;
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
      this.selected = true;

      const condicionEncargada = serv => {
        return (this.selectedEncargada) ? serv.encargada === this.selectedEncargada : true
      }

      const mostrarFech = this.servicio.filter(serv => condicionEncargada(serv))
      if (mostrarFech.length != 0) {
        this.mostrarFecha = true
      } else {
        this.mostrarFecha = false
      }

      this.servicioService.getEncargadaFechaAsc(this.selectedEncargada).then((fechaAsce) => {
        this.fechaAsc = fechaAsce[0]['fechaHoyInicio']
      })

      this.servicioService.getEncargadaFechaDesc(this.selectedEncargada).then((fechaDesce) => {
        this.fechaDesc = fechaDesce[0]['fechaHoyInicio']
      })

      // Filter by servicio
      const servicios = this.servicio.filter(serv => condicionEncargada(serv))
      this.totalServicio = servicios.reduce((accumulator, serv) => {
        return accumulator + serv.servicio;
      }, 0)

      // Filter by Propina
      const propinas = this.servicio.filter(serv => condicionEncargada(serv))
      this.totalValorPropina = propinas.reduce((accumulator, serv) => {
        return accumulator + serv.propina;
      }, 0)

      // Filter by Pago
      const terapeuta = this.servicio.filter(serv => condicionEncargada(serv))
      this.totalValorTerapeuta = terapeuta.reduce((accumulator, serv) => {
        return accumulator + serv.numberEncarg;
      }, 0)

      // Filter by Bebida
      const bebida = this.servicio.filter(serv => condicionEncargada(serv))
      this.TotalValorBebida = bebida.reduce((accumulator, serv) => {
        return accumulator + serv.bebidas;
      }, 0)

      // Filter by Tabaco
      const tabac = this.servicio.filter(serv => condicionEncargada(serv))
      this.TotalValorTabaco = tabac.reduce((accumulator, serv) => {
        return accumulator + serv.tabaco;
      }, 0)

      // Filter by Vitamina
      const vitamina = this.servicio.filter(serv => condicionEncargada(serv))
      this.totalValorVitaminas = vitamina.reduce((accumulator, serv) => {
        return accumulator + serv.vitaminas;
      }, 0)

      // Filter by Vitamina
      const otroServicio = this.servicio.filter(serv => condicionEncargada(serv))
      this.totalValorOtroServ = otroServicio.reduce((accumulator, serv) => {
        return accumulator + serv.otros;
      }, 0)

      let comisiServicio = 0, comiPropina = 0, comiBebida = 0, comiTabaco = 0, comiVitamina = 0, comiOtros = 0, sumComision = 0;
      this.totalComision = 0

      this.trabajadorService.getEncargada(this.selectedEncargada).then((datosNameEncarg) => {
        this.terapeutaName = datosNameEncarg[0]

        // Comision
        comisiServicio = this.totalServicio / 100 * datosNameEncarg[0]['servicio'];
        comiPropina = this.totalValorPropina / 100 * datosNameEncarg[0]['propina'];
        comiBebida = this.TotalValorBebida / 100 * datosNameEncarg[0]['bebida'];
        comiTabaco = this.TotalValorTabaco / 100 * datosNameEncarg[0]['tabaco'];
        comiVitamina = this.totalValorVitaminas / 100 * datosNameEncarg[0]['vitamina'];
        comiOtros = this.totalValorOtroServ / 100 * datosNameEncarg[0]['otros'];

        // Conversion decimal
        this.comisionServicio = Number(comisiServicio.toFixed(1))
        this.comisionPropina = Number(comiPropina.toFixed(1))
        this.comisionBebida = Number(comiBebida.toFixed(1))
        this.comisionTabaco = Number(comiTabaco.toFixed(1))
        this.comisionVitamina = Number(comiVitamina.toFixed(1))
        this.comisionOtros = Number(comiOtros.toFixed(1))

        sumComision = Number(this.comisionServicio) + Number(this.comisionPropina) +
          Number(this.comisionBebida) + Number(this.comisionTabaco) +
          Number(this.comisionVitamina) + Number(this.comisionOtros);

        // return this.sumaComision = sumComision.toFixed(0)
        if (this.sumaComision != 0 || this.sumaComision != undefined) {
          this.sumaComision = Number(sumComision.toFixed(1))
        }

        // Recibido

        const numbTerap = this.servicio.filter(serv => condicionEncargada(serv))
        this.recibidoTerap = numbTerap.reduce((accumulator, serv) => {
          return accumulator + serv.numberEncarg;
        }, 0)

        return this.totalComision = this.sumaComision - Number(this.recibidoTerap)
      })
    }
  }

  guardar() {
    let conteo = 0;
    if (this.selectedEncargada) {
      this.servicioService.getEncargadaNoLiquidada(this.selectedEncargada).then((datos) => {
        for (let index = 0; index < datos.length; index++) {
          conteo = datos.length;
          this.servicioService.updateLiquidacion(datos[index]['idDocument'], datos[index]['id']).then((datos) => {
          })
        }
        this.liquidacionService.registerLiquidacionesEncargada(this.selectedEncargada, this.fechaConvertion, this.horaConvertion, conteo, this.totalComision).then((datos) => {
          this.liqEncargada = true;
          this.addEncarg = false;
          window.location.reload();
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Liquidado Correctamente!',
            showConfirmButton: false,
            timer: 2500,
          });
        })

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