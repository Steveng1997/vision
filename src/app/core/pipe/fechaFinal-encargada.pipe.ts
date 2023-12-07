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
      if (paramFechaInicial === undefined) return items.filter((item, index) => item.createdDate === paramFechaFinal)
      if (paramFechaFinal === undefined) return items.filter((item, index) => item.createdDate === paramFechaInicial)
      return items.filter((item, index) => item.createdDate >= paramFechaInicial && item.createdDate <= paramFechaFinal)
    }
  }
}
