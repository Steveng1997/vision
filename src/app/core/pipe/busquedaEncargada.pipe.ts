import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'busquedaEncargada'
})
export class BusquedaEncargadaPipe implements PipeTransform {

  transform(items: any[], param: string, paramNumber: number): any {
    if (!param || param?.length < 1) {
      return items;
    }

    // if (items) {
    //   return items.filter((item, index) => item.encargada.match(param.toLowerCase().slice(1))
    //     || item.desdeFechaLiquidado.match(param) || item.hastaFechaLiquidado.match(param)
    //     || item.importe.match(param) || item.tratamiento.match(param) > -1);
    // }

    if (items) {
      debugger
      return items.filter((item, index) => item.encargada.match(param.toLowerCase().slice(1)) 
      || item.importe === paramNumber || item.tratamiento === paramNumber ||
      item.desdeFechaLiquidado(param.toLowerCase().slice(1)) || item.hastaFechaLiquidado(param.toLowerCase().slice(1)));
    }
  }
}