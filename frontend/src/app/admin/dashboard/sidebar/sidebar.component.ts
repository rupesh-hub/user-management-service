import {Component, inject, Input} from '@angular/core';

import {
  faBell,
  faUsers,
  faUserShield,
  faBarChart,
  faClock,
  faCog,
  faUserGroup,
  faChevronLeft,
  faShieldCat,
  faChevronRight,
  faBellConcierge,
  faAddressBook,
  faShieldAlt
} from '@fortawesome/free-solid-svg-icons';
import {IsActiveMatchOptions, Route, Router} from '@angular/router';

interface NavItem {
  title: string
  icon: any
  link: string
  badge?: number
  active?: boolean
}

@Component({
  selector: 'ums-sidebar',
  standalone: false,
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {

  @Input() user:any;

  // Exact match options
  exactMatchOptions: IsActiveMatchOptions = {
    paths: 'exact',
    queryParams: 'exact',
    fragment: 'ignored',
    matrixParams: 'ignored'
  };

  protected router: Router = inject(Router);
  isCollapsed = false
  protected faChevronLeft = faChevronLeft;
  protected faChevronRight = faChevronRight;

  navItems: NavItem[] = [
    {title: "Dashboard", icon: faBarChart, link: "/admin/dashboard", active: true},
    {title: "Users", icon: faUsers, link: "/admin/users", badge: 4},
    {title: "User Groups", icon: faUserGroup, link: "/admin/user-groups"},
    {title: "Roles & Permissions", icon: faShieldCat, link: "/admin/permissions"},
    {title: "Activity Log", icon: faClock, link: "/admin/activity-logs"},
    {title: 'Notifications', icon: faBell, link: "/admin/notifications", badge: 7},
    {title: "Authentication Managements", icon: faUserShield, link: "/admin/authentications"},
    {title: 'System Health & Security', icon: faShieldAlt, link: "/admin/system-healths"},
    {title: 'User Directory & Profiles', icon: faAddressBook, link: "/admin/directories-profiles"},
    {title: 'Notifications & Communications', icon: faBellConcierge, link: "/admin/communications"},
    {title: "Settings", icon: faCog, link: "/admin/settings"},
  ]

  toggleSidebar(): void {
    this.isCollapsed = !this.isCollapsed
  }

}
