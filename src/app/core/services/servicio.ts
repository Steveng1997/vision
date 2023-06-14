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

  registerServicio(formularioall, formaPago, fecha, horaStart, totalServicio, horaEnd,
    salida, fechaHoyInicio, valueEfectivo, valueBizum, valueTarjeta, valueTrans) {
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
      salida: salida,
      fechaHoyInicio: fechaHoyInicio,
      editar: true,
      liquidado: false,
      valueEfectivo: valueEfectivo,
      valueBizum: valueBizum,
      valueTarjeta: valueTarjeta,
      valueTrans: valueTrans,
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
      .collection('servicio', (ref) => ref.orderBy('fechaHoyInicio', 'asc'))
      .valueChanges();
  }

  getByLiquidFalse() {
    return this.db
      .collection('servicio', (ref) => ref.orderBy('id', 'asc').where('liquidado', '==', false))
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

  getTerapeutaByAsc(nombre: string): Promise<any> {
    return new Promise((resolve, _reject) => {
      this.db
        .collection('servicio', (ref) => ref.where('terapeuta', '==', nombre).orderBy('id', 'asc'))
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

  getFechaHoy(fecha): Promise<any> {
    return new Promise((resolve, _reject) => {
      this.db
        .collection('servicio', (ref) => ref.where('fechaHoyInicio', '==', fecha))
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

  // -----------------------------------------------------------------------------------
  // End Delete
  // -----------------------------------------------------------------------------------
}
