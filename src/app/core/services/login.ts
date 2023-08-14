import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

// Models
import { Encargada } from '../models/encargada';


@Injectable()
export class LoginService {

  API_URL = 'http://18.191.235.23:3000/api/encargada';
  // API_URL = 'http://localhost:3000/api/encargada';

  constructor(
    public router: Router,
    private http: HttpClient
  ) { }

  // Register

  registerEncargada(encargada: Encargada) {
    return this.http.post(`${this.API_URL}/registerEncargada`, encargada);
  }

  // Get

  getById(id: number) {
    return this.http.get(`${this.API_URL}/idEncargada/${id}`);
  }

  getByIdAndAdministrador(id: number) {
    return this.http.get(`${this.API_URL}/idAdmin/${id}`);
  }

  getByIdAll(id: number) {
    return this.http.get(`${this.API_URL}/idEncargada/${id}`);
  }

  getByUsuario(usuario: string) {
    return this.http.get(`${this.API_URL}/usuarioEncargada/${usuario}`);
  }

  getEncargada(nombre: string) {
    return this.http.get(`${this.API_URL}/nombreEncargada/${nombre}`);
  }

  getByUserAndPass(usuario: string, pass: string) {
    return this.http.get(`${this.API_URL}/usuarioAndpass/${usuario}/${pass}`);
  }

  getUsuarios() {
    return this.http.get(`${this.API_URL}/listaEncargada`);
    // return this.db.collection('usuarios', (ref) => ref.orderBy('id', 'asc')).valueChanges();
  }

  // Update

  updateUser(id: number, encargada: Encargada) {
    return this.http.put(`${this.API_URL}/updateEncargada/${id}`, encargada);
  }

  // Delete

  deleteEncargadas(id: number) {
    return this.http.delete(`${this.API_URL}/deleteEncargada/${id}`);
  }
}