import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LiquidationTherapist } from '../models/liquidationTherapist';

@Injectable()
export class ServiceLiquidationTherapist {

  API_URL = 'http://3.129.249.184:3000/api/liqTerapeuta';
  // API_URL = 'http://localhost:3000/api/liqTerapeuta';

  constructor(
    public router: Router,
    private http: HttpClient
  ) { }

  // Register

  settlementRecord(liquidationTherapist: LiquidationTherapist) {
    return this.http.post(`${this.API_URL}/registerLiqTerap`, liquidationTherapist);
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

  update(id: number, liquidationTherapist: LiquidationTherapist) {
    return this.http.put(`${this.API_URL}/updateTherapistById/${id}`, liquidationTherapist);
  }

  updateById(idTerapeuta, liquidationTherapist: LiquidationTherapist) {
    return this.http.put(`${this.API_URL}/updateIdAndImporte/${idTerapeuta}`, liquidationTherapist);
  }

  updateTerapImporteId(id: number, liquidationTherapist: LiquidationTherapist) {
    return this.http.put(`${this.API_URL}/updateByTerapByImporteById/${id}`, liquidationTherapist);
  }
}