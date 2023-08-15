import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

// Model
import { Cierre } from '../models/cierre';

@Injectable()
export class CierreService {

  API_URL = 'http://18.191.235.23:3000/api/cierre';
  API_SERVICIO = 'http://18.191.235.23:3000/api/servicio';

  // API_URL = 'http://localhost:3000/api/cierre';  
  // API_SERVICIO = 'http://localhost:3000/api/servicio';

  constructor(
    public router: Router,
    private http: HttpClient
  ) { }

  // Register

  registerCierre(cierre: Cierre) {
    return this.http.post(`${this.API_URL}/registerCierre`, cierre);
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