import { Component } from '@angular/core';

@Component({
  selector: 'ums-auth-layout',
  standalone: false,
  template: `
    <div class="auth-layout">
      <router-outlet></router-outlet>
    </div>
  `,
  styles: ``
})
export class AuthLayoutComponent {

}
