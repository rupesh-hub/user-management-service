import {Component, EventEmitter, inject, Input, Output} from "@angular/core"
import {AuthenticationService} from '../../core/services/authentication.service';
import {faUser, faCogs, faSignOut, faBell, faSearch} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'ums-navbar',
  standalone: false,
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {

  @Input() user:any;
  @Input() searchQuery = ""
  @Output() searchChange = new EventEmitter<string>()

  @Input() selectedTimeframe = ""
  @Input() timeframes: string[] = []
  @Output() timeframeChange = new EventEmitter<string>()
  protected _authenticationService: AuthenticationService =  inject(AuthenticationService);

  isProfileMenuOpen = false
  isNotificationsOpen = false
  isDarkMode = false
  protected faUser = faUser;
  protected faCogs = faCogs;
  protected faSignOut = faSignOut;
  protected faBell = faBell;
  protected faSearch = faSearch;

  notifications = [
    { id: 1, title: "New user registered", time: "2 min ago", read: false },
    { id: 2, title: "User account locked", time: "1 hour ago", read: false },
    { id: 3, title: "System update completed", time: "3 hours ago", read: true },
  ]

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

  onTimeframeSelect(timeframe: string): void {
    this.selectedTimeframe = timeframe
    this.timeframeChange.emit(timeframe)
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
