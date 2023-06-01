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
import { LoginComponent } from './navigation/login/login.component';

const routes: Routes = [
  {
    path: 'menu/:id',
    component: SidenavWrapperComponent,
    children: [
      {
        path: 'vision/:id',
        component: VisionComponent
      },
      {
        path: 'nuevo-servicio/:id',
        component: NuevoServicioComponent
      },
      {
        path: 'tabla/:id',
        component: TablaComponent
      },
      // {
      //   path: 'liquidacion',
      //   component: LiquidacionComponent
      // },
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
      }
    ]
  },
  {
    path: '',
    component: LoginComponent
  },
  {
    path: '**',
    component: LoginComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
