import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ServiceManager } from 'src/app/core/services/manager';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private authService: ServiceManager,
    private router: Router
  ) {  }

  canActivate():boolean{
    if(!this.authService.isAuth()){
      console.log('Token no es válido o ya expiró');
      this.router.navigate(['**']);
      return false;
    }
    return true;
  }
  
}