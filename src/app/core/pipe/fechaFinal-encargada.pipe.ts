import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fechaFinalEncargada'
})
export class FechaFinalEncargadaPipe implements PipeTransform {

  transform(items: any[], paramFechaInicial: string, paramFechaFinal: string): any {
    if (!paramFechaInicial || paramFechaInicial?.length < 1) {
      return items;
    }

    if (items) {
      if (paramFechaInicial === undefined) return items.filter((item, index) => item.hastaFechaLiquidado === paramFechaFinal)
      if (paramFechaFinal === undefined) return items.filter((item, index) => item.desdeFechaLiquidado === paramFechaInicial)
      return items.filter((item, index) => item.desdeFechaLiquidado >= paramFechaInicial && item.hastaFechaLiquidado <= paramFechaFinal)
    }
  }
}
