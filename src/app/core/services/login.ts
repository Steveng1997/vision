import { Injectable } from '@angular/core';
import 'firebase/compat/app';
import { Usuario } from '../models/usuarios';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Injectable()
export class LoginService {

  servicio: Usuario[] = [];
  cursoDoc: AngularFirestoreDocument<Usuario>;

  constructor(
    public router: Router,
    private db: AngularFirestore
  ) { }

  usuarios: Usuario[] = [];

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

  registerUser(formularioall) {
    formularioall = {
      id: `uid${this.makeid(10)}`,
      nombre: formularioall.nombre,
      usuario: formularioall.usuario,
      pass: formularioall.pass,
      rol: 'encargada',
      fijoDia: 0,
      servicio: 0,
      bebida: 0,
      tabaco: 0,
      vitamina: 0,
      propina: 0,
      otros: 0,
      activo: true,
    };
    return new Promise<any>((resolve, reject) => {
      this.db
        .collection('usuarios')
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

  getById(id): Promise<any> {
    return new Promise((resolve, reject) => {
      this.db
        .collection('usuarios', (ref) => ref.where('id', '==', id))
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

  getByIdAll(id) {
    return this.db
      .collection('usuarios', (ref) => ref.where('id', '==', id))
      .valueChanges();
  }

  getByUsuario(usuario): Promise<any> {
    return new Promise((resolve, reject) => {
      this.db
        .collection('usuarios', (ref) => ref.where('usuario', '==', usuario))
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

  emailExistAndPassword(email: string, password: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.db
        .collection('usuarios', (ref) =>
          ref.where('email', '==', email).where('password', '==', password)
        )
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

  getUsuariosByDocument(id): Promise<any> {
    return new Promise((resolve, reject) => {
      this.db
        .collection('usuarios', (ref) => ref.where('id', '==', id))
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

  getUsuarios() {
    return this.db
      .collection('usuarios', (ref) => ref.orderBy('id', 'asc'))
      .valueChanges();
  }


  // getEmailYPassword(email, password): Promise<any> {
  //   return new Promise<any>((resolve, reject) => {
  //     this.authFire.signInWithEmailAndPassword(email, password)
  //       .then(
  //         (response) => resolve(response),
  //         (error) => reject(error)
  //       );
  //   });
  // }

  // -----------------------------------------------------------------------------------
  // End Get
  // -----------------------------------------------------------------------------------

  // -----------------------------------------------------------------------------------
  // Update
  // -----------------------------------------------------------------------------------

  updateUsuarios(idDocument, idUser, user: Usuario) {
    return new Promise<any>((resolve, reject) => {
      this.db
        .collection('usuarios', (ref) => ref.where('id', '==', idUser))
        .doc(idDocument)
        .update(user)
        .then((res) => {
          resolve(true);
        }).catch((err) => {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Error al modificar el Usuario',
          });
        });
    })
  }

  // -----------------------------------------------------------------------------------
  // End Update
  // -----------------------------------------------------------------------------------

  // -----------------------------------------------------------------------------------
  // Delete
  // -----------------------------------------------------------------------------------

  async deleteUsuario(idDocument, id): Promise<any> {
    this.db
      .collection('usuarios', (ref) => ref.where('id', '==', id))
      .doc(idDocument)
      .delete();
  }

  // -----------------------------------------------------------------------------------
  // End Delete
  // -----------------------------------------------------------------------------------
}