import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { Service } from 'src/app/core/services/service'

// Services
import { ServiceManager } from 'src/app/core/services/manager'
import { ServiceTherapist } from 'src/app/core/services/therapist'

// Models
import { ModelTherapist } from 'src/app/core/models/therapist'

import moment from 'moment'

@Component({
  selector: 'app-vision',
  templateUrl: './vision.component.html',
  styleUrls: ['./vision.component.css']
})

export class VisionComponent implements OnInit {

  diferenceMinutes: number
  tableVision: boolean = false
  loading: boolean = false
  vision: any
  page!: number
  fechaDiaHoy = ''
  totalServicio: number
  idUser: number
  therapist: any
  horaEnd: string
  horaHoy: string

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

  // Table therapist
  therapistCount: number
  servicesTherapist = []

  // Table manager
  managerCount: number
  servicesManager = []

  therapistModel: ModelTherapist = {
    activo: true,
    bebida: "",
    fechaEnd: "",
    horaEnd: "",
    id: 0,
    minuto: 0,
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

  public async ngOnInit() {
    let manager, element
    this.loading = true
    this.tableVision = false
    const params = this.activatedRoute.snapshot.params;
    this.idUser = Number(params['id'])

    this.serviceManager.getById(this.idUser).subscribe(async (rp: any) => {
      this.servicesManager = rp
      manager = rp
      if (rp[0]['rol'] == 'administrador') {
        this.getService()
        await this.getManagerall(element)
      } else {
        this.getServiceByManager(rp[0])
        await this.getManager(manager, element, 'array')
      }
    })

    await this.getTherapist('array', element)
  }

  getManagerall(element) {
    if (element == undefined) {

      this.todaysDate()
      this.serviceManager.getUsuarios().subscribe((rp: any) => {
        this.servicesManager = rp

        for (let o = 0; o < rp.length; o++) {
          this.service.getManagerAndDates(rp[o]['nombre'], this.fechaDiaHoy).subscribe((rp: any) => {
            this.managerCount = rp.length
            this.servicesManager[o]['count'] = this.managerCount

            const servicios = rp.filter(serv => serv)
            const sumatoria = servicios.reduce((accumulator, serv) => {
              return accumulator + serv.totalServicio
            }, 0)

            this.servicesManager[o]['sum'] = sumatoria

            this.servicesManager.sort(function (a, b) {
              if (a.sum > b.sum) {
                return -1;
              }
              if (a.sum < b.sum) {
                return 1;
              }

              return 0;
            })
          })
        }
      })
    } else {
      this.serviceManager.getUsuarios().subscribe((rp: any) => {
        this.servicesManager = rp

        for (let o = 0; o < rp.length; o++) {
          this.service.getManagerAndDates(rp[o]['nombre'], element).subscribe((rp: any) => {
            this.managerCount = rp.length
            this.servicesManager[o]['count'] = this.managerCount

            const servicios = rp.filter(serv => serv)
            const sumatoria = servicios.reduce((accumulator, serv) => {
              return accumulator + serv.totalServicio
            }, 0)


            this.servicesManager[o]['sum'] = sumatoria

            this.servicesManager.sort(function (a, b) {
              if (a.sum > b.sum) {
                return -1;
              }
              if (a.sum < b.sum) {
                return 1;
              }

              return 0;
            })
          })
        }
      })
    }
  }

  getManager = async (element, dates, text) => {
    if (text == 'array') {
      this.todaysDate()

      this.service.getManagerAndDates(element[0]['nombre'], this.fechaDiaHoy).subscribe((rp: any) => {
        this.managerCount = rp.length
        this.servicesManager[0]['count'] = this.managerCount

        const servicios = rp.filter(serv => serv)
        const sumatoria = servicios.reduce((accumulator, serv) => {
          return accumulator + serv.totalServicio
        }, 0)

        if (sumatoria > 999) {
          const coma = sumatoria.toString().indexOf(".") !== -1 ? true : false;
          const array = coma ? sumatoria.toString().split(".") : sumatoria.toString().split("");
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
          this.servicesManager[0]['sum'] = integer[0].toString()
        } else {
          this.servicesManager[0]['sum'] = sumatoria.toString()
        }
      })
    } else {
      this.service.getManagerAndDates(element[0]['nombre'], dates).subscribe((rp: any) => {
        this.managerCount = rp.length
        this.servicesManager[0]['count'] = this.managerCount

        const servicios = rp.filter(serv => serv)
        const sumatoria = servicios.reduce((accumulator, serv) => {
          return accumulator + serv.totalServicio
        }, 0)

        if (sumatoria > 999) {
          const coma = sumatoria.toString().indexOf(".") !== -1 ? true : false;
          const array = coma ? sumatoria.toString().split(".") : sumatoria.toString().split("");
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
          this.servicesManager[0]['sum'] = integer[0].toString()
        } else {
          this.servicesManager[0]['sum'] = sumatoria.toString()
        }
      })
    }
  }

  getTherapist = async (text, dates) => {
    let therapit
    await this.serviceTherapist.getMinutes().subscribe(async (rp: any) => {
      this.therapist = rp
      console.log(this.therapist)
      therapit = rp

      await this.getMinute(therapit)
      await this.tableTherapist(therapit, text, dates)

      return therapit
    })
  }

  tableTherapist = async (element, text, dateCurent) => {
    if (text == 'array') {

      let date = new Date(), day = 0, month = 0, year = 0, convertDay = '', dates = ''

      day = date.getDate()
      month = date.getMonth() + 1
      year = date.getFullYear()

      if (day > 0 && day < 10) {
        convertDay = '0' + day
        dates = `${year}-${month}-${convertDay}`
      } else {
        day = day
        dates = `${year}-${month}-${day}`
      }

      this.servicesTherapist = element

      for (let o = 0; o < element.length; o++) {
        this.service.getTherapistAndDates(element[o]['nombre'], dates).subscribe((rp: any) => {
          this.therapistCount = rp.length
          this.servicesTherapist[o]['count'] = this.therapistCount

          const servicios = rp.filter(serv => serv)
          const sumatoria = servicios.reduce((accumulator, serv) => {
            return accumulator + serv.totalServicio
          }, 0)

          this.servicesTherapist[o]['sum'] = sumatoria

          this.servicesTherapist.sort(function (a, b) {
            if (a.sum > b.sum) {
              return -1;
            }
            if (a.sum < b.sum) {
              return 1;
            }

            return 0;
          })
        })
      }

    } else {
      this.servicesTherapist = element

      for (let o = 0; o < element.length; o++) {
        this.service.getTherapistAndDates(element[o]['nombre'], dateCurent).subscribe((rp: any) => {
          this.therapistCount = rp.length
          this.servicesTherapist[o]['count'] = this.therapistCount

          const servicios = rp.filter(serv => serv)
          const sumatoria = servicios.reduce((accumulator, serv) => {
            return accumulator + serv.totalServicio
          }, 0)

          this.servicesTherapist[o]['sum'] = sumatoria

          this.servicesTherapist.sort(function (a, b) {
            if (a.sum > b.sum) {
              return -1;
            }
            if (a.sum < b.sum) {
              return 1;
            }

            return 0;
          })
        })
      }
    }
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

      this.loading = false
      this.tableVision = true
    })
  }

  getMinute(element) {
    if (element.length > 0) {
      if (element?.horaEnd != "") {
        this.minuteDifference(element)
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

      this.loading = false
      this.tableVision = true
    })
  }

  updateHourAndExit(element, o) {
    if (this.diferenceMinutes <= 0) {
      element[o]['minuto'] = 0
      element[o]['fechaEnd'] = ''
      element[o]['horaEnd'] = ''
      element[o]['salida'] = ''
      this.serviceTherapist.updateHoraAndSalida(element[o]['nombre'], element[o]).subscribe((rp) => {
      }).add(this.serviceTherapist.getMinutes().subscribe((rp: any) => {
        this.therapist = rp
        console.log(this.therapist)
      }))
    }
  }

  updateMinute(element, o) {
    if (this.diferenceMinutes > 0) {
      element[o]['minuto'] = this.diferenceMinutes
      this.serviceTherapist.updateMinute(element[o]['id'], element[o]).subscribe((rp) => {
      }).add(this.serviceTherapist.getMinutes().subscribe((rp: any) => {
        this.therapist = rp
        console.log(this.therapist)
      }))
    }
  }

  minuteDifference(element) {
    for (let o = 0; o < element.length; o++) {

      if (element[o]['fechaEnd'] != "") {
        let date = new Date(), day = 0, convertDay = '', month = 0, year = 0, hour = new Date().toTimeString().substring(0, 8), dayEnd = '', monthEnd = '', yearEnd = ''

        dayEnd = element[o]['fechaEnd'].substring(0, 2)
        monthEnd = element[o]['fechaEnd'].substring(3, 5)
        yearEnd = element[o]['fechaEnd'].substring(6, 9)
        yearEnd = + '20' + yearEnd

        var date1 = moment(`${yearEnd}-${monthEnd}-${dayEnd} ${element[o]['horaEnd']}`, "YYYY-MM-DD HH:mm")

        // Date 2

        day = date.getDate()
        month = date.getMonth() + 1
        year = date.getFullYear()

        if (day > 0 && day < 10) {
          convertDay = '0' + day
          var date2 = moment(`${year}-${month}-${convertDay} ${hour}`, "YYYY-MM-DD HH:mm")
        } else {
          day = day
          var date2 = moment(`${year}-${month}-${day} ${hour}`, "YYYY-MM-DD HH:mm:ss")
        }

        this.diferenceMinutes = date1.diff(date2, 'minute')

        this.updateMinute(element, o)
        this.updateHourAndExit(element, o)
      }
    }
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

  backArrow = async () => {
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

        this.serviceManager.getById(this.idUser).subscribe(async (rp: any) => {
          if (rp[0]['rol'] == 'administrador') {

            await this.getManagerall(fechaActualmente)
            await this.getTherapist('date', fechaActualmente)

            this.service.getFechaHoy(fechaActualmente).subscribe((rp: any) => {
              this.vision = rp
              if (rp.length > 0) this.totalVisionSum()
              else this.totalsAtZero()
            })
          } else {

            await this.getManager(rp, fechaActualmente, 'date')
            await this.getTherapist('date', fechaActualmente)

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

        this.serviceManager.getById(this.idUser).subscribe(async (rp: any) => {
          if (rp[0]['rol'] == 'administrador') {

            await this.getManagerall(fechaActualmente)
            await this.getTherapist('date', fechaActualmente)

            this.service.getFechaHoy(fechaActualmente).subscribe((rp: any) => {
              this.vision = rp
              if (rp.length > 0) this.totalVisionSum()
              else this.totalsAtZero()
            })
          } else {

            await this.getManager(rp, fechaActualmente, 'date')
            await this.getTherapist('date', fechaActualmente)

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

  nextArrow = async () => {
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

        this.serviceManager.getById(this.idUser).subscribe(async (rp: any) => {
          if (rp[0]['rol'] == 'administrador') {

            await this.getManagerall(fechaActualmente)
            await this.getTherapist('date', fechaActualmente)

            this.service.getFechaHoy(fechaActualmente).subscribe((rp: any) => {
              this.vision = rp

              if (rp.length > 0) this.totalVisionSum()
              else this.totalsAtZero()
            })
          } else {

            await this.getManager(rp, fechaActualmente, 'date')
            await this.getTherapist('date', fechaActualmente)

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

        this.serviceManager.getById(this.idUser).subscribe(async (rp: any) => {
          if (rp[0]['rol'] == 'administrador') {

            await this.getManagerall(fechaActualmente)
            await this.getTherapist('date', fechaActualmente)

            this.service.getFechaHoy(fechaActualmente).subscribe((rp: any) => {
              this.vision = rp
              if (rp.length > 0) this.totalVisionSum()
              else this.totalsAtZero()
            })
          } else {

            await this.getManager(rp, fechaActualmente, 'date')
            await this.getTherapist('date', fechaActualmente)

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