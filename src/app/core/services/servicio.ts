import { Injectable } from '@angular/core';
import 'firebase/compat/app';
import { Servicio } from '../models/servicio';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

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

  registerServicio(formularioall, formaPago, fecha, hora, totalServicio, horaFin, salida, fechaHoy) {
    formularioall = {
      id: `uid${this.makeid(10)}`,
      terapeuta: formularioall.terapeuta,
      encargada: formularioall.encargada,
      cliente: formularioall.cliente,
      fecha: fecha,
      hora: hora,
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
      horaFin: horaFin,
      servicio: formularioall.servicio,
      bebidas: formularioall.bebidas,
      tabaco: formularioall.tabaco,
      vitaminas: formularioall.vitaminas,
      propina: formularioall.propina,
      otros: formularioall.otros,
      salida: salida,
      fechaHoy: fechaHoy
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
      .collection('servicio', (ref) => ref.orderBy('id', 'asc'))
      .valueChanges();
  }

  // getFecha() {
  //   return this.db
  //     .collection('servicio', (ref) => ref.orderBy('id', 'asc'))
  //     .valueChanges();
  // }

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

  // getFecha(fecha): Promise<any> {
  //   return new Promise((resolve, _reject) => {
  //     this.db
  //       .collection('servicio', (ref) => ref.where('fecha', '==', fecha))
  //       .valueChanges({ idField: 'idDocument' })
  //       .subscribe((rp) => {
  //         if (rp[0]?.idDocument) {
  //           resolve(rp);
  //         } else {
  //           resolve(rp);
  //         }
  //       });
  //   });
  // }

  // getFechaInicialAndFinal(fechaInicial, fechaFinal): Promise<any> {
  //   return new Promise((resolve, _reject) => {
  //     this.db
  //       .collection('servicio', (ref) => ref.where('fecha', '==', fechaInicial).where('fecha', '==', fechaFinal))
  //       .valueChanges({ idField: 'idDocument' })
  //       .subscribe((rp) => {
  //         if (rp[0]?.idDocument) {
  //           resolve(rp);
  //         } else {
  //           resolve(rp);
  //         }
  //       });
  //   });
  // }

  // -----------------------------------------------------------------------------------
  // Get
  // -----------------------------------------------------------------------------------

  // -----------------------------------------------------------------------------------
  // Update
  // -----------------------------------------------------------------------------------

  //   updateRetos(idDocumentReto, idReto, reto: Retos) {
  //     return this.db
  //       .collection('retos', (ref) => ref.where('id', '==', idReto))
  //       .doc(idDocumentReto)
  //       .update(reto);
  //   }


  // -----------------------------------------------------------------------------------
  // End Update
  // -----------------------------------------------------------------------------------

  // -----------------------------------------------------------------------------------
  // Delete
  // -----------------------------------------------------------------------------------

  //   async deleteRetos(idDocument, id): Promise<any> {
  //     this.db
  //       .collection('retos', (ref) => ref.where('id', '==', id))
  //       .doc(idDocument)
  //       .delete();
  //   }

  //   async deleteRetoPersonal(idDocument, id): Promise<any> {
  //     this.db
  //       .collection('retoPersonal', (ref) => ref.where('id', '==', id))
  //       .doc(idDocument)
  //       .delete();
  //   }

  // -----------------------------------------------------------------------------------
  // End Delete
  // -----------------------------------------------------------------------------------
}
