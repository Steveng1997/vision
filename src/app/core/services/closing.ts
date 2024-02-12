import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

// Model
import { ModelClosing } from '../models/closing';

@Injectable()
export class ServiceClosing {

  // API_URL = 'http://18.191.250.105:3000/api/cierre';
  // API_SERVICIO = 'http://18.191.250.105:3000/api/servicio';

  // Page pasffey
  API_URL = 'http://35.181.62.147:3000/api/cierre';
  API_SERVICIO = 'http://35.181.62.147:3000/api/servicio';

  constructor(
    public router: Router,
    private http: HttpClient
  ) { }

  // Register

  settlementRecord(closing: ModelClosing) {
    return this.http.post(`${this.API_URL}/registerCierre`, closing);
  }

  // Get  

  getAllCierre() {
    return this.http.get(`${this.API_URL}/getByAllCierre`);
  }

  getIdCierre(idCierre: string) {
    return this.http.get(`${this.API_URL}/getByIdCierre/${idCierre}`);
  }

  getByEncargada(encargada: string) {
    return this.http.get(`${this.API_URL}/getEncargada/${encargada}`);
  }

  // Delete

  deleteClosing(id: number) {
    return this.http.delete(`${this.API_URL}/deleteClosing/${id}`);
  }
}