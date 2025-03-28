import {Component, OnInit} from '@angular/core';
import {faSearch, faPlus, faChevronDown, faEllipsisVertical, faFilter, faEye} from '@fortawesome/free-solid-svg-icons';

interface User {
  id: number,
  name: string,
  email: string,
  username: string,
  avatar: string,
  access: {
    admin: boolean,
    dataExport: boolean,
    dataImport: boolean,
  }
  lastActive: string,
  dateAdded: string,
}


@Component({
  selector: 'ums-users',
  standalone: false,
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent implements OnInit {
  // Font Awesome icons
  faSearch = faSearch
  faPlus = faPlus
  faChevronDown = faChevronDown
  faEllipsisVertical = faEllipsisVertical
  faFilter = faFilter
  faEye = faEye;

  // Users data
  users: User[] = []
  filteredUsers: User[] = []

  // Pagination
  currentPage = 1
  itemsPerPage = 8
  totalPages = 1

  // Search and filters
  searchQuery = ""
  selectedUsers: number[] = []
  selectAll = false

  constructor() {
  }

  ngOnInit(): void {
    this.loadUsers()
    this.applyFilters()
  }

  loadUsers(): void {
    // Mock data - in a real app, this would come from an API
    this.users = [
      {
        id: 1,
        name: "Florence Shaw",
        email: "florence@untitledui.com",
        avatar: "https://i.pravatar.cc/150?img=1",
        access: {admin: true, dataExport: true, dataImport: true},
        lastActive: "Mar 4, 2024",
        dateAdded: "July 4, 2022",
        username: 'Rupesh2053'
      },
      {
        id: 2,
        name: "Amélie Laurent",
        email: "amelie@untitledui.com",
        avatar: "https://i.pravatar.cc/150?img=5",
        access: {admin: true, dataExport: true, dataImport: true},
        lastActive: "Mar 4, 2024",
        dateAdded: "July 4, 2022",
        username: 'Rupesh2053'
      },
      {
        id: 3,
        name: "Ammar Foley",
        email: "ammar@untitledui.com",
        avatar: "https://i.pravatar.cc/150?img=8",
        access: {admin: false, dataExport: true, dataImport: true},
        lastActive: "Mar 2, 2024",
        dateAdded: "July 4, 2022",
        username: 'Rupesh2053'
      },
      {
        id: 4,
        name: "Caitlyn King",
        email: "caitlyn@untitledui.com",
        avatar: "https://i.pravatar.cc/150?img=9",
        access: {admin: false, dataExport: true, dataImport: true},
        lastActive: "Mar 6, 2024",
        dateAdded: "July 4, 2022",
        username: 'Rupesh2053'
      },
      {
        id: 5,
        name: "Sienna Hewitt",
        email: "sienna@untitledui.com",
        avatar: "https://i.pravatar.cc/150?img=25",
        access: {admin: false, dataExport: true, dataImport: true},
        lastActive: "Mar 8, 2024",
        dateAdded: "July 4, 2022",
        username: 'Rupesh2053'
      },
      {
        id: 6,
        name: "Olly Shroeder",
        email: "olly@untitledui.com",
        avatar: "https://i.pravatar.cc/150?img=12",
        access: {admin: false, dataExport: true, dataImport: true},
        lastActive: "Mar 6, 2024",
        dateAdded: "July 4, 2022",
        username: 'Rupesh2053'
      },
      {
        id: 7,
        name: "Mathilde Lewis",
        email: "mathilde@untitledui.com",
        avatar: "https://i.pravatar.cc/150?img=3",
        access: {admin: false, dataExport: true, dataImport: true},
        lastActive: "Mar 4, 2024",
        dateAdded: "July 4, 2022",
        username: 'Rupesh2053'
      },
      {
        id: 8,
        name: "Jaya Willis",
        email: "jaya@untitledui.com",
        avatar: "https://i.pravatar.cc/150?img=33",
        access: {admin: false, dataExport: true, dataImport: true},
        lastActive: "Mar 4, 2024",
        dateAdded: "July 4, 2022",
        username: 'Rupesh2053'
      },
      {
        id: 9,
        name: "Marcus Chen",
        email: "marcus@untitledui.com",
        avatar: "https://i.pravatar.cc/150?img=11",
        access: {admin: false, dataExport: true, dataImport: true},
        lastActive: "Mar 3, 2024",
        dateAdded: "July 4, 2022",
        username: 'Rupesh2053'
      },
      {
        id: 10,
        name: "Elena Rodriguez",
        email: "elena@untitledui.com",
        avatar: "https://i.pravatar.cc/150?img=24",
        access: {admin: false, dataExport: true, dataImport: true},
        lastActive: "Mar 1, 2024",
        dateAdded: "July 4, 2022",
        username: 'Rupesh2053'
      },
      {
        id: 11,
        name: "David Kim",
        email: "david@untitledui.com",
        avatar: "https://i.pravatar.cc/150?img=15",
        access: {admin: false, dataExport: true, dataImport: true},
        lastActive: "Mar 5, 2024",
        dateAdded: "July 4, 2022",
        username: 'Rupesh2053'
      },
      {
        id: 12,
        name: "Sophia Patel",
        email: "sophia@untitledui.com",
        avatar: "https://i.pravatar.cc/150?img=20",
        access: {admin: false, dataExport: true, dataImport: true},
        lastActive: "Mar 7, 2024",
        dateAdded: "July 4, 2022",
        username: 'Rupesh2053'
      },
    ]
  }

  applyFilters(): void {
    let filtered = this.users

    // Apply search filter
    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase()
      filtered = filtered.filter(
        (user) => user.name.toLowerCase().includes(query) || user.email.toLowerCase().includes(query),
      )
    }

    this.filteredUsers = filtered
    this.totalPages = Math.ceil(this.filteredUsers.length / this.itemsPerPage)
  }

  onSearch(): void {
    this.currentPage = 1
    this.applyFilters()
  }

  toggleSelectAll(): void {
    this.selectAll = !this.selectAll

    if (this.selectAll) {
      this.selectedUsers = this.getCurrentPageUsers().map((user) => user.id)
    } else {
      this.selectedUsers = []
    }
  }

  toggleSelectUser(userId: number): void {
    const index = this.selectedUsers.indexOf(userId)
    console.log(index)

    if (index === -1) {
      this.selectedUsers.push(userId)
    } else {
      this.selectedUsers.splice(index, 1)
    }

    // Update selectAll state
    const currentPageUserIds = this.getCurrentPageUsers().map((user) => user.id)
    this.selectAll = currentPageUserIds.every((id) => this.selectedUsers.includes(id))
  }

  isSelected(userId: number): boolean {
    return this.selectedUsers.includes(userId)
  }

  getCurrentPageUsers(): User[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage
    return this.filteredUsers.slice(startIndex, startIndex + this.itemsPerPage)
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page
    }
  }

  getPaginationRange(): number[] {
    const range = []
    const maxVisiblePages = 5

    let start = Math.max(1, this.currentPage - Math.floor(maxVisiblePages / 2))
    const end = Math.min(this.totalPages, start + maxVisiblePages - 1)

    // Adjust start if we're near the end
    if (end === this.totalPages) {
      start = Math.max(1, end - maxVisiblePages + 1)
    }

    for (let i = start; i <= end; i++) {
      range.push(i)
    }

    return range
  }

  protected readonly Math = Math;
}

