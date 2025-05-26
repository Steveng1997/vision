import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'horaInicial',
  standalone: false
})
export class HoraInicialPipe implements PipeTransform {

  parmHourStart: string
  parmHourEnd: string
  parmConvertDate: string
  day: string
  month: string
  year: string

  transform(items: any[], paramFechaInicial: string, paramHoraInicial: string, paramFechaFinal: string, paramHoraFinal: string): any {
    if (!paramHoraInicial || paramHoraInicial?.length < 1) {
      return items;
    }

    this.parmHourStart = `${paramFechaInicial} ${paramHoraInicial}`
    this.parmHourEnd = `${paramFechaFinal} ${paramHoraFinal}`

    if (items.length > 0) {
      if (paramHoraInicial === undefined && paramHoraFinal === undefined) return
      if (paramHoraInicial === undefined) return items.filter((item, index) => item.horaEnd <= paramHoraFinal)
      if (paramHoraFinal === undefined) return items.filter((item, index) => item.horaStart === paramHoraInicial)

      this.day = paramFechaFinal.toString().substring(8, 10)
      this.month = paramFechaFinal.toString().substring(5, 7)
      this.year = paramFechaFinal.toString().substring(2, 4)
      this.parmConvertDate = `${this.day}-${this.month}-${this.year}`

      for (let i = items.length - 1; i >= 0; i--) {
        if (items[i].fechaFin > this.parmConvertDate) {
          items.splice(i, 1);
        }
      }

      return items.filter((item, index) => `${item.fechaHoyInicio} ${item.horaStart}` >= this.parmHourStart && `${item.fechaHoyInicio} ${item.horaEnd}` <= this.parmHourEnd)
    }
  }
}