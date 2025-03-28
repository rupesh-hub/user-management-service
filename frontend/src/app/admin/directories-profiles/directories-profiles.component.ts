import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  avatar: string;
  status: 'active' | 'inactive' | 'pending' | 'suspended' | 'locked';
  role: string;
  department: string;
  location: string;
  phoneNumber: string;
  lastLogin: Date | null;
  createdAt: Date;
  twoFactorEnabled: boolean;
  emailVerified: boolean;
  groups: string[];
  permissions: string[];
  notes: string;
}

interface UserActivity {
  id: string;
  userId: string;
  action: string;
  timestamp: Date;
  ipAddress: string;
  device: string;
  browser: string;
  location: string;
  details: string;
}

interface UserGroup {
  id: string;
  name: string;
  description: string;
  memberCount: number;
}

interface UserRole {
  id: string;
  name: string;
  description: string;
  permissions: string[];
}

interface UserPermission {
  id: string;
  name: string;
  description: string;
  category: string;
}


@Component({
  selector: 'ums-directories-profiles',
  standalone: false,
  templateUrl: './directories-profiles.component.html',
  styleUrl: './directories-profiles.component.scss'
})
export class DirectoriesProfilesComponent implements OnInit {
  // User directory
  users: User[] = [];
  filteredUsers: User[] = [];
  searchTerm = '';
  statusFilter: 'all' | 'active' | 'inactive' | 'pending' | 'suspended' | 'locked' = 'all';
  roleFilter = 'all';
  departmentFilter = 'all';
  sortBy = 'name';
  sortDirection: 'asc' | 'desc' = 'asc';

  // Pagination
  currentPage = 1;
  pageSize = 10;
  totalPages = 1;

  // Selected user
  selectedUser: User | null = null;
  userActivities: UserActivity[] = [];
  userGroups: UserGroup[] = [];
  availableGroups: UserGroup[] = [];
  userRoles: UserRole[] = [];
  availableRoles: UserRole[] = [];
  allPermissions: UserPermission[] = [];

  // View state
  activeTab = 'profile';
  isEditingProfile = false;
  isChangingPassword = false;
  isManagingGroups = false;
  isManagingRoles = false;

  // Forms
  profileForm: FormGroup;
  passwordForm: FormGroup;

  // Departments and roles for filtering
  departments: string[] = [];
  roles: string[] = [];

  constructor(private fb: FormBuilder) {
    this.profileForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      username: ['', Validators.required],
      phoneNumber: [''],
      department: [''],
      location: [''],
      notes: ['']
    });

    this.passwordForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.generateMockData();
    this.applyFilters();
  }

  generateMockData(): void {
    // Generate departments
    this.departments = ['Engineering', 'Marketing', 'Sales', 'Customer Support', 'Finance', 'Human Resources', 'Product', 'Design', 'Operations'];

    // Generate roles
    this.roles = ['Administrator', 'Manager', 'Editor', 'Viewer', 'Developer', 'Analyst', 'Support Agent'];

    // Generate users
    const statuses: ('active' | 'inactive' | 'pending' | 'suspended' | 'locked')[] = ['active', 'active', 'active', 'active', 'inactive', 'pending', 'suspended', 'locked'];
    const firstNames = ['John', 'Jane', 'Michael', 'Emily', 'David', 'Sarah', 'Robert', 'Lisa', 'William', 'Jessica', 'James', 'Jennifer', 'Thomas', 'Amanda', 'Christopher', 'Ashley'];
    const lastNames = ['Smith', 'Johnson', 'Williams', 'Jones', 'Brown', 'Davis', 'Miller', 'Wilson', 'Moore', 'Taylor', 'Anderson', 'Thomas', 'Jackson', 'White', 'Harris', 'Martin'];
    const locations = ['New York, USA', 'London, UK', 'San Francisco, USA', 'Toronto, Canada', 'Sydney, Australia', 'Berlin, Germany', 'Tokyo, Japan', 'Paris, France'];

    this.users = [];

    for (let i = 0; i < 100; i++) {
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`;
      const username = `${firstName.toLowerCase()}${lastName.toLowerCase()}${Math.floor(Math.random() * 1000)}`;
      const department = this.departments[Math.floor(Math.random() * this.departments.length)];
      const role = this.roles[Math.floor(Math.random() * this.roles.length)];
      const location = locations[Math.floor(Math.random() * locations.length)];
      const status = statuses[Math.floor(Math.random() * statuses.length)];

      // Random date within the last 2 years for creation
      const createdAt = new Date();
      createdAt.setDate(createdAt.getDate() - Math.floor(Math.random() * 730));

      // Random date for last login (null for some users)
      let lastLogin: Date | null = null;
      if (Math.random() > 0.1) {
        lastLogin = new Date();
        lastLogin.setDate(lastLogin.getDate() - Math.floor(Math.random() * 60));
      }

      this.users.push({
        id: `user-${i + 1}`,
        firstName,
        lastName,
        email,
        username,
        avatar: `${firstName.charAt(0)}${lastName.charAt(0)}`,
        status,
        role,
        department,
        location,
        phoneNumber: `+1 ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
        lastLogin,
        createdAt,
        twoFactorEnabled: Math.random() > 0.7,
        emailVerified: Math.random() > 0.1,
        groups: [],
        permissions: [],
        notes: ''
      });
    }

    // Generate groups
    this.availableGroups = [
      { id: 'group-1', name: 'Executive Team', description: 'Company leadership and executives', memberCount: 5 },
      { id: 'group-2', name: 'Marketing Department', description: 'Marketing and communications team', memberCount: 12 },
      { id: 'group-3', name: 'Engineering Team', description: 'Software development and engineering', memberCount: 28 },
      { id: 'group-4', name: 'Product Design', description: 'UI/UX and product design team', memberCount: 8 },
      { id: 'group-5', name: 'Backend Development', description: 'Backend services and API development', memberCount: 10 },
      { id: 'group-6', name: 'Frontend Development', description: 'Frontend and client-side development', memberCount: 10 },
      { id: 'group-7', name: 'Customer Support', description: 'Customer service and support team', memberCount: 15 },
      { id: 'group-8', name: 'Sales Team', description: 'Sales and business development', memberCount: 20 }
    ];

    // Assign random groups to users
    this.users.forEach(user => {
      const numGroups = Math.floor(Math.random() * 3);
      const shuffledGroups = [...this.availableGroups].sort(() => 0.5 - Math.random());
      user.groups = shuffledGroups.slice(0, numGroups).map(g => g.id);
    });

    // Generate permissions
    this.allPermissions = [
      { id: 'perm-1', name: 'user:create', description: 'Create users', category: 'User Management' },
      { id: 'perm-2', name: 'user:read', description: 'View users', category: 'User Management' },
      { id: 'perm-3', name: 'user:update', description: 'Update users', category: 'User Management' },
      { id: 'perm-4', name: 'user:delete', description: 'Delete users', category: 'User Management' },
      { id: 'perm-5', name: 'user:impersonate', description: 'Impersonate users', category: 'User Management' },
      { id: 'perm-6', name: 'content:create', description: 'Create content', category: 'Content Management' },
      { id: 'perm-7', name: 'content:read', description: 'View content', category: 'Content Management' },
      { id: 'perm-8', name: 'content:update', description: 'Update content', category: 'Content Management' },
      { id: 'perm-9', name: 'content:delete', description: 'Delete content', category: 'Content Management' },
      { id: 'perm-10', name: 'content:publish', description: 'Publish content', category: 'Content Management' },
      { id: 'perm-11', name: 'settings:read', description: 'View settings', category: 'System Settings' },
      { id: 'perm-12', name: 'settings:update', description: 'Update settings', category: 'System Settings' },
      { id: 'perm-13', name: 'roles:manage', description: 'Manage roles and permissions', category: 'System Settings' },
      { id: 'perm-14', name: 'system:backup', description: 'Backup system data', category: 'System Settings' },
      { id: 'perm-15', name: 'system:restore', description: 'Restore system data', category: 'System Settings' }
    ];

    // Generate roles with permissions
    this.availableRoles = [
      {
        id: 'role-1',
        name: 'Administrator',
        description: 'Full system access with all permissions',
        permissions: this.allPermissions.map(p => p.id)
      },
      {
        id: 'role-2',
        name: 'Manager',
        description: 'Can manage users and content but cannot modify system settings',
        permissions: this.allPermissions.filter(p => p.category !== 'System Settings').map(p => p.id)
      },
      {
        id: 'role-3',
        name: 'Editor',
        description: 'Can create and edit content but cannot manage users',
        permissions: this.allPermissions.filter(p => p.category === 'Content Management').map(p => p.id)
      },
      {
        id: 'role-4',
        name: 'Viewer',
        description: 'Read-only access to content',
        permissions: this.allPermissions.filter(p => p.name.includes(':read')).map(p => p.id)
      },
      {
        id: 'role-5',
        name: 'Developer',
        description: 'Technical access for development purposes',
        permissions: ['perm-2', 'perm-6', 'perm-7', 'perm-8', 'perm-11']
      },
      {
        id: 'role-6',
        name: 'Analyst',
        description: 'Access to reporting and analytics',
        permissions: ['perm-2', 'perm-7', 'perm-11']
      },
      {
        id: 'role-7',
        name: 'Support Agent',
        description: 'Customer support access',
        permissions: ['perm-2', 'perm-7', 'perm-8']
      }
    ];

    // Generate user activities
    const actionTypes = [
      'Logged in',
      'Updated profile',
      'Changed password',
      'Uploaded document',
      'Downloaded report',
      'Created content',
      'Updated content',
      'Deleted content',
      'Added user to group',
      'Removed user from group',
      'Changed role',
      'Enabled two-factor authentication',
      'Disabled two-factor authentication',
      'Reset password',
      'Exported data'
    ];

    const devices = ['Desktop', 'Laptop', 'Mobile', 'Tablet'];
    const browsers = ['Chrome', 'Firefox', 'Safari', 'Edge'];

    this.userActivities = [];

    // Generate 50 random activities
    for (let i = 0; i < 50; i++) {
      const user = this.users[Math.floor(Math.random() * this.users.length)];
      const action = actionTypes[Math.floor(Math.random() * actionTypes.length)];
      const device = devices[Math.floor(Math.random() * devices.length)];
      const browser = browsers[Math.floor(Math.random() * browsers.length)];
      const location = locations[Math.floor(Math.random() * locations.length)];

      // Random date within the last 30 days
      const timestamp = new Date();
      timestamp.setDate(timestamp.getDate() - Math.floor(Math.random() * 30));
      timestamp.setHours(
        Math.floor(Math.random() * 24),
        Math.floor(Math.random() * 60),
        Math.floor(Math.random() * 60)
      );

      this.userActivities.push({
        id: `activity-${i + 1}`,
        userId: user.id,
        action,
        timestamp,
        ipAddress: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
        device,
        browser,
        location,
        details: `User ${action.toLowerCase()} from ${device} using ${browser}`
      });
    }

    // Sort activities by timestamp (newest first)
    this.userActivities.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  applyFilters(): void {
    let filtered = [...this.users];

    // Apply search term
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(user =>
        user.firstName.toLowerCase().includes(term) ||
        user.lastName.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term) ||
        user.username.toLowerCase().includes(term)
      );
    }

    // Apply status filter
    if (this.statusFilter !== 'all') {
      filtered = filtered.filter(user => user.status === this.statusFilter);
    }

    // Apply role filter
    if (this.roleFilter !== 'all') {
      filtered = filtered.filter(user => user.role === this.roleFilter);
    }

    // Apply department filter
    if (this.departmentFilter !== 'all') {
      filtered = filtered.filter(user => user.department === this.departmentFilter);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0;

      switch (this.sortBy) {
        case 'name':
          comparison = `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`);
          break;
        case 'email':
          comparison = a.email.localeCompare(b.email);
          break;
        case 'username':
          comparison = a.username.localeCompare(b.username);
          break;
        case 'department':
          comparison = a.department.localeCompare(b.department);
          break;
        case 'role':
          comparison = a.role.localeCompare(b.role);
          break;
        case 'status':
          comparison = a.status.localeCompare(b.status);
          break;
        case 'lastLogin':
          // Handle null values for lastLogin
          if (a.lastLogin === null && b.lastLogin === null) {
            comparison = 0;
          } else if (a.lastLogin === null) {
            comparison = 1;
          } else if (b.lastLogin === null) {
            comparison = -1;
          } else {
            comparison = a.lastLogin.getTime() - b.lastLogin.getTime();
          }
          break;
        case 'createdAt':
          comparison = a.createdAt.getTime() - b.createdAt.getTime();
          break;
        default:
          comparison = 0;
      }

      return this.sortDirection === 'asc' ? comparison : -comparison;
    });

    this.filteredUsers = filtered;
    this.totalPages = Math.ceil(this.filteredUsers.length / this.pageSize);
    this.currentPage = Math.min(this.currentPage, this.totalPages);
    if (this.currentPage === 0 && this.totalPages > 0) {
      this.currentPage = 1;
    }
  }

  toggleSortDirection(): void {
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    this.applyFilters();
  }

  setSortBy(field: string): void {
    if (this.sortBy === field) {
      this.toggleSortDirection();
    } else {
      this.sortBy = field;
      this.sortDirection = 'asc';
      this.applyFilters();
    }
  }

  resetFilters(): void {
    this.searchTerm = '';
    this.statusFilter = 'all';
    this.roleFilter = 'all';
    this.departmentFilter = 'all';
    this.applyFilters();
  }

  // Pagination
  get paginatedUsers(): User[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.filteredUsers.slice(startIndex, startIndex + this.pageSize);
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  // User selection and details
  selectUser(user: User): void {
    this.selectedUser = user;
    this.activeTab = 'profile';
    this.isEditingProfile = false;
    this.isChangingPassword = false;
    this.isManagingGroups = false;
    this.isManagingRoles = false;

    // Load user activities
    this.userActivities = this.userActivities.filter(activity => activity.userId === user.id);

    // Load user groups
    this.userGroups = this.availableGroups.filter(group => user.groups.includes(group.id));

    // Load user roles
    this.userRoles = this.availableRoles.filter(role => role.name === user.role);
  }

  clearSelectedUser(): void {
    this.selectedUser = null;
  }

  // Tab navigation
  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  // Profile editing
  editProfile(): void {
    if (!this.selectedUser) return;

    this.isEditingProfile = true;
    this.profileForm.patchValue({
      firstName: this.selectedUser.firstName,
      lastName: this.selectedUser.lastName,
      email: this.selectedUser.email,
      username: this.selectedUser.username,
      phoneNumber: this.selectedUser.phoneNumber,
      department: this.selectedUser.department,
      location: this.selectedUser.location,
      notes: this.selectedUser.notes
    });
  }

  cancelProfileEdit(): void {
    this.isEditingProfile = false;
  }

  saveProfile(): void {
    if (!this.selectedUser || this.profileForm.invalid) return;

    const formValues = this.profileForm.value;

    // Update the selected user
    this.selectedUser = {
      ...this.selectedUser,
      firstName: formValues.firstName,
      lastName: formValues.lastName,
      email: formValues.email,
      username: formValues.username,
      phoneNumber: formValues.phoneNumber,
      department: formValues.department,
      location: formValues.location,
      notes: formValues.notes
    };

    // Update the user in the users array
    const index = this.users.findIndex(u => u.id === this.selectedUser!.id);
    if (index !== -1) {
      this.users[index] = this.selectedUser;
    }

    this.isEditingProfile = false;
    this.applyFilters();
  }

  // Password management
  changePassword(): void {
    this.isChangingPassword = true;
    this.passwordForm.reset();
  }

  cancelPasswordChange(): void {
    this.isChangingPassword = false;
  }

  savePassword(): void {
    if (!this.selectedUser || this.passwordForm.invalid) return;

    const formValues = this.passwordForm.value;

    if (formValues.newPassword !== formValues.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    // In a real application, you would call your API to update the password
    console.log(`Password changed for user ${this.selectedUser.username}`);
    alert('Password changed successfully');

    this.isChangingPassword = false;
  }

  // Status management
  updateUserStatus(status: 'active' | 'inactive' | 'pending' | 'suspended' | 'locked'): void {
    if (!this.selectedUser) return;

    if (confirm(`Are you sure you want to change the user's status to ${status}?`)) {
      // Update the selected user
      this.selectedUser = {
        ...this.selectedUser,
        status
      };

      // Update the user in the users array
      const index = this.users.findIndex(u => u.id === this.selectedUser!.id);
      if (index !== -1) {
        this.users[index] = this.selectedUser;
      }

      this.applyFilters();
    }
  }

  // Group management
  manageGroups(): void {
    this.isManagingGroups = true;
  }

  cancelGroupManagement(): void {
    this.isManagingGroups = false;
  }

  toggleUserGroup(groupId: string): void {
    if (!this.selectedUser) return;

    const groupIndex = this.selectedUser.groups.indexOf(groupId);

    if (groupIndex === -1) {
      // Add group
      this.selectedUser.groups.push(groupId);
    } else {
      // Remove group
      this.selectedUser.groups.splice(groupIndex, 1);
    }

    // Update user groups
    this.userGroups = this.availableGroups.filter(group => this.selectedUser!.groups.includes(group.id));
  }

  saveGroups(): void {
    if (!this.selectedUser) return;

    // Update the user in the users array
    const index = this.users.findIndex(u => u.id === this.selectedUser!.id);
    if (index !== -1) {
      this.users[index] = this.selectedUser;
    }

    this.isManagingGroups = false;
  }

  // Role management
  manageRoles(): void {
    this.isManagingRoles = true;
  }

  cancelRoleManagement(): void {
    this.isManagingRoles = false;
  }

  setUserRole(roleName: string): void {
    if (!this.selectedUser) return;

    // Update the selected user
    this.selectedUser = {
      ...this.selectedUser,
      role: roleName
    };

    // Update user roles
    this.userRoles = this.availableRoles.filter(role => role.name === roleName);
  }

  saveRoles(): void {
    if (!this.selectedUser) return;

    // Update the user in the users array
    const index = this.users.findIndex(u => u.id === this.selectedUser!.id);
    if (index !== -1) {
      this.users[index] = this.selectedUser;
    }

    this.isManagingRoles = false;
    this.applyFilters();
  }

  // Helper methods
  getUserStatusClass(status: string): string {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'suspended':
        return 'bg-red-100 text-red-800';
      case 'locked':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  formatTimeAgo(date: Date | null): string {
    if (!date) return 'Never';

    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.round(diffMs / 1000);
    const diffMin = Math.round(diffSec / 60);
    const diffHour = Math.round(diffMin / 60);
    const diffDay = Math.round(diffHour / 24);

    if (diffSec < 60) {
      return `${diffSec} seconds ago`;
    } else if (diffMin < 60) {
      return `${diffMin} minutes ago`;
    } else if (diffHour < 24) {
      return `${diffHour} hours ago`;
    } else if (diffDay < 30) {
      return `${diffDay} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  }

  getInitials(firstName: string, lastName: string): string {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`;
  }

  getRandomColor(userId: string): string {
    // Generate a consistent color based on the user ID
    const colors = [
      'bg-red-500',
      'bg-blue-500',
      'bg-green-500',
      'bg-yellow-500',
      'bg-purple-500',
      'bg-pink-500',
      'bg-indigo-500',
      'bg-teal-500'
    ];

    const hash = userId.split('').reduce((acc, char) => {
      return char.charCodeAt(0) + acc;
    }, 0);

    return colors[hash % colors.length];
  }

  isUserInGroup(groupId: string): boolean {
    return this.selectedUser?.groups.includes(groupId) || false;
  }

  hasPermission(permissionId: string): boolean {
    if (!this.selectedUser) return false;

    // Find the user's role
    const userRole = this.availableRoles.find(role => role.name === this.selectedUser!.role);

    if (!userRole) return false;

    // Check if the role has the permission
    return userRole.permissions.includes(permissionId);
  }

  protected readonly Math = Math;
}

