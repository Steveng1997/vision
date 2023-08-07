import { Injectable } from '@angular/core';
import 'firebase/compat/app';
import { Servicio } from '../models/servicio';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';

@Injectable()
export class ServicioService {
  constructor(public router: Router, private db: AngularFirestore) { }

  servicio: Servicio[] = [];
  cursoDoc: AngularFirestoreDocument<Servicio>;

  // Register

  makeid(length) {
    var result = '';
    var characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  registerServicio(formularioall, idUnico, formaPago, fecha, horaStart, totalServicio, horaEnd, fechaHoyInicio,
    valueEfectivo, valueBizum, valueTarjeta, valueTrans, valueEfectTerapeuta, valueBizuTerapeuta,
    valueTarjeTerapeuta, valueTransTerapeuta, valueEfectEncargada, valueBizuEncargada, valueTarjeEncargada,
    valueTransEncargada, currentDate, valuePiso1Efectivo, valuePiso1Bizum, valuePiso1Tarjeta,
    valuePiso1Transaccion, valuePiso2Efectivo, valuePiso2Bizum, valuePiso2Tarjeta, valuePiso2Transaccion) {
    formularioall = {
      id: `uid${this.makeid(10)}`,
      terapeuta: formularioall.terapeuta,
      encargada: formularioall.encargada,
      cliente: formularioall.cliente,
      fecha: fecha,
      horaStart: horaStart,
      minuto: formularioall.minuto,
      efectPiso1: formularioall.efectPiso1,
      bizuPiso1: formularioall.bizuPiso1,
      tarjPiso1: formularioall.tarjPiso1,
      transPiso1: formularioall.transPiso1,
      efectPiso2: formularioall.efectPiso2,
      bizuPiso2: formularioall.bizuPiso2,
      tarjPiso2: formularioall.tarjPiso2,
      transPiso2: formularioall.transPiso2,
      efectTerap: formularioall.efectTerap,
      bizuTerap: formularioall.bizuTerap,
      tarjTerap: formularioall.tarjTerap,
      transTerap: formularioall.transTerap,
      efectEncarg: formularioall.efectEncarg,
      bizuEncarg: formularioall.bizuEncarg,
      tarjEncarg: formularioall.tarjEncarg,
      transEncarg: formularioall.transEncarg,
      efectOtro: formularioall.efectOtro,
      bizuOtro: formularioall.bizuOtro,
      tarjOtro: formularioall.tarjOtro,
      transOtro: formularioall.transOtro,
      numberPiso1: formularioall.numberPiso1,
      numberPiso2: formularioall.numberPiso2,
      numberTerap: formularioall.numberTerap,
      numberEncarg: formularioall.numberEncarg,
      numberOtro: formularioall.numberOtro,
      nota: formularioall.nota,
      idUnico: idUnico,
      formaPago: formaPago,
      totalServicio: totalServicio,
      horaEnd: horaEnd,
      servicio: formularioall.servicio,
      bebidas: formularioall.bebidas,
      tabaco: formularioall.tabaco,
      vitaminas: formularioall.vitaminas,
      propina: formularioall.propina,
      otros: formularioall.otros,
      salida: formularioall.salida,
      fechaHoyInicio: fechaHoyInicio,
      editar: true,
      valueEfectivo: valueEfectivo,
      valueBizum: valueBizum,
      valueTarjeta: valueTarjeta,
      valueTrans: valueTrans,
      cierre: false,
      valueEfectTerapeuta: valueEfectTerapeuta,
      valueBizuTerapeuta: valueBizuTerapeuta,
      valueTarjeTerapeuta: valueTarjeTerapeuta,
      valueTransTerapeuta: valueTransTerapeuta,
      valueEfectEncargada: valueEfectEncargada,
      valueBizuEncargada: valueBizuEncargada,
      valueTarjeEncargada: valueTarjeEncargada,
      valueTransEncargada: valueTransEncargada,
      currentDate: currentDate,
      liquidadoEncargada: false,
      liquidadoTerapeuta: false,
      idTerapeuta: '',
      idEncargada: '',
      idCierre: '',

      valuePiso1Efectivo: valuePiso1Efectivo,
      valuePiso1Bizum: valuePiso1Bizum,
      valuePiso1Tarjeta: valuePiso1Tarjeta,
      valuePiso1Transaccion: valuePiso1Transaccion,
      valuePiso2Efectivo: valuePiso2Efectivo,
      valuePiso2Bizum: valuePiso2Bizum,
      valuePiso2Tarjeta: valuePiso2Tarjeta,
      valuePiso2Transaccion: valuePiso2Transaccion
    };
    return new Promise<any>((resolve, reject) => {
      this.db.collection('servicio').add(formularioall).then(
        (response) => resolve(response),
        (error) => reject(error)
      );
    });
  }

  // Get

  geyByCurrentDesc(): Promise<any> {
    return new Promise((resolve, _reject) => {
      this.db.collection('servicio', (ref) => ref.orderBy('id', 'desc').where('cierre', '==', true)).valueChanges({ idField: 'idDocument' }).subscribe((rp) => {
        if (rp[0]?.idDocument) {
          resolve(rp);
        } else {
          resolve(rp);
        }
      });
    });
  }

  getByTerapeutaAndEncargada(terapeuta: string, encargada: string) {
    return this.db.collection('servicio', (ref) => ref.where('terapeuta', '==', terapeuta).where('encargada', '==', encargada)).valueChanges();
  }

  getByEncargada(encargada: string) {
    return this.db.collection('servicio', (ref) => ref.where('encargada', '==', encargada).where("liquidadoEncargada", "==", false)).valueChanges();
  }

  getServicio() {
    return this.db.collection('servicio', (ref) => ref.orderBy('currentDate', 'desc').orderBy('horaStart', 'desc')).valueChanges();
  }

  getByLiquidEncargadaFalse() {
    return this.db.collection('servicio', (ref) => ref.orderBy('currentDate', 'desc').where('liquidadoEncargada', '==', false)).valueChanges();
  }

  getByLiquidTerapFalse() {
    return this.db.collection('servicio', (ref) => ref.orderBy('currentDate', 'desc').where('liquidadoTerapeuta', '==', false)).valueChanges();
  }

  getByLiquidTerapTrue() {
    return this.db.collection('servicio', (ref) => ref.orderBy('currentDate', 'desc').where('liquidadoTerapeuta', '==', true)).valueChanges();
  }

  getByIdTerap(idTerap) {
    return this.db.collection('servicio', (ref) => ref.where('idTerapeuta', '==', idTerap)).valueChanges();
  }

  getByIdCierre(idCierre) {
    return this.db.collection('servicio', (ref) => ref.where('idCierre', '==', idCierre)).valueChanges();
  }

  getByIdEncarg(idEncarg) {
    return this.db.collection('servicio', (ref) => ref.where('idEncargada', '==', idEncarg)).valueChanges();
  }

  geyByCierreFalse(): Promise<any> {
    return new Promise((resolve, _reject) => {
      this.db.collection('servicio', (ref) => ref.orderBy('currentDate', 'desc').where('cierre', '==', false)).valueChanges({ idField: 'idDocument' }).subscribe((rp) => {
        if (rp[0]?.idDocument) {
          resolve(rp);
        } else {
          resolve(rp);
        }
      });
    });
  }

  geyByCierreTrue(): Promise<any> {
    return new Promise((resolve, _reject) => {
      this.db.collection('servicio', (ref) => ref.orderBy('currentDate', 'desc').where('cierre', '==', false)).valueChanges({ idField: 'idDocument' }).subscribe((rp) => {
        if (rp[0]?.idDocument) {
          resolve(rp);
        } else {
          resolve(rp);
        }
      });
    });
  }

  getById(id: string): Promise<any> {
    return new Promise((resolve, _reject) => {
      this.db.collection('servicio', (ref) => ref.where('id', '==', id)).valueChanges({ idField: 'idDocument' }).subscribe((rp) => {
        if (rp[0]?.idDocument) {
          resolve(rp);
        } else {
          resolve(rp);
        }
      });
    });
  }

  getByEditar(id: string): Promise<any> {
    return new Promise((resolve, _reject) => {
      this.db.collection('servicio', (ref) => ref.where('id', '==', id).where('editar', '==', true)).valueChanges({ idField: 'idDocument' }).subscribe((rp) => {
        if (rp[0]?.idDocument) {
          resolve(rp);
        } else {
          resolve(rp);
        }
      });
    });
  }

  getTerapeutaByAsc(terapeuta: string): Promise<any> {
    return new Promise((resolve, _reject) => {
      this.db.collection('servicio', (ref) => ref.where('terapeuta', '==', terapeuta).orderBy('id', 'asc')).valueChanges({ idField: 'idDocument' }).subscribe((rp) => {
        if (rp[0]?.idDocument) {
          resolve(rp);
        } else {
          resolve(rp);
        }
      });
    });
  }

  getTerapeutaByDesc(terapeuta: string): Promise<any> {
    return new Promise((resolve, _reject) => {
      this.db.collection('servicio', (ref) => ref.where('terapeuta', '==', terapeuta).orderBy('id', 'desc')).valueChanges({ idField: 'idDocument' }).subscribe((rp) => {
        if (rp[0]?.idDocument) {
          resolve(rp);
        } else {
          resolve(rp);
        }
      });
    });
  }

  getTerapeuta(nombre: string): Promise<any> {
    return new Promise((resolve, _reject) => {
      this.db.collection('servicio', (ref) => ref.where('terapeuta', '==', nombre)).valueChanges({ idField: 'idDocument' }).subscribe((rp) => {
        if (rp[0]?.idDocument) {
          resolve(rp);
        } else {
          resolve(rp);
        }
      });
    });
  }

  getIdDocument(id: string): Promise<any> {
    return new Promise((resolve, _reject) => {
      this.db.collection('servicio', (ref) => ref.where('idUnico', '==', id)).valueChanges({ idField: 'idDocument' }).subscribe((rp) => {
        if (rp[0]?.idDocument) {
          resolve(rp);
        } else {
          resolve(rp);
        }
      });
    });
  }

  getEncargada(nombre: string): Promise<any> {
    return new Promise((resolve, _reject) => {
      this.db.collection('servicio', (ref) => ref.where('encargada', '==', nombre)).valueChanges({ idField: 'idDocument' }).subscribe((rp) => {
        if (rp[0]?.idDocument) {
          resolve(rp);
        } else {
          resolve(rp);
        }
      });
    });
  }

  getTerapeutaEncargada(terapeuta: string, encargada: string): Promise<any> {
    return new Promise((resolve, _reject) => {
      this.db.collection('servicio', (ref) => ref.where('terapeuta', '==', terapeuta)
        .where('encargada', '==', encargada).where('liquidadoTerapeuta', '==', false)).valueChanges({ idField: 'idDocument' }).subscribe((rp) => {
          if (rp[0]?.idDocument) {
            resolve(rp);
          } else {
            resolve(rp);
          }
        });
    });
  }

  getEncargadaAndLiquidacion(encargada: string): Promise<any> {
    return new Promise((resolve, _reject) => {
      this.db.collection('servicio', (ref) => ref.where('encargada', '==', encargada)
        .where('liquidadoEncargada', '==', false)).valueChanges({ idField: 'idDocument' }).subscribe((rp) => {
          if (rp[0]?.idDocument) {
            resolve(rp);
          } else {
            resolve(rp);
          }
        });
    });
  }

  getEncargadaNoLiquidadaTerap(encargada: string): Promise<any> {
    return new Promise((resolve, _reject) => {
      this.db.collection('servicio', (ref) => ref.where('encargada', '==', encargada)
        .where('liquidadoTerapeuta', '==', false)).valueChanges({ idField: 'idDocument' }).subscribe((rp) => {
          if (rp[0]?.idDocument) {
            resolve(rp);
          } else {
            resolve(rp);
          }
        });
    });
  }

  getEncargadaNoLiquidada(encargada: string): Promise<any> {
    return new Promise((resolve, _reject) => {
      this.db.collection('servicio', (ref) => ref.where('encargada', '==', encargada)
        .where('liquidadoEncargada', '==', false)).valueChanges({ idField: 'idDocument' }).subscribe((rp) => {
          if (rp[0]?.idDocument) {
            resolve(rp);
          } else {
            resolve(rp);
          }
        });
    });
  }

  getEncargadaNoLiquidadaByFechaDesc(encargada: string): Promise<any> {
    return new Promise((resolve, _reject) => {
      this.db.collection('servicio', (ref) => ref.where('encargada', '==', encargada)
        .where('liquidadoEncargada', '==', false).orderBy('fechaHoyInicio', 'desc')).valueChanges({ idField: 'idDocument' }).subscribe((rp) => {
          if (rp[0]?.idDocument) {
            resolve(rp);
          } else {
            resolve(rp);
          }
        });
    });
  }

  getTerapNoLiquidadaByFechaDesc(encargada: string): Promise<any> {
    return new Promise((resolve, _reject) => {
      this.db.collection('servicio', (ref) => ref.where('encargada', '==', encargada)
        .where('liquidadoTerapeuta', '==', false).orderBy('fechaHoyInicio', 'desc')).valueChanges({ idField: 'idDocument' }).subscribe((rp) => {
          if (rp[0]?.idDocument) {
            resolve(rp);
          } else {
            resolve(rp);
          }
        });
    });
  }

  getEncargadaNoLiquidadaByFechaAsc(encargada: string): Promise<any> {
    return new Promise((resolve, _reject) => {
      this.db.collection('servicio', (ref) => ref.where('encargada', '==', encargada)
        .where('liquidadoEncargada', '==', false).orderBy('fechaHoyInicio', 'asc')).valueChanges({ idField: 'idDocument' }).subscribe((rp) => {
          if (rp[0]?.idDocument) {
            resolve(rp);
          } else {
            resolve(rp);
          }
        });
    });
  }

  getTerapNoLiquidadaByFechaAsc(encargada: string): Promise<any> {
    return new Promise((resolve, _reject) => {
      this.db.collection('servicio', (ref) => ref.where('encargada', '==', encargada)
        .where('liquidadoTerapeuta', '==', false).orderBy('fechaHoyInicio', 'asc')).valueChanges({ idField: 'idDocument' }).subscribe((rp) => {
          if (rp[0]?.idDocument) {
            resolve(rp);
          } else {
            resolve(rp);
          }
        });
    });
  }

  getEncargadaNoCierre(encargada: string): Promise<any> {
    return new Promise((resolve, _reject) => {
      this.db.collection('servicio', (ref) => ref.where('encargada', '==', encargada)
        .where('cierre', '==', false)).valueChanges({ idField: 'idDocument' }).subscribe((rp) => {
          if (rp[0]?.idDocument) {
            resolve(rp);
          } else {
            resolve(rp);
          }
        });
    });
  }

  getTerapeutaFechaAsc(terapeuta: string, encargada: string): Promise<any> {
    return new Promise((resolve, _reject) => {
      this.db.collection('servicio', (ref) => ref.orderBy('currentDate', 'asc')
        .where('terapeuta', '==', terapeuta).where('encargada', '==', encargada).where('liquidadoTerapeuta', '==', false))
        .valueChanges({ idField: 'idDocument' }).subscribe((rp) => {
          if (rp[0]?.idDocument) {
            resolve(rp);
          } else {
            resolve(rp);
          }
        });
    });
  }

  getTerapeutaFechaAscByLiqTrue(terapeuta: string, encargada: string): Promise<any> {
    return new Promise((resolve, _reject) => {
      this.db.collection('servicio', (ref) => ref.orderBy('currentDate', 'asc')
        .where('terapeuta', '==', terapeuta).where('encargada', '==', encargada).where('liquidadoTerapeuta', '==', true))
        .valueChanges({ idField: 'idDocument' }).subscribe((rp) => {
          if (rp[0]?.idDocument) {
            resolve(rp);
          } else {
            resolve(rp);
          }
        });
    });
  }

  getEncargadaFechaAscByLiqTrue(encargada: string): Promise<any> {
    return new Promise((resolve, _reject) => {
      this.db.collection('servicio', (ref) => ref.orderBy('currentDate', 'asc')
        .where('encargada', '==', encargada).where('liquidadoEncargada', '==', true))
        .valueChanges({ idField: 'idDocument' }).subscribe((rp) => {
          if (rp[0]?.idDocument) {
            resolve(rp);
          } else {
            resolve(rp);
          }
        });
    });
  }

  getEncargFechaAsc(encargada: string): Promise<any> {
    return new Promise((resolve, _reject) => {
      this.db.collection('servicio', (ref) => ref.orderBy('currentDate', 'asc')
        .where('encargada', '==', encargada).where('liquidadoEncargada', '==', false))
        .valueChanges({ idField: 'idDocument' }).subscribe((rp) => {
          if (rp[0]?.idDocument) {
            resolve(rp);
          } else {
            resolve(rp);
          }
        });
    });
  }

  getTerapeutaFechaDesc(terapeuta: string, encargada: string): Promise<any> {
    return new Promise((resolve, _reject) => {
      this.db.collection('servicio', (ref) => ref.orderBy('currentDate', 'desc')
        .where('terapeuta', '==', terapeuta).where('encargada', '==', encargada).where('liquidadoTerapeuta', '==', false))
        .valueChanges({ idField: 'idDocument' }).subscribe((rp) => {
          if (rp[0]?.idDocument) {
            resolve(rp);
          } else {
            resolve(rp);
          }
        });
    });
  }

  getTerapeutaFechaDescByLiqFalse(terapeuta: string, encargada: string): Promise<any> {
    return new Promise((resolve, _reject) => {
      this.db.collection('servicio', (ref) => ref.orderBy('currentDate', 'desc')
        .where('terapeuta', '==', terapeuta).where('encargada', '==', encargada).where('liquidadoTerapeuta', '==', true))
        .valueChanges({ idField: 'idDocument' }).subscribe((rp) => {
          if (rp[0]?.idDocument) {
            resolve(rp);
          } else {
            resolve(rp);
          }
        });
    });
  }

  getEncargadaFechaDescByLiqTrue(encargada: string): Promise<any> {
    return new Promise((resolve, _reject) => {
      this.db.collection('servicio', (ref) => ref.orderBy('currentDate', 'desc')
        .where('encargada', '==', encargada).where('liquidadoEncargada', '==', true)).valueChanges({ idField: 'idDocument' }).subscribe((rp) => {
          if (rp[0]?.idDocument) {
            resolve(rp);
          } else {
            resolve(rp);
          }
        });
    });
  }

  getEncargadaWithCurrentDate(nombre: string): Promise<any> {
    return new Promise((resolve, _reject) => {
      this.db.collection('servicio', (ref) => ref.where('terapeuta', '==', nombre).orderBy('currentDate', 'desc'))
        .valueChanges({ idField: 'idDocument' }).subscribe((rp) => {
          if (rp[0]?.idDocument) {
            resolve(rp);
          } else {
            resolve(rp);
          }
        });
    });
  }

  getEncargFechaDesc(encargada: string): Promise<any> {
    return new Promise((resolve, _reject) => {
      this.db.collection('servicio', (ref) => ref.orderBy('currentDate', 'desc')
        .where('encargada', '==', encargada).where('liquidadoEncargada', '==', false)).valueChanges({ idField: 'idDocument' }).subscribe((rp) => {
          if (rp[0]?.idDocument) {
            resolve(rp);
          } else {
            resolve(rp);
          }
        });
    });
  }

  getEncargadaFechaAsc(encargada: string): Promise<any> {
    return new Promise((resolve, _reject) => {
      this.db.collection('servicio', (ref) => ref.orderBy('id', 'asc').where('encargada', '==', encargada))
        .valueChanges({ idField: 'idDocument' }).subscribe((rp) => {
          if (rp[0]?.idDocument) {
            resolve(rp);
          } else {
            resolve(rp);
          }
        });
    });
  }

  getEncargadaFechaDesc(encargada: string): Promise<any> {
    return new Promise((resolve, _reject) => {
      this.db.collection('servicio', (ref) => ref.orderBy('id', 'desc').where('encargada', '==', encargada))
        .valueChanges({ idField: 'idDocument' }).subscribe((rp) => {
          if (rp[0]?.idDocument) {
            resolve(rp);
          } else {
            resolve(rp);
          }
        });
    });
  }


  getFechaHoy(fechaHoy): Promise<any> {
    return new Promise((resolve, _reject) => {
      this.db.collection('servicio', (ref) => ref.orderBy('currentDate', 'desc').where('fechaHoyInicio', '==', fechaHoy))
        .valueChanges({ idField: 'idDocument' }).subscribe((rp) => {
          if (rp[0]?.idDocument) {
            resolve(rp);
          } else {
            resolve(rp);
          }
        });
    });
  }

  getIdUnicoByCierre(idUnico: string): Promise<any> {
    return new Promise((resolve, _reject) => {
      this.db.collection('servicio', (ref) => ref.where('idUnico', '==', idUnico)
        .where('cierre', '==', false)).valueChanges({ idField: 'idDocument' }).subscribe((rp) => {
          if (rp[0]?.idDocument) {
            resolve(rp);
          } else {
            resolve(rp);
          }
        });
    });
  }

  getIdUnico(idUnico: string): Promise<any> {
    return new Promise((resolve, _reject) => {
      this.db.collection('servicio', (ref) => ref.where('idUnico', '==', idUnico).orderBy('idUnico', 'desc'))
        .valueChanges({ idField: 'idDocument' }).subscribe((rp) => {
          if (rp[0]?.idDocument) {
            resolve(rp);
          } else {
            resolve(rp);
          }
        });
    });
  }

  // Update

  updateServicio(idDocumentServicio, idServicio, servi: Servicio) {
    return this.db.collection('servicio', (ref) => ref.where('id', '==', idServicio)).doc(idDocumentServicio).update(servi);
  }

  updateAllServicio(idDocumentServicio, idServicio) {
    return this.db.collection('servicio', (ref) => ref.where('id', '==', idServicio)).doc(idDocumentServicio).update({
      numberPiso1: 0,
      numberTerap: 0,
      propina: 0,
      servicio: 0,
      totalServicio: 0,
      minuto: 0,
    });
  }

  updateNumberPiso1(idDocumentServicio, idUnico) {
    return this.db.collection('servicio', (ref) => ref.where('idUnico', '==', idUnico)).doc(idDocumentServicio).update({
      numberPiso1: 0,
    });
  }

  updateWithValueNumberPiso1(idDocumentServicio, idUnico, piso1) {
    return this.db.collection('servicio', (ref) => ref.where('idUnico', '==', idUnico)).doc(idDocumentServicio).update({
      numberPiso1: piso1,
    });
  }

  updateNumberPiso2(idDocumentServicio, idUnico) {
    return this.db.collection('servicio', (ref) => ref.where('idUnico', '==', idUnico)).doc(idDocumentServicio).update({
      numberPiso2: 0,
    });
  }

  updateWithValueNumberPiso2(idDocumentServicio, idUnico, piso2) {
    return this.db.collection('servicio', (ref) => ref.where('idUnico', '==', idUnico)).doc(idDocumentServicio).update({
      numberPiso2: piso2,
    });
  }

  updateNumberEncargada(idDocumentServicio, idUnico) {
    return this.db.collection('servicio', (ref) => ref.where('idUnico', '==', idUnico)).doc(idDocumentServicio).update({
      numberEncarg: 0,
    });
  }

  updateWithValueNumberEncargada(idDocumentServicio, idUnico, encargada) {
    return this.db.collection('servicio', (ref) => ref.where('idUnico', '==', idUnico)).doc(idDocumentServicio).update({
      numberEncarg: encargada,
    });
  }

  updateNumberTerap(idDocumentServicio, idUnico) {
    return this.db.collection('servicio', (ref) => ref.where('idUnico', '==', idUnico)).doc(idDocumentServicio).update({
      numberTerap: 0,
    });
  }

  updateWithValueNumberTerap(idDocumentServicio, idUnico, terapeuta) {
    return this.db.collection('servicio', (ref) => ref.where('idUnico', '==', idUnico)).doc(idDocumentServicio).update({
      numberTerap: terapeuta,
    });
  }

  updateNumberOtros(idDocumentServicio, idUnico) {
    return this.db.collection('servicio', (ref) => ref.where('idUnico', '==', idUnico)).doc(idDocumentServicio).update({
      numberOtro: 0,
    });
  }

  updateWithValueNumberOtros(idDocumentServicio, idUnico, otro) {
    return this.db.collection('servicio', (ref) => ref.where('idUnico', '==', idUnico)).doc(idDocumentServicio).update({
      numberOtro: otro,
    });
  }

  updateLiquidacionTerap(idDocument, id, idTerapeuta) {
    return this.db.collection('servicio', (ref) => ref.where('id', '==', id)).doc(idDocument).update({
      liquidadoTerapeuta: true,
      idTerapeuta: idTerapeuta
    });
  }

  updateLiquidacionEncarg(idDocument, id, idEncargada) {
    return this.db.collection('servicio', (ref) => ref.where('id', '==', id)).doc(idDocument).update({
      liquidadoEncargada: true,
      idEncargada: idEncargada
    });
  }

  updateCierre(idDocument, id, idCierre) {
    return this.db.collection('servicio', (ref) => ref.where('id', '==', id)).doc(idDocument).update({
      cierre: true,
      idCierre: idCierre
    });
  }

  // Delete

  async deleteServicio(idDocument, id): Promise<any> {
    this.db.collection('servicio', (ref) => ref.where('id', '==', id)).doc(idDocument).delete();
  }
}
