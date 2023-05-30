import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'busqueda'
})
export class BusquedaPipe implements PipeTransform {

  transform(items: any[], param: string): any {

    if (!param || param?.length < 1) {
      return items;
    }
    if (items) {

      return items.filter((item, index) => item.terapeuta.match(param) 
      || item.encargada.match(param) || item.fecha.match(param) || item.formaPago.match(param) 
      || item.horaStart.match(param) || item.horaEnd.match(param) || item.salida.match(param)
      || item.formaPago.indexOf(param.toLowerCase()) > -1);
    }
  }
}