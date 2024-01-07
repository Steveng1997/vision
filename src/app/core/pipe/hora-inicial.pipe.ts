import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'horaInicial'
})
export class HoraInicialPipe implements PipeTransform {

  transform(items: any[], paramHoraInicial: string, paramHoraFinal: string): any {
    if (!paramHoraInicial || paramHoraInicial?.length < 1) {
      return items;
    }

    if (items) {
      if (paramHoraInicial === undefined && paramHoraFinal === undefined) return
      if (paramHoraInicial === undefined) return items.filter((item, index) => item.horaEnd <= paramHoraFinal)
      if (paramHoraFinal === undefined) return items.filter((item, index) => item.horaStart === paramHoraInicial)
      return items.filter((item, index) => item.horaStart >= paramHoraInicial && item.horaEnd <= paramHoraFinal)
    }
  }
}
