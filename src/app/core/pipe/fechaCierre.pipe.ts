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
      if (paramFechaInicial === undefined) return items.filter((item, index) => item.hastaFecha === paramFechaFinal)
      if (paramFechaFinal === undefined) return items.filter((item, index) => item.desdeFecha === paramFechaInicial)
      return items.filter((item, index) => item.desdeFecha >= paramFechaInicial && item.hastaFecha <= paramFechaFinal)
    }
  }
}
