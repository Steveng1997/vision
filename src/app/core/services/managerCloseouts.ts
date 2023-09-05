import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

// Model
import { LiquidationManager } from '../models/liquidationManager';

@Injectable()
export class ServiceLiquidationManager {

  API_URL = 'http://3.129.249.184/api/liqEncargada';
  // API_URL = 'http://localhost:3000/api/liqEncargada';

  constructor(
    public router: Router,
    private http: HttpClient
  ) { }

  // Register

  registerLiquidacionesEncargada(liquidationManger: LiquidationManager) {
    return this.http.post(`${this.API_URL}/registerLiqEncarg`, liquidationManger);
  }

  // Get

  getLiquidacionesEncargada() {
    return this.http.get(`${this.API_URL}/getByLiquidacionesEncargada`);
  }

  getIdEncarg(idEncargada: number) {
    return this.http.get(`${this.API_URL}/getByIdEncarg/${idEncargada}`);
  }

  getByEncargada(encargada: string) {
    return this.http.get(`${this.API_URL}/getEncargada/${encargada}`);
  }

  // Update

  updateById(idEncargada: number, liquidationManger: LiquidationManager) {
    return this.http.put(`${this.API_URL}/updateIdAndImporte/${idEncargada}`, liquidationManger);
  }

  updateEncargImporteId(id: number, liquidationManger: LiquidationManager) {
    return this.http.put(`${this.API_URL}/updateByEncargByImporteById/${id}`, liquidationManger);
  }
}