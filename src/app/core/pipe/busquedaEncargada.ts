import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'busquedaEncargada'
})
export class BusquedaEncargadaPipe implements PipeTransform {

  transform(items: any[], param: string): any {
    if (!param || param?.length < 1) {
      return items;
    }

    if (items) {

      return items.filter((item) => item.encargada.match(param.toLowerCase().slice(1))  > -1);
    }
  }
}