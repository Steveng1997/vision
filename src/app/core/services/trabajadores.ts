import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

// Model
import { Trabajadores } from '../models/trabajadores';

// Firebase
import 'firebase/compat/app';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class TrabajadoresService {

  constructor(public router: Router, private db: AngularFirestore) { }

  trabajadores: Trabajadores[] = [];
  cursoDoc: AngularFirestoreDocument<Trabajadores>;

  // -----------------------------------------------------------------------------------
  // Register
  // -----------------------------------------------------------------------------------

  makeid(length: number) {
    var result = '';
    var characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  registerTerapeuta(nombre: string) {
    let trabajador = {
      id: `uid${this.makeid(10)}`,
      nombre: nombre,
      servicio: 0,
      bebida: 0,
      tabaco: 0,
      vitamina: 0,
      otros: 0,
      propina: 0,
      activo: true,
    };
    return new Promise<any>((resolve, reject) => {
      this.db
        .collection('terapeutas')
        .add(trabajador)
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

  getByIdTerapeuta(id): Promise<any> {
    return new Promise((resolve, reject) => {
      this.db
        .collection('terapeutas', (ref) => ref.where('id', '==', id))
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

  getAllTerapeuta() {
    return this.db
      .collection('terapeutas', (ref) => ref.orderBy('nombre', 'asc'))
      .valueChanges()
  }

  getTerapeuta(nombre: string): Promise<any> {
    return new Promise((resolve, _reject) => {
      this.db
        .collection('terapeutas', (ref) => ref.where('nombre', '==', nombre))
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
  // End Get
  // -----------------------------------------------------------------------------------

  // -----------------------------------------------------------------------------------
  // Update
  // -----------------------------------------------------------------------------------

  updateTerapeutas(idDocument, idTerapeuta, terapeuta: Trabajadores) {
    return this.db.collection('terapeutas', (ref) => ref.where('id', '==', idTerapeuta))
      .doc(idDocument)
      .update(terapeuta);
  }

  // -----------------------------------------------------------------------------------
  // End Update
  // -----------------------------------------------------------------------------------

  // -----------------------------------------------------------------------------------
  // Delete
  // -----------------------------------------------------------------------------------

  async deleteTerapeuta(idDocument, id): Promise<any> {
    this.db
      .collection('terapeutas', (ref) => ref.where('id', '==', id))
      .doc(idDocument)
      .delete();
  }

  // -----------------------------------------------------------------------------------
  // End Delete
  // -----------------------------------------------------------------------------------

}