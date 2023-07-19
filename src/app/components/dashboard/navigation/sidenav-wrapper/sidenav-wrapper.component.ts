import { Component, ViewChild, OnInit } from '@angular/core'
import { NavigationEnd, Router, ActivatedRoute } from '@angular/router'
import { LoginService } from 'src/app/core/services/login'
import { BreakpointObserver } from '@angular/cdk/layout'
import { MatSidenav } from '@angular/material/sidenav'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import { delay, filter } from 'rxjs/operators'

@UntilDestroy()
@Component({
  selector: 'app-sidenav-wrapper',
  templateUrl: './sidenav-wrapper.component.html',
  styleUrls: ['./sidenav-wrapper.component.css']
})

export class SidenavWrapperComponent implements OnInit {
  usuarios: any[] = []
  public idUser: any
  @ViewChild(MatSidenav)
  sidenav!: MatSidenav

  isLiquidacion = false

  constructor(
    public router: Router,
    private activeRoute: ActivatedRoute,
    private serviceLogin: LoginService,
    private observer: BreakpointObserver
  ) { }

  ngOnInit(): void {
    document.getElementById('idTitulo').innerHTML = 'Visión'

    this.idUser = this.activeRoute.snapshot.paramMap.get('id')
    this.serviceLogin.getById(this.idUser).then((rp) => {
      this.idUser = rp[0]
    })
  }

  liquidacion() {
    this.isLiquidacion = !this.isLiquidacion
  }

  ngAfterViewInit() {

    this.observer
      .observe(['(max-width: 1300px)'])
      .pipe(delay(1), untilDestroyed(this))
      .subscribe((res) => {
        if (res.matches) {
          this.sidenav.mode = 'over'
          this.sidenav.close()
        } else {
          this.sidenav.mode = 'side'
          this.sidenav.open()
        }
      })
  }

  toolbar() {
    this.sidenav.mode = 'over'
    this.sidenav.close()
  }
}
