import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fechaInicial'
})
export class FechaInicialPipe implements PipeTransform {

  transform(items: any[], param: string): any {
    if (!param || param?.length < 1) {
      return items;
    }

    if (items) {
      return items.filter((item, index) => item.fecha === param);
    }
  }
}
