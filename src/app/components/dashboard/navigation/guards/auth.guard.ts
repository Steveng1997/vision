import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ServiceManager } from 'src/app/core/services/manager';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  dateDay = ''

  constructor(
    private authService: ServiceManager,
    private router: Router
  ) { }

  dateTpm() {
    let fecha = new Date(), dia = 0, mes = 0, año = 0, convertMes = '', convertDia = ''

    dia = fecha.getDate()
    mes = fecha.getMonth() + 1
    año = fecha.getFullYear()

    if (mes > 0 && mes < 10) {
      convertMes = '0' + mes
      this.dateDay = `${dia}/${convertMes}/${año}`
    } else {
      convertMes = mes.toString()
      this.dateDay = `${dia}/${mes}/${año}`
    }

    if (dia > 0 && dia < 10) {
      convertDia = '0' + dia
      this.dateDay = `${convertDia}/${convertMes}/${año}`
    } else {
      convertDia = dia.toString()
      this.dateDay = `${dia}/${convertMes}/${año}`
    }
  }

  canActivate(): boolean {
    this.dateTpm()
    var dateTmp = localStorage.getItem('dateTmp');

    if (!this.authService.isAuth() || dateTmp < this.dateDay) {
      localStorage.clear();
      this.router.navigate(['**']);
      return false;
    }
    return true;
  }

}