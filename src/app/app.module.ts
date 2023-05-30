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

firebase.initializeApp({
  databaseURL: "https://vision-62bf7-default-rtdb.firebaseio.com",
  apiKey: "AIzaSyAlCRev6ZMXbPhQLE7W6WcZMPSnSDpHQ9M",
  authDomain: "vision-62bf7.firebaseapp.com",
  projectId: "vision-62bf7",
  storageBucket: "vision-62bf7.appspot.com",
  messagingSenderId: "288456932542",
  appId: "1:288456932542:web:47ba8ac4fdfe6fd65d72ef",
  measurementId: "G-PRX34JBW81"
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
    LoginService
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }