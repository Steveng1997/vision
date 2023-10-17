import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NewServiceComponent } from './navigation/newService/newService.component';
import { TableComponent } from './navigation/table/table.component';
import { SettingComponent } from './navigation/setting/setting.component';
import { SidenavWrapperComponent } from './navigation/sidenav-wrapper/sidenav-wrapper.component';
import { VisionComponent } from './navigation/vision/vision.component';
import { TherapistComponent } from './navigation/Settlement/therapist/therapist.component';
import { ManagerComponent } from './navigation/Settlement/manager/manager.component';
import { LoginComponent } from './navigation/login/login.component';
import { ClosingComponent } from './navigation/closing/closing.component';

// Guard
import { AuthGuard } from './navigation/guards/auth.guard';

const routes: Routes = [
  {
    path: 'menu/:id',
    component: SidenavWrapperComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'vision/:id',
        component: VisionComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'nuevo-servicio/:id/:editar',
        component: NewServiceComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'tabla/:id',
        component: TableComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'cierre',
        component: ClosingComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'configuracion',
        component: SettingComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'terapeutas',
        component: TherapistComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'encargadas',
        component: ManagerComponent,
        canActivate: [AuthGuard]
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
