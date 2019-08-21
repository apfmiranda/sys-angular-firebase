import { DashboardResourcesComponent } from './components/dashboard-resources/dashboard-resources.component';
import { DashboardHomeComponent } from './components/dashboard-home/dashboard-home.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  {
    path: '',
    component: DashboardHomeComponent,
    children: [
      { path: 'profile', loadChildren: () => import('./../user/user.module').then(m => m.UserModule)},
      { path: '', component: DashboardResourcesComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
