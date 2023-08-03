import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fechaInicial'
})
export class FechaInicialPipe implements PipeTransform {

  transform(items: any[], paramFechaInicial: string, paramFechaFinal: string): any {
    if (!paramFechaInicial || paramFechaInicial?.length < 1) {
      return items;
    }

    debugger

    if (items) {
      if (paramFechaInicial === undefined && paramFechaFinal === undefined) return
      if (paramFechaInicial === undefined) return items.filter((item, index) => item.fecha <= paramFechaFinal)
      if (paramFechaFinal === undefined) return items.filter((item, index) => item.fecha === paramFechaInicial)
      return items.filter((item, index) => item.fecha >= paramFechaInicial && item.fecha <= paramFechaFinal)
    }
  }
}
