import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LiquidationTherapist } from '../models/liquidationTherapist';

@Injectable()
export class ServiceLiquidationTherapist {

  // API_URL = 'http://18.191.250.105:3000/api/liqTerapeuta';

  // Page pasffey
  API_URL = 'http://35.180.156.130:3000/api/liqTerapeuta';

  constructor(
    public router: Router,
    private http: HttpClient
  ) { }

  // Register

  settlementRecord(liquidationTherapist: LiquidationTherapist) {
    return this.http.post(`${this.API_URL}/registerLiqTerap`, liquidationTherapist);
  }

  // Get

  consultTherapistSettlements(company: string) {
    return this.http.get(`${this.API_URL}/getByLiquidacionesTerapeuta/${company}`);
  }

  consultTherapistId(idTerapeuta: string) {
    return this.http.get(`${this.API_URL}/getByIdTerap/${idTerapeuta}`);
  }

  consultTherapistAndManager(terapeuta: string, encargada: string) {
    return this.http.get(`${this.API_URL}/getTerapeutaAndEncargada`, {
      params: {
        terapeuta,
        encargada
      }
    });
  }

  consultManager(encargada: string, company: string) {
    return this.http.get(`${this.API_URL}/getEncargada/${encargada}/${company}`);
  }

  consultTherapist(therapist: string, company: string) {
    return this.http.get(`${this.API_URL}/getTherapist/${therapist}/${company}`);
  }

  getDateCurrentDay(fechaHoy: string, company: string) {
    return this.http.get(`${this.API_URL}/getDateCurrent/${fechaHoy}/${company}`);
  }

  getEncargadaAndDate(createdDate: string, encargada: string) {
    return this.http.get(`${this.API_URL}/getFechaHoyByManager`, {
      params: {
        createdDate,
        encargada
      }
    });
  }

  // Update

  update(id: number, liquidationTherapist: LiquidationTherapist) {
    return this.http.put(`${this.API_URL}/updateTherapistById/${id}`, liquidationTherapist);
  }

  updateById(idTerapeuta, liquidationTherapist: LiquidationTherapist) {
    return this.http.put(`${this.API_URL}/updateIdAndImporte/${idTerapeuta}`, liquidationTherapist);
  }

  updateTerapImporteId(id: number, liquidationTherapist: LiquidationTherapist) {
    return this.http.put(`${this.API_URL}/updateByTerapByImporteById/${id}`, liquidationTherapist);
  }

  // Delete

  deleteLiquidationTherapist(id: number) {
    return this.http.delete(`${this.API_URL}/deleteLiquidationTherapists/${id}`);
  }
}