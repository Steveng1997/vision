import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NuevoServicioComponent } from './navigation/nuevo-servicio/nuevo-servicio.component';
import { TableComponent } from './navigation/table/table.component';
import { ConfiguracionComponent } from './navigation/configuracion/configuracion.component';
import { SidenavWrapperComponent } from './navigation/sidenav-wrapper/sidenav-wrapper.component';
import { VisionComponent } from './navigation/vision/vision.component';
import { TherapistComponent } from './navigation/Settlement/therapist/therapist.component';
import { ManagerComponent } from './navigation/Settlement/manager/manager.component';
import { LoginComponent } from './navigation/login/login.component';
import { CierreComponent } from './navigation/cierre/cierre.component';

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
        path: 'nuevo-servicio/:id/:editar',
        component: NuevoServicioComponent
      },
      {
        path: 'tabla/:id',
        component: TableComponent
      },
      {
        path: 'cierre',
        component: CierreComponent
      },
      {
        path: 'configuracion',
        component: ConfiguracionComponent
      },
      {
        path: 'terapeutas',
        component: TherapistComponent
      },
      {
        path: 'encargadas',
        component: ManagerComponent
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
