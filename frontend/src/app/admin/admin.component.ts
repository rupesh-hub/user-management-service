import {Component, inject, OnInit} from '@angular/core';
import {AuthenticationService} from '../core/services/authentication.service';

@Component({
  selector: 'ums-admin',
  standalone: false,
  template: `
    <div class="flex flex-col h-screen">
      <!-- Main content area with sidebar and header -->
      <div class="flex flex-1 overflow-hidden">
        <!-- Sidebar on the left (full height) -->
        <aside
          class="w-64 bg-gray-800 text-white transform transition-transform duration-200 ease-in-out md:translate-x-0">
          <ums-sidebar [user]="user"></ums-sidebar>
        </aside>

        <!-- Right section (header + content) -->
        <div class="flex flex-col flex-1">
          <!-- Header below sidebar -->
          <header class="bg-white z-10">
            <ums-navbar [user]="user"></ums-navbar>
          </header>

          <!-- Main content area -->
          <main class="flex-1 overflow-x-auto overflow-y-auto bg-gray-50 p-4 max-w-[calc(100vw-16rem)]">
            <router-outlet></router-outlet>
          </main>
        </div>
      </div>
    </div>
  `,
  styles: ``
})
export class AdminComponent implements OnInit{

  protected _authenticationService: AuthenticationService = inject(AuthenticationService);
  protected user: any;

  ngOnInit() {
    this.user = this._authenticationService.authenticatedUser();
  }

}
