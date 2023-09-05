import { Component, ViewChild, OnInit } from '@angular/core'
import { Router, ActivatedRoute } from '@angular/router'
import { ServiceManager } from 'src/app/core/services/manager'
import { BreakpointObserver } from '@angular/cdk/layout'
import { MatSidenav } from '@angular/material/sidenav'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import { delay } from 'rxjs/operators'

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
    private serviceManager: ServiceManager,
    private observer: BreakpointObserver
  ) { }

  ngOnInit(): void {
    document.getElementById('idTitulo').innerHTML = 'Visión'

    this.idUser = this.activeRoute.snapshot.params;
    if (this.idUser.id) {
      this.serviceManager.getById(this.idUser.id).subscribe((res) => {
        this.idUser = res[0]
      })
    }
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
