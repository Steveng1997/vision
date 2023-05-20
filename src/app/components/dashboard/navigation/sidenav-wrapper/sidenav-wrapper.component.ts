import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidenav-wrapper',
  templateUrl: './sidenav-wrapper.component.html',
  styleUrls: ['./sidenav-wrapper.component.css']
})
export class SidenavWrapperComponent implements OnInit {

  isExpanded: boolean = false;
  isLiquidacion: boolean = false;

  constructor(public router: Router) { }

  ngOnInit(): void {
  }
}
