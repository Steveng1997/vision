import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fechaInicialEncargada'
})
export class FechaInicialEncargadaPipe implements PipeTransform {

  transform(items: any[], paramFechaInicial: string): any {
    if (!paramFechaInicial || paramFechaInicial?.length < 1) {
      return items;
    }

    if (items) {
      return items.filter((item, index) => item.desdeFechaLiquidado === paramFechaInicial)
    }
  }
}
