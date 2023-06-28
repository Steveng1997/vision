import { Injectable } from '@angular/core';
import 'firebase/compat/app';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';

@Injectable()
export class CierreService {
  constructor(public router: Router, private db: AngularFirestore) { }

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

  registerCierre(encargada, fechaDesde, fechaHasta, horaFecha, tratamiento, total,
    efectivo, bizum, tarjeta, transaccion) {
    let formularioall = {
      id: `uid${this.makeid(10)}`,
      encargada: encargada,
      fechaDesde: fechaDesde,
      fechaHasta: fechaHasta,
      horaFecha: horaFecha,
      tratamiento: tratamiento,
      total: total,
      efectivo: efectivo,
      bizum: bizum,
      tarjeta: tarjeta,
      transaccion: transaccion,
    };
    return new Promise<any>((resolve, reject) => {
      this.db
        .collection('cierre')
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

  getLiquidacionesEncargada() {
    return this.db
      .collection('cierre', (ref) => ref.orderBy('id', 'desc'))
      .valueChanges();
  }
}