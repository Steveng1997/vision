import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { Service } from 'src/app/core/services/service'

// Services
import { ServiceManager } from 'src/app/core/services/manager'
import { ServiceTherapist } from 'src/app/core/services/therapist'

// Models
import { ModelTherapist } from 'src/app/core/models/therapist'

@Component({
  selector: 'app-vision',
  templateUrl: './vision.component.html',
  styleUrls: ['./vision.component.css']
})

export class VisionComponent implements OnInit {

  vision: any
  page!: number
  fechaDiaHoy = ''
  totalServicio: number
  idUser: number
  therapist: any
  horaEnd: string
  horaHoy: string
  diferenceMinuto: string

  // TOTALES
  totalVision: number
  totalBebida: number
  totalTobaccoo: number
  totalVitamina: number
  totalTipa: number
  totalOtros: number
  totalCollection: number

  // TOTALES formas de Pago
  totalEfectivo: number
  totalBizum: number
  totalTarjeta: number
  totalTrasnf: number
  totalTerap: number
  totalEncarg: number
  totalOtro: number
  totalPisos: number

  // Conteo fecha
  count: number = 0
  dateTodayCurrent: string
  atrasCount: number = 0
  siguienteCount: number = 0
  fechaFormat = new Date()

  // string Number
  totalTreatment: string
  totalDrinks: string
  totalTobacco: string
  totalVitamin: string
  totalTip: string
  totalOthers: string
  totalVisions: string
  totalPiso: string
  totalEfectiv: string
  totalBizu: string
  totalTarjet: string
  totalTrasn: string
  totalTerape: string
  totalEncargada: string
  totalOtr: string
  totalCollections: string

  therapistModel: ModelTherapist = {
    activo: true,
    bebida: "",
    fechaEnd: "",
    horaEnd: "",
    id: 0,
    minuto: "",
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
    private activatedRoute: ActivatedRoute,
    public service: Service,
    private serviceManager: ServiceManager,
    private serviceTherapist: ServiceTherapist
  ) { }

  public async ngOnInit(): Promise<void> {
    const params = this.activatedRoute.snapshot.params;
    this.idUser = Number(params['id'])

    this.serviceManager.getById(this.idUser).subscribe((rp) => {
      if (rp[0]['rol'] == 'administrador') {
        this.getService()
      } else {
        this.getServiceByManager(rp[0])
      }
    })

    if (!this.consultTherapist()) return

    setTimeout(() => {
      this.getMinute()
    }, 1200);
  }

  totalsAtZero() {
    this.totalPisos = 0
    this.totalVision = 0
    this.totalServicio = 0
    this.totalDrinks = '0'
    this.totalTobaccoo = 0
    this.totalVitamina = 0
    this.totalTipa = 0
    this.totalOtros = 0
    this.totalEfectivo = 0
    this.totalBizum = 0
    this.totalTarjeta = 0
    this.totalTrasnf = 0
    this.totalTerap = 0
    this.totalOtro = 0
    this.totalCollection = 0
    this.totalTreatment = '0'
    this.totalTobacco = '0'
    this.totalVitamin = '0'
    this.totalTip = '0'
    this.totalOthers = '0'
    this.totalVisions = '0'
    this.totalPiso = '0'
    this.totalEfectiv = '0'
    this.totalBizu = '0'
    this.totalTarjet = '0'
    this.totalTrasn = '0'
    this.totalTerape = '0'
    this.totalEncargada = '0'
    this.totalOtr = '0'
    this.totalCollections = '0'
  }

  getServiceByManager(manager: string) {
    this.todaysDate()
    this.dateTodayCurrent = 'HOY'
    this.service.getEncargadaAndDate(this.fechaDiaHoy, manager['nombre']).subscribe((rp: any) => {
      this.vision = rp

      if (rp.length != 0) {
        this.totalVisionSum()
      } else {
        this.totalsAtZero()
      }
    })
  }

  consultTherapist() {
    this.serviceTherapist.getAllTerapeutaByOrden().subscribe((rp: any) => {
      this.therapist = rp
      return true
    })
    return true
  }

  getMinute() {
    if (this.therapist.length > 0) {
      if (this.therapist?.horaEnd != "") {
        for (let i in this.therapist) {
          this.minuteDifference(this.therapist[i]?.horaEnd, this.therapist[i]?.nombre, this.therapist[i]?.fechaEnd)
          if (this.therapist[i]?.minuto != null && this.therapist[i]?.minuto != "") {
            this.therapist[i].minuto = this.horaEnd
            this.serviceTherapist.updateMinute(this.therapist[i]?.id, this.therapist[i]).subscribe((rp) => {
              if (!this.consultTherapist()) return
            })
          }
        }
      }
    }
  }

  todaysDate() {
    let convertDia
    let currentDate = new Date()
    let dia = currentDate.getDate()
    let mes = currentDate.toJSON().substring(5, 7)
    if (dia > 0 && dia < 10) {
      convertDia = '0' + dia
      this.fechaDiaHoy = `${currentDate.getFullYear()}-${mes}-${convertDia}`
    } else {
      this.fechaDiaHoy = `${currentDate.getFullYear()}-${mes}-${dia}`
    }
  }

  getService() {
    this.todaysDate()
    this.dateTodayCurrent = 'HOY'

    this.service.getFechaHoy(this.fechaDiaHoy).subscribe((datoServicio: any) => {
      this.vision = datoServicio

      if (datoServicio.length != 0) {
        this.totalVisionSum()
      } else {
        this.totalsAtZero()
      }
    })
  }

  minuteDifference(horaFin: string, nombre: string, fecha: string) {

    let hora_actual: any = new Date(), convertHora = '', fechaEnd = '', convertFecha = '',
      fechaHoy = new Date(), dia = 0, mes = 0, año = 0, convertMes = '', convertDia = ''

    dia = fechaHoy.getDate()
    mes = fechaHoy.getMonth() + 1
    año = fechaHoy.getFullYear()

    let minutes = hora_actual.getMinutes().toString().length === 1 ?
      '0' + hora_actual.getMinutes() : hora_actual.getMinutes()
    hora_actual = hora_actual.getHours() + ':' + minutes
    let hora_inicio = hora_actual
    const hora_final: any = horaFin

    if (mes > 0 && mes < 10) {
      convertMes = '0' + mes
      fechaEnd = `${dia}-${convertMes}-${año}`
    } else {
      convertMes = mes.toString()
      fechaEnd = `${dia}-${mes}-${año}`
    }

    if (dia > 0 && dia < 10) {
      convertDia = '0' + dia
      fechaEnd = `${año}-${convertMes}-${convertDia}`
    } else {
      fechaEnd = `${año}-${convertMes}-${dia}`
    }

    // Convertimos fecha
    if (fecha != "") convertFecha = fecha?.replace("/", "-").replace("/", "-")

    // Expresión regular para comprobar formato
    var formatohora = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/

    if (hora_inicio.length == 4) {
      hora_inicio = '0' + hora_inicio
    }

    // setTimeout(() => {
    //   if (convertFecha < fechaEnd) {
    //     this.serviceTherapist.getByNombre(nombre).subscribe((rp) => {
    //       this.serviceTherapist.updateHoraAndSalida(nombre, rp[0]).subscribe((rp) => {
    //         return ''
    //       })
    //     })
    //   }
    // }, 1000);

    // Si algún valor no tiene formato correcto sale
    if (!(hora_inicio.match(formatohora) && hora_final.match(formatohora))) {
      return ''
    }

    // Calcula los minutos de cada hora
    var minutos_inicio = hora_inicio.split(':').reduce((p, c) => parseInt(p) * 60 + parseInt(c))
    var minutos_final = hora_final.split(':').reduce((p, c) => parseInt(p) * 60 + parseInt(c))

    if (hora_inicio.length === 4) {
      convertHora = '0' + hora_inicio
    } else {
      convertHora = hora_inicio
    }

    // Si la hora final es anterior a la hora inicial sale
    if (minutos_final <= minutos_inicio) {
      this.therapist[0].fechaEnd = ""
      this.therapist[0].horaEnd = ""
      this.therapist[0].minuto = ""
      this.therapist[0].salida = ""
      this.serviceTherapist.updateHoraAndSalida(nombre, this.therapist[0]).subscribe((resp: any) => { })
      return ''
    }

    // Diferencia de minutos
    var diferencia = parseInt(minutos_final) - minutos_inicio

    // Cálculo de horas y minutos de la diferencia
    var horas = Math.floor(diferencia / 60)
    var minutos = diferencia % 60

    // this.horaEnd = horas + ':' + (minutos < 10 ? '0' : '') + minutos
    this.horaHoy = horas + ':' + (minutos < 10 ? '0' : '') + minutos

    if (this.horaHoy.slice(0, 1) === "0") {
      this.horaEnd = this.horaHoy.slice(2, 4)
    } else {
      this.horaEnd = this.horaHoy
    }

    return this.horaEnd
  }

  validateTheEmptyField() {
    if (this.totalTreatment == undefined) this.totalTreatment = '0'
    if (this.totalDrinks == undefined) this.totalDrinks = '0'
    if (this.totalTobacco == undefined) this.totalTobacco = '0'
    if (this.totalVitamin == undefined) this.totalVitamin = '0'
    if (this.totalTip == undefined) this.totalTip = '0'
    if (this.totalOthers == undefined) this.totalOthers = '0'
    if (this.totalVisions == undefined) this.totalVisions = '0'

    if (this.totalPiso == undefined) this.totalPiso = '0'
    if (this.totalEfectiv == undefined) this.totalEfectiv = '0'
    if (this.totalBizu == undefined) this.totalBizu = '0'
    if (this.totalTarjet == undefined) this.totalTarjet = '0'
    if (this.totalTrasn == undefined) this.totalTrasn = '0'
    if (this.totalTerape == undefined) this.totalTerape = '0'
    if (this.totalEncargada == undefined) this.totalEncargada = '0'
    if (this.totalOtr == undefined) this.totalOtr = '0'
    if (this.totalCollections == undefined) this.totalCollections = '0'
  }

  // Suma de TOTALES
  totalVisionSum() {
    let efectPiso1 = 0, efectPiso2 = 0, bizumPiso1 = 0, bizumPiso2 = 0, tarjetaPiso1 = 0, tarjetaPiso2 = 0,
      transfPiso1 = 0, transfPiso2 = 0

    const totalServ = this.vision.map(({ servicio }) => servicio).reduce((acc, value) => acc + value, 0)
    this.totalServicio = totalServ

    if (this.totalServicio > 0) {

      const coma = this.totalServicio.toString().indexOf(".") !== -1 ? true : false;
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
      this.totalTreatment = integer[0].toString()
    } else {
      this.totalTreatment = totalServ.toString()
    }

    const totalValorBebida = this.vision.map(({ bebidas }) => bebidas).reduce((acc, value) => acc + value, 0)
    this.totalBebida = totalValorBebida

    if (this.totalBebida > 0) {

      const coma = this.totalBebida.toString().indexOf(".") !== -1 ? true : false;
      const array = coma ? this.totalBebida.toString().split(".") : this.totalBebida.toString().split("");
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
      this.totalDrinks = integer[0].toString()
    } else {
      this.totalDrinks = totalValorBebida.toString()
    }

    const totalValorTab = this.vision.map(({ tabaco }) => tabaco).reduce((acc, value) => acc + value, 0)
    this.totalTobaccoo = totalValorTab

    if (this.totalTobaccoo > 0) {

      const coma = this.totalTobaccoo.toString().indexOf(".") !== -1 ? true : false;
      const arrayNumero = coma ? this.totalTobaccoo.toString().split(".") : this.totalTobaccoo.toString().split("");
      let integerPart = coma ? arrayNumero[0].split("") : arrayNumero;
      let subIndex = 1;

      for (let i = integerPart.length - 1; i >= 0; i--) {

        if (integerPart[i] !== "." && subIndex % 3 === 0 && i != 0) {

          integerPart.splice(i, 0, ".");
          subIndex++;

        } else {
          subIndex++;
        }
      }

      integerPart = [integerPart.toString().replace(/,/gi, "")]
      this.totalTobacco = integerPart[0].toString()
    } else {
      this.totalTobacco = totalValorTab.toString()
    }

    const totalValorVitamina = this.vision.map(({ vitaminas }) => vitaminas).reduce((acc, value) => acc + value, 0)
    this.totalVitamina = totalValorVitamina

    if (this.totalVitamina > 0) {

      const coma = this.totalVitamina.toString().indexOf(".") !== -1 ? true : false;
      const array = coma ? this.totalVitamina.toString().split(".") : this.totalVitamina.toString().split("");
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
      this.totalVitamin = integer[0].toString()
    } else {
      this.totalVitamin = totalValorVitamina.toString()
    }

    const totalValorProp = this.vision.map(({ propina }) => propina).reduce((acc, value) => acc + value, 0)
    this.totalTipa = totalValorProp

    if (this.totalTipa > 0) {

      const coma = this.totalTipa.toString().indexOf(".") !== -1 ? true : false;
      const array = coma ? this.totalTipa.toString().split(".") : this.totalTipa.toString().split("");
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
      this.totalTip = integer[0].toString()
    } else {
      this.totalTip = totalValorProp.toString()
    }

    const totalValorOtroServicio = this.vision.map(({ otros }) => otros).reduce((acc, value) => acc + value, 0)
    this.totalOtros = totalValorOtroServicio

    if (this.totalOtros > 0) {

      const coma = this.totalOtros.toString().indexOf(".") !== -1 ? true : false;
      const array = coma ? this.totalOtros.toString().split(".") : this.totalOtros.toString().split("");
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
      this.totalOthers = integer[0].toString()
    } else {
      this.totalOthers = totalValorOtroServicio.toString()
    }

    this.totalVision = this.totalServicio + this.totalBebida + this.totalTobaccoo +
      this.totalVitamina + this.totalTipa + this.totalOtros

    if (this.totalVision > 0) {

      const coma = this.totalVision.toString().indexOf(".") !== -1 ? true : false;
      const array = coma ? this.totalVision.toString().split(".") : this.totalVision.toString().split("");
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
      this.totalVisions = integer[0].toString()
    } else {
      this.totalVisions = this.totalVision.toString()
    }

    // total de las Formas de pagos

    const totalPiso1Efect = this.vision.map(({ valuePiso1Efectivo }) => valuePiso1Efectivo).reduce((acc, value) => acc + value, 0)
    efectPiso1 = totalPiso1Efect

    const totalPiso2Efect = this.vision.map(({ valuePiso2Efectivo }) => valuePiso2Efectivo).reduce((acc, value) => acc + value, 0)
    efectPiso2 = totalPiso2Efect

    this.totalEfectivo = efectPiso1 + efectPiso2

    if (this.totalEfectivo > 0) {

      const coma = this.totalEfectivo.toString().indexOf(".") !== -1 ? true : false;
      const array = coma ? this.totalEfectivo.toString().split(".") : this.totalEfectivo.toString().split("");
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
      this.totalEfectiv = integer[0].toString()
    }

    const totalPiso1Bizum = this.vision.map(({ valuePiso1Bizum }) => valuePiso1Bizum).reduce((acc, value) => acc + value, 0)
    bizumPiso1 = totalPiso1Bizum

    const totalPiso2Bizum = this.vision.map(({ valuePiso2Bizum }) => valuePiso2Bizum).reduce((acc, value) => acc + value, 0)
    bizumPiso2 = totalPiso2Bizum

    this.totalBizum = bizumPiso1 + bizumPiso2

    if (this.totalBizum > 0) {

      const coma = this.totalBizum.toString().indexOf(".") !== -1 ? true : false;
      const array = coma ? this.totalBizum.toString().split(".") : this.totalBizum.toString().split("");
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
      this.totalBizu = integer[0].toString()
    } else {
      this.totalBizu = this.totalBizum.toString()
    }

    const totalPiso1Tarjeta = this.vision.map(({ valuePiso1Tarjeta }) => valuePiso1Tarjeta).reduce((acc, value) => acc + value, 0)
    tarjetaPiso1 = totalPiso1Tarjeta

    const totalPiso2Tarjeta = this.vision.map(({ valuePiso2Tarjeta }) => valuePiso2Tarjeta).reduce((acc, value) => acc + value, 0)
    tarjetaPiso2 = totalPiso2Tarjeta

    this.totalTarjeta = tarjetaPiso1 + tarjetaPiso2

    if (this.totalTarjeta > 0) {

      const coma = this.totalTarjeta.toString().indexOf(".") !== -1 ? true : false;
      const array = coma ? this.totalTarjeta.toString().split(".") : this.totalTarjeta.toString().split("");
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
      this.totalTarjet = integer[0].toString()
    } else {
      this.totalTarjet = this.totalTarjeta.toString()
    }

    const totalPiso1Transaccion = this.vision.map(({ valuePiso1Transaccion }) => valuePiso1Transaccion).reduce((acc, value) => acc + value, 0)
    transfPiso1 = totalPiso1Transaccion

    const totalPiso2Transaccion = this.vision.map(({ valuePiso2Transaccion }) => valuePiso2Transaccion).reduce((acc, value) => acc + value, 0)
    transfPiso2 = totalPiso2Transaccion

    this.totalTrasnf = transfPiso1 + transfPiso2

    if (this.totalTrasnf > 0) {

      const coma = this.totalTrasnf.toString().indexOf(".") !== -1 ? true : false;
      const array = coma ? this.totalTrasnf.toString().split(".") : this.totalTrasnf.toString().split("");
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
      this.totalTrasn = integer[0].toString()
    } else {
      this.totalTrasn = this.totalTrasnf.toString()
    }

    const totalValorTerapeuta = this.vision.map(({ numberTerap }) => numberTerap).reduce((acc, value) => acc + value, 0)
    this.totalTerap = totalValorTerapeuta

    if (this.totalTerap > 0) {

      const coma = this.totalTerap.toString().indexOf(".") !== -1 ? true : false;
      const array = coma ? this.totalTerap.toString().split(".") : this.totalTerap.toString().split("");
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
      this.totalTerape = integer[0].toString()
    } else {
      this.totalTerape = this.totalTerap.toString()
    }

    const totalValorEncargada = this.vision.map(({ numberEncarg }) => numberEncarg).reduce((acc, value) => acc + value, 0)
    this.totalEncarg = totalValorEncargada

    if (this.totalEncarg > 0) {

      const coma = this.totalEncarg.toString().indexOf(".") !== -1 ? true : false;
      const array = coma ? this.totalEncarg.toString().split(".") : this.totalEncarg.toString().split("");
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
      this.totalEncargada = integer[0].toString()
    } else {
      this.totalEncargada = this.totalEncarg.toString()
    }

    const totalValorOtro = this.vision.map(({ numberOtro }) => numberOtro).reduce((acc, value) => acc + value, 0)
    this.totalOtro = totalValorOtro

    if (this.totalOtro > 0) {

      const coma = this.totalOtro.toString().indexOf(".") !== -1 ? true : false;
      const array = coma ? this.totalOtro.toString().split(".") : this.totalOtro.toString().split("");
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
      this.totalOtr = integer[0].toString()
    } else {
      this.totalOtr = this.totalOtro.toString()
    }

    this.totalPisos = this.totalEfectivo + this.totalBizum + this.totalTarjeta + this.totalTrasnf

    if (this.totalPisos > 0) {

      const coma = this.totalPisos.toString().indexOf(".") !== -1 ? true : false;
      const array = coma ? this.totalPisos.toString().split(".") : this.totalPisos.toString().split("");
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
      this.totalPiso = integer[0].toString()
    } else {
      this.totalPiso = this.totalPisos.toString()
    }

    this.totalCollection = this.totalEfectivo + this.totalBizum + this.totalTarjeta + this.totalTrasnf
      + this.totalTerap + this.totalEncarg + this.totalOtro

    if (this.totalCollection > 0) {

      const coma = this.totalCollection.toString().indexOf(".") !== -1 ? true : false;
      const array = coma ? this.totalCollection.toString().split(".") : this.totalCollection.toString().split("");
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
      this.totalCollections = integer[0].toString()
    } else {
      this.totalCollections = this.totalCollection.toString()
    }

    this.validateTheEmptyField()
  }

  backArrow() {
    let fechHoy = new Date(), fechaEnd = '', convertDiaHoy = '', diaHoy = 0, mesHoy = 0,
      añoHoy = 0, convertMesHoy = ''

    diaHoy = fechHoy.getDate()
    mesHoy = fechHoy.getMonth() + 1
    añoHoy = fechHoy.getFullYear()

    if (mesHoy > 0 && mesHoy < 10) {
      convertMesHoy = '0' + mesHoy
      fechaEnd = `${añoHoy}-${convertMesHoy}-${diaHoy}`
    } else {
      convertMesHoy = mesHoy.toString()
      fechaEnd = `${añoHoy}-${convertMesHoy}-${diaHoy}`
    }

    if (diaHoy > 0 && diaHoy < 10) {
      convertDiaHoy = '0' + diaHoy
      fechaEnd = `${añoHoy}-${convertMesHoy}-${convertDiaHoy}`
    } else {
      fechaEnd = `${añoHoy}-${convertMesHoy}-${diaHoy}`
    }

    if (this.siguienteCount > 0) {
      this.siguienteCount = 0
      this.count = 0
      this.count++
      let convertmes = '', convertDia = '', convertAño = '', fechaHoy = '', mes = '',
        fechaActualmente = '', convertionAño

      for (let i = 0; i < this.count; i++) {
        this.fechaFormat.setDate(this.fechaFormat.getDate() - this.count)
        convertDia = this.fechaFormat.toString().substring(8, 10)
        convertmes = this.fechaFormat.toString().substring(4, 7)
        convertAño = this.fechaFormat.toString().substring(11, 15)
        convertionAño = this.fechaFormat.toString().substring(13, 15)

        if (convertmes == 'Dec') mes = "12"
        if (convertmes == 'Nov') mes = "11"
        if (convertmes == 'Oct') mes = "10"
        if (convertmes == 'Sep') mes = "09"
        if (convertmes == 'Aug') mes = "08"
        if (convertmes == 'Jul') mes = "07"
        if (convertmes == 'Jun') mes = "06"
        if (convertmes == 'May') mes = "05"
        if (convertmes == 'Apr') mes = "04"
        if (convertmes == 'Mar') mes = "03"
        if (convertmes == 'Feb') mes = "02"
        if (convertmes == 'Jan') mes = "01"

        fechaHoy = `${convertAño}-${mes}-${convertDia}`

        if (fechaEnd == fechaHoy) this.dateTodayCurrent = 'HOY'
        else this.dateTodayCurrent = `${convertDia}/${mes}/${convertionAño}`

        fechaActualmente = `${convertAño}-${mes}-${convertDia}`

        this.serviceManager.getById(this.idUser).subscribe((rp: any) => {
          if (rp[0]['rol'] == 'administrador') {
            this.service.getFechaHoy(fechaActualmente).subscribe((rp: any) => {
              this.vision = rp
              if (rp.length > 0) this.totalVisionSum()
              else this.totalsAtZero()
            })
          } else {
            this.service.getEncargadaAndDate(fechaActualmente, rp[0]['nombre']).subscribe((rp: any) => {
              this.vision = rp

              if (rp.length > 0) this.totalVisionSum()
              else this.totalsAtZero()
            })
          }
        })

        this.atrasCount = this.count

        return true
      }
    } else {
      this.atrasCount = 0
      this.siguienteCount = 0
      this.count = 0
      this.count++
      let convertmes = '', convertDia = '', convertAño = '', mes = '', fechaHoy = '',
        convertFecha = '', fechaActualmente = '', convertionAño

      for (let i = 0; i < this.count; i++) {

        this.fechaFormat.setDate(this.fechaFormat.getDate() - this.count)
        convertFecha = this.fechaFormat.toString()
        this.fechaFormat = new Date(convertFecha)
        convertDia = this.fechaFormat.toString().substring(8, 10)
        convertmes = this.fechaFormat.toString().substring(4, 7)
        convertAño = this.fechaFormat.toString().substring(11, 15)
        convertionAño = this.fechaFormat.toString().substring(13, 15)

        if (convertmes == 'Dec') mes = "12"
        if (convertmes == 'Nov') mes = "11"
        if (convertmes == 'Oct') mes = "10"
        if (convertmes == 'Sep') mes = "09"
        if (convertmes == 'Aug') mes = "08"
        if (convertmes == 'Jul') mes = "07"
        if (convertmes == 'Jun') mes = "06"
        if (convertmes == 'May') mes = "05"
        if (convertmes == 'Apr') mes = "04"
        if (convertmes == 'Mar') mes = "03"
        if (convertmes == 'Feb') mes = "02"
        if (convertmes == 'Jan') mes = "01"

        fechaHoy = `${convertAño}-${mes}-${convertDia}`

        if (fechaEnd == fechaHoy) {
          this.dateTodayCurrent = 'HOY'
        }
        else {
          this.dateTodayCurrent = `${convertDia}/${mes}/${convertionAño}`
        }

        fechaActualmente = `${convertAño}-${mes}-${convertDia}`

        this.serviceManager.getById(this.idUser).subscribe((rp: any) => {
          if (rp[0]['rol'] == 'administrador') {
            this.service.getFechaHoy(fechaActualmente).subscribe((rp: any) => {
              this.vision = rp
              if (rp.length > 0) this.totalVisionSum()
              else this.totalsAtZero()
            })
          } else {
            this.service.getEncargadaAndDate(fechaActualmente, rp[0]['nombre']).subscribe((rp: any) => {
              this.vision = rp

              if (rp.length > 0) this.totalVisionSum()
              else this.totalsAtZero()
            })
          }
        })

        this.atrasCount = this.count

        return true
      }
    }
    return false
  }

  nextArrow() {
    let fechaDia = new Date(), mesDelDia = 0, convertMess = '', messs = '', convertimosMes = 0
    mesDelDia = fechaDia.getMonth() + 1

    let fechHoy = new Date(), fechaEnd = '', convertDiaHoy = '', diaHoy = 0, mesHoy = 0, añoHoy = 0, convertMesHoy = ''

    diaHoy = fechHoy.getDate()
    mesHoy = fechHoy.getMonth() + 1
    añoHoy = fechHoy.getFullYear()

    if (mesHoy > 0 && mesHoy < 10) {
      convertMesHoy = '0' + mesHoy
      fechaEnd = `${añoHoy}-${convertMesHoy}-${diaHoy}`
    } else {
      convertMesHoy = mesHoy.toString()
      fechaEnd = `${añoHoy}-${mesHoy}-${diaHoy}`
    }

    if (diaHoy > 0 && diaHoy < 10) {
      convertDiaHoy = '0' + diaHoy
      fechaEnd = `${añoHoy}-${convertMesHoy}-${convertDiaHoy}`
    } else {
      fechaEnd = `${añoHoy}-${convertMesHoy}-${diaHoy}`
    }

    if (this.atrasCount > 0) {
      this.atrasCount = 0
      this.count = 0
      this.count++
      convertMess = this.fechaFormat.toString().substring(4, 7)
      if (convertMess == 'Dec') messs = "12"
      if (convertMess == 'Nov') messs = "11"
      if (convertMess == 'Oct') messs = "10"
      if (convertMess == 'Sep') messs = "09"
      if (convertMess == 'Aug') messs = "08"
      if (convertMess == 'Jul') messs = "07"
      if (convertMess == 'Jun') messs = "06"
      if (convertMess == 'May') messs = "05"
      if (convertMess == 'Apr') messs = "04"
      if (convertMess == 'Mar') messs = "03"
      if (convertMess == 'Feb') messs = "02"
      if (convertMess == 'Jan') messs = "01"

      convertimosMes = Number(messs)
      this.atrasCount = 0
      this.count = 0
      this.count++

      let convertmes = '', convertDia = '', convertAño = '', mes = '', fechaHoy = '',
        fechaActualmente = '', convertionAño = ''

      for (let i = 0; i < this.count; i++) {
        this.fechaFormat.setDate(this.fechaFormat.getDate() + this.count)
        convertDia = this.fechaFormat.toString().substring(8, 10)
        convertmes = this.fechaFormat.toString().substring(4, 7)
        convertAño = this.fechaFormat.toString().substring(11, 15)
        convertionAño = this.fechaFormat.toString().substring(13, 15)

        if (convertmes == 'Dec') mes = "12"
        if (convertmes == 'Nov') mes = "11"
        if (convertmes == 'Oct') mes = "10"
        if (convertmes == 'Sep') mes = "09"
        if (convertmes == 'Aug') mes = "08"
        if (convertmes == 'Jul') mes = "07"
        if (convertmes == 'Jun') mes = "06"
        if (convertmes == 'May') mes = "05"
        if (convertmes == 'Apr') mes = "04"
        if (convertmes == 'Mar') mes = "03"
        if (convertmes == 'Feb') mes = "02"
        if (convertmes == 'Jan') mes = "01"

        fechaHoy = `${convertAño}-${mes}-${convertDia}`

        if (fechaEnd == fechaHoy) {
          this.dateTodayCurrent = 'HOY'
        }
        else {
          this.dateTodayCurrent = `${convertDia}/${mes}/${convertionAño}`
        }

        fechaActualmente = `${convertAño}-${mes}-${convertDia}`

        this.serviceManager.getById(this.idUser).subscribe((rp: any) => {
          if (rp[0]['rol'] == 'administrador') {
            this.service.getFechaHoy(fechaActualmente).subscribe((rp: any) => {
              this.vision = rp
              if (rp.length > 0) this.totalVisionSum()
              else this.totalsAtZero()
            })
          } else {
            this.service.getEncargadaAndDate(fechaActualmente, rp[0]['nombre']).subscribe((rp: any) => {
              this.vision = rp

              if (rp.length > 0) this.totalVisionSum()
              else this.totalsAtZero()
            })
          }
        })

        this.atrasCount = 0
        this.count = 0
        return true
      }
    }

    else {
      this.atrasCount = 0
      this.siguienteCount = 0
      this.count = 0
      this.count++
      let convertmes = '', convertDia = '', convertAño = '', mes = '', fechaHoy = '',
        convertFecha = '', fechaActualmente = '', convertionAño

      var result = new Date(new Date().toISOString())
      for (let i = 0; i < this.count; i++) {

        this.fechaFormat.setDate(this.fechaFormat.getDate() + this.count)
        convertFecha = this.fechaFormat.toString()
        this.fechaFormat = new Date(convertFecha)

        convertDia = this.fechaFormat.toString().substring(8, 10)
        convertmes = this.fechaFormat.toString().substring(4, 7)
        convertAño = this.fechaFormat.toString().substring(11, 15)
        convertionAño = this.fechaFormat.toString().substring(13, 15)

        if (convertmes == 'Dec') mes = "12"
        if (convertmes == 'Nov') mes = "11"
        if (convertmes == 'Oct') mes = "10"
        if (convertmes == 'Sep') mes = "09"
        if (convertmes == 'Aug') mes = "08"
        if (convertmes == 'Jul') mes = "07"
        if (convertmes == 'Jun') mes = "06"
        if (convertmes == 'May') mes = "05"
        if (convertmes == 'Apr') mes = "04"
        if (convertmes == 'Mar') mes = "03"
        if (convertmes == 'Feb') mes = "02"
        if (convertmes == 'Jan') mes = "01"

        fechaHoy = `${convertAño}-${mes}-${convertDia}`

        if (fechaEnd == fechaHoy) {
          this.dateTodayCurrent = 'HOY'
        }
        else {
          this.dateTodayCurrent = `${convertDia}/${mes}/${convertionAño}`
        }

        fechaActualmente = `${convertAño}-${mes}-${convertDia}`

        this.serviceManager.getById(this.idUser).subscribe((rp: any) => {
          if (rp[0]['rol'] == 'administrador') {
            this.service.getFechaHoy(fechaActualmente).subscribe((rp: any) => {
              this.vision = rp
              if (rp.length > 0) this.totalVisionSum()
              else this.totalsAtZero()
            })
          } else {
            this.service.getEncargadaAndDate(fechaActualmente, rp[0]['nombre']).subscribe((rp: any) => {
              this.vision = rp

              if (rp.length > 0) this.totalVisionSum()
              else this.totalsAtZero()
            })
          }
        })

        this.siguienteCount = this.count

        return true
      }
    }
    return false
  }

  editByName(nombre: string) {
    this.service.getTerapeutaWithCurrentDate(nombre).subscribe((rp: any) => {
      if (rp.length > 0) this.router.navigate([`menu/${this.idUser}/nuevo-servicio/${rp[0]['id']}/true`])
    })
  }
}