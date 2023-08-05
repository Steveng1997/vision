import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'busquedaTerapeuta'
})
export class BusquedaTerapeutaPipe implements PipeTransform {

  transform(items: any, param: string, paramNumber: number): any {

    if (!param || param === undefined) return items;
    if (!items) return [];

    debugger

    if (items) {
      return items.filter((item) => item.importe === paramNumber
        || item.terapeuta.match(param.slice(0)) || item.encargada.match(param.slice(0))
        || item.desdeFechaLiquidado.match(param.slice(0)) || item.hastaFechaLiquidado.match(param.slice(0))
        || item.desdeHoraLiquidado.match(param.slice(0)) || item.hastaHoraLiquidado.match(param.slice(0)));
    }
  }
}