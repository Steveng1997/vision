import { Injectable } from "@angular/core";
import { CanActivate, ActivatedRouteSnapshot, Router } from "@angular/router";

@Injectable()
export class Guardian implements CanActivate {

    constructor(private _router: Router) { }

    canActivate(route: ActivatedRouteSnapshot): boolean{
        let id = +route.url[1].path;
        if(isNaN(id) || id < 1){
            alert("Invalid servicio ID");
            this._router.navigate(['/login'])
            return false;
        }   
        return true;
    }
}