import { Injectable } from '@angular/core';
import 'firebase/compat/app';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';

@Injectable()
export class LiquidacioneTerapService {
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

  registerLiquidacionesTerapeutas(terapeuta, encargada, desdeFechaLiquidado, hastaFechaLiquidado, desdeHoraLiquidado, hastaHoraLiquidado,
    tratamiento, importe, idTerapeuta, currentDate) {
    let formularioall = {
      id: `uid${this.makeid(10)}`,
      terapeuta: terapeuta,
      encargada: encargada,
      desdeFechaLiquidado: desdeFechaLiquidado,
      hastaFechaLiquidado: hastaFechaLiquidado,
      desdeHoraLiquidado: desdeHoraLiquidado,
      hastaHoraLiquidado: hastaHoraLiquidado,
      tratamiento: tratamiento,
      importe: importe,
      idTerapeuta: idTerapeuta,
      currentDate: currentDate
    };
    return new Promise<any>((resolve, reject) => {
      this.db.collection('liquidacionesTerapeuta').add(formularioall).then(
        (response) => resolve(response),
        (error) => reject(error)
      );
    });
  }

  // Get

  getLiquidacionesTerapeuta() {
    return this.db.collection('liquidacionesTerapeuta', (ref) => ref.orderBy('id', 'desc')).valueChanges();
  }

  getIdTerap(idTerap): Promise<any> {
    return new Promise((resolve, _reject) => {
      this.db.collection('liquidacionesTerapeuta', (ref) => ref.where('idTerapeuta', '==', idTerap))
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

  update(idDocument, nombreTerap, idTerapeuta) {
    return this.db.collection('liquidacionesTerapeuta', (ref) => ref.where('nombre', '==', nombreTerap)).doc(idDocument).update({
      idTerapeuta: idTerapeuta
    });
  }

  updateById(idDocument, idTerapeuta, importe) {
    return this.db.collection('liquidacionesTerapeuta', (ref) => ref.where('idTerapeuta', '==', idTerapeuta)).doc(idDocument).update({
      importe: importe
    });
  }
}