import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

// Models
import { ModelService } from '../models/service';

@Injectable()
export class Service {

  API_URL = 'http://3.12.102.108:3000/api/servicio';

  constructor(
    public router: Router,
    private http: HttpClient
  ) { }


  // Register

  registerServicio(service: ModelService) {
    return this.http.post(`${this.API_URL}/registerServicio`, service);
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

  getByManagerOrder(encargada: string) {
    return this.http.get(`${this.API_URL}/getManagerOrderCurrentDate/${encargada}`);
  }

  getByCierre(encargada: string) {
    return this.http.get(`${this.API_URL}/getEncargadaAndCierre/${encargada}`);
  }

  getServicio() {
    return this.http.get(`${this.API_URL}/getServicios`);
  }

  getByLiquidTerapFalse() {
    return this.http.get(`${this.API_URL}/getByLiquidacionTerapeutaFalse`);
  }

  getByIdTerap(idTerap: string) {
    return this.http.get(`${this.API_URL}/getIdTerapeuta/${idTerap}`);
  }

  getByIdCierre(idCierre: number) {
    return this.http.get(`${this.API_URL}/getIdCierre/${idCierre}`);
  }

  getByIdEncarg(idEncargada: string) {
    return this.http.get(`${this.API_URL}/getIdEncargada/${idEncargada}`);
  }

  geyByCierreFalse() {
    return this.http.get(`${this.API_URL}/getCierreFalse`);
  }

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

  getEncargada(encargada: string) {
    return this.http.get(`${this.API_URL}/getByEncargada/${encargada}`);
  }

  getEncargadaAndDate(fechaHoyInicio: string, encargada: string) {
    return this.http.get(`${this.API_URL}/getFechaHoyByManager`, {
      params: {
        fechaHoyInicio,
        encargada
      }
    });
  }


  getTerapeutaEncargada(terapeuta: string, encargada: string) {
    return this.http.get(`${this.API_URL}/getTerapeuAndEncar`, {
      params: {
        terapeuta,
        encargada
      }
    });
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
    return this.http.get(`${this.API_URL}/getByTerapFechaAsc`, {
      params: {
        terapeuta,
        encargada
      }
    });
  }

  getTerapeutaFechaAscByLiqTrue(terapeuta: string, encargada: string) {
    return this.http.get(`${this.API_URL}/getByTerapFechaAscByLiquidadoTrue`, {
      params: {
        terapeuta,
        encargada
      }
    });
  }

  getEncargadaFechaAscByLiqTrue(encargada: string) {
    return this.http.get(`${this.API_URL}/getEncargFechaAscByLiqTrue/${encargada}`);
  }

  getEncargFechaAsc(encargada: string) {
    return this.http.get(`${this.API_URL}/getEncargFechaAscByLiqFalse/${encargada}`);
  }

  getTerapeutaFechaDesc(terapeuta: string, encargada: string) {
    return this.http.get(`${this.API_URL}/getTerapeutaAndEncargadaFechaDesc`, {
      params: {
        terapeuta,
        encargada
      }
    });
  }

  getTerapeutaFechaDescByLiqTrue(terapeuta: string, encargada: string) {
    return this.http.get(`${this.API_URL}/getTerapeutaAndEncargadaFechaDescLiqTrue`, {
      params: {
        terapeuta,
        encargada
      }
    });
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

  getIdDescendente(idUnico: string) {
    return this.http.get(`${this.API_URL}/getByIdDesc/${idUnico}`);
  }

  getbYTerapeutaEncargadaFechaHoraInicio(terapeuta: string, encargada: string, fecha: string, horaStart: string) {
    return this.http.get(`${this.API_URL}/getTerapeutaEncargadaFechaHoraInicio/${terapeuta}/${encargada}/${fecha}/${horaStart}`);
  }

  getByTerapeutaEncargadaFechaHoraInicioFechaHoraFin(terapeuta: string, encargada: string, horaStart: string, horaEnd: string, fecha: string, fechaFin: string) {
    return this.http.get(`${this.API_URL}/getTerapeutaEncargadaFechaHoraInicioFechaHoraFin`, {
      params: {
        terapeuta,
        encargada,
        fecha,
        horaStart,
        fechaFin,
        horaEnd
      }
    });
  }

  getByEncargadaFechaHoraInicioFechaHoraFin(encargada: string, horaStart: string, horaEnd: string, fecha: string, fechaFin: string) {
    return this.http.get(`${this.API_URL}/getEncargadaFechaHoraInicioFechaHoraFin`, {
      params: {
        encargada,
        fecha,
        horaStart,
        fechaFin,
        horaEnd,
      }
    });
  }

  getManagerWithDate(encargada: string, fecha: string) {
    return this.http.get(`${this.API_URL}/getManagerWithDate`, {
      params: {
        encargada,
        fecha
      }
    });
  }

  getTherapistWithDate(terapeuta: string, fecha: string) {
    return this.http.get(`${this.API_URL}/getTherapistWithDate`, {
      params: {
        terapeuta,
        fecha
      }
    });
  }

  getManagerpaymentForm(encargada: string, fecha: string) {
    return this.http.get(`${this.API_URL}/getManagerpaymentForm`, {
      params: {
        encargada,
        fecha
      }
    });
  }

  getTherapistpaymentForm(terapeuta: string, fecha: string) {
    return this.http.get(`${this.API_URL}/getTherapistpaymentForm`, {
      params: {
        terapeuta,
        fecha
      }
    });
  }


  getManagerAndDate(encargada: string, fecha: string, fechaFin: string) {
    return this.http.get(`${this.API_URL}/getManagerAndDate`, {
      params: {
        encargada,
        fecha,
        fechaFin
      }
    });
  }

  getpaymentFormAndDate(formaPago: string, fecha: string, fechaFin: string) {
    return this.http.get(`${this.API_URL}/getpaymentFormAndDate`, {
      params: {
        formaPago,
        fecha,
        fechaFin
      }
    });
  }

  getFechaAndId(id: number, fechaHoyInicio: string) {
    return this.http.get(`${this.API_URL}/getFechaWithId`, {
      params: {
        id,
        fechaHoyInicio
      }
    });
  }

  getTerapeutaLiqFalse(terapeuta: string) {
    return this.http.get(`${this.API_URL}/getByTerapeutaLiquidatedZero/${terapeuta}`);
  }

  getManagerLiqFalse(encargada: string) {
    return this.http.get(`${this.API_URL}/getByManagerLiquidatedZero/${encargada}`);
  }

  getPaymentForm(formaPago: string) {
    return this.http.get(`${this.API_URL}/getPaymenForm/${formaPago}`);
  }

  getTherapistAndDates(terapeuta: string, fechaHoyInicio: string) {
    return this.http.get(`${this.API_URL}/getTherapistAndDate/${terapeuta}/${fechaHoyInicio}`);
  }

  // Update

  updateServicio(id: number, service: ModelService) {
    return this.http.put(`${this.API_URL}/updateByServicio/${id}`, service);
  }

  updateAllServicio(id: number, service: ModelService) {
    return this.http.put(`${this.API_URL}/updateAllTheServicio/${id}`, service);
  }

  updateNumberPiso1(idUnico: string, service: ModelService) {
    return this.http.put(`${this.API_URL}/updateByNumberPiso1/${idUnico}`, service);
  }

  updateWithValueNumberPiso1(id: number, idUnico: string, service: ModelService) {
    return this.http.put(`${this.API_URL}/updateByWithValueNumberPiso1/${id}/${idUnico}`, service);
  }

  updateNumberPiso2(idUnico: string, service: ModelService) {
    return this.http.put(`${this.API_URL}/updateByNumberPiso2/${idUnico}`, service);
  }

  updateWithValueNumberPiso2(id: number, idUnico: string, service: ModelService) {
    return this.http.put(`${this.API_URL}/updateByWithValueNumberPiso2/${id}/${idUnico}`, service);
  }

  updateNumberEncargada(idUnico: string, service: ModelService) {
    return this.http.put(`${this.API_URL}/updateByNumberEncargada/${idUnico}`, service);
  }

  updateWithValueNumberEncargada(id: number, idUnico: string, service: ModelService) {
    return this.http.put(`${this.API_URL}/updateByWithValueNumberEncargada/${id}/${idUnico}`, service);
  }

  updateNumberTerap(idUnico: string, service: ModelService) {
    return this.http.put(`${this.API_URL}/updateByNumberTerap/${idUnico}`, service);
  }

  updateWithValueNumberTerap(id: number, idUnico: string, service: ModelService) {
    return this.http.put(`${this.API_URL}/updateByWithValueNumberTerap/${id}/${idUnico}`, service);
  }

  updateNumberOtros(idUnico: string, service: ModelService) {
    return this.http.put(`${this.API_URL}/updateByNumberOtros/${idUnico}`, service);
  }

  updateWithValueNumberOtros(id: number, idUnico: string, service: ModelService) {
    return this.http.put(`${this.API_URL}/updateByWithValueNumberOtros/${id}/${idUnico}`, service);
  }

  updateLiquidacionTerap(id: number, service: ModelService) {
    return this.http.put(`${this.API_URL}/updateByLiquidacionTerap/${id}`, service);
  }

  updateLiquidacionEncarg(id: number, service: ModelService) {
    return this.http.put(`${this.API_URL}/updateByLiquidacionEncarg/${id}`, service);;
  }

  updateCierre(idCierre: number, id: number, service: ModelService) {
    return this.http.put(`${this.API_URL}/updateByCierre/${idCierre}/${id}`, service);;
  }

  updatePisos(id: number, idUnico: string, service: ModelService) {
    return this.http.put(`${this.API_URL}/updateByValuePisos/${id}/${idUnico}`, service);
  }

  // Delete

  deleteServicio(id: number) {
    return this.http.delete(`${this.API_URL}/EliminarServicio/${id}`);
  }
}
