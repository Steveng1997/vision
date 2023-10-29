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
    document.getElementById('therapeut').style.display = 'none'
    document.getElementById('manager').style.display = 'none'
    document.getElementById('my_back').style.display = 'none'

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

  // click() {
  //   let menuToggle = document.querySelector('.menuToggle');
  //   menuToggle.addEventListener("click", function () {
  //     menuToggle.classList.toggle('active')
  //   });
  // }
}
