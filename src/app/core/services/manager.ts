import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';

// Models
import { ModelManager } from '../models/manager';


@Injectable()
export class ServiceManager {

  API_URL = 'http://3.12.102.108:3000/api/encargada';
  length: number;

  constructor(
    public router: Router,
    private http: HttpClient,
    private jwtHelper: JwtHelperService
  ) { }

  // Register

  registerEncargada(manager: ModelManager) {
    return this.http.post(`${this.API_URL}/registerEncargada`, manager);
  }

  // Get

  getById(id: number) {
    return this.http.get(`${this.API_URL}/idEncargada/${id}`);
  }

  getByIdAndAdministrador(id: number) {
    return this.http.get(`${this.API_URL}/idAdmin/${id}`);
  }

  getByUsuario(usuario: string) {
    return this.http.get(`${this.API_URL}/usuarioEncargada/${usuario}`);
  }

  getEncargada(nombre: string) {
    return this.http.get(`${this.API_URL}/nombreEncargada/${nombre}`);
  }

  getByUserAndPass(usuario: string, pass: string) {
    return this.http.get(`${this.API_URL}/usuarioAndpass`, {
      params: {
        usuario,
        pass
      }
    });
  }

  isAuth():boolean{
    const token = localStorage.getItem('token');
    if(this.jwtHelper.isTokenExpired(token) || !localStorage.getItem('token')){
      return false;
    }
    return true;
  }

  getUsuarios() {
    return this.http.get(`${this.API_URL}/listaEncargada`);
  }

  // Update

  updateUser(id: number, manager: ModelManager) {
    return this.http.put(`${this.API_URL}/updateEncargada/${id}`, manager);
  }

  // Delete

  deleteManager(id: number) {
    return this.http.delete(`${this.API_URL}/deleteEncargada/${id}`);
  }
}