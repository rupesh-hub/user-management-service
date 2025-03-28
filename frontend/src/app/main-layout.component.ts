import { Component } from '@angular/core';

@Component({
  selector: 'ums-main-layout',
  standalone: false,
  template: `
    <div>
      <ums-navbar/>
      <div>
        <ums-sidebar/>
        <main>
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `,
  styles: ``
})
export class MainLayoutComponent {

}
