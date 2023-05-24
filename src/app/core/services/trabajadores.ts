import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

// Model
import { Trabajadores } from '../models/trabajadores';

// Firebase
import 'firebase/compat/app';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';

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

  registerEncargada(nombre: string) {
    let trabajador = {
      id: `uid${this.makeid(10)}`,
      nombre: nombre
    };
    return new Promise<any>((resolve, reject) => {
      this.db
        .collection('encargadas')
        .add(trabajador)
        .then(
          (response) => resolve(response),
          (error) => reject(error)
        );
    });
  }

  registerTerapeuta(nombre: string) {
    let trabajador = {
      id: `uid${this.makeid(10)}`,
      nombre: nombre
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

  getAllEncargada() {
    return this.db
      .collection('encargadas', (ref) => ref.orderBy('nombre', 'asc'))
      .valueChanges()
  }

  getEncargada(nombre: string): Promise<any> {
    return new Promise((resolve, _reject) => {
      this.db
        .collection('encargadas', (ref) => ref.where('nombre', '==', nombre))
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

  getByIdEncargada(id): Promise<any> {
    return new Promise((resolve, reject) => {
      this.db
        .collection('encargadas', (ref) => ref.where('id', '==', id))
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

  // Terapeutas

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

  updateEncargadas(idDocument, idEncargada, encargada: Trabajadores) {
    return this.db.collection('encargadas', (ref) => ref.where('id', '==', idEncargada))
      .doc(idDocument)
      .update(encargada);
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

  async deleteEncargadas(idDocument, id): Promise<any> {
    this.db
      .collection('encargadas', (ref) => ref.where('id', '==', id))
      .doc(idDocument)
      .delete();
  }

  // -----------------------------------------------------------------------------------
  // End Delete
  // -----------------------------------------------------------------------------------

}