import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'terapeutaSuma'
})
export class TerapeutaSumaPipe implements PipeTransform {

  transform(items: any[], param: string): any {

    // const totalServ = this.servicio.map(({ servicio }) => servicio).reduce((acc, value) => acc + value, 0);
    // this.totalServicio = totalServ;

    if (!param || param?.length < 1) {
      return items;
    }

    if (items) {
      let a = items.filter((item, index) => item.terapeuta === param);
      let b = a.map
      return a
    }
  }
}
