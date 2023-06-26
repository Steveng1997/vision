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

  // -----------------------------------------------------------------------------------
  // Register
  // -----------------------------------------------------------------------------------
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

  registerServicio(formularioall, formaPago, fecha, horaStart, totalServicio, horaEnd, fechaHoyInicio, 
    valueEfectivo, valueBizum, valueTarjeta, valueTrans, valueEfectTerapeuta, valueBizuTerapeuta, 
    valueTarjeTerapeuta, valueTransTerapeuta, valueEfectEncargada, valueBizuEncargada, valueTarjeEncargada, 
    valueTransEncargada, currentDate) {
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
      liquidado: false,
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
    };
    return new Promise<any>((resolve, reject) => {
      this.db
        .collection('servicio')
        .add(formularioall)
        .then(
          (response) => resolve(response),
          (error) => reject(error)
        );
    });
  }

  // -----------------------------------------------------------------------------------
  // End register
  // -----------------------------------------------------------------------------------

  // -----------------------------------------------------------------------------------
  // Get
  // -----------------------------------------------------------------------------------

  getServicio() {
    return this.db
      .collection('servicio', (ref) => ref.orderBy('currentDate', 'desc'))
      .valueChanges();
  }

  getByLiquidFalse() {
    return this.db
      .collection('servicio', (ref) => ref.orderBy('currentDate', 'desc').where('liquidado', '==', false))
      .valueChanges();
  }

  getByLiquidTrue() {
    return this.db
      .collection('servicio', (ref) => ref.orderBy('currentDate', 'desc').where('liquidado', '==', true))
      .valueChanges();
  }

  geyByCierreFalse() {
    return this.db
      .collection('servicio', (ref) => ref.orderBy('currentDate', 'desc').where('cierre', '==', false))
      .valueChanges();
  }

  getById(id: string): Promise<any> {
    return new Promise((resolve, _reject) => {
      this.db
        .collection('servicio', (ref) => ref.where('id', '==', id))
        .valueChanges({ idField: 'idDocument' })
        .subscribe((rp) => {
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
      this.db
        .collection('servicio', (ref) => ref.where('id', '==', id).where('editar', '==', true))
        .valueChanges({ idField: 'idDocument' })
        .subscribe((rp) => {
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
      this.db
        .collection('servicio', (ref) => ref.where('terapeuta', '==', terapeuta).orderBy('id', 'asc'))
        .valueChanges({ idField: 'idDocument' })
        .subscribe((rp) => {
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
      this.db
        .collection('servicio', (ref) => ref.where('terapeuta', '==', terapeuta).orderBy('id', 'desc'))
        .valueChanges({ idField: 'idDocument' })
        .subscribe((rp) => {
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
      this.db
        .collection('servicio', (ref) => ref.where('terapeuta', '==', nombre))
        .valueChanges({ idField: 'idDocument' })
        .subscribe((rp) => {
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
      this.db
        .collection('servicio', (ref) => ref.where('encargada', '==', nombre))
        .valueChanges({ idField: 'idDocument' })
        .subscribe((rp) => {
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
      this.db
        .collection('servicio', (ref) => ref.where('terapeuta', '==', terapeuta)
          .where('encargada', '==', encargada).where('liquidado', '==', false))
        .valueChanges({ idField: 'idDocument' })
        .subscribe((rp) => {
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
      this.db
        .collection('servicio', (ref) => ref.where('encargada', '==', encargada)
          .where('liquidado', '==', false))
        .valueChanges({ idField: 'idDocument' })
        .subscribe((rp) => {
          if (rp[0]?.idDocument) {
            resolve(rp);
          } else {
            resolve(rp);
          }
        });
    });
  }

  getTerapeutaFechaAsc(terapeuta: string): Promise<any> {
    return new Promise((resolve, _reject) => {
      this.db
        .collection('servicio', (ref) => ref.orderBy('id', 'asc')
          .where('terapeuta', '==', terapeuta))
        .valueChanges({ idField: 'idDocument' })
        .subscribe((rp) => {
          if (rp[0]?.idDocument) {
            resolve(rp);
          } else {
            resolve(rp);
          }
        });
    });
  }

  getTerapeutaFechaDesc(terapeuta: string): Promise<any> {
    return new Promise((resolve, _reject) => {
      this.db
        .collection('servicio', (ref) => ref.orderBy('id', 'desc')
          .where('terapeuta', '==', terapeuta))
        .valueChanges({ idField: 'idDocument' })
        .subscribe((rp) => {
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
      this.db
        .collection('servicio', (ref) => ref.orderBy('id', 'asc')
          .where('encargada', '==', encargada))
        .valueChanges({ idField: 'idDocument' })
        .subscribe((rp) => {
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
      this.db
        .collection('servicio', (ref) => ref.orderBy('id', 'desc')
          .where('encargada', '==', encargada))
        .valueChanges({ idField: 'idDocument' })
        .subscribe((rp) => {
          if (rp[0]?.idDocument) {
            resolve(rp);
          } else {
            resolve(rp);
          }
        });
    });
  }


  getFechaHoy(): Promise<any> {
    return new Promise((resolve, _reject) => {
      this.db
        .collection('servicio', (ref) => ref.orderBy('currentDate', 'desc'))
        .valueChanges({ idField: 'idDocument' })
        .subscribe((rp) => {
          if (rp[0]?.idDocument) {
            resolve(rp);
          } else {
            resolve(rp);
          }
        });
    });
  }

  // -----------------------------------------------------------------------------------
  // Get
  // -----------------------------------------------------------------------------------

  // -----------------------------------------------------------------------------------
  // Update
  // -----------------------------------------------------------------------------------

  updateServicio(idDocumentServicio, idServicio, servi: Servicio) {
    return this.db
      .collection('servicio', (ref) => ref.where('id', '==', idServicio))
      .doc(idDocumentServicio)
      .update(servi);
  }

  // -----------------------------------------------------------------------------------
  // End Update
  // -----------------------------------------------------------------------------------

  // -----------------------------------------------------------------------------------
  // Delete
  // -----------------------------------------------------------------------------------

  async deleteServicio(idDocument, id): Promise<any> {
    this.db
      .collection('servicio', (ref) => ref.where('id', '==', id))
      .doc(idDocument)
      .delete();
  }

  updateLiquidacion(idDocument, id) {
    return this.db
      .collection('servicio', (ref) => ref.where('id', '==', id))
      .doc(idDocument)
      .update({
        liquidado: true,
      });
  }

  updateCierre(idDocument, id) {
    return this.db
      .collection('servicio', (ref) => ref.where('id', '==', id))
      .doc(idDocument)
      .update({
        cierre: true,
      });
  }

  // -----------------------------------------------------------------------------------
  // End Delete
  // -----------------------------------------------------------------------------------
}
