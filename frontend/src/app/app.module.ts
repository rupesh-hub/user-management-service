import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {ErrorComponent} from './shared/error/error.component';
import {UnauthorizedComponent} from './shared/unauthorized/unauthorized.component';
import {CoreModule} from './core/core.module';
import {AdminModule} from './admin/admin.module';
import {UserModule} from './user/user.module';
import {TokenInterceptor} from './core/interceptors/token.interceptor';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {FormsModule} from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    ErrorComponent,
    UnauthorizedComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    CoreModule,
    AdminModule,
    UserModule,
    FontAwesomeModule,
    FormsModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
