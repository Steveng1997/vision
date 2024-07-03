import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

// Model
import { LiquidationManager } from '../models/liquidationManager';

@Injectable()
export class ServiceLiquidationManager {

  // API_URL = 'http://18.191.250.105:3000/api/liqEncargada';

  // Page pasffey
  API_URL = 'http://35.181.62.147:3000/api/liqEncargada';

  constructor(
    public router: Router,
    private http: HttpClient
  ) { }

  // Register

  settlementRecord(liquidationManger: LiquidationManager) {
    return this.http.post(`${this.API_URL}/registerLiqEncarg`, liquidationManger);
  }

  // Get

  getLiquidacionesEncargada(company: string) {
    return this.http.get(`${this.API_URL}/getByLiquidacionesEncargada/${company}`);
  }

  getIdEncarg(idEncargada: string) {
    return this.http.get(`${this.API_URL}/getByIdEncarg/${idEncargada}`);
  }

  getByEncargada(encargada: string) {
    return this.http.get(`${this.API_URL}/getEncargada/${encargada}`);
  }

  getDateCurrentDay(fechaHoy: string, company: string) {
    return this.http.get(`${this.API_URL}/getDateCurrent/${fechaHoy}/${company}`);
  }

  getEncargadaAndDate(createdDate: string, encargada: string, company: string) {
    return this.http.get(`${this.API_URL}/getFechaHoyByManager`, {
      params: {
        createdDate,
        encargada,
        company
      }
    });
  }

  // Update

  updateById(idEncargada: number, liquidationManger: LiquidationManager) {
    return this.http.put(`${this.API_URL}/updateIdAndImporte/${idEncargada}`, liquidationManger);
  }

  updateEncargImporteId(id: number, liquidationManger: LiquidationManager) {
    return this.http.put(`${this.API_URL}/updateByEncargByImporteById/${id}`, liquidationManger);
  }

  // Delete

  deleteLiquidationManager(id: number) {
    return this.http.delete(`${this.API_URL}/deleteLiquidationManagers/${id}`);
  }
}