import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardRoutingModule } from './dashboard-routing.module';

// MAT
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';

// Components
import { ConfiguracionComponent } from './navigation/configuracion/configuracion.component';
import { EstadisticaComponent } from './navigation/estadistica/estadistica.component';
import { LiquidacionComponent } from './navigation/liquidacion/liquidacion.component';
import { NuevoServicioComponent } from './navigation/nuevo-servicio/nuevo-servicio.component';
import { SidenavWrapperComponent } from './navigation/sidenav-wrapper/sidenav-wrapper.component';
import { EncargadosComponent } from './navigation/liquidacion/encargados/encargados.component';
import { TerapeutasComponent } from './navigation/liquidacion/terapeutas/terapeutas.component';

@NgModule({
  declarations: [SidenavWrapperComponent, ConfiguracionComponent,
    EstadisticaComponent, LiquidacionComponent, NuevoServicioComponent,
    EncargadosComponent, TerapeutasComponent],
  imports: [
    CommonModule,
    DashboardRoutingModule,

    // NG Material Modules
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatToolbarModule
  ]
})
export class DashboardModule { }
