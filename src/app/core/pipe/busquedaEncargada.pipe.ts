import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'busquedaEncargada'
})
export class BusquedaEncargadaPipe implements PipeTransform {

  transform(items: any, param: string, paramNumber: number): any {

    // if (!param || param?.length < 1) return items;


    if (!param) return items;
    if (!items) return [];

    if (items) {

      return items.filter((item) => item.encargada.match(param.toLowerCase().slice(1))
        || item.tratamiento === paramNumber || item.importe === paramNumber
        || item.desdeFechaLiquidado.match(param) || item.hastaFechaLiquidado.match(param));
    }
  }
}