import { AuthenticatedPreloadingStrategy } from './core/strategy/authenticated-preloading.strategy';
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';


const routes: Routes = [
  {
    path: 'dashboard', loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule)
  },
  {path: '', redirectTo: 'login', pathMatch: 'full' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      preloadingStrategy: AuthenticatedPreloadingStrategy
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
