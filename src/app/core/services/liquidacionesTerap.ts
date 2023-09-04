import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LiquidacionTerapeuta } from '../models/liquidacionTerap';

@Injectable()
export class LiquidacioneTerapService {

  API_URL = 'http://3.129.249.184:3000/api/liqTerapeuta';
  // API_URL = 'http://localhost:3000/api/liqTerapeuta';

  constructor(
    public router: Router,
    private http: HttpClient
  ) { }

  // Register

  settlementRecord(liqTerap: LiquidacionTerapeuta) {
    return this.http.post(`${this.API_URL}/registerLiqTerap`, liqTerap);
  }

  // Get

  getLiquidacionesTerapeuta() {
    return this.http.get(`${this.API_URL}/getByLiquidacionesTerapeuta`);
  }

  getIdTerap(idTerapeuta: number) {
    return this.http.get(`${this.API_URL}/getByIdTerap/${idTerapeuta}`);
  }

  getTerapAndEncarg(terapeuta: string, encargada: string) {
    return this.http.get(`${this.API_URL}/getTerapeutaAndEncargada`, {
      params: {
        terapeuta,
        encargada
      }
    });
  }

  // Update

  update(id: number, liqTerap: LiquidacionTerapeuta) {
    return this.http.put(`${this.API_URL}/updateTherapistById/${id}`, liqTerap);
  }

  updateById(idTerapeuta, liqTerap: LiquidacionTerapeuta) {
    return this.http.put(`${this.API_URL}/updateIdAndImporte/${idTerapeuta}`, liqTerap);
  }

  updateTerapImporteId(id: number, liqTerap: LiquidacionTerapeuta) {
    return this.http.put(`${this.API_URL}/updateByTerapByImporteById/${id}`, liqTerap);
  }
}