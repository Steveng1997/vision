import { Injectable } from '@angular/core';
import 'firebase/compat/app';
import { Usuario } from '../models/usuarios';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';

@Injectable()
export class LoginService {

  usuario: Usuario[] = [];
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
      fijoDia: formularioall.fijoDia,
      servicio: formularioall.servicio,
      bebida: formularioall.bebida,
      tabaco: formularioall.tabaco,
      vitamina: formularioall.vitamina,
      propina: formularioall.propina,
      otros: formularioall.otros,
      activo: true
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

  getByIdAndAdministrador(id): Promise<any> {
    return new Promise((resolve, reject) => {
      this.db
        .collection('usuarios', (ref) => ref.where('id', '==', id).where('rol', '==', 'administrador'))
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

  getUsuarios() {
    return this.db
      .collection('usuarios', (ref) => ref.orderBy('id', 'asc'))
      .valueChanges();
  }

  // -----------------------------------------------------------------------------------
  // End Get
  // -----------------------------------------------------------------------------------

  // -----------------------------------------------------------------------------------
  // Update
  // -----------------------------------------------------------------------------------

  updateUser(idDocument, idUsuario, usuario: Usuario) {
    return this.db.collection('usuarios', (ref) => ref.where('id', '==', idUsuario))
      .doc(idDocument)
      .update(usuario);
  }

  // -----------------------------------------------------------------------------------
  // End Update
  // -----------------------------------------------------------------------------------

  // -----------------------------------------------------------------------------------
  // Delete
  // -----------------------------------------------------------------------------------

  async deleteEncargadas(idDocument, id): Promise<any> {
    this.db
      .collection('usuarios', (ref) => ref.where('id', '==', id))
      .doc(idDocument)
      .delete();
  }

  // -----------------------------------------------------------------------------------
  // End Delete
  // -----------------------------------------------------------------------------------
}