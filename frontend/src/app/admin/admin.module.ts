import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DashboardComponent} from './dashboard/dashboard.component';
import {UsersComponent} from './users/users.component';
import {RouterModule, Routes} from '@angular/router';
import {AdminComponent} from './admin.component';
import {SidebarComponent} from './dashboard/sidebar/sidebar.component';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MetricCardComponent} from './dashboard/matric-card/metric-card.component';
import {ChartContainerComponent} from './dashboard/chart-container/chart-container.component';
import {UserTableComponent} from './dashboard/user-table/user-table.component';
import {UserGroupComponent} from './user-group/user-group.component';
import {ActivityLogsComponent} from './activity-logs/activity-logs.component';
import {UserAuthenticationComponent} from './user-authentication/user-authentication.component';
import {PermissionsComponent} from './permissions/permissions.component';
import {NotificationsComponent} from './notifications/notifications.component';
import {DirectoriesProfilesComponent} from './directories-profiles/directories-profiles.component';
import {SystemHealthsComponent} from './system-healths/system-healths.component';
import {CommunicationsComponent} from './communications/communications.component';
import {SettingsComponent} from './settings/settings.component';
import {NavbarComponent} from '../shared/navbar/navbar.component';
import {DetailsComponent} from './users/details/details.component';
import { AddComponent } from './users/add/add.component';

const routes: Routes = [
  {path: '', redirectTo: 'dashboard', pathMatch: 'full'},
  {path: 'dashboard', component: DashboardComponent},
  {path: 'users', component: UsersComponent},
  {path: 'users/details/:username', component: DetailsComponent},
  {path: 'users/add', component: AddComponent},
  {path: 'user-groups', component: UserGroupComponent},
  {path: 'activity-logs', component: ActivityLogsComponent},
  {path: 'authentications', component: UserAuthenticationComponent},
  {path: 'notifications', component: NotificationsComponent},
  {path: 'permissions', component: PermissionsComponent},
  {path: 'directories-profiles', component: DirectoriesProfilesComponent},
  {path: 'system-healths', component: SystemHealthsComponent},
  {path: 'communications', component: CommunicationsComponent},
  {path: 'settings', component: SettingsComponent}
];

@NgModule({
  declarations: [
    DashboardComponent,
    UsersComponent,
    AdminComponent,
    SidebarComponent,
    MetricCardComponent,
    ChartContainerComponent,
    UserTableComponent,
    UserGroupComponent,
    ActivityLogsComponent,
    UserAuthenticationComponent,
    PermissionsComponent,
    NotificationsComponent,
    DirectoriesProfilesComponent,
    SystemHealthsComponent,
    CommunicationsComponent,
    SettingsComponent,
    NavbarComponent,
    DetailsComponent,
    AddComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FontAwesomeModule,
    ReactiveFormsModule,
    FormsModule
  ],
  exports: [RouterModule, SidebarComponent]
})
export class AdminModule {
}
