import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fechaCierre'
})
export class FechaCierrePipe implements PipeTransform {

  transform(items: any[], paramFechaInicial: string, paramFechaFinal: string): any {
    if (!paramFechaInicial || paramFechaInicial?.length < 1) {
      return items;
    }

    if (items) {
      if (paramFechaInicial === undefined) return items.filter((item, index) => item.fechaHasta === paramFechaFinal)
      if (paramFechaFinal === undefined) return items.filter((item, index) => item.fechaDesde === paramFechaInicial)
      return items.filter((item, index) => item.fechaDesde >= paramFechaInicial && item.fechaHasta <= paramFechaFinal)
    }
  }
}
