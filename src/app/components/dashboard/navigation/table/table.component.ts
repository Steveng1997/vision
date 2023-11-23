import { Component, OnInit, ɵbypassSanitizationTrustResourceUrl } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { Service } from 'src/app/core/services/service'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'
import * as XLSX from 'xlsx'
import Swal from 'sweetalert2'

// Service
import { ServiceTherapist } from 'src/app/core/services/therapist'
import { FormBuilder, FormControl, FormGroup } from '@angular/forms'
import { ServiceManager } from 'src/app/core/services/manager'


@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})

export class TableComponent implements OnInit {

  fechaInicio: string
  fechaFinal: string
  filtredBusqueda: string
  page!: number

  // Terapeuta
  terapeuta: any
  selectedTerapeuta: string

  // Encargada
  manager: any
  selectedEncargada: string
  selectedFormPago: string

  servicio: any
  horario: any

  fileName = 'tabla.xlsx'
  idUser: number

  administratorRole: boolean = false

  // Servicios
  totalServicio: number
  totalPiso2: number;
  totalPiso: number
  totalValorTerapeuta: number
  totalValorEncargada: number
  totalValorAOtros: number
  TotalValorBebida: number
  TotalValorTabaco: number
  totalValorVitaminas: number
  totalValorPropina: number
  totalValorOtroServ: number
  totalValor: number


  // Services String
  TotalValueLetter: string
  TotalServiceLetter: string
  TotalFloor1Letter: string
  TotalFloor2Letter: string
  TotalTherapistLetter: string
  TotalManagerLetter: string
  TotalToAnotherLetter: string
  TotalDrinkLetter: string
  TotalTobaccoLetter: string
  TotalVitaminsLetter: string
  TotalTipLetter: string
  TotalOthersLetter: string

  idService: any

  formTemplate = new FormGroup({
    fechaInicio: new FormControl(''),
    FechaFin: new FormControl(''),
    terapeuta: new FormControl(''),
    encargada: new FormControl(''),
    busqueda: new FormControl(''),
    formaPago: new FormControl('')
  })

  constructor(
    public router: Router,
    public serviceTherapist: ServiceTherapist,
    public service: Service,
    public fb: FormBuilder,
    private modalService: NgbModal,
    public serviceManager: ServiceManager,
    private activeRoute: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.selectedTerapeuta = ""
    this.selectedEncargada = ""
    this.selectedFormPago = ""

    const params = this.activeRoute.snapshot.params;
    this.idUser = Number(params['id'])

    if (this.idUser) {
      this.serviceManager.getById(this.idUser).subscribe((rp) => {
        setTimeout(() => {
          if (rp[0]['rol'] == 'administrador') {
            this.administratorRole = true
            this.getManager()
          } else {
            this.manager = rp
            this.selectedEncargada = this.manager[0].nombre
          }
        }, 1000);
      })
    }

    this.getTherapist()
    this.getServices()
    this.emptyTotals()
  }

  emptyTotals() {
    if (this.totalServicio == undefined) this.totalServicio = 0
    if (this.totalPiso == undefined) this.totalPiso = 0
    if (this.totalPiso2 == undefined) this.totalPiso2 = 0
    if (this.totalValorTerapeuta == undefined) this.totalValorTerapeuta = 0
    if (this.totalValorEncargada == undefined) this.totalValorEncargada = 0
    if (this.totalValorAOtros == undefined) this.totalValorAOtros = 0
    if (this.TotalValorBebida == undefined) this.TotalValorBebida = 0
    if (this.TotalValorTabaco == undefined) this.TotalValorTabaco = 0
    if (this.totalValorVitaminas == undefined) this.totalValorVitaminas = 0
    if (this.totalValorPropina == undefined) this.totalValorPropina = 0
    if (this.totalValorOtroServ == undefined) this.totalValorOtroServ = 0
    if (this.totalValor == undefined) this.totalValor = 0
  }

  getServices() {
    this.serviceManager.getById(this.idUser).subscribe((rp) => {
      if (rp[0]['rol'] == 'administrador') {
        this.service.getServicio().subscribe((datoServicio: any) => {
          this.servicio = datoServicio
          if (datoServicio.length != 0) {
            this.totalSumOfServices()
          }

          for (let i = 0; i < this.servicio.length; i++) {
            this.pointThousandTable(i)
          }

        })
      } else {
        this.service.getByManagerOrder(rp[0]['nombre']).subscribe((datoServicio: any) => {
          this.servicio = datoServicio
          if (datoServicio.length != 0) {
            this.totalSumOfServices()
          }
        })
      }
    })
  }

  pointThousandTable(i: number) {
    if (this.servicio[i].numberPiso1 > 0) {

      const coma = this.servicio[i].numberPiso1.toString().indexOf(".") !== -1 ? true : false;
      const array = coma ? this.servicio[i].numberPiso1.toString().split(".") : this.servicio[i].numberPiso1.toString().split("");
      let integer = coma ? array[i].split("") : array;
      let subIndex = 1;

      for (let i = integer.length - 1; i >= 0; i--) {

        if (integer[i] !== "." && subIndex % 3 === 0 && i != 0) {

          integer.splice(i, 0, ".");
          subIndex++;

        } else {
          subIndex++;
        }
      }

      integer = [integer.toString().replace(/,/gi, "")]
      this.servicio[i].numberPiso1 = integer[0].toString()
    } else {
      this.servicio[i].numberPiso1 = this.totalValor.toString()
    }

    if (this.servicio[i].numberPiso2 > 0) {

      const coma = this.servicio[i].numberPiso2.toString().indexOf(".") !== -1 ? true : false;
      const array = coma ? this.servicio[i].numberPiso2.toString().split(".") : this.servicio[i].numberPiso2.toString().split("");
      let integer = coma ? array[i].split("") : array;
      let subIndex = 1;

      for (let i = integer.length - 1; i >= 0; i--) {

        if (integer[i] !== "." && subIndex % 3 === 0 && i != 0) {

          integer.splice(i, 0, ".");
          subIndex++;

        } else {
          subIndex++;
        }
      }

      integer = [integer.toString().replace(/,/gi, "")]
      this.servicio[i].numberPiso2 = integer[0].toString()
    } else {
      this.servicio[i].numberPiso2 = this.servicio[i].numberPiso2.toString()
    }

    if (this.servicio[i].numberTerap > 0) {

      const coma = this.servicio[i].numberTerap.toString().indexOf(".") !== -1 ? true : false;
      const array = coma ? this.servicio[i].numberTerap.toString().split(".") : this.servicio[i].numberTerap.toString().split("");
      let integer = coma ? array[i].split("") : array;
      let subIndex = 1;

      for (let i = integer.length - 1; i >= 0; i--) {

        if (integer[i] !== "." && subIndex % 3 === 0 && i != 0) {

          integer.splice(i, 0, ".");
          subIndex++;

        } else {
          subIndex++;
        }
      }

      integer = [integer.toString().replace(/,/gi, "")]
      this.servicio[i].numberTerap = integer[0].toString()
    } else {
      this.servicio[i].numberTerap = this.servicio[i].numberTerap.toString()
    }

    if (this.servicio[i].numberEncarg > 0) {

      const coma = this.servicio[i].numberEncarg.toString().indexOf(".") !== -1 ? true : false;
      const array = coma ? this.servicio[i].numberEncarg.toString().split(".") : this.servicio[i].numberEncarg.toString().split("");
      let integer = coma ? array[i].split("") : array;
      let subIndex = 1;

      for (let i = integer.length - 1; i >= 0; i--) {

        if (integer[i] !== "." && subIndex % 3 === 0 && i != 0) {

          integer.splice(i, 0, ".");
          subIndex++;

        } else {
          subIndex++;
        }
      }

      integer = [integer.toString().replace(/,/gi, "")]
      this.servicio[i].numberEncarg = integer[0].toString()
    } else {
      this.servicio[i].numberEncarg = this.servicio[i].numberEncarg.toString()
    }

    if (this.servicio[i].numberOtro > 0) {

      const coma = this.servicio[i].numberOtro.toString().indexOf(".") !== -1 ? true : false;
      const array = coma ? this.servicio[i].numberOtro.toString().split(".") : this.servicio[i].numberOtro.toString().split("");
      let integer = coma ? array[i].split("") : array;
      let subIndex = 1;

      for (let i = integer.length - 1; i >= 0; i--) {

        if (integer[i] !== "." && subIndex % 3 === 0 && i != 0) {

          integer.splice(i, 0, ".");
          subIndex++;

        } else {
          subIndex++;
        }
      }

      integer = [integer.toString().replace(/,/gi, "")]
      this.servicio[i].numberOtro = integer[0].toString()
    } else {
      this.servicio[i].numberOtro = this.servicio[i].numberOtro.toString()
    }

    if (this.servicio[i].bebidas > 0) {

      const coma = this.servicio[i].bebidas.toString().indexOf(".") !== -1 ? true : false;
      const array = coma ? this.servicio[i].bebidas.toString().split(".") : this.servicio[i].bebidas.toString().split("");
      let integer = coma ? array[i].split("") : array;
      let subIndex = 1;

      for (let i = integer.length - 1; i >= 0; i--) {

        if (integer[i] !== "." && subIndex % 3 === 0 && i != 0) {

          integer.splice(i, 0, ".");
          subIndex++;

        } else {
          subIndex++;
        }
      }

      integer = [integer.toString().replace(/,/gi, "")]
      this.servicio[i].bebidas = integer[0].toString()
    } else {
      this.servicio[i].bebidas = this.servicio[i].bebidas.toString()
    }

    if (this.servicio[i].tabaco > 0) {

      const coma = this.servicio[i].tabaco.toString().indexOf(".") !== -1 ? true : false;
      const array = coma ? this.servicio[i].tabaco.toString().split(".") : this.servicio[i].tabaco.toString().split("");
      let integer = coma ? array[i].split("") : array;
      let subIndex = 1;

      for (let i = integer.length - 1; i >= 0; i--) {

        if (integer[i] !== "." && subIndex % 3 === 0 && i != 0) {

          integer.splice(i, 0, ".");
          subIndex++;

        } else {
          subIndex++;
        }
      }

      integer = [integer.toString().replace(/,/gi, "")]
      this.servicio[i].tabaco = integer[0].toString()
    } else {
      this.servicio[i].tabaco = this.servicio[i].tabaco.toString()
    }

    if (this.servicio[i].vitaminas > 0) {

      const coma = this.servicio[i].vitaminas.toString().indexOf(".") !== -1 ? true : false;
      const array = coma ? this.servicio[i].vitaminas.toString().split(".") : this.servicio[i].vitaminas.toString().split("");
      let integer = coma ? array[i].split("") : array;
      let subIndex = 1;

      for (let i = integer.length - 1; i >= 0; i--) {

        if (integer[i] !== "." && subIndex % 3 === 0 && i != 0) {

          integer.splice(i, 0, ".");
          subIndex++;

        } else {
          subIndex++;
        }
      }

      integer = [integer.toString().replace(/,/gi, "")]
      this.servicio[i].vitaminas = integer[0].toString()
    } else {
      this.servicio[i].vitaminas = this.servicio[i].vitaminas.toString()
    }

    if (this.servicio[i].propina > 0) {

      const coma = this.servicio[i].propina.toString().indexOf(".") !== -1 ? true : false;
      const array = coma ? this.servicio[i].propina.toString().split(".") : this.servicio[i].propina.toString().split("");
      let integer = coma ? array[i].split("") : array;
      let subIndex = 1;

      for (let i = integer.length - 1; i >= 0; i--) {

        if (integer[i] !== "." && subIndex % 3 === 0 && i != 0) {

          integer.splice(i, 0, ".");
          subIndex++;

        } else {
          subIndex++;
        }
      }

      integer = [integer.toString().replace(/,/gi, "")]
      this.servicio[i].propina = integer[0].toString()
    } else {
      this.servicio[i].propina = this.servicio[i].propina.toString()
    }

    if (this.servicio[i].otros > 0) {

      const coma = this.servicio[i].otros.toString().indexOf(".") !== -1 ? true : false;
      const array = coma ? this.servicio[i].otros.toString().split(".") : this.servicio[i].otros.toString().split("");
      let integer = coma ? array[i].split("") : array;
      let subIndex = 1;

      for (let i = integer.length - 1; i >= 0; i--) {

        if (integer[i] !== "." && subIndex % 3 === 0 && i != 0) {

          integer.splice(i, 0, ".");
          subIndex++;

        } else {
          subIndex++;
        }
      }

      integer = [integer.toString().replace(/,/gi, "")]
      this.servicio[i].otros = integer[0].toString()
    } else {
      this.servicio[i].otros = this.servicio[i].otros.toString()
    }

    if (this.servicio[i].totalServicio > 0) {

      const coma = this.servicio[i].totalServicio.toString().indexOf(".") !== -1 ? true : false;
      const array = coma ? this.servicio[i].totalServicio.toString().split(".") : this.servicio[i].totalServicio.toString().split("");
      let integer = coma ? array[i].split("") : array;
      let subIndex = 1;

      for (let i = integer.length - 1; i >= 0; i--) {

        if (integer[i] !== "." && subIndex % 3 === 0 && i != 0) {

          integer.splice(i, 0, ".");
          subIndex++;

        } else {
          subIndex++;
        }
      }

      integer = [integer.toString().replace(/,/gi, "")]
      this.servicio[i].totalServicio = integer[0].toString()
    } else {
      this.servicio[i].totalServicio = this.servicio[i].totalServicio.toString()
    }

    if (this.servicio[i].servicio > 0) {

      const coma = this.servicio[i].servicio.toString().indexOf(".") !== -1 ? true : false;
      const array = coma ? this.servicio[i].servicio.toString().split(".") : this.servicio[i].servicio.toString().split("");
      let integer = coma ? array[i].split("") : array;
      let subIndex = 1;

      for (let i = integer.length - 1; i >= 0; i--) {

        if (integer[i] !== "." && subIndex % 3 === 0 && i != 0) {

          integer.splice(i, 0, ".");
          subIndex++;

        } else {
          subIndex++;
        }
      }

      integer = [integer.toString().replace(/,/gi, "")]
      this.servicio[i].servicio = integer[0].toString()
    } else {
      this.servicio[i].servicio = this.servicio[i].servicio.toString()
    }
  }

  filters() {
    this.filtredBusqueda = this.formTemplate.value.busqueda.replace(/(^\w{1})|(\s+\w{1})/g, letra => letra.toUpperCase())

    if (this.formTemplate.value.fechaInicio != "") {
      let mes = '', dia = '', año = '', fecha = ''
      fecha = this.formTemplate.value.fechaInicio
      dia = fecha.substring(8, 11)
      mes = fecha.substring(5, 7)
      año = fecha.substring(2, 4)
      this.fechaInicio = `${dia}-${mes}-${año}`
    }

    if (this.formTemplate.value.FechaFin != "") {
      let mesFin = '', diaFin = '', añoFin = '', fechaFin = ''
      fechaFin = this.formTemplate.value.FechaFin
      diaFin = fechaFin.substring(8, 11)
      mesFin = fechaFin.substring(5, 7)
      añoFin = fechaFin.substring(2, 4)
      this.fechaFinal = `${diaFin}-${mesFin}-${añoFin}`
    }

    this.serviceManager.getById(this.idUser).subscribe((rp) => {
      if (rp[0]['rol'] == 'administrador') {

        if (this.selectedTerapeuta != "" || this.selectedEncargada != "" ||
          this.formTemplate.value.fechaInicio || this.formTemplate.value.FechaFin != "") {
          (document.getElementById('buttonDelete') as HTMLButtonElement).disabled = false;
        } else {
          (document.getElementById('buttonDelete') as HTMLButtonElement).disabled = true;
        }
      }
    })

    if (this.selectedFormPago != '') {
      if (!this.PaymentForm()) return
    }

    this.calculateSumOfServices()
  }

  PaymentForm() {
    this.service.getPaymentForm(this.selectedFormPago).subscribe((rp) => {
      this.servicio = rp
      return true
    })
    return false
  }

  calculateSumOfServices() {

    const therapistCondition = serv => {
      return (this.selectedTerapeuta) ? serv.terapeuta === this.selectedTerapeuta : true
    }

    const managerCondition = serv => {
      return (this.selectedEncargada) ? serv.encargada === this.selectedEncargada : true
    }

    const conditionBetweenDates = serv => {
      if (this.fechaInicio === undefined && this.fechaFinal === undefined) return true
      if (this.fechaInicio === undefined && serv.fecha <= this.fechaFinal) return true
      if (this.fechaFinal === undefined && serv.fecha === this.fechaInicio) return true
      if (serv.fecha >= this.fechaInicio && serv.fecha <= this.fechaFinal) return true

      return false
    }

    const searchCondition = serv => {
      if (!this.filtredBusqueda) return true
      const criterio = this.filtredBusqueda
      return (serv.terapeuta.match(criterio)
        || serv.encargada.match(criterio)
        || serv.formaPago.match(criterio)
        || serv.fecha.match(criterio)
        || serv.cliente.match(criterio)) ? true : false
    }

    // Filter by Servicio
    if (Array.isArray(this.servicio)) {
      const servicios = this.servicio.filter(serv => therapistCondition(serv)
        && managerCondition(serv) && searchCondition(serv) && conditionBetweenDates(serv))
      this.totalServicio = servicios.reduce((accumulator, serv) => {
        return accumulator + serv.servicio
      }, 0)


      // Filter by Pisos
      const pisoss = this.servicio.filter(serv => therapistCondition(serv)
        && managerCondition(serv) && searchCondition(serv) && conditionBetweenDates(serv))
      this.totalPiso = pisoss.reduce((accumulator, serv) => {
        return accumulator + serv.numberPiso1
      }, 0)

      // Filter by Pisos
      const pisos2 = this.servicio.filter(serv => therapistCondition(serv)
        && managerCondition(serv) && searchCondition(serv) && conditionBetweenDates(serv))
      this.totalPiso2 = pisos2.reduce((accumulator, serv) => {
        return accumulator + serv.numberPiso2
      }, 0)

      // Filter by Terapeuta
      const terapeuta = this.servicio.filter(serv => therapistCondition(serv)
        && managerCondition(serv) && searchCondition(serv) && conditionBetweenDates(serv))
      this.totalValorTerapeuta = terapeuta.reduce((accumulator, serv) => {
        return accumulator + serv.numberTerap
      }, 0)

      // Filter by Encargada
      const encargada = this.servicio.filter(serv => therapistCondition(serv)
        && managerCondition(serv) && searchCondition(serv) && conditionBetweenDates(serv))
      this.totalValorEncargada = encargada.reduce((accumulator, serv) => {
        return accumulator + serv.numberEncarg
      }, 0)

      // Filter by Valor Otro
      const valorOtro = this.servicio.filter(serv => therapistCondition(serv)
        && managerCondition(serv) && searchCondition(serv) && conditionBetweenDates(serv))
      this.totalValorAOtros = valorOtro.reduce((accumulator, serv) => {
        return accumulator + serv.numberOtro
      }, 0)

      // Filter by Valor Bebida
      const valorBebida = this.servicio.filter(serv => therapistCondition(serv)
        && managerCondition(serv) && searchCondition(serv) && conditionBetweenDates(serv))
      this.TotalValorBebida = valorBebida.reduce((accumulator, serv) => {
        return accumulator + serv.bebidas
      }, 0)

      // Filter by Valor Tabaco
      const valorTabaco = this.servicio.filter(serv => therapistCondition(serv)
        && managerCondition(serv) && searchCondition(serv) && conditionBetweenDates(serv))
      this.TotalValorTabaco = valorTabaco.reduce((accumulator, serv) => {
        return accumulator + serv.tabaco
      }, 0)

      // Filter by Valor Vitamina
      const valorVitamina = this.servicio.filter(serv => therapistCondition(serv)
        && managerCondition(serv) && searchCondition(serv) && conditionBetweenDates(serv))
      this.totalValorVitaminas = valorVitamina.reduce((accumulator, serv) => {
        return accumulator + serv.vitaminas
      }, 0)

      // Filter by Valor Propina
      const valorPropina = this.servicio.filter(serv => therapistCondition(serv)
        && managerCondition(serv) && searchCondition(serv) && conditionBetweenDates(serv))
      this.totalValorPropina = valorPropina.reduce((accumulator, serv) => {
        return accumulator + serv.propina
      }, 0)

      // Filter by Valor Total
      const valorTotal = this.servicio.filter(serv => therapistCondition(serv)
        && managerCondition(serv) && searchCondition(serv) && conditionBetweenDates(serv))
      this.totalValor = valorTotal.reduce((accumulator, serv) => {
        this.idService = valorTotal
        return accumulator + serv.totalServicio
      }, 0)

      // Filter by Valor Propina
      const valorOtros = this.servicio.filter(serv => therapistCondition(serv)
        && managerCondition(serv) && searchCondition(serv) && conditionBetweenDates(serv))
      this.totalValorOtroServ = valorOtros.reduce((accumulator, serv) => {
        return accumulator + serv.otros
      }, 0)
    }

    this.thousandPoint()
  }

  thousandPoint() {
    if (this.totalValor > 0) {

      const coma = this.totalValor.toString().indexOf(".") !== -1 ? true : false;
      const array = coma ? this.totalValor.toString().split(".") : this.totalValor.toString().split("");
      let integer = coma ? array[0].split("") : array;
      let subIndex = 1;

      for (let i = integer.length - 1; i >= 0; i--) {

        if (integer[i] !== "." && subIndex % 3 === 0 && i != 0) {

          integer.splice(i, 0, ".");
          subIndex++;

        } else {
          subIndex++;
        }
      }

      integer = [integer.toString().replace(/,/gi, "")]
      this.TotalValueLetter = integer[0].toString()
    } else {
      this.TotalValueLetter = this.totalValor.toString()
    }

    if (this.totalServicio > 0) {
      const coma = this.totalValor.toString().indexOf(".") !== -1 ? true : false;
      const array = coma ? this.totalServicio.toString().split(".") : this.totalServicio.toString().split("");
      let integer = coma ? array[0].split("") : array;
      let subIndex = 1;

      for (let i = integer.length - 1; i >= 0; i--) {

        if (integer[i] !== "." && subIndex % 3 === 0 && i != 0) {

          integer.splice(i, 0, ".");
          subIndex++;

        } else {
          subIndex++;
        }
      }

      integer = [integer.toString().replace(/,/gi, "")]
      this.TotalServiceLetter = integer[0].toString()
    } else {
      this.TotalServiceLetter = this.totalServicio.toString()
    }

    if (this.totalPiso > 0) {
      const coma = this.totalValor.toString().indexOf(".") !== -1 ? true : false;
      const array = coma ? this.totalPiso.toString().split(".") : this.totalPiso.toString().split("");
      let integer = coma ? array[0].split("") : array;
      let subIndex = 1;

      for (let i = integer.length - 1; i >= 0; i--) {

        if (integer[i] !== "." && subIndex % 3 === 0 && i != 0) {

          integer.splice(i, 0, ".");
          subIndex++;

        } else {
          subIndex++;
        }
      }

      integer = [integer.toString().replace(/,/gi, "")]
      this.TotalFloor1Letter = integer[0].toString()
    } else {
      this.TotalFloor1Letter = this.totalPiso.toString()
    }

    if (this.totalPiso2 > 0) {
      const coma = this.totalValor.toString().indexOf(".") !== -1 ? true : false;
      const array = coma ? this.totalPiso2.toString().split(".") : this.totalPiso2.toString().split("");
      let integer = coma ? array[0].split("") : array;
      let subIndex = 1;

      for (let i = integer.length - 1; i >= 0; i--) {

        if (integer[i] !== "." && subIndex % 3 === 0 && i != 0) {

          integer.splice(i, 0, ".");
          subIndex++;

        } else {
          subIndex++;
        }
      }

      integer = [integer.toString().replace(/,/gi, "")]
      this.TotalFloor2Letter = integer[0].toString()
    } else {
      this.TotalFloor2Letter = this.totalPiso2.toString()
    }

    if (this.totalValorTerapeuta > 0) {
      const coma = this.totalValor.toString().indexOf(".") !== -1 ? true : false;
      const array = coma ? this.totalValorTerapeuta.toString().split(".") : this.totalValorTerapeuta.toString().split("");
      let integer = coma ? array[0].split("") : array;
      let subIndex = 1;

      for (let i = integer.length - 1; i >= 0; i--) {

        if (integer[i] !== "." && subIndex % 3 === 0 && i != 0) {

          integer.splice(i, 0, ".");
          subIndex++;

        } else {
          subIndex++;
        }
      }

      integer = [integer.toString().replace(/,/gi, "")]
      this.TotalTherapistLetter = integer[0].toString()
    } else {
      this.TotalTherapistLetter = this.totalValorTerapeuta.toString()
    }

    if (this.totalValorEncargada > 0) {
      const coma = this.totalValor.toString().indexOf(".") !== -1 ? true : false;
      const array = coma ? this.totalValorEncargada.toString().split(".") : this.totalValorEncargada.toString().split("");
      let integer = coma ? array[0].split("") : array;
      let subIndex = 1;

      for (let i = integer.length - 1; i >= 0; i--) {

        if (integer[i] !== "." && subIndex % 3 === 0 && i != 0) {

          integer.splice(i, 0, ".");
          subIndex++;

        } else {
          subIndex++;
        }
      }

      integer = [integer.toString().replace(/,/gi, "")]
      this.TotalManagerLetter = integer[0].toString()
    } else {
      this.TotalManagerLetter = this.totalValorEncargada.toString()
    }

    if (this.totalValorAOtros > 0) {
      const coma = this.totalValor.toString().indexOf(".") !== -1 ? true : false;
      const array = coma ? this.totalValorAOtros.toString().split(".") : this.totalValorAOtros.toString().split("");
      let integer = coma ? array[0].split("") : array;
      let subIndex = 1;

      for (let i = integer.length - 1; i >= 0; i--) {

        if (integer[i] !== "." && subIndex % 3 === 0 && i != 0) {

          integer.splice(i, 0, ".");
          subIndex++;

        } else {
          subIndex++;
        }
      }

      integer = [integer.toString().replace(/,/gi, "")]
      this.TotalToAnotherLetter = integer[0].toString()
    } else {
      this.TotalToAnotherLetter = this.totalValorAOtros.toString()
    }

    if (this.totalValorAOtros > 0) {
      const coma = this.totalValor.toString().indexOf(".") !== -1 ? true : false;
      const array = coma ? this.totalValorAOtros.toString().split(".") : this.totalValorAOtros.toString().split("");
      let integer = coma ? array[0].split("") : array;
      let subIndex = 1;

      for (let i = integer.length - 1; i >= 0; i--) {

        if (integer[i] !== "." && subIndex % 3 === 0 && i != 0) {

          integer.splice(i, 0, ".");
          subIndex++;

        } else {
          subIndex++;
        }
      }

      integer = [integer.toString().replace(/,/gi, "")]
      this.TotalToAnotherLetter = integer[0].toString()
    } else {
      this.TotalToAnotherLetter = this.totalValorAOtros.toString()
    }

    if (this.TotalValorBebida > 0) {
      const coma = this.totalValor.toString().indexOf(".") !== -1 ? true : false;
      const array = coma ? this.TotalValorBebida.toString().split(".") : this.TotalValorBebida.toString().split("");
      let integer = coma ? array[0].split("") : array;
      let subIndex = 1;

      for (let i = integer.length - 1; i >= 0; i--) {

        if (integer[i] !== "." && subIndex % 3 === 0 && i != 0) {

          integer.splice(i, 0, ".");
          subIndex++;

        } else {
          subIndex++;
        }
      }

      integer = [integer.toString().replace(/,/gi, "")]
      this.TotalDrinkLetter = integer[0].toString()
    } else {
      this.TotalDrinkLetter = this.TotalValorBebida.toString()
    }

    if (this.TotalValorTabaco > 0) {
      const coma = this.totalValor.toString().indexOf(".") !== -1 ? true : false;
      const array = coma ? this.TotalValorTabaco.toString().split(".") : this.TotalValorTabaco.toString().split("");
      let integer = coma ? array[0].split("") : array;
      let subIndex = 1;

      for (let i = integer.length - 1; i >= 0; i--) {

        if (integer[i] !== "." && subIndex % 3 === 0 && i != 0) {

          integer.splice(i, 0, ".");
          subIndex++;

        } else {
          subIndex++;
        }
      }

      integer = [integer.toString().replace(/,/gi, "")]
      this.TotalTobaccoLetter = integer[0].toString()
    } else {
      this.TotalTobaccoLetter = this.TotalValorTabaco.toString()
    }

    if (this.totalValorVitaminas > 0) {
      const coma = this.totalValor.toString().indexOf(".") !== -1 ? true : false;
      const array = coma ? this.totalValorVitaminas.toString().split(".") : this.totalValorVitaminas.toString().split("");
      let integer = coma ? array[0].split("") : array;
      let subIndex = 1;

      for (let i = integer.length - 1; i >= 0; i--) {

        if (integer[i] !== "." && subIndex % 3 === 0 && i != 0) {

          integer.splice(i, 0, ".");
          subIndex++;

        } else {
          subIndex++;
        }
      }

      integer = [integer.toString().replace(/,/gi, "")]
      this.TotalVitaminsLetter = integer[0].toString()
    } else {
      this.TotalVitaminsLetter = this.totalValorVitaminas.toString()
    }

    if (this.totalValorPropina > 0) {
      const coma = this.totalValor.toString().indexOf(".") !== -1 ? true : false;
      const array = coma ? this.totalValorPropina.toString().split(".") : this.totalValorPropina.toString().split("");
      let integer = coma ? array[0].split("") : array;
      let subIndex = 1;

      for (let i = integer.length - 1; i >= 0; i--) {

        if (integer[i] !== "." && subIndex % 3 === 0 && i != 0) {

          integer.splice(i, 0, ".");
          subIndex++;

        } else {
          subIndex++;
        }
      }

      integer = [integer.toString().replace(/,/gi, "")]
      this.TotalTipLetter = integer[0].toString()
    } else {
      this.TotalTipLetter = this.totalValorPropina.toString()
    }

    if (this.totalValorOtroServ > 0) {
      const coma = this.totalValor.toString().indexOf(".") !== -1 ? true : false;
      const array = coma ? this.totalValorOtroServ.toString().split(".") : this.totalValorOtroServ.toString().split("");
      let integer = coma ? array[0].split("") : array;
      let subIndex = 1;

      for (let i = integer.length - 1; i >= 0; i--) {

        if (integer[i] !== "." && subIndex % 3 === 0 && i != 0) {

          integer.splice(i, 0, ".");
          subIndex++;

        } else {
          subIndex++;
        }
      }

      integer = [integer.toString().replace(/,/gi, "")]
      this.TotalOthersLetter = integer[0].toString()
    } else {
      this.TotalOthersLetter = this.totalValorOtroServ.toString()
    }
  }

  totalSumOfServices() {
    const totalServ = this.servicio.map(({ servicio }) => servicio).reduce((acc, value) => acc + value, 0)
    this.totalServicio = totalServ

    const totalPisos = this.servicio.map(({ numberPiso1 }) => numberPiso1).reduce((acc, value) => acc + value, 0)
    this.totalPiso = totalPisos

    const totalPisos2 = this.servicio.map(({ numberPiso2 }) => numberPiso2).reduce((acc, value) => acc + value, 0)
    this.totalPiso2 = totalPisos2

    const totalTera = this.servicio.map(({ numberTerap }) => numberTerap).reduce((acc, value) => acc + value, 0)
    this.totalValorTerapeuta = totalTera

    const totalEncarg = this.servicio.map(({ numberEncarg }) => numberEncarg).reduce((acc, value) => acc + value, 0)
    this.totalValorEncargada = totalEncarg

    const totalOtr = this.servicio.map(({ numberOtro }) => numberOtro).reduce((acc, value) => acc + value, 0)
    this.totalValorAOtros = totalOtr

    const totalValorBebida = this.servicio.map(({ bebidas }) => bebidas).reduce((acc, value) => acc + value, 0)
    this.TotalValorBebida = totalValorBebida

    const totalValorTab = this.servicio.map(({ tabaco }) => tabaco).reduce((acc, value) => acc + value, 0)
    this.TotalValorTabaco = totalValorTab

    const totalValorVitamina = this.servicio.map(({ vitaminas }) => vitaminas).reduce((acc, value) => acc + value, 0)
    this.totalValorVitaminas = totalValorVitamina

    const totalValorProp = this.servicio.map(({ propina }) => propina).reduce((acc, value) => acc + value, 0)
    this.totalValorPropina = totalValorProp

    const totalValorOtroServicio = this.servicio.map(({ otros }) => otros).reduce((acc, value) => acc + value, 0)
    this.totalValorOtroServ = totalValorOtroServicio

    const totalvalors = this.servicio.map(({ totalServicio }) => totalServicio).reduce((acc, value) => acc + value, 0)
    this.totalValor = totalvalors

    this.thousandPoint()
  }

  getTherapist() {
    this.serviceTherapist.getAllTerapeuta().subscribe((datosTerapeuta) => {
      this.terapeuta = datosTerapeuta
    })
  }

  getManager() {
    this.serviceManager.getUsuarios().subscribe((datosEncargada) => {
      this.manager = datosEncargada
    })
  }

  notes(targetModal, modal) {
    var notaMensaje = []
    this.service.getById(targetModal).subscribe((rp) => {
      notaMensaje = rp[0]

      if (notaMensaje['nota'] != '')
        this.modalService.open(modal, {
          centered: true,
          backdrop: 'static',
        })
    })
  }

  exportExcel() {
    let element = document.getElementById('excel-table')
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element)
    const wb: XLSX.WorkBook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1')
    XLSX.writeFile(wb, this.fileName)
  }

  editForm(id: string) {
    this.router.navigate([`menu/${this.idUser}/nuevo-servicio/${id}/true`])
  }

  deleteService() {
    Swal.fire({
      title: '¿Deseas eliminar el registro?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Deseo eliminar!'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: '¿Estas seguro de eliminar?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Si, Deseo eliminar!'
        }).then((result) => {
          this.serviceTherapist.getTerapeuta(this.idService[0]['terapeuta']).subscribe((rp: any) => {
            this.serviceTherapist.updateHoraAndSalida(rp[0].nombre, rp[0]).subscribe((rp: any) => { })
          })

          for (let i = 0; this.idService.length; i++) {
            this.service.deleteServicio(this.idService[i].id).subscribe((rp: any) => {
              this.getServices()
            })
          }

          Swal.fire({ position: 'top-end', icon: 'success', title: '¡Eliminado Correctamente!', showConfirmButton: false, timer: 2500 })
        })
      }
    })
  }
}