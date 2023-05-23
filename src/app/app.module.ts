import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// Firebase
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';

// Conection a Firebase
import { environment } from 'src/environments/enviroment';
import firebase from 'firebase/compat/app';

// Services
import { TrabajadoresService } from './core/services/trabajadores';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

firebase.initializeApp({
  databaseURL: 'https://megacopias-ceea2-default-rtdb.firebaseio.com',
  apiKey: "AIzaSyAk5L0k26GIzLzvpiuUxX2Ns2G6hKywLzM",
  authDomain: "megacopias-ceea2.firebaseapp.com",
  projectId: "megacopias-ceea2",
  storageBucket: "megacopias-ceea2.appspot.com",
  messagingSenderId: "1044087892775",
  appId: "1:1044087892775:web:908fdd059e7d90cf3a9702",
  measurementId: "G-QZ1FE7CN90"
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
    NgbModule,
    AngularFireModule.initializeApp(environment),
  ],
  providers: [
    TrabajadoresService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }