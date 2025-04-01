import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RolesPermissionsService } from './roles-permissions.service';
import { Role, PermissionCategory, Permission, User } from './roles-permissions.model';

@Component({
  selector: 'ums-permissions',
  standalone: false,
  templateUrl: './permissions.component.html',
  styleUrls: ['./permissions.component.scss']
})
export class PermissionsComponent implements OnInit {
  // Roles
  roles: Role[] = [];
  selectedRole: Role | null = null;
  isEditingRole = false;
  isCreatingRole = false;
  roleForm: FormGroup;

  // Permissions
  permissionCategories: PermissionCategory[] = [];
  selectedPermissions: { [key: string]: boolean } = {};

  // Users
  users: User[] = [];
  filteredUsers: User[] = [];
  userSearchTerm = '';
  isAssigningUsers = false;

  // UI state
  activeTab = 'roles';

  private _rolesPermissionService: RolesPermissionsService = inject(RolesPermissionsService);

  constructor(private fb: FormBuilder) {
    this.roleForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadRoles();
    this.permissionsByCategories();
  }

  // Load all roles
  loadRoles(): void {
    this._rolesPermissionService.getRolesPermissions().subscribe({
      next: (response) => {
        this.roles = response.data;
      },
      error: (error) => console.error('Error fetching roles:', error)
    });
  }

  // Load permissions grouped by category
  permissionsByCategories(): void {
    this._rolesPermissionService.permissionByCategories().subscribe({
      next: (response) => {
        this.permissionCategories = response.data;
        this.resetPermissions();
      },
      error: (error) => console.error('Error fetching permissions by category:', error)
    });
  }

  // Tab navigation
  setActiveTab(tab: string): void {
    this.activeTab = tab;
    if (tab === 'permissions' && this.selectedRole) {
      this.permissionsByCategories();
    }
  }

  // Role management
  selectRole(role: any): void {
    this.selectedRole = role;
    this.resetPermissions();

    if (this.activeTab === 'permissions') {
      this.loadRolePermissions();
    }
  }

  // Load permissions for selected role
  loadRolePermissions(): void {
    if (!this.selectedRole) return;

    // this._rolesPermissionService.getRolePermissions(this.selectedRole.id).subscribe({
    //   next: (response) => {
    //     // Reset all permissions to false first
    //     this.resetPermissions();
    //
    //     // Set selected permissions to true
    //     response.data.forEach((permission: Permission) => {
    //       this.selectedPermissions[permission.id] = true;
    //     });
    //   },
    //   error: (error) => console.error('Error fetching role permissions:', error)
    // });
  }

  createRole(): void {
    this.isCreatingRole = true;
    this.isEditingRole = false;
    this.selectedRole = null;
    this.roleForm.reset();
    this.resetPermissions();
  }

  editRole(): void {
    if (!this.selectedRole) return;

    this.isEditingRole = true;
    this.isCreatingRole = false;
    this.roleForm.patchValue({
      name: this.selectedRole.name,
      description: this.selectedRole.description,
    });
  }

  cancelRoleEdit(): void {
    this.isEditingRole = false;
    this.isCreatingRole = false;
    this.roleForm.reset();
  }

  saveRole(): void {
    if (this.roleForm.invalid) return;

    const formValues = this.roleForm.value;

    if (this.isCreatingRole) {
      this._rolesPermissionService.createRole({
        name: formValues.name,
        description: formValues.description
      }).subscribe({
        next: (response: any) => {
          const newRole: Role = {
            id: response.data.id,
            name: formValues.name,
            description: formValues.description,
            userCount: 0,
            isSystemRole: response.data.isSystemRole,
            createdOn: response.data.createdOn,
            modifiedOn: response.data.modifiedOn,
          };
          this.roles.push(newRole);
          this.selectedRole = newRole;
          this.cancelRoleEdit();
        },
        error: (error) => console.error('Error creating role:', error)
      });
    } else if (this.isEditingRole && this.selectedRole) {
      const request = {
        name: formValues.name,
        description: formValues.description
      };
      this._rolesPermissionService.updateRole(this.selectedRole.id, request).subscribe({
        next: (response: any) => {
          const index = this.roles.findIndex(r => r.id === this.selectedRole!.id);
          if (index !== -1) {
            this.roles[index] = {
              ...this.selectedRole,
              name: response.data.name,
              description: response.data.description,
              modifiedOn: response.data.modifiedOn,
            };
            this.selectedRole = this.roles[index];
            this.cancelRoleEdit();
          }
        },
        error: (error) => console.error('Error updating role:', error)
      });
    }
  }

  deleteRole(role: Role): void {
    if (confirm(`Are you sure you want to delete the role "${role.name}"?`)) {
      this._rolesPermissionService.deleteRole(role.id).subscribe({
        next: () => {
          this.roles = this.roles.filter(r => r.id !== role.id);
          if (this.selectedRole?.id === role.id) {
            this.selectedRole = null;
          }
        },
        error: (error) => console.error(`Error deleting role "${role.name}":`, error)
      });
    }
  }

  // Permission management
  resetPermissions(): void {
    this.selectedPermissions = {};
    this.permissionCategories.forEach(category => {
      category.permissions.forEach(permission => {
        this.selectedPermissions[permission.id] = false;
      });
    });
  }

  togglePermission(permissionId: string): void {
    this.selectedPermissions[permissionId] = !this.selectedPermissions[permissionId];
  }

  toggleCategoryPermissions(categoryName: string, value: boolean): void {
    const category = this.permissionCategories.find(c => c.categoryName === categoryName);
    if (category) {
      category.permissions.forEach(permission => {
        this.selectedPermissions[permission.id] = value;
      });
    }
  }

  isCategoryFullySelected(categoryName: string): boolean {
    const category = this.permissionCategories.find(c => c.categoryName === categoryName);
    if (!category) return false;
    return category.permissions.every(permission => this.selectedPermissions[permission.id]);
  }

  isCategoryPartiallySelected(categoryName: string): boolean {
    const category = this.permissionCategories.find(c => c.categoryName === categoryName);
    if (!category) return false;

    const selectedCount = category.permissions.filter(
      permission => this.selectedPermissions[permission.id]
    ).length;

    return selectedCount > 0 && selectedCount < category.permissions.length;
  }

  savePermissions(): void {
    if (!this.selectedRole) return;

    const selectedPermissionIds = Object.keys(this.selectedPermissions)
      .filter(key => this.selectedPermissions[key]);

    // this._rolesPermissionService.updateRolePermissions(
    //   this.selectedRole.id,
    //   selectedPermissionIds
    // ).subscribe({
    //   next: () => alert('Permissions updated successfully'),
    //   error: (error) => console.error('Error updating permissions:', error)
    // });
  }

  // User management
  openAssignUsers(): void {
    if (!this.selectedRole) return;
    this.isAssigningUsers = true;
    this.filteredUsers = [...this.users];
    this.userSearchTerm = '';
  }

  closeAssignUsers(): void {
    this.isAssigningUsers = false;
  }

  searchUsers(): void {
    const term = this.userSearchTerm.toLowerCase();
    this.filteredUsers = this.users.filter(
      user => user.name.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term)
    );
  }

  isUserInRole(userId: string): boolean {
    if (!this.selectedRole) return false;
    return this.users.find(u => u.id === userId)?.roles.includes(this.selectedRole.id) || false;
  }

  toggleUserRole(userId: string): void {
    if (!this.selectedRole) return;

    const user = this.users.find(u => u.id === userId);
    if (!user) return;

    const roleIndex = user.roles.indexOf(this.selectedRole.id);
    if (roleIndex === -1) {
      user.roles.push(this.selectedRole.id);
    } else {
      user.roles.splice(roleIndex, 1);
    }
  }

  saveUserAssignments(): void {
    if (!this.selectedRole) return;

    const usersWithRole = this.users.filter(user =>
      user.roles.includes(this.selectedRole!.id)
    );

    // this._rolesPermissionService.updateRoleUsers(
    //   this.selectedRole.id,
    //   usersWithRole.map(user => user.id)
    // ).subscribe({
    //   next: () => {
    //     alert('User assignments updated successfully');
    //     this.closeAssignUsers();
    //   },
    //   error: (error) => console.error('Error updating user assignments:', error)
    // });
  }

  // Helper methods
  getCategoryPermissionCount(categoryName: string): { selected: number; total: number } {
    const category = this.permissionCategories.find(c => c.categoryName === categoryName);
    if (!category) return { selected: 0, total: 0 };

    const selectedCount = category.permissions.filter(
      permission => this.selectedPermissions[permission.id]
    ).length;

    return {
      selected: selectedCount,
      total: category.permissions.length
    };
  }

  // Add this property to track expanded categories
  expandedCategories: { [key: string]: boolean } = {};

// Toggle category expansion
  toggleCategory(categoryName: string): void {
    this.expandedCategories[categoryName] = !this.expandedCategories[categoryName];
  }

// Check if category is expanded
  isCategoryExpanded(categoryName: string): boolean {
    return this.expandedCategories[categoryName];
  }

// Initialize all categories as expanded by default
  initializeExpandedCategories(): void {
    this.permissionCategories.forEach(category => {
      this.expandedCategories[category.categoryName] = true;
    });
  }
}
