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
    if (!x.matches) {
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

  buttonLiquidation() {
    var contentLiquidation = document.getElementById('containerLiquidation');
    var x = window.matchMedia("(min-device-width: 1030px)")
    var contenedor = Array.from(document.getElementsByClassName('marginPage') as HTMLCollectionOf<HTMLElement>)

    if (!x.matches) {
      if (contentLiquidation.style.display == "none") {
        contentLiquidation.style.display = "block";
        contenedor[0].style.position = 'relative';
        contentLiquidation.classList.add('animationLiquidation');
      } else {
        contentLiquidation.style.display = "none";
        contenedor[0].style.position = 'static';
      }
    }
  }

  buttonMenu() {
    var contentMenu = document.getElementById('containerMenu');
    var x = window.matchMedia("(min-device-width: 1030px)")
    var contenedor = Array.from(document.getElementsByClassName('marginPage') as HTMLCollectionOf<HTMLElement>)
    if (!x.matches) {
      if (contentMenu.style.display == "none") {
        contentMenu.style.display = "block";
        contenedor[0].style.position = 'relative';
        contentMenu.classList.add('animationMenu');
      } else {
        contentMenu.style.display = "none";
        contenedor[0].style.position = 'static';
      }
    }
  }

  main() {
    var contentMenu = document.getElementById('containerMenu');
    var contentLiquidation = document.getElementById('containerLiquidation');
    var x = window.matchMedia("(min-device-width: 1030px)")
    var contenedor = Array.from(document.getElementsByClassName('marginPage') as HTMLCollectionOf<HTMLElement>)

    if (!x.matches) {
      if (contentMenu.style.display == "block") {
        contentMenu.style.display = "none";
        contenedor[0].style.position = 'static';
      }

      if (contentLiquidation.style.display == "block") {
        contentLiquidation.style.display = "none";
        contenedor[0].style.position = 'static';
      }
    }
  }
}