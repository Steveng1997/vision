import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

// Alert
import Swal from 'sweetalert2';

// Model
import { Trabajadores } from '../models/trabajadores';

// Firebase
import 'firebase/compat/app';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Injectable({
  providedIn: 'root'
})
export class TrabajadoresService {

  constructor(
    public router: Router,
    private db: AngularFirestore,
    private authFire: AngularFireAuth
  ) { }

  trabajadores: Trabajadores[] = [];

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

  registerPersona(nombre: string) {
    let trabajador = {
      id: `uid${this.makeid(10)}`,
      nombre: nombre
    };
    return new Promise<any>((resolve, reject) => {
      this.db
        .collection('trabajadores')
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

  geyByName(nombre: string): Promise<any> {
    return new Promise((resolve, _reject) => {
      this.db
        .collection('trabajadores', (ref) => ref.where('nombre', '==', nombre))
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

}