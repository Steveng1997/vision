import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

// Model
import { Terapeutas } from '../models/terapeutas';

@Injectable({
  providedIn: 'root'
})
export class TrabajadoresService {

  // API_Encargada = 'http://localhost:3000/api/encargada';
  // API_Terapeuta = 'http://localhost:3000/api/terapeuta';

  API_Encargada = 'http://3.129.249.184:3000/api/encargada';
  API_Terapeuta = 'http://3.129.249.184:3000/api/terapeuta';

  constructor(
    public router: Router,
    private http: HttpClient
  ) { }

  // Register

  registerTerapeuta(terapeuta: Terapeutas) {
    return this.http.post(`${this.API_Terapeuta}/registerTerapeuta`, terapeuta);
  }

  // Get

  getByIdTerapeuta(id: number) {
    return this.http.get(`${this.API_Terapeuta}/getId/${id}`);
  }

  getByNombre(nombre: string) {
    return this.http.get(`${this.API_Terapeuta}/getNombre/${nombre}`);
  }

  getAllTerapeuta() {
    return this.http.get(`${this.API_Terapeuta}/getByIdAsc`);
  }

  getAllTerapeutaByOrden() {
    return this.http.get(`${this.API_Terapeuta}/getByHoraEndDesc`);
  }

  getTerapeuta(nombre: string) {
    return this.http.get(`${this.API_Terapeuta}/getNombre/${nombre}`);
  }

  getEncargada(nombre: string) {
    return this.http.get(`${this.API_Encargada}/nombreEncargada/${nombre}`);
  }

  // Update

  updateTerapeutas(id: number, terapeuta: Terapeutas) {
    return this.http.put(`${this.API_Terapeuta}/updateTherapistById/${id}`, terapeuta);
  }

  update(nombreTerap, terapeuta: Terapeutas) {
    return this.http.put(`${this.API_Terapeuta}/update3Item/${nombreTerap}`, terapeuta);
  }

  updateHoraAndSalida(nombreTerap: string, terapeuta: Terapeutas) {
    return this.http.put(`${this.API_Terapeuta}/updateByHoraAndSalida/${nombreTerap}`, terapeuta);
  }

  // Delete

  deleteTerapeuta(id: number) {
    return this.http.delete(`${this.API_Terapeuta}/deleteTerapeuta/${id}`);
  }
}