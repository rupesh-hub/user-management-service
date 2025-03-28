import {Component, OnInit} from '@angular/core';

export interface Role {
  id: string;
  name: string;
  description: string;
  isPrimary?: boolean;
}

export interface Permission {
  id: string;
  name: string;
  description: string;
  granted: boolean;
  category: string;
}

@Component({
  selector: 'ums-roles-permissions',
  standalone: false,
  templateUrl: './roles-permissions.component.html',
  styleUrl: './roles-permissions.component.scss'
})
export class RolesPermissionsComponent implements OnInit {

  roles: Role[] = [];
  permissions: Permission[] = [];

  ngOnInit(): void {
    // Mock Roles
    this.roles = [
      {
        id: 'role1',
        name: 'Software Engineer',
        description: 'Responsible for developing and maintaining software applications',
        isPrimary: true
      },
      {
        id: 'role2',
        name: 'Team Lead',
        description: 'Leads a team of developers and coordinates project activities',
        isPrimary: false
      }
    ];

    // Mock Permissions
    this.permissions = [
      {id: 'perm1', name: 'View Projects', description: 'Can view all projects', granted: true, category: 'Projects'},
      {
        id: 'perm2',
        name: 'Create Projects',
        description: 'Can create new projects',
        granted: true,
        category: 'Projects'
      },
      {
        id: 'perm3',
        name: 'Edit Projects',
        description: 'Can edit project details',
        granted: true,
        category: 'Projects'
      },
      {id: 'perm4', name: 'Delete Projects', description: 'Can delete projects', granted: false, category: 'Projects'},
      {id: 'perm5', name: 'View Users', description: 'Can view user profiles', granted: true, category: 'Users'},
      {
        id: 'perm6',
        name: 'Create Users',
        description: 'Can create new user accounts',
        granted: false,
        category: 'Users'
      },
      {id: 'perm7', name: 'Edit Users', description: 'Can edit user details', granted: true, category: 'Users'},
      {id: 'perm8', name: 'Delete Users', description: 'Can delete user accounts', granted: false, category: 'Users'},
      {
        id: 'perm9',
        name: 'View Reports',
        description: 'Can view performance reports',
        granted: true,
        category: 'Reports'
      },
      {id: 'perm10', name: 'Create Reports', description: 'Can create new reports', granted: true, category: 'Reports'},
      {
        id: 'perm11',
        name: 'Admin Access',
        description: 'Has administrative privileges',
        granted: false,
        category: 'Admin'
      },
      {
        id: 'perm12',
        name: 'Financial Access',
        description: 'Can access financial information',
        granted: false,
        category: 'Admin'
      }
    ];
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  formatDateTime(date: Date): string {
    return new Date(date).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  updatePermission(id: string, granted: boolean): void {
    // Simulate API call
    setTimeout(() => {
      const index = this.permissions.findIndex(p => p.id === id);
      if (index !== -1) {
        this.permissions[index].granted = granted;
      }
    }, 500);
  }

}
