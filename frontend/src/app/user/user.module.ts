import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ChangePasswordComponent} from './change-password/change-password.component';
import {ProfileComponent} from './profile/profile.component';
import {RouterModule, Routes} from '@angular/router';
import { ProfileCardComponent } from './profile/profile-card/profile-card.component';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { TasksComponent } from './profile/tasks/tasks.component';
import { PerformancesComponent } from './profile/performances/performances.component';
import { RolesPermissionsComponent } from './profile/roles-permissions/roles-permissions.component';
import { SecurityPrivacyComponent } from './profile/security-privacy/security-privacy.component';
import { LoginActivityComponent } from './profile/login-activity/login-activity.component';
import { SettingsComponent } from './profile/settings/settings.component';
import { NotificationsComponent } from './profile/notifications/notifications.component';
import { DocumentsComponent } from './profile/documents/documents.component';
import { UserComponent } from './user.component';
import { SidenavComponent } from './sidenav/sidenav.component';
import {AdminModule} from '../admin/admin.module';

const routes: Routes = [
  { path: '', redirectTo: 'profile', pathMatch: 'full' },
  { path: 'profile', component: ProfileComponent },
  { path: 'change-password', component: ChangePasswordComponent },
  { path: 'personal', component: ProfileComponent },
  { path: 'tasks', component: TasksComponent},
  { path: 'performance', component: PerformancesComponent},
  { path: 'roles', component: RolesPermissionsComponent},
  { path:'security', component: SecurityPrivacyComponent},
  { path: 'activity', component: LoginActivityComponent},
  { path:'settings', component: SettingsComponent},
  { path: 'notifications', component: NotificationsComponent},
  { path: 'documents', component: DocumentsComponent},
];

@NgModule({
  declarations: [
    ChangePasswordComponent,
    ProfileComponent,
    ProfileCardComponent,
    TasksComponent,
    PerformancesComponent,
    RolesPermissionsComponent,
    SecurityPrivacyComponent,
    LoginActivityComponent,
    SettingsComponent,
    NotificationsComponent,
    DocumentsComponent,
    UserComponent,
    SidenavComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FontAwesomeModule,
    ReactiveFormsModule,
    FormsModule
  ],
  exports: [RouterModule]
})
export class UserModule { }
