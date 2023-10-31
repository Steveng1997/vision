import { Component, OnInit } from '@angular/core'
import { Router, ActivatedRoute } from '@angular/router'
import { ServiceManager } from 'src/app/core/services/manager'

@Component({
  selector: 'app-sidenav-wrapper',
  templateUrl: './sidenav-wrapper.component.html',
  styleUrls: ['./sidenav-wrapper.component.css']
})

export class SidenavWrapperComponent implements OnInit {
  public idUser: any

  constructor(
    public router: Router,
    private activeRoute: ActivatedRoute,
    private serviceManager: ServiceManager
  ) { }

  ngOnInit(): void {

    var x = window.matchMedia("(min-device-width: 1030px)")
    if (x.matches) {
      document.getElementById('containerLiquidation').style.display = ''
    } else {
      document.getElementById('containerLiquidation').style.display = 'none'
      document.getElementById('containerMenu').style.display = 'none'
      document.getElementById('textNew').style.display = 'none'
    }

    this.idUser = this.activeRoute.snapshot.params;
    if (this.idUser.id) {
      this.serviceManager.getById(this.idUser.id).subscribe((res) => {
        this.idUser = res[0]
      })
    }
  }

  liquidations() {
    addEventListener("click", (event) => {
      document.getElementById('liquidation').style.display = ''
    });
  }

  buttonMenu() {
    var detalle = document.getElementById('containerMenu');
    var x = window.matchMedia("(min-device-width: 1030px)")
    var contenedor = Array.from(document.getElementsByClassName('marginPage') as HTMLCollectionOf<HTMLElement>)

    if (!x.matches) {
      if (detalle.style.display == "none") {
        detalle.style.display = "block";
        contenedor[0].style.position = 'relative';
      } else {
        detalle.style.display = "none";
        contenedor[0].style.position = 'static';
      }
    }
  }
}