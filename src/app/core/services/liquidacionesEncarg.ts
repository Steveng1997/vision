import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

// Model
import { LiquidacionEncargada } from '../models/liquidacionEncarg';

@Injectable()
export class LiquidacioneEncargService {

  API_URL = 'http://3.129.249.184/api/liqEncargada';
  // API_URL = 'http://localhost:3000/api/liqEncargada';

  constructor(
    public router: Router,
    private http: HttpClient
  ) { }

  // Register

  registerLiquidacionesEncargada(liqEncarg: LiquidacionEncargada) {
    return this.http.post(`${this.API_URL}/registerLiqEncarg`, liqEncarg);
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

  updateById(idEncargada: number, liqEncarg: LiquidacionEncargada) {
    return this.http.put(`${this.API_URL}/updateIdAndImporte/${idEncargada}`, liqEncarg);
  }

  updateEncargImporteId(id: number, liqEncarg: LiquidacionEncargada) {
    return this.http.put(`${this.API_URL}/updateByEncargByImporteById/${id}`, liqEncarg);
  }
}