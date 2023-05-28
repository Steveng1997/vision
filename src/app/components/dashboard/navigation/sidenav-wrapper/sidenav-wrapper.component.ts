import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LoginService } from 'src/app/core/services/login';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-sidenav-wrapper',
  templateUrl: './sidenav-wrapper.component.html',
  styleUrls: ['./sidenav-wrapper.component.css']
})
export class SidenavWrapperComponent implements OnInit {

  isExpanded: boolean = false;
  isLiquidacion: boolean = false;
  usuarios: any[] = [];
  idUser: string;

  constructor(
    public router: Router,
    private activeRoute: ActivatedRoute,
    private serviceLogin: LoginService
  ) { }

  ngOnInit(): void {
    debugger
    this.idUser = this.activeRoute.snapshot.paramMap.get('id');
    this.serviceLogin.getById(this.idUser).then((rp) => {
      this.idUser = rp[0]
    })
  }
}
