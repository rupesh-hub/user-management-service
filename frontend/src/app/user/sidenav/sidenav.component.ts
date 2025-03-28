import {Component, Input, OnInit} from '@angular/core';
import {Router, NavigationEnd} from "@angular/router"
import {filter} from "rxjs/operators"

interface MenuItem {
  icon: string
  label: string
  route: string
  active: boolean
  badge?: number
}

@Component({
  selector: 'ums-sidenav',
  standalone: false,
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.scss'
})
export class SidenavComponent implements OnInit {

  protected activeTab = "personal";
  @Input() user: any;

  menuItems: MenuItem[] = [
    {icon: "user", label: "Personal Information", route: "profile", active: true},
    {icon: "briefcase", label: "Tasks & Projects", route: "tasks", active: false, badge: 3},
    {icon: "chart-bar", label: "Performance", route: "performance", active: false},
    {icon: "shield", label: "Roles & Permissions", route: "roles", active: false},
    {icon: "lock", label: "Security & Privacy", route: "security", active: false},
    {icon: "clock", label: "Activity & Login History", route: "activity", active: false},
    {icon: "document", label: "Documents & Files", route: "documents", active: false},
    {icon: "bell", label: "Notifications", route: "notifications", active: false, badge: 5},
    {icon: "cog", label: "Account Settings", route: "settings", active: false},
  ]

  constructor(private router: Router) {}

  ngOnInit() {
    this.updateActiveStateFromUrl(this.router.url)
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe((event: NavigationEnd) => {
      this.updateActiveStateFromUrl(event.url)
    })
  }

  updateActiveStateFromUrl(url: string): void {
    const currentRoute = url.split("/").pop() || ""
    this.menuItems.forEach((item) => {
      item.active = item.route === currentRoute
    })
  }

  updateActiveItem(selectedItem: MenuItem): void {
    this.menuItems.forEach((item) => {
      item.active = item === selectedItem
    })
  }

}
