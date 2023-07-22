import { Injectable } from '@angular/core';
import 'firebase/compat/app';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';

@Injectable()
export class LiquidacioneEncargService {
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

  registerLiquidacionesEncargada(encargada, desdeFechaLiquidado, hastaFechaLiquidado, desdeHoraLiquidado, hastaHoraLiquidado,
    tratamiento, importe, idEncargada) {
    let formularioall = {
      id: `uid${this.makeid(10)}`,
      encargada: encargada,
      desdeFechaLiquidado: desdeFechaLiquidado,
      hastaFechaLiquidado: hastaFechaLiquidado,
      desdeHoraLiquidado: desdeHoraLiquidado,
      hastaHoraLiquidado: hastaHoraLiquidado,
      tratamiento: tratamiento,
      importe: importe,
      idEncargada: idEncargada
    };
    return new Promise<any>((resolve, reject) => {
      this.db.collection('liquidacionesEncargada').add(formularioall).then(
        (response) => resolve(response),
        (error) => reject(error)
      );
    });
  }

  // Get

  getLiquidacionesEncargada() {
    return this.db.collection('liquidacionesEncargada', (ref) => ref.orderBy('id', 'desc')).valueChanges();
  }

  getIdEncarg(idEncarg): Promise<any> {
    return new Promise((resolve, _reject) => {
      this.db.collection('liquidacionesEncargada', (ref) => ref.where('idEncargada', '==', idEncarg))
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

  update(idDocument, nombreEncarg, idEncargada) {
    return this.db.collection('liquidacionesEncargada', (ref) => ref.where('nombre', '==', nombreEncarg))
      .doc(idDocument).update({
        idEncargada: idEncargada
      });
  }

  updateById(idDocument, idEncargada, importe) {
    return this.db.collection('liquidacionesEncargada', (ref) => ref.where('idEncargada', '==', idEncargada))
      .doc(idDocument).update({
        importe: importe
      });
  }
}