import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'busquedaCierre'
})
export class BusquedaCierrePipe implements PipeTransform {

  transform(items: any[], param: string): any {

    if (!param || param?.length < 1) {
      return items;
    }

    if (items) {
      return items.filter((item) => item.encargada.match(param.toLowerCase().slice(1))
        || item.fechaDesde.match(param) || item.fechaHasta.match(param)
        || item.horaDesde.match(param) || item.horaHasta.match(param));
    }
  }
}