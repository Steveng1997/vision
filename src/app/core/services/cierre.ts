import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';

@Injectable()
export class CierreService {
  constructor(public router: Router, private db: AngularFirestore) { }

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

  registerCierre(encargada, fechaDesde, fechaHasta, horaDesde, horaHasta, tratamiento, total,
    efectivo, bizum, tarjeta, transaccion, currentDate, idCierre) {
    let formularioall = {
      id: `uid${this.makeid(10)}`,
      encargada: encargada,
      fechaDesde: fechaDesde,
      fechaHasta: fechaHasta,
      horaDesde: horaDesde,
      horaHasta: horaHasta,
      tratamiento: tratamiento,
      total: total,
      efectivo: efectivo,
      bizum: bizum,
      tarjeta: tarjeta,
      transaccion: transaccion,
      currentDate: currentDate,
      idCierre: idCierre
    };
    return new Promise<any>((resolve, reject) => {
      this.db.collection('cierre').add(formularioall).then(
        (response) => resolve(response),
        (error) => reject(error)
      );
    });
  }

  // Get

  getAllCierre() {
    return this.db.collection('cierre', (ref) => ref.orderBy('currentDate', 'desc')).valueChanges();
  }

  getServicioByEncargadaAndIdUnico(encargada: string): Promise<any> {
    return new Promise((resolve, _reject) => {
      this.db.collection('servicio', (ref) => ref.where('encargada', '==', encargada)
        .where('cierre', '==', false).orderBy('currentDate', 'asc')).valueChanges({ idField: 'idDocument' }).subscribe((rp) => {
          if (rp[0]?.idDocument) {
            resolve(rp);
          } else {
            resolve(rp);
          }
        });
    });
  }

  getIdTerap(idCierre): Promise<any> {
    return new Promise((resolve, _reject) => {
      this.db.collection('cierre', (ref) => ref.where('idCierre', '==', idCierre))
        .valueChanges({ idField: 'idDocument' }).subscribe((rp) => {
          if (rp[0]?.idDocument) {
            resolve(rp);
          } else {
            resolve(rp);
          }
        });
    });
  }

  getEncargadaByCierre(encargada: string): Promise<any> {
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

  getEncargadaFechaAscByCierreTrue(encargada: string): Promise<any> {
    return new Promise((resolve, _reject) => {
      this.db.collection('servicio', (ref) => ref.orderBy('currentDate', 'asc')
        .where('encargada', '==', encargada).where('cierre', '==', true))
        .valueChanges({ idField: 'idDocument' }).subscribe((rp) => {
          if (rp[0]?.idDocument) {
            resolve(rp);
          } else {
            resolve(rp);
          }
        });
    });
  }

  getEncargadaFechaDescByCierreFalse(encargada: string): Promise<any> {
    return new Promise((resolve, _reject) => {
      this.db.collection('servicio', (ref) => ref.orderBy('currentDate', 'desc')
        .where('encargada', '==', encargada).where('cierre', '==', true))
        .valueChanges({ idField: 'idDocument' }).subscribe((rp) => {
          if (rp[0]?.idDocument) {
            resolve(rp);
          } else {
            resolve(rp);
          }
        });
    });
  }
}