import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms"

interface Role {
  id: string
  name: string
  description: string
  userCount: number
  isSystemRole: boolean
  createdAt: Date
  updatedAt: Date
}

interface Permission {
  id: string
  name: string
  description: string
  category: string
  isEnabled: boolean
}

interface User {
  id: string
  name: string
  email: string
  avatar: string
  roles: string[]
}

interface PermissionCategory {
  name: string
  permissions: Permission[]
}

@Component({
  selector: 'ums-permissions',
  standalone: false,
  templateUrl: './permissions.component.html',
  styleUrl: './permissions.component.scss'
})
export class PermissionsComponent implements OnInit {
  // Roles
  roles: Role[] = []
  selectedRole: Role | null = null
  isEditingRole = false
  isCreatingRole = false
  roleForm: FormGroup

  // Permissions
  permissionCategories: PermissionCategory[] = []
  allPermissions: Permission[] = []
  selectedPermissions: { [key: string]: boolean } = {}

  // Users
  users: User[] = []
  filteredUsers: User[] = []
  userSearchTerm = ""
  isAssigningUsers = false

  // UI state
  activeTab = "roles"

  constructor(private fb: FormBuilder) {
    this.roleForm = this.fb.group({
      name: ["", [Validators.required, Validators.minLength(3)]],
      description: ["", Validators.required],
    })
  }

  ngOnInit(): void {
    this.generateMockData()
  }

  generateMockData(): void {
    // Generate mock roles
    this.roles = [
      {
        id: "role-1",
        name: "Administrator",
        description: "Full system access with all permissions",
        userCount: 3,
        isSystemRole: true,
        createdAt: new Date(2023, 0, 15),
        updatedAt: new Date(2023, 5, 20),
      },
      {
        id: "role-2",
        name: "Manager",
        description: "Can manage users and content but cannot modify system settings",
        userCount: 8,
        isSystemRole: true,
        createdAt: new Date(2023, 0, 15),
        updatedAt: new Date(2023, 3, 10),
      },
      {
        id: "role-3",
        name: "Editor",
        description: "Can create and edit content but cannot manage users",
        userCount: 15,
        isSystemRole: false,
        createdAt: new Date(2023, 1, 5),
        updatedAt: new Date(2023, 4, 12),
      },
      {
        id: "role-4",
        name: "Viewer",
        description: "Read-only access to content",
        userCount: 42,
        isSystemRole: false,
        createdAt: new Date(2023, 1, 5),
        updatedAt: new Date(2023, 1, 5),
      },
      {
        id: "role-5",
        name: "Support",
        description: "Can view and respond to user inquiries",
        userCount: 7,
        isSystemRole: false,
        createdAt: new Date(2023, 2, 18),
        updatedAt: new Date(2023, 6, 3),
      },
    ]

    // Generate mock permissions
    const userPermissions: Permission[] = [
      { id: "perm-1", name: "user:create", description: "Create users", category: "User Management", isEnabled: false },
      { id: "perm-2", name: "user:read", description: "View users", category: "User Management", isEnabled: false },
      { id: "perm-3", name: "user:update", description: "Update users", category: "User Management", isEnabled: false },
      { id: "perm-4", name: "user:delete", description: "Delete users", category: "User Management", isEnabled: false },
      {
        id: "perm-5",
        name: "user:impersonate",
        description: "Impersonate users",
        category: "User Management",
        isEnabled: false,
      },
    ]

    const contentPermissions: Permission[] = [
      {
        id: "perm-6",
        name: "content:create",
        description: "Create content",
        category: "Content Management",
        isEnabled: false,
      },
      {
        id: "perm-7",
        name: "content:read",
        description: "View content",
        category: "Content Management",
        isEnabled: false,
      },
      {
        id: "perm-8",
        name: "content:update",
        description: "Update content",
        category: "Content Management",
        isEnabled: false,
      },
      {
        id: "perm-9",
        name: "content:delete",
        description: "Delete content",
        category: "Content Management",
        isEnabled: false,
      },
      {
        id: "perm-10",
        name: "content:publish",
        description: "Publish content",
        category: "Content Management",
        isEnabled: false,
      },
    ]

    const settingsPermissions: Permission[] = [
      {
        id: "perm-11",
        name: "settings:read",
        description: "View settings",
        category: "System Settings",
        isEnabled: false,
      },
      {
        id: "perm-12",
        name: "settings:update",
        description: "Update settings",
        category: "System Settings",
        isEnabled: false,
      },
      {
        id: "perm-13",
        name: "roles:manage",
        description: "Manage roles and permissions",
        category: "System Settings",
        isEnabled: false,
      },
      {
        id: "perm-14",
        name: "system:backup",
        description: "Backup system data",
        category: "System Settings",
        isEnabled: false,
      },
      {
        id: "perm-15",
        name: "system:restore",
        description: "Restore system data",
        category: "System Settings",
        isEnabled: false,
      },
    ]

    const analyticsPermissions: Permission[] = [
      { id: "perm-16", name: "analytics:view", description: "View analytics", category: "Analytics", isEnabled: false },
      {
        id: "perm-17",
        name: "analytics:export",
        description: "Export analytics data",
        category: "Analytics",
        isEnabled: false,
      },
      {
        id: "perm-18",
        name: "reports:generate",
        description: "Generate reports",
        category: "Analytics",
        isEnabled: false,
      },
      {
        id: "perm-19",
        name: "reports:schedule",
        description: "Schedule reports",
        category: "Analytics",
        isEnabled: false,
      },
    ]

    this.allPermissions = [...userPermissions, ...contentPermissions, ...settingsPermissions, ...analyticsPermissions]

    this.permissionCategories = [
      { name: "User Management", permissions: userPermissions },
      { name: "Content Management", permissions: contentPermissions },
      { name: "System Settings", permissions: settingsPermissions },
      { name: "Analytics", permissions: analyticsPermissions },
    ]

    // Generate mock users
    this.users = [
      { id: "user-1", name: "John Doe", email: "john.doe@example.com", avatar: "JD", roles: ["role-1"] },
      { id: "user-2", name: "Jane Smith", email: "jane.smith@example.com", avatar: "JS", roles: ["role-2"] },
      {
        id: "user-3",
        name: "Robert Johnson",
        email: "robert.johnson@example.com",
        avatar: "RJ",
        roles: ["role-2", "role-3"],
      },
      { id: "user-4", name: "Emily Davis", email: "emily.davis@example.com", avatar: "ED", roles: ["role-3"] },
      { id: "user-5", name: "Michael Wilson", email: "michael.wilson@example.com", avatar: "MW", roles: ["role-4"] },
      { id: "user-6", name: "Sarah Brown", email: "sarah.brown@example.com", avatar: "SB", roles: ["role-4"] },
      { id: "user-7", name: "David Miller", email: "david.miller@example.com", avatar: "DM", roles: ["role-5"] },
      {
        id: "user-8",
        name: "Lisa Anderson",
        email: "lisa.anderson@example.com",
        avatar: "LA",
        roles: ["role-3", "role-5"],
      },
    ]

    this.filteredUsers = [...this.users]
  }

  // Tab navigation
  setActiveTab(tab: string): void {
    this.activeTab = tab
  }

  // Role management
  selectRole(role: Role): void {
    this.selectedRole = role
    this.resetPermissions()

    // Simulate loading permissions for this role
    if (role.name === "Administrator") {
      this.allPermissions.forEach((permission) => {
        this.selectedPermissions[permission.id] = true
      })
    } else if (role.name === "Manager") {
      this.allPermissions.forEach((permission) => {
        // Managers can do everything except system settings
        this.selectedPermissions[permission.id] = permission.category !== "System Settings"
      })
    } else if (role.name === "Editor") {
      this.allPermissions.forEach((permission) => {
        // Editors can only manage content
        this.selectedPermissions[permission.id] = permission.category === "Content Management"
      })
    } else if (role.name === "Viewer") {
      this.allPermissions.forEach((permission) => {
        // Viewers can only read
        this.selectedPermissions[permission.id] = permission.name.includes(":read")
      })
    } else if (role.name === "Support") {
      this.allPermissions.forEach((permission) => {
        // Support can read users and content
        this.selectedPermissions[permission.id] =
          permission.name === "user:read" || permission.name === "content:read" || permission.name === "analytics:view"
      })
    }
  }

  createRole(): void {
    this.isCreatingRole = true
    this.isEditingRole = false
    this.selectedRole = null
    this.roleForm.reset()
    this.resetPermissions()
  }

  editRole(): void {
    if (!this.selectedRole) return

    this.isEditingRole = true
    this.isCreatingRole = false
    this.roleForm.patchValue({
      name: this.selectedRole.name,
      description: this.selectedRole.description,
    })
  }

  cancelRoleEdit(): void {
    this.isEditingRole = false
    this.isCreatingRole = false
    this.roleForm.reset()
  }

  saveRole(): void {
    if (this.roleForm.invalid) return

    const formValues = this.roleForm.value

    if (this.isCreatingRole) {
      // Create new role
      const newRole: Role = {
        id: `role-${this.roles.length + 1}`,
        name: formValues.name,
        description: formValues.description,
        userCount: 0,
        isSystemRole: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      this.roles.push(newRole)
      this.selectedRole = newRole
    } else if (this.isEditingRole && this.selectedRole) {
      // Update existing role
      const index = this.roles.findIndex((r) => r.id === this.selectedRole!.id)
      if (index !== -1) {
        this.roles[index] = {
          ...this.selectedRole,
          name: formValues.name,
          description: formValues.description,
          updatedAt: new Date(),
        }
        this.selectedRole = this.roles[index]
      }
    }

    this.isEditingRole = false
    this.isCreatingRole = false
    this.roleForm.reset()
  }

  deleteRole(role: Role): void {
    if (confirm(`Are you sure you want to delete the role "${role.name}"? This action cannot be undone.`)) {
      this.roles = this.roles.filter((r) => r.id !== role.id)
      if (this.selectedRole && this.selectedRole.id === role.id) {
        this.selectedRole = null
        this.resetPermissions()
      }
    }
  }

  // Permission management
  resetPermissions(): void {
    this.selectedPermissions = {}
    this.allPermissions.forEach((permission) => {
      this.selectedPermissions[permission.id] = false
    })
  }

  togglePermission(permissionId: string): void {
    this.selectedPermissions[permissionId] = !this.selectedPermissions[permissionId]
  }

  toggleCategoryPermissions(category: string, value: boolean): void {
    this.allPermissions
      .filter((permission) => permission.category === category)
      .forEach((permission) => {
        this.selectedPermissions[permission.id] = value
      })
  }

  isCategoryFullySelected(category: string): boolean {
    return this.allPermissions
      .filter((permission) => permission.category === category)
      .every((permission) => this.selectedPermissions[permission.id])
  }

  isCategoryPartiallySelected(category: string): boolean {
    const categoryPermissions = this.allPermissions.filter((permission) => permission.category === category)
    const selectedCount = categoryPermissions.filter((permission) => this.selectedPermissions[permission.id]).length
    return selectedCount > 0 && selectedCount < categoryPermissions.length
  }

  savePermissions(): void {
    if (!this.selectedRole) return

    console.log(`Saving permissions for role ${this.selectedRole.name}:`, this.selectedPermissions)
    alert(`Permissions updated for role: ${this.selectedRole.name}`)
    // In a real application, you would send this to your backend
  }

  // User-role management
  openAssignUsers(): void {
    if (!this.selectedRole) return
    this.isAssigningUsers = true
    this.filteredUsers = [...this.users]
    this.userSearchTerm = ""
  }

  closeAssignUsers(): void {
    this.isAssigningUsers = false
  }

  searchUsers(): void {
    const term = this.userSearchTerm.toLowerCase()
    this.filteredUsers = this.users.filter(
      (user) => user.name.toLowerCase().includes(term) || user.email.toLowerCase().includes(term),
    )
  }

  isUserInRole(userId: string): boolean {
    if (!this.selectedRole) return false
    return this.users.find((u) => u.id === userId)?.roles.includes(this.selectedRole!.id) || false
  }

  toggleUserRole(userId: string): void {
    if (!this.selectedRole) return

    const userIndex = this.users.findIndex((u) => u.id === userId)
    if (userIndex === -1) return

    const user = this.users[userIndex]
    const roleIndex = user.roles.indexOf(this.selectedRole.id)

    if (roleIndex === -1) {
      // Add role to user
      user.roles.push(this.selectedRole.id)
    } else {
      // Remove role from user
      user.roles.splice(roleIndex, 1)
    }

    // Update user count for the role
    this.selectedRole.userCount = this.users.filter((u) => u.roles.includes(this.selectedRole!.id)).length
  }

  saveUserAssignments(): void {
    if (!this.selectedRole) return

    console.log(`Saving user assignments for role ${this.selectedRole.name}`)
    alert(`User assignments updated for role: ${this.selectedRole.name}`)
    this.isAssigningUsers = false
    // In a real application, you would send this to your backend
  }

  // Helper methods
  getCategoryPermissionCount(category: string): { selected: number; total: number } {
    const categoryPermissions = this.allPermissions.filter((permission) => permission.category === category)
    const selectedCount = categoryPermissions.filter((permission) => this.selectedPermissions[permission.id]).length
    return { selected: selectedCount, total: categoryPermissions.length }
  }

  getRoleUserCount(roleId: string): number {
    return this.users.filter((user) => user.roles.includes(roleId)).length
  }
}



