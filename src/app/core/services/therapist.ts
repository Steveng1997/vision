import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

// Model
import { ModelTherapist } from '../models/therapist';

@Injectable({
  providedIn: 'root'
})
export class ServiceTherapist {

  // API_Terapeuta = 'http://18.191.250.105:3000/api/terapeuta';

  // Page pasffey
  API_Terapeuta = 'http://35.180.156.130:3000/api/terapeuta';

  constructor(
    public router: Router,
    private http: HttpClient
  ) { }

  // Register

  save(therapist: ModelTherapist) {
    return this.http.post(`${this.API_Terapeuta}/registerTerapeuta`, therapist);
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

  getMinutes() {
    return this.http.get(`${this.API_Terapeuta}/orderMinutes`);
  }

  getByCompany(company: string) {
    return this.http.get(`${this.API_Terapeuta}/getCompany/${company}`);
  }

  orderByMinutesAndCompany(company: string) {
    return this.http.get(`${this.API_Terapeuta}/orderMinutesAndCompany/${company}`);
  }  

  // Update

  updateTerapeutas(id: number, therapist: ModelTherapist) {
    return this.http.put(`${this.API_Terapeuta}/updateTherapistById/${id}`, therapist);
  }

  update(nombreTerap, therapist: ModelTherapist) {
    return this.http.put(`${this.API_Terapeuta}/update4Item/${nombreTerap}`, therapist);
  }

  updateHoraAndSalida(nombreTerap: string, therapist: ModelTherapist) {
    return this.http.put(`${this.API_Terapeuta}/updateByHoraAndSalida/${nombreTerap}`, therapist);
  }

  updateMinute(id: number, therapist: ModelTherapist) {
    return this.http.put(`${this.API_Terapeuta}/updateMinutesWithId/${id}`, therapist);
  }

  // Delete

  deleteTerapeuta(id: number) {
    return this.http.delete(`${this.API_Terapeuta}/deleteTerapeuta/${id}`);
  }
}