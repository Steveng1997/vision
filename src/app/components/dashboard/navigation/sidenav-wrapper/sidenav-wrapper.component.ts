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

  isLiquidation = false

  constructor(
    public router: Router,
    private activeRoute: ActivatedRoute,
    private serviceManager: ServiceManager
  ) { }

  ngOnInit(): void {
    // document.getElementById('idTitulo').innerHTML = 'Visión'

    this.idUser = this.activeRoute.snapshot.params;
    if (this.idUser.id) {
      this.serviceManager.getById(this.idUser.id).subscribe((res) => {
        this.idUser = res[0]
      })
    }
  }

  liquidation() {
    this.isLiquidation = !this.isLiquidation
  }

  // click() {
  //   debugger
  //   const sidebar = document.querySelector(".sidebar");
  //   const sidebarClose = document.querySelector("#sidebar-close");
  //   const menu = document.querySelector(".menu-content");
  //   const menuItems = document.querySelectorAll(".submenu-item");
  //   const subMenuTitles = document.querySelectorAll(".navbar__container .menu-title");

  //   // sidebarClose.addEventListener("click", () => sidebar.classList.toggle("close"));
  //   menuItems.forEach((item, index) => {
  //     item.addEventListener("click", () => {
  //       menu.classList.add("submenu-active");
  //       item.classList.add("show-submenu");
  //       menuItems.forEach((item2, index2) => {
  //         if (index !== index2) {
  //           item2.classList.remove("show-submenu");
  //         }
  //       });
  //     });
  //   });
  //   subMenuTitles.forEach((title) => {
  //     title.addEventListener("click", () => {
  //       menu.classList.remove("submenu-active");
  //     });
  //   });
  // }
}
