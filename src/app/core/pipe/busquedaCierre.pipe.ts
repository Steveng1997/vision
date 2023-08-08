import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'busquedaCierre'
})
export class BusquedaCierrePipe implements PipeTransform {

  transform(items: any[], param: string): any {

    if (!param) return items;
    if (!items) return [];

    if (items) {
      return items.filter((item) => item.encargada.match(param.slice(0))
        || item.fechaDesde.match(param) || item.fechaHasta.match(param)
        || item.horaDesde.match(param.slice(0)) || item.horaHasta.match(param.slice(0)));
    }
  }
}