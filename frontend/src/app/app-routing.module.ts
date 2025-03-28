import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {authenticationGuard} from './core/guards/authentication.guard';
import {CoreComponent} from './core/core.component';
import {AdminComponent} from './admin/admin.component';
import {UserComponent} from './user/user.component';

const routes: Routes = [
  {
    path: '',
    component: CoreComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('./core/core.module').then(m => m.CoreModule)
      }
    ]
  },
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [authenticationGuard],
    data: {roles: ['admin']},
    loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule)
  },
  {
    path: 'users',
    component: UserComponent,
    canActivate: [authenticationGuard],
    data: {roles: ['user', 'admin']},
    loadChildren: () => import('./user/user.module').then(m => m.UserModule)
  },
  {path: '**', redirectTo: '/login'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
