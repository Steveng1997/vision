import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

// Models
import { Servicio } from '../models/servicio';

@Injectable()
export class ServicioService {

  API_URL = 'http://18.191.235.23:3000/api/servicio';
  // API_URL = 'http://localhost:3000/api/servicio';

  constructor(
    public router: Router,
    private http: HttpClient
  ) { }


  // Register

  registerServicio(servicio: Servicio) {
    return this.http.post(`${this.API_URL}/registerServicio`, servicio);
  }

  // Get

  geyByCurrentDesc() {
    return this.http.get(`${this.API_URL}/getByCierreTrue`);
  }

  getByTerapeutaAndEncargada(terapeuta: string, encargada: string) {
    return this.http.get(`${this.API_URL}/getTerapeutaAndEncargada/${terapeuta}/${encargada}`);
  }

  getByEncargada(encargada: string) {
    return this.http.get(`${this.API_URL}/getEncargada/${encargada}`);
  }

  getByCierre(encargada: string) {
    return this.http.get(`${this.API_URL}/getEncargadaAndCierre/${encargada}`);
  }

  getServicio() {
    return this.http.get(`${this.API_URL}/getServicios`);
  }

  getByLiquidEncargadaFalse() {
    return this.http.get(`${this.API_URL}/getByLiquidacionEncargadaFalse`);
  }

  getByLiquidTerapFalse() {
    return this.http.get(`${this.API_URL}/getByLiquidacionTerapeutaFalse`);
  }

  getByLiquidTerapTrue() {
    return this.http.get(`${this.API_URL}/getByLiquidacionTerapeutaTrue`);
  }

  getByIdTerap(idTerap: number) {
    return this.http.get(`${this.API_URL}/getIdTerapeuta/${idTerap}`);
  }

  getByIdCierre(idCierre: number) {
    return this.http.get(`${this.API_URL}/getIdCierre/${idCierre}`);
  }

  getByIdEncarg(idEncarg: number) {
    return this.http.get(`${this.API_URL}/getIdEncargada/${idEncarg}`);
  }

  geyByCierreFalse() {
    return this.http.get(`${this.API_URL}/getCierreFalse`);
  }

  // geyByCierreTrue() {
  //   return new Promise((resolve, _reject) => {
  //     this.db.collection('servicio', (ref) => ref.orderBy('currentDate', 'desc').where('cierre', '==', false)).valueChanges({ idField: 'idDocument' }).subscribe((rp) => {
  //       if (rp[0]?.idDocument) {
  //         resolve(rp);
  //       } else {
  //         resolve(rp);
  //       }
  //     });
  //   });
  // }

  getById(id: number) {
    return this.http.get(`${this.API_URL}/getId/${id}`);
  }

  getByEditar(id: number) {
    return this.http.get(`${this.API_URL}/getIdEditar/${id}`);
  }

  getTerapeutaByAsc(terapeuta: string) {
    return this.http.get(`${this.API_URL}/getByTerapeutaAsc/${terapeuta}`);
  }

  getTerapeutaByDesc(terapeuta: string) {
    return this.http.get(`${this.API_URL}/getByTerapeutaDesc/${terapeuta}`);
  }

  getTerapeuta(terapeuta: string) {
    return this.http.get(`${this.API_URL}/getByTerapeuta/${terapeuta}`);
  }

  getIdDocument(idUnico: string) {
    return this.http.get(`${this.API_URL}/getIdUnico/${idUnico}`);
  }

  getEncargada(encargada: string) {
    return this.http.get(`${this.API_URL}/getByEncargada/${encargada}`);
  }

  getTerapeutaEncargada(terapeuta: string, encargada: string) {
    return this.http.get(`${this.API_URL}/getTerapeuAndEncar/${terapeuta}/${encargada}`);
  }

  getEncargadaAndLiquidacion(encargada: string) {
    return this.http.get(`${this.API_URL}/getEncargadaLiquidacionFalse/${encargada}`);
  }

  getEncargadaNoLiquidadaTerap(encargada: string) {
    return this.http.get(`${this.API_URL}/getEncargadaLiquidadoTerpFalse/${encargada}`);
  }

  getEncargadaNoLiquidada(encargada: string) {
    return this.http.get(`${this.API_URL}/getEncargNoLiquid/${encargada}`);
  }

  getEncargadaNoLiquidadaByFechaDesc(encargada: string) {
    return this.http.get(`${this.API_URL}/getEncargNoLiquidByFechaDesc/${encargada}`);
  }

  getTerapNoLiquidadaByFechaDesc(encargada: string) {
    return this.http.get(`${this.API_URL}/getTerapgNoLiquidByFechaDesc/${encargada}`);
  }

  getEncargadaNoLiquidadaByFechaAsc(encargada: string) {
    return this.http.get(`${this.API_URL}/getNoEncargNoLiquidByFechaAsc/${encargada}`);
  }

  getTerapNoLiquidadaByFechaAsc(encargada: string) {
    return this.http.get(`${this.API_URL}/getNoTerapNoLiquidByFechaAsc/${encargada}`);
  }

  getEncargadaNoCierre(encargada: string) {
    return this.http.get(`${this.API_URL}/getByEncargadaNoCierre/${encargada}`);
  }

  getTerapeutaFechaAsc(terapeuta: string, encargada: string) {
    return this.http.get(`${this.API_URL}/getByTerapFechaAsc/${terapeuta}/${encargada}`);
  }

  getTerapeutaFechaAscByLiqTrue(terapeuta: string, encargada: string) {
    return this.http.get(`${this.API_URL}/getByTerapFechaAscByLiquidadoTrue/${terapeuta}/${encargada}`);
  }

  getEncargadaFechaAscByLiqTrue(encargada: string) {
    return this.http.get(`${this.API_URL}/getEncargFechaAscByLiqTrue/${encargada}`);
  }

  getEncargFechaAsc(encargada: string) {
    return this.http.get(`${this.API_URL}/getEncargFechaAscByLiqFalse/${encargada}`);
  }

  getTerapeutaFechaDesc(terapeuta: string, encargada: string) {
    return this.http.get(`${this.API_URL}/getTerapeutaAndEncargadaFechaDesc/${terapeuta}/${encargada}`);
  }

  getTerapeutaFechaDescByLiqTrue(terapeuta: string, encargada: string) {
    return this.http.get(`${this.API_URL}/getTerapeutaAndEncargadaFechaDescLiqTrue/${terapeuta}/${encargada}`);
  }

  getEncargadaFechaDescByLiqTrue(encargada: string) {
    return this.http.get(`${this.API_URL}/getByEncargadaByLiqTrue/${encargada}`);
  }

  getTerapeutaWithCurrentDate(terapeuta: string) {
    return this.http.get(`${this.API_URL}/getByTerapeutaWithCurrentDate/${terapeuta}`);
  }

  getEncargFechaDesc(encargada: string) {
    return this.http.get(`${this.API_URL}/getByEncargFechaDesc/${encargada}`);
  }

  getEncargadaFechaAsc(encargada: string) {
    return this.http.get(`${this.API_URL}/getByEncargadaFechaAsc/${encargada}`);
  }

  getEncargadaFechaDesc(encargada: string) {
    return this.http.get(`${this.API_URL}/getByEncargadaFechaDesc/${encargada}`);
  }

  getFechaHoy(fechaHoy: string) {
    return this.http.get(`${this.API_URL}/getByFechaHoy/${fechaHoy}`);
  }

  getIdUnicoByCierre(idUnico: string) {
    return this.http.get(`${this.API_URL}/getByIdUnicoByCierre/${idUnico}`);
  }

  getIdUnico(idUnico: string) {
    return this.http.get(`${this.API_URL}/getByIdUnico/${idUnico}`);
  }

  getIdDescendente(idUnico: string) {
    return this.http.get(`${this.API_URL}/getByIdDesc/${idUnico}`);
  }

  // Update

  updateServicio(id: number, servicio: Servicio) {
    return this.http.put(`${this.API_URL}/updateByServicio/${id}`, servicio);
  }

  updateAllServicio(id: number, servicio: Servicio) {
    return this.http.put(`${this.API_URL}/updateAllTheServicio/${id}`, servicio);
  }

  updateNumberPiso1(idUnico: string, servicio: Servicio) {
    return this.http.put(`${this.API_URL}/updateByNumberPiso1/${idUnico}`, servicio);
  }

  updateWithValueNumberPiso1(id: number, idUnico: string, servicio: Servicio) {
    return this.http.put(`${this.API_URL}/updateByWithValueNumberPiso1/${id}/${idUnico}`, servicio);
  }

  updateNumberPiso2(idUnico: string, servicio: Servicio) {
    return this.http.put(`${this.API_URL}/updateByNumberPiso2/${idUnico}`, servicio);
  }

  updateWithValueNumberPiso2(id: number, idUnico: string, servicio: Servicio) {
    return this.http.put(`${this.API_URL}/updateByWithValueNumberPiso2/${id}/${idUnico}`, servicio);
  }

  updateNumberEncargada(idUnico: string, servicio: Servicio) {
    return this.http.put(`${this.API_URL}/updateByNumberEncargada/${idUnico}`, servicio);
  }

  updateWithValueNumberEncargada(id: number, idUnico: string, servicio: Servicio) {
    return this.http.put(`${this.API_URL}/updateByWithValueNumberEncargada/${id}/${idUnico}`, servicio);
  }

  updateNumberTerap(idUnico: string, servicio: Servicio) {
    return this.http.put(`${this.API_URL}/updateByNumberTerap/${idUnico}`, servicio);
  }

  updateWithValueNumberTerap(id: number, idUnico: string, servicio: Servicio) {
    return this.http.put(`${this.API_URL}/updateByWithValueNumberTerap/${id}/${idUnico}`, servicio);
  }

  updateNumberOtros(idUnico: string, servicio: Servicio) {
    return this.http.put(`${this.API_URL}/updateByNumberOtros/${idUnico}`, servicio);
  }

  updateWithValueNumberOtros(id: number, idUnico: string, servicio: Servicio) {
    return this.http.put(`${this.API_URL}/updateByWithValueNumberOtros/${id}/${idUnico}`, servicio);
  }

  updateLiquidacionTerap(id: number, servicio: Servicio) {
    return this.http.put(`${this.API_URL}/updateByLiquidacionTerap/${id}`, servicio);
  }

  updateLiquidacionEncarg(id: number, servicio: Servicio) {
    return this.http.put(`${this.API_URL}/updateByLiquidacionEncarg/${id}`, servicio);;
  }

  updateCierre(idCierre: number, id: number, servicio: Servicio) {
    return this.http.put(`${this.API_URL}/updateByCierre/${idCierre}/${id}`, servicio);;
  }

  updatePisos(id: number, idUnico: string, servicio: Servicio) {
    return this.http.put(`${this.API_URL}/updateByValuePisos/${id}/${idUnico}`, servicio);
  }

  // Delete

  deleteServicio(id: number) {
    return this.http.delete(`${this.API_URL}/EliminarServicio/${id}`);
  }
}
