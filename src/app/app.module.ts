import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// Firebase
import { AngularFireModule } from '@angular/fire/compat';

// MAT
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

// Conection a Firebase
import { environment } from 'src/environments/enviroment';
import firebase from 'firebase/compat/app';

// Services
import { TrabajadoresService } from './core/services/trabajadores';
import { ServicioService } from './core/services/servicio';
import { LoginService } from './core/services/login';
import { LiquidacioneTerapService } from './core/services/liquidacionesTerap';
import { LiquidacioneEncargService } from './core/services/liquidacionesEncarg';
import { CierreService } from './core/services/cierre';

firebase.initializeApp({
  // databaseURL: "https://vision-d5b15-default-rtdb.firebaseio.com",
  apiKey: "AIzaSyBwCESkYd7JglSnL6lclI89lIyfT8h_dMk",
  authDomain: "doradachik.firebaseapp.com",
  projectId: "doradachik",
  storageBucket: "doradachik.appspot.com",
  messagingSenderId: "394858221429",
  appId: "1:394858221429:web:843db9e4d663d40de30d3c"
  // measurementId: "G-B9EP4XFVFG"
});

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,

    // NG Material Modules
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatToolbarModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,

    AngularFireModule.initializeApp(environment),
  ],
  providers: [
    TrabajadoresService,
    ServicioService,
    LoginService,
    LiquidacioneTerapService,
    LiquidacioneEncargService,
    CierreService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }