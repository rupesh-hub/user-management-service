import {Component, OnInit} from '@angular/core';
import {faSearch, faPlus, faChevronDown, faChevronUp, faFilter, faEye} from '@fortawesome/free-solid-svg-icons';
import {AdminService} from '../admin.service';


interface User {
  id: string;
  name: string;
  email: string;
  username: string;
  avatar: string;
  roles: string[];
  lastActive: string;
  dateAdded: string;
  initials: string;
  initialsColor: string;
  status: string;
}

interface UserFilter {
  search?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  username?: string;
  active?: boolean;
  createdAfter?: Date;
  createdBefore?: Date;
}

@Component({
  selector: 'ums-users',
  standalone: false,
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent implements OnInit {
  // Icons
  faSearch = faSearch;
  faPlus = faPlus;
  faChevronDown = faChevronDown;
  faChevronUp = faChevronUp;
  faFilter = faFilter;
  faEye = faEye;

  // Data
  users: User[] = [];
  selectedUsers: string[] = [];
  selectAll = false;

  // Pagination
  currentPage = 0;
  itemsPerPage = 10;
  totalElements = 0;
  totalPages = 1;

  // Filtering
  filter: UserFilter = {};
  showAdvancedFilters = false;
  searchQuery = "";

  // Sorting
  sortBy = 'createdOn';
  sortDirection: 'ASC' | 'DESC' = 'DESC';

  constructor(private _adminService: AdminService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    const params: any = {
      page: this.currentPage,
      size: this.itemsPerPage,
      sortBy: this.sortBy,
      sortDirection: this.sortDirection,
      search: this.searchQuery
    };

    // Add advanced filters if they exist
    if (this.filter.firstName) params.firstName = this.filter.firstName;
    if (this.filter.lastName) params.lastName = this.filter.lastName;
    if (this.filter.email) params.email = this.filter.email;
    if (this.filter.username) params.username = this.filter.username;
    if (this.filter.active !== undefined) params.active = this.filter.active;
    if (this.filter.createdAfter) params.createdAfter = this.filter.createdAfter.toISOString().split('T')[0];
    if (this.filter.createdBefore) params.createdBefore = this.filter.createdBefore.toISOString().split('T')[0];

    this._adminService.getUsers(params).subscribe({
      next: (response) => {
        this.users = response.users;
        this.totalElements = response.pagination.totalElements;
        this.totalPages = response.pagination.totalPages;
        this.selectAll = false;
        this.selectedUsers = [];
      },
      error: (error) => {
        console.error('Error loading users:', error);
      }
    });
  }

  onSearch(): void {
    this.currentPage = 0;
    this.loadUsers();
  }

  onSort(field: string): void {
    if (this.sortBy === field) {
      this.sortDirection = this.sortDirection === 'ASC' ? 'DESC' : 'ASC';
    } else {
      this.sortBy = field;
      this.sortDirection = 'DESC';
    }
    this.loadUsers();
  }

  toggleAdvancedFilters(): void {
    this.showAdvancedFilters = !this.showAdvancedFilters;
  }

  applyAdvancedFilters(): void {
    this.currentPage = 0;
    this.loadUsers();
  }

  clearFilters(): void {
    this.filter = {};
    this.searchQuery = "";
    this.currentPage = 0;
    this.loadUsers();
  }

  toggleSelectAll(): void {
    this.selectAll = !this.selectAll;
    if (this.selectAll) {
      this.selectedUsers = this.users.map(user => user.id);
    } else {
      this.selectedUsers = [];
    }
  }

  toggleSelectUser(userId: string): void {
    const index = this.selectedUsers.indexOf(userId);
    if (index === -1) {
      this.selectedUsers.push(userId);
    } else {
      this.selectedUsers.splice(index, 1);
    }
    this.selectAll = this.users.every(user => this.selectedUsers.includes(user.id));
  }

  isSelected(userId: string): boolean {
    return this.selectedUsers.includes(userId);
  }

  goToPage(page: number): void {
    this.currentPage = page;
    this.loadUsers();
  }

  getPaginationRange(): number[] {
    const range = [];
    const maxVisiblePages = 5;
    let start = Math.max(0, this.currentPage - Math.floor(maxVisiblePages / 2));
    let end = Math.min(this.totalPages - 1, start + maxVisiblePages - 1);

    // Adjust if we're at the end
    if (end === this.totalPages - 1) {
      start = Math.max(0, end - maxVisiblePages + 1);
    }

    for (let i = start; i <= end; i++) {
      range.push(i);
    }

    return range;
  }

  getSortIcon(field: string): any {
    if (this.sortBy !== field) return null;
    return this.sortDirection === 'ASC' ? faChevronUp : faChevronDown;
  }


  protected readonly Math = Math;
}

