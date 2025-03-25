import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {authenticationGuard} from './core/guards/authentication.guard';

const routes: Routes = [
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule),
    canActivate: [authenticationGuard],
    data: {roles: ['admin', 'user']}
  },
  {
    path: 'users',
    loadChildren: () => import('./user/user.module').then(m => m.UserModule),
    canActivate: [authenticationGuard],
    data: {roles: ['admin', 'user']}
  },
  {
    path: '',
    loadChildren: () => import('./core/core.module').then(m => m.CoreModule)
  },
  {
    path: '**',
    redirectTo: '/login'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
