export interface Role {
  id: string
  name: string
  description: string
  userCount: number
  isSystemRole: boolean
  createdOn: Date
  modifiedOn: Date
}

export interface Permission {
  id: string
  name: string
  description: string
  category: string
  isEnabled: boolean
}

export interface User {
  id: string
  name: string
  email: string
  avatar: string
  roles: string[]
}

export interface PermissionCategory {
  categoryName: string
  permissions: Permission[]
}
