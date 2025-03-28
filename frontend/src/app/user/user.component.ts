import {Component, EventEmitter, HostListener, inject, Input, OnInit, Output} from '@angular/core';
import {AuthenticationService} from '../core/services/authentication.service';
import {faUser, faCogs, faSignOut, faBell, faSearch} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'ums-user',
  standalone: false,
  template: `
    <div class="flex flex-col h-screen">
      <!-- Main content area with sidebar and header -->
      <div class="flex flex-1 overflow-hidden">
        <!-- Sidebar on the left (full height) -->
        <aside
          class="w-64 text-white shadow-lg transform transition-transform duration-200 ease-in-out md:translate-x-0 h-full">
          <ums-sidenav [user]="user"></ums-sidenav>
        </aside>

        <!-- Right section (header + content) -->
        <div class="flex flex-col flex-1">
          <!-- Header below sidebar -->
          <header class="bg-white shadow-sm z-10">
            <header class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
              <div class="flex items-center justify-between h-16 px-4 md:px-6">
                <!-- Left: Page Title -->
                <div>
                  <h1 class="text-xl font-semibold text-gray-800 dark:text-white">Welcome back {{ user.name }} !</h1>
                </div>

                <!-- Right: Search, Timeframe, Notifications, Profile -->
                <div class="flex items-center space-x-3">
                  <!-- Search -->
                  <div class="relative">
                    <fa-icon [icon]="faSearch"
                             class="text-gray-400 font-medium absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"/>
                    <input
                      [(ngModel)]="searchQuery"
                      (input)="onSearch()"
                      type="text"
                      placeholder="Search users..."
                      class="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white w-48 md:w-64">
                  </div>

                  <!-- Dark Mode Toggle -->
                  <button
                    (click)="toggleDarkMode()"
                    class="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none">
                    <svg *ngIf="!isDarkMode" class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/>
                    </svg>
                    <svg *ngIf="isDarkMode" class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/>
                    </svg>
                  </button>

                  <!-- Notifications -->
                  <div class="relative">
                    <button
                      (click)="toggleNotifications()"
                      class="notifications-button p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none relative">
                      <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
                      </svg>

                      <!-- Unread notification badge -->
                      @if (hasUnreadNotifications()) {
                        <span
                          class="absolute top-0 right-0 -mt-1 -mr-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs font-semibold text-white">
                    {{ unreadNotificationsCount }}
                  </span>
                      }

                    </button>

                    <!-- Notifications Dropdown -->
                    <div *ngIf="isNotificationsOpen"
                         class="notifications-dropdown origin-top-right absolute right-0 mt-2 w-80 rounded shadow bg-white dark:bg-gray-700 z-10 border">
                      <div class="py-2">
                        <div
                          class="px-4 py-2 border-b border-gray-200 dark:border-gray-600 flex justify-start gap-2 items-center">
                          <h3 class="text-sm font-semibold text-gray-800 dark:text-white">Notifications</h3>
                          <small
                            class="font-bold h-5 w-5 rounded-full bg-red-700 flex justify-center items-center text-white font-serif text-xs">2</small>
                        </div>
                        <div *ngIf="notifications.length === 0"
                             class="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                          No new notifications
                        </div>
                        <a
                          *ngFor="let notification of notifications"
                          class="block px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer border-b"
                          [class.bg-indigo-50]="!notification.read"
                          [class.dark:bg-gray-600]="!notification.read">
                          <div class="flex items-start">
                            <div class="flex-shrink-0">
                  <span
                    class="h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-500 dark:text-indigo-300 flex items-center justify-center">
                   <fa-icon [icon]="faBell"/>
                  </span>
                            </div>
                            <div class="ml-3 w-0 flex-1"
                                 [class]="!notification.read?'font-bold':'text-gray-600 dark:text-gray-400'">
                              <p class="text-sm dark:text-white">{{ notification.title }}</p>
                              <p class="mt-1 text-xs">{{ notification.time }}</p>
                            </div>
                          </div>
                        </a>
                        <div class="px-4 py-2 text-center">
                          <a
                            class="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 cursor-pointer"
                            routerLink="/users/notifications">View all
                            notifications</a>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Profile Dropdown -->
                  <div class="relative">
                    <button
                      (click)="toggleProfileMenu()"
                      class="profile-button flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 relative">
                      <img class="h-8 w-8 rounded-full" [src]="user?.profile" alt="User avatar">
                      <span
                        class="absolute top-0 right-0 -mt-1 -mr-1 flex h-4 w-4 items-center justify-center rounded-full bg-green-500 text-xs font-semibold text-white border-2 border-white"></span>
                    </button>

                    <!-- Profile Dropdown Menu -->
                    <div *ngIf="isProfileMenuOpen"
                         class="profile-dropdown origin-top-right absolute right-0 mt-2 w-48 rounded shadow-lg bg-white dark:bg-gray-700 ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                      <div class="py-1 bg-slate-50 rounded">
                        <a
                          class="flex justify-start items-center gap-4 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer">
                          <fa-icon [icon]="faUser"/>
                          Your Profile
                        </a>
                        <a
                          class="flex justify-start items-center gap-4 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer">
                          <fa-icon [icon]="faCogs"/>
                          Settings
                        </a>
                        <div class="border-t border-gray-200 dark:border-gray-600"></div>
                        <a
                          class="flex justify-start items-center gap-4 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer"
                          (click)="_authenticationService.logout()">
                          <fa-icon [icon]="faSignOut"/>
                          Sign out
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </header>

          </header>

          <!-- Main content area -->
          <main class="flex-1 overflow-x-auto p-4">
            <router-outlet></router-outlet>
          </main>
        </div>
      </div>
    </div>

  `,
  styles: ``
})
export class UserComponent implements OnInit {
  protected _authenticationService: AuthenticationService = inject(AuthenticationService);
  protected user: any;

  @Input() searchQuery = ""
  @Output() searchChange = new EventEmitter<string>()

  @Input() selectedTimeframe = ""
  @Input() timeframes: string[] = []
  @Output() timeframeChange = new EventEmitter<string>()

  isProfileMenuOpen = false
  isNotificationsOpen = false
  isDarkMode = false
  protected faUser = faUser;
  protected faCogs = faCogs;
  protected faSignOut = faSignOut;
  protected faBell = faBell;
  protected faSearch = faSearch;

  notifications = [
    {id: 1, title: "New user registered", time: "2 min ago", read: false},
    {id: 2, title: "User account locked", time: "1 hour ago", read: false},
    {id: 3, title: "System update completed", time: "3 hours ago", read: true},
  ]

  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent) {
    // Get the clicked element
    const clickedElement = event.target as HTMLElement;

    // Check if click was outside profile dropdown
    if (this.isProfileMenuOpen &&
      !clickedElement.closest('.profile-dropdown') &&
      !clickedElement.closest('.profile-button')) {
      this.isProfileMenuOpen = false;
    }

    // Check if click was outside notifications dropdown
    if (this.isNotificationsOpen &&
      !clickedElement.closest('.notifications-dropdown') &&
      !clickedElement.closest('.notifications-button')) {
      this.isNotificationsOpen = false;
    }
  }

  ngOnInit() {
    this.user = this._authenticationService.authenticatedUser();
  }

  toggleProfileMenu(): void {
    this.isProfileMenuOpen = !this.isProfileMenuOpen
    if (this.isProfileMenuOpen) {
      this.isNotificationsOpen = false
    }
  }

  toggleNotifications(): void {
    this.isNotificationsOpen = !this.isNotificationsOpen
    if (this.isNotificationsOpen) {
      this.isProfileMenuOpen = false
    }
  }

  toggleDarkMode(): void {
    this.isDarkMode = !this.isDarkMode
    if (this.isDarkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }

  onSearch(): void {
    this.searchChange.emit(this.searchQuery)
  }

  // Getter to calculate unread notifications
  get unreadNotificationsCount(): number {
    return this.notifications.filter(n => !n.read).length;
  }

  // Method to check if there are unread notifications
  hasUnreadNotifications(): boolean {
    return this.unreadNotificationsCount > 0;
  }


}
