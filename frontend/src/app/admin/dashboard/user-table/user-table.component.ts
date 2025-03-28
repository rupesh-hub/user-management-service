import {Component, EventEmitter, Input, Output} from '@angular/core';
import {User, UserStatus} from '../../model/dashboard.model';
import {faTrashAlt, faPlus, faCaretLeft, faCaretRight, faEye, faPencil, faCog} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'ums-user-table',
  standalone: false,
  templateUrl: './user-table.component.html',
  styleUrl: './user-table.component.scss'
})
export class UserTableComponent {
  @Input() users: User[] = []
  @Input() currentPage = 1
  @Input() totalPages = 1
  @Input() itemsPerPage = 10
  @Input() totalItems = 0

  @Output() pageChange = new EventEmitter<number>()

  protected faTrashAlt = faTrashAlt;
  protected faPlus = faPlus;
  protected faCaretLeft = faCaretLeft;
  protected faCaretRight = faCaretRight;
  protected faEye = faEye;
  protected faPencil = faPencil;
  protected faCog = faCog;

  selectedUsers: number[] = []
  selectAll = false
  isFilterOpen = false
  isUserActionOpen: { [key: number]: boolean } = {}

  // Filters
  statusFilter: UserStatus | "all" = "all"
  roleFilter: string | "all" = "all"
  dateFilter: string | "all" = "all"

  roles = ["User", "Editor", "Admin"]
  statuses = Object.values(UserStatus)
  dateRanges = ["Last 7 days", "Last 30 days", "Last 90 days", "This year"]

  constructor() {
  }

  toggleSelectAll(): void {
    this.selectAll = !this.selectAll
    if (this.selectAll) {
      this.selectedUsers = this.users.map((user) => user.id)
    } else {
      this.selectedUsers = []
    }
  }

  toggleUserSelection(userId: number): void {
    const index = this.selectedUsers.indexOf(userId)
    if (index === -1) {
      this.selectedUsers.push(userId)
    } else {
      this.selectedUsers.splice(index, 1)
    }

    // Update selectAll state
    this.selectAll = this.selectedUsers.length === this.users.length
  }

  isSelected(userId: number): boolean {
    return this.selectedUsers.includes(userId)
  }

  toggleUserActions(userId: number): void {
    // Close all other open menus
    Object.keys(this.isUserActionOpen).forEach((key) => {
      if (+key !== userId) {
        this.isUserActionOpen[+key] = false
      }
    })

    // Toggle the current menu
    this.isUserActionOpen[userId] = !this.isUserActionOpen[userId]
  }

  toggleFilters(): void {
    this.isFilterOpen = !this.isFilterOpen
  }

  applyFilters(): void {
    // Implement filter logic
    this.isFilterOpen = false
  }

  resetFilters(): void {
    this.statusFilter = "all"
    this.roleFilter = "all"
    this.dateFilter = "all"
  }

  changePage(page: any): void {
    if (page >= 1 && page <= this.totalPages) {
      this.pageChange.emit(page)
    }
  }

  getStatusClass(status: UserStatus): string {
    switch (status) {
      case UserStatus.Active:
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case UserStatus.Inactive:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
      case UserStatus.Warned:
        return "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300"
      case UserStatus.Blocked:
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
    }
  }

  getStatusDot(status: UserStatus): string {
    switch (status) {
      case UserStatus.Active:
        return "bg-green-500"
      case UserStatus.Inactive:
        return "bg-gray-500"
      case UserStatus.Warned:
        return "bg-amber-500"
      case UserStatus.Blocked:
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  getPaginationArray(): (number | string)[] {
    const pages: (number | string)[] = []

    if (this.totalPages <= 7) {
      // Show all pages
      for (let i = 1; i <= this.totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Always show first page
      pages.push(1)

      if (this.currentPage > 3) {
        pages.push("...")
      }

      // Show pages around current page
      const start = Math.max(2, this.currentPage - 1)
      const end = Math.min(this.totalPages - 1, this.currentPage + 1)

      for (let i = start; i <= end; i++) {
        pages.push(i)
      }

      if (this.currentPage < this.totalPages - 2) {
        pages.push("...")
      }

      // Always show last page
      pages.push(this.totalPages)
    }

    return pages
  }

  protected readonly Math = Math;
}


