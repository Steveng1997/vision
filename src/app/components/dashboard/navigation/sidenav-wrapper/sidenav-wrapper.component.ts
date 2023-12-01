import { Component, OnInit } from '@angular/core'
import { Router, ActivatedRoute } from '@angular/router'
import { ServiceManager } from 'src/app/core/services/manager'

@Component({
  selector: 'app-sidenav-wrapper',
  templateUrl: './sidenav-wrapper.component.html',
  styleUrls: ['./sidenav-wrapper.component.css']
})

export class SidenavWrapperComponent implements OnInit {
  idUser: any
  validationMenu: boolean = false
  validationLiquidation: boolean = false
  contentLiquidation: any
  contentMenu: any

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
    if (this.validationMenu == true) {
      this.contentMenu.style.display = "none";
    }

    this.contentLiquidation = document.getElementById('containerLiquidation');
    var x = window.matchMedia("(min-device-width: 1030px)")
    var contenedor = Array.from(document.getElementsByClassName('marginPage') as HTMLCollectionOf<HTMLElement>)

    if (!x.matches) {
      if (this.contentLiquidation.style.display == "none") {
        this.contentLiquidation.style.display = "block";
        this.contentLiquidation.classList.add('animationLiquidation');
        this.validationLiquidation = true
      } else {
        this.contentLiquidation.style.display = "none";
        if (contenedor.length > 0) {
          contenedor[0].style.position = 'static';
          this.validationLiquidation = false
        }
      }
    }
  }

  buttonMenu() {
    if (this.validationLiquidation == true) {
      this.contentLiquidation.style.display = "none";
    }

    this.contentMenu = document.getElementById('containerMenu');
    var x = window.matchMedia("(min-device-width: 1030px)")
    var contenedor = Array.from(document.getElementsByClassName('marginPage') as HTMLCollectionOf<HTMLElement>)
    if (!x.matches) {
      if (this.contentMenu.style.display == "none") {
        this.contentMenu.style.display = "block";
        this.contentMenu.classList.add('animationMenu');
        this.validationMenu = true
      } else {
        this.contentMenu.style.display = "none";
        if (contenedor.length > 0) {
          contenedor[0].style.position = 'static';
          this.validationMenu = false
        }
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
      }

      if (contentLiquidation.style.display == "block") {
        contentLiquidation.style.display = "none";
      }
    }
  }
}