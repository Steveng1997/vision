import { Injectable } from '@angular/core';
import 'firebase/compat/app';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';

@Injectable()
export class LiquidacioneTerapService {
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

  registerLiquidacionesTerapeutas(terapeuta, encargada, fechaLiquidado, horaLiquidado,
    tratamiento, importe) {
    let formularioall = {
      id: `uid${this.makeid(10)}`,
      terapeuta: terapeuta,
      encargada: encargada,
      fechaLiquidado: fechaLiquidado,
      horaLiquidado: horaLiquidado,
      tratamiento: tratamiento,
      importe: importe
    };
    return new Promise<any>((resolve, reject) => {
      this.db
        .collection('liquidacionesTerapeuta')
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

  getLiquidacionesTerapeuta() {
    return this.db
      .collection('liquidacionesTerapeuta', (ref) => ref.orderBy('id', 'desc'))
      .valueChanges();
  }
}