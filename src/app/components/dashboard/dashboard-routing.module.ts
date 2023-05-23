import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NuevoServicioComponent } from './navigation/nuevo-servicio/nuevo-servicio.component';
import { TablaComponent } from './navigation/tabla/tabla.component';
import { LiquidacionComponent } from './navigation/liquidacion/liquidacion.component';
import { EstadisticaComponent } from './navigation/estadistica/estadistica.component';
import { ConfiguracionComponent } from './navigation/configuracion/configuracion.component';
import { SidenavWrapperComponent } from './navigation/sidenav-wrapper/sidenav-wrapper.component';
import { VisionComponent } from './navigation/vision/vision.component';
import { TerapeutasComponent } from './navigation/liquidacion/terapeutas/terapeutas.component';
import { EncargadosComponent } from './navigation/liquidacion/encargados/encargados.component';
import { TrabajadoresComponent } from './navigation/trabajadores/trabajadores.component';

const routes: Routes = [
  // Sidenavwrapper Component acts like a shell & the active child Component gets rendered into the <router-outlet>
  {
    path: '',
    component: SidenavWrapperComponent,
    children: [
      {
        path: 'vision',
        component: VisionComponent
      },
      {
        path: 'nuevo-servicio',
        component: NuevoServicioComponent
      },
      {
        path: 'tabla',
        component: TablaComponent
      },
      {
        path: 'liquidacion',
        component: LiquidacionComponent
      },
      {
        path: 'estadistica',
        component: EstadisticaComponent
      },
      {
        path: 'configuracion',
        component: ConfiguracionComponent
      },
      {
        path: 'terapeutas',
        component: TerapeutasComponent
      },
      {
        path: 'encargados',
        component: EncargadosComponent
      },
      {
        path: 'trabajadores',
        component: TrabajadoresComponent
      }
    ]
  },
  {
    path: '**',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
