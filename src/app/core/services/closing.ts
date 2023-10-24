import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

// Model
import { Closing } from '../models/closing';

@Injectable()
export class ServiceClosing {

  API_URL = 'http://3.12.102.108:3000/api/cierre';
  API_SERVICIO = 'http://3.12.102.108:3000/api/servicio';

  constructor(
    public router: Router,
    private http: HttpClient
  ) { }

  // Register

  registerCierre(closing: Closing) {
    return this.http.post(`${this.API_URL}/registerCierre`, closing);
  }

  // Get  

  getAllCierre() {
    return this.http.get(`${this.API_URL}/getByAllCierre`);
  }

  getServicioByEncargadaAndIdUnico(encargada: string) {
    return this.http.get(`${this.API_SERVICIO}/getByServicioByEncargadaAndIdUnico/${encargada}`);
  }

  getIdCierre(idCierre: number) {
    return this.http.get(`${this.API_URL}/getByIdCierre/${idCierre}`);
  }

  getEncargadaByCierre(encargada: string) {
    return this.http.get(`${this.API_SERVICIO}/getEncargadaAndCierre/${encargada}`);
  }

  getEncargadaFechaAscByCierreTrue(encargada: string) {
    return this.http.get(`${this.API_SERVICIO}/getByEncargadaFechaAscByCierreTrue/${encargada}`);
  }

  getEncargadaFechaDescByCierreFalse(encargada: string) {
    return this.http.get(`${this.API_SERVICIO}/getByEncargadaFechaDescByCierreFalse/${encargada}`);
  }
}