import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxPaginationModule } from 'ngx-pagination';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

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
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatCheckboxModule } from '@angular/material/checkbox'

// Components
import { ConfiguracionComponent } from './navigation/configuracion/configuracion.component';
import { EstadisticaComponent } from './navigation/estadistica/estadistica.component';
import { LiquidacionComponent } from './navigation/liquidacion/liquidacion.component';
import { NuevoServicioComponent } from './navigation/nuevo-servicio/nuevo-servicio.component';
import { SidenavWrapperComponent } from './navigation/sidenav-wrapper/sidenav-wrapper.component';
import { EncargadosComponent } from './navigation/liquidacion/encargados/encargados.component';
import { TerapeutasComponent } from './navigation/liquidacion/terapeutas/terapeutas.component';
import { VisionComponent } from './navigation/vision/vision.component';
import { TablaComponent } from './navigation/tabla/tabla.component';
import { LoginComponent } from './navigation/login/login.component';

// Pipe
import { TerapeutaPipe } from 'src/app/core/pipe/terapeuta.pipe';
import { EncargadaPipe } from 'src/app/core/pipe/encargada.pipe';
import { FechaInicialPipe } from 'src/app/core/pipe/fecha-inicial.pipe';
import { BusquedaPipe } from 'src/app/core/pipe/busqueda.pipe';
import { FormaPagoPipe } from 'src/app/core/pipe/forma-pago.pipe';

@NgModule({
  declarations: [SidenavWrapperComponent, ConfiguracionComponent,
    EstadisticaComponent, LiquidacionComponent, NuevoServicioComponent,
    EncargadosComponent, TerapeutasComponent, VisionComponent, TablaComponent,
    TerapeutaPipe, EncargadaPipe, FechaInicialPipe, FormaPagoPipe,
    BusquedaPipe, LoginComponent],

  imports: [
    CommonModule,
    DashboardRoutingModule,
    FormsModule,
    NgbModule,
    NgxPaginationModule,
    TimepickerModule,
    BsDatepickerModule,
    ReactiveFormsModule,

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
    MatButtonModule,
    MatDividerModule,
    MatCheckboxModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
})
export class DashboardModule { }
