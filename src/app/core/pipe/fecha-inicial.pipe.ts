import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fechaInicial'
})
export class FechaInicialPipe implements PipeTransform {

  transform(items: any[], paramFechaInicial: string, paramFechaFinal: string): any {
    if (!paramFechaInicial || paramFechaInicial?.length < 1) {
      return items;
    }

    if (items) {
      debugger
      return items.filter((item, index) => item.fecha >= paramFechaInicial && item.fecha <= paramFechaFinal);
    }
  }
}
