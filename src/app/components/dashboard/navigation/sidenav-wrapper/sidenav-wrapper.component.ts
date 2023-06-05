import { Component, ViewChild, OnInit } from '@angular/core';
import { NavigationEnd, Router, ActivatedRoute } from '@angular/router';
import { LoginService } from 'src/app/core/services/login';
import { BreakpointObserver } from '@angular/cdk/layout';
import { MatSidenav } from '@angular/material/sidenav';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { delay, filter } from 'rxjs/operators';

@UntilDestroy()
@Component({
  selector: 'app-sidenav-wrapper',
  templateUrl: './sidenav-wrapper.component.html',
  styleUrls: ['./sidenav-wrapper.component.css'],
  // encapsulation: ViewEncapsulation.None  
})

export class SidenavWrapperComponent implements OnInit {
  usuarios: any[] = [];
  idUser: any;
  @ViewChild(MatSidenav)
  sidenav!: MatSidenav;

  isLiquidacion = false;

  constructor(
    public router: Router,
    private activeRoute: ActivatedRoute,
    private serviceLogin: LoginService,
    private observer: BreakpointObserver
  ) { }

  tabla() {
    document.getElementById('tabla').style.display = 'block'
    document.getElementById('tabla').innerHTML = 'Tabla'
    document.getElementById('vision').style.display = 'none'
    document.getElementById('nuevo-servicio').style.display = 'none'
    document.getElementById('liq-terap').style.display = 'none'
    document.getElementById('liq-encargada').style.display = 'none'
    document.getElementById('estadistica').style.display = 'none'
    document.getElementById('configuracion').style.display = 'none'
  }

  vision() {
    document.getElementById('vision').style.display = 'block'
    document.getElementById('vision').innerHTML = 'Visión'
    document.getElementById('tabla').style.display = 'none'
    document.getElementById('nuevo-servicio').style.display = 'none'
    document.getElementById('liq-terap').style.display = 'none'
    document.getElementById('liq-encargada').style.display = 'none'
    document.getElementById('estadistica').style.display = 'none'
    document.getElementById('configuracion').style.display = 'none'
  }

  nuevoServicio() {
    document.getElementById('nuevo-servicio').style.display = 'block'
    document.getElementById('nuevo-servicio').innerHTML = 'Nuevo servicio'
    document.getElementById('tabla').style.display = 'none'
    document.getElementById('vision').style.display = 'none'
    document.getElementById('liq-terap').style.display = 'none'
    document.getElementById('liq-encargada').style.display = 'none'
    document.getElementById('estadistica').style.display = 'none'
    document.getElementById('configuracion').style.display = 'none'
  }

  terapeu() {
    document.getElementById('liq-terap').style.display = 'block'
    document.getElementById('liq-terap').innerHTML = 'Liquidacion terapeuta'
    document.getElementById('tabla').style.display = 'none'
    document.getElementById('vision').style.display = 'none'
    document.getElementById('nuevo-servicio').style.display = 'none'
    document.getElementById('liq-encargada').style.display = 'none'
    document.getElementById('estadistica').style.display = 'none'
    document.getElementById('configuracion').style.display = 'none'
  }

  encargada() {
    document.getElementById('liq-encargada').style.display = 'block'
    document.getElementById('liq-encargada').innerHTML = 'Liquidacion encargada'
    document.getElementById('tabla').style.display = 'none'
    document.getElementById('vision').style.display = 'none'
    document.getElementById('nuevo-servicio').style.display = 'none'
    document.getElementById('liq-terap').style.display = 'none'
    document.getElementById('estadistica').style.display = 'none'
    document.getElementById('configuracion').style.display = 'none'
  }

  estadistica() {
    document.getElementById('estadistica').style.display = 'block'
    document.getElementById('estadistica').innerHTML = 'Estadistica'
    document.getElementById('tabla').style.display = 'none'
    document.getElementById('vision').style.display = 'none'
    document.getElementById('nuevo-servicio').style.display = 'none'
    document.getElementById('liq-terap').style.display = 'none'
    document.getElementById('liq-encargada').style.display = 'none'
    document.getElementById('configuracion').style.display = 'none'
  }

  configuracion() {
    document.getElementById('configuracion').style.display = 'block'
    document.getElementById('configuracion').innerHTML = 'Configuracion'
    document.getElementById('tabla').style.display = 'none'
    document.getElementById('vision').style.display = 'none'
    document.getElementById('nuevo-servicio').style.display = 'none'
    document.getElementById('liq-terap').style.display = 'none'
    document.getElementById('estadistica').style.display = 'none'
    document.getElementById('liq-encargada').style.display = 'none'
  }

  ngOnInit(): void {
    this.idUser = this.activeRoute.snapshot.paramMap.get('id');
    this.serviceLogin.getById(this.idUser).then((rp) => {
      this.idUser = rp[0]
    })
    document.getElementById('vision').innerHTML = 'Visión'
  }

  liquidacion() {
    this.isLiquidacion = !this.isLiquidacion;
  }

  ngAfterViewInit() {

    this.observer
      .observe(['(max-width: 1300px)'])
      .pipe(delay(1), untilDestroyed(this))
      .subscribe((res) => {
        if (res.matches) {
          this.sidenav.mode = 'over';
          this.sidenav.close();
        } else {
          this.sidenav.mode = 'side';
          this.sidenav.open();
        }
      });
  }
}
