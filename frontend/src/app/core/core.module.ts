import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LoginComponent} from './authentication/login/login.component';
import {
  ConfirmationTokenValidatorComponent
} from './authentication/confirmation-token-validator/confirmation-token-validator.component';
import {ForgetPasswordComponent} from './authentication/forget-password/forget-password.component';
import {ResetPasswordComponent} from './authentication/reset-password/reset-password.component';
import {RouterModule, Routes} from '@angular/router';
import {ErrorComponent} from '../shared/error/error.component';
import {UnauthorizedComponent} from '../shared/unauthorized/unauthorized.component';
import {RegisterComponent} from './authentication/register/register.component';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {ReactiveFormsModule} from '@angular/forms';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent,
  },
  {
    path: 'validate-token',
    component: ConfirmationTokenValidatorComponent
  },
  {
    path: 'forget-password',
    component: ForgetPasswordComponent,
  },
  {
    path: 'reset-password',
    component: ResetPasswordComponent,
  },
  {
    path: 'unauthorized',
    component: UnauthorizedComponent
  },
  {
    path: 'error',
    component: ErrorComponent
  },
  {
    path: '**',
    redirectTo: '/error'
  }
];

@NgModule({
  declarations: [
    LoginComponent,
    ConfirmationTokenValidatorComponent,
    ForgetPasswordComponent,
    ResetPasswordComponent,
    RegisterComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FontAwesomeModule,
    ReactiveFormsModule
  ],
  exports: [RouterModule]
})
export class CoreModule {
}
