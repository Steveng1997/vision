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
    document.getElementById('my-class2').style.display = 'none'
    document.getElementById('my-class3').style.display = 'none'
    document.getElementById('my_back').style.display = 'none'

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

  click() {
    var myClasses = document.querySelectorAll('.my-class'),
      i = 0,
      l = myClasses.length;

    document.getElementById('my-class2').style.display = ''
    document.getElementById('my-class3').style.display = ''
    document.getElementById('my_back').style.display = ''

    for (i; i < l; i++) {
      myClasses[i]["style"].display = 'none';
    }
  }

  back() {
    var myClasses = document.querySelectorAll('.my-class'),
      i = 0,
      l = myClasses.length;

    for (i; i < l; i++) {
      myClasses[i]["style"].display = '';
      document.getElementById('my-class2').style.display = 'none'
      document.getElementById('my-class3').style.display = 'none'
      document.getElementById('my_back').style.display = 'none'
    }
  }
}
