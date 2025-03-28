import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

interface UserGroup {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  createdAt: Date;
  updatedAt: Date;
  parentGroup?: string;
  roles: string[];
}

interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  department: string;
  title: string;
  groups: string[];
}

interface Role {
  id: string;
  name: string;
  description: string;
}

@Component({
  selector: 'ums-user-group',
  standalone: false,
  templateUrl: './user-group.component.html',
  styleUrl: './user-group.component.scss'
})
export class UserGroupComponent implements OnInit {
  // Groups
  groups: UserGroup[] = [];
  filteredGroups: UserGroup[] = [];
  selectedGroup: UserGroup | null = null;
  isEditingGroup = false;
  isCreatingGroup = false;
  groupForm: FormGroup;
  groupSearchTerm = '';

  // Users
  users: User[] = [];
  filteredUsers: User[] = [];
  userSearchTerm = '';
  isManagingMembers = false;

  // Roles
  roles: Role[] = [];
  isManagingRoles = false;
  selectedRoles: { [key: string]: boolean } = {};

  // UI state
  viewMode: 'grid' | 'list' = 'grid';

  constructor(private fb: FormBuilder) {
    this.groupForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', Validators.required],
      parentGroup: ['']
    });
  }

  ngOnInit(): void {
    this.generateMockData();
    this.applyGroupFilters();
  }

  generateMockData(): void {
    // Generate mock groups
    this.groups = [
      {
        id: 'group-1',
        name: 'Executive Team',
        description: 'Company leadership and executives',
        memberCount: 5,
        createdAt: new Date(2023, 0, 15),
        updatedAt: new Date(2023, 5, 20),
        roles: ['role-1']
      },
      {
        id: 'group-2',
        name: 'Marketing Department',
        description: 'Marketing and communications team',
        memberCount: 12,
        createdAt: new Date(2023, 1, 10),
        updatedAt: new Date(2023, 4, 5),
        roles: ['role-2', 'role-3']
      },
      {
        id: 'group-3',
        name: 'Engineering Team',
        description: 'Software development and engineering',
        memberCount: 28,
        createdAt: new Date(2023, 2, 20),
        updatedAt: new Date(2023, 6, 15),
        roles: ['role-2', 'role-3']
      },
      {
        id: 'group-4',
        name: 'Product Design',
        description: 'UI/UX and product design team',
        memberCount: 8,
        createdAt: new Date(2023, 3, 5),
        updatedAt: new Date(2023, 5, 10),
        parentGroup: 'group-3',
        roles: ['role-3']
      },
      {
        id: 'group-5',
        name: 'Backend Development',
        description: 'Backend services and API development',
        memberCount: 10,
        createdAt: new Date(2023, 3, 5),
        updatedAt: new Date(2023, 5, 10),
        parentGroup: 'group-3',
        roles: ['role-3']
      },
      {
        id: 'group-6',
        name: 'Frontend Development',
        description: 'Frontend and client-side development',
        memberCount: 10,
        createdAt: new Date(2023, 3, 5),
        updatedAt: new Date(2023, 5, 10),
        parentGroup: 'group-3',
        roles: ['role-3']
      },
      {
        id: 'group-7',
        name: 'Customer Support',
        description: 'Customer service and support team',
        memberCount: 15,
        createdAt: new Date(2023, 4, 12),
        updatedAt: new Date(2023, 6, 8),
        roles: ['role-5']
      },
      {
        id: 'group-8',
        name: 'Sales Team',
        description: 'Sales and business development',
        memberCount: 20,
        createdAt: new Date(2023, 1, 25),
        updatedAt: new Date(2023, 5, 30),
        roles: ['role-2']
      }
    ];

    // Generate mock users
    this.users = [
      { id: 'user-1', name: 'John Doe', email: 'john.doe@example.com', avatar: 'JD', department: 'Executive', title: 'CEO', groups: ['group-1'] },
      { id: 'user-2', name: 'Jane Smith', email: 'jane.smith@example.com', avatar: 'JS', department: 'Executive', title: 'CTO', groups: ['group-1', 'group-3'] },
      { id: 'user-3', name: 'Robert Johnson', email: 'robert.johnson@example.com', avatar: 'RJ', department: 'Marketing', title: 'Marketing Director', groups: ['group-2'] },
      { id: 'user-4', name: 'Emily Davis', email: 'emily.davis@example.com', avatar: 'ED', department: 'Marketing', title: 'Content Strategist', groups: ['group-2'] },
      { id: 'user-5', name: 'Michael Wilson', email: 'michael.wilson@example.com', avatar: 'MW', department: 'Engineering', title: 'Lead Developer', groups: ['group-3', 'group-5'] },
      { id: 'user-6', name: 'Sarah Brown', email: 'sarah.brown@example.com', avatar: 'SB', department: 'Engineering', title: 'UX Designer', groups: ['group-3', 'group-4'] },
      { id: 'user-7', name: 'David Miller', email: 'david.miller@example.com', avatar: 'DM', department: 'Engineering', title: 'Frontend Developer', groups: ['group-3', 'group-6'] },
      { id: 'user-8', name: 'Lisa Anderson', email: 'lisa.anderson@example.com', avatar: 'LA', department: 'Support', title: 'Support Manager', groups: ['group-7'] },
      { id: 'user-9', name: 'James Wilson', email: 'james.wilson@example.com', avatar: 'JW', department: 'Sales', title: 'Sales Director', groups: ['group-8'] },
      { id: 'user-10', name: 'Jennifer Lee', email: 'jennifer.lee@example.com', avatar: 'JL', department: 'Sales', title: 'Account Executive', groups: ['group-8'] }
    ];

    // Generate mock roles
    this.roles = [
      { id: 'role-1', name: 'Administrator', description: 'Full system access with all permissions' },
      { id: 'role-2', name: 'Manager', description: 'Can manage users and content but cannot modify system settings' },
      { id: 'role-3', name: 'Editor', description: 'Can create and edit content but cannot manage users' },
      { id: 'role-4', name: 'Viewer', description: 'Read-only access to content' },
      { id: 'role-5', name: 'Support', description: 'Can view and respond to user inquiries' }
    ];

    this.filteredUsers = [...this.users];
  }

  // Group filtering
  applyGroupFilters(): void {
    const term = this.groupSearchTerm.toLowerCase();
    this.filteredGroups = this.groups.filter(group =>
      group.name.toLowerCase().includes(term) ||
      group.description.toLowerCase().includes(term)
    );
  }

  // Group management
  selectGroup(group: UserGroup): void {
    this.selectedGroup = group;
    this.resetSelectedRoles();

    // Set selected roles based on group's roles
    group.roles.forEach(roleId => {
      this.selectedRoles[roleId] = true;
    });
  }

  createGroup(): void {
    this.isCreatingGroup = true;
    this.isEditingGroup = false;
    this.selectedGroup = null;
    this.groupForm.reset();
    this.viewMode = 'list';
  }

  editGroup(): void {
    if (!this.selectedGroup) return;

    this.isEditingGroup = true;
    this.isCreatingGroup = false;
    this.groupForm.patchValue({
      name: this.selectedGroup.name,
      description: this.selectedGroup.description,
      parentGroup: this.selectedGroup.parentGroup || ''
    });
  }

  cancelGroupEdit(): void {
    this.isEditingGroup = false;
    this.isCreatingGroup = false;
    this.groupForm.reset();
  }

  saveGroup(): void {
    if (this.groupForm.invalid) return;

    const formValues = this.groupForm.value;

    if (this.isCreatingGroup) {
      // Create new group
      const newGroup: UserGroup = {
        id: `group-${this.groups.length + 1}`,
        name: formValues.name,
        description: formValues.description,
        memberCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        roles: [],
        ...(formValues.parentGroup ? { parentGroup: formValues.parentGroup } : {})
      };

      this.groups.push(newGroup);
      this.selectedGroup = newGroup;
    } else if (this.isEditingGroup && this.selectedGroup) {
      // Update existing group
      const index = this.groups.findIndex(g => g.id === this.selectedGroup!.id);
      if (index !== -1) {
        this.groups[index] = {
          ...this.selectedGroup,
          name: formValues.name,
          description: formValues.description,
          parentGroup: formValues.parentGroup || undefined,
          updatedAt: new Date()
        };
        this.selectedGroup = this.groups[index];
      }
    }

    this.isEditingGroup = false;
    this.isCreatingGroup = false;
    this.groupForm.reset();
    this.applyGroupFilters();
  }

  deleteGroup(group: UserGroup): void {
    if (confirm(`Are you sure you want to delete the group "${group.name}"? This action cannot be undone.`)) {
      // Check if this group has subgroups
      const hasSubgroups = this.groups.some(g => g.parentGroup === group.id);

      if (hasSubgroups) {
        alert('This group has subgroups. Please reassign or delete the subgroups first.');
        return;
      }

      this.groups = this.groups.filter(g => g.id !== group.id);

      // Update users who were in this group
      this.users.forEach(user => {
        const groupIndex = user.groups.indexOf(group.id);
        if (groupIndex !== -1) {
          user.groups.splice(groupIndex, 1);
        }
      });

      if (this.selectedGroup && this.selectedGroup.id === group.id) {
        this.selectedGroup = null;
      }

      this.applyGroupFilters();
    }
  }

  // Member management
  openManageMembers(): void {
    if (!this.selectedGroup) return;
    this.isManagingMembers = true;
    this.filteredUsers = [...this.users];
    this.userSearchTerm = '';
  }

  closeManageMembers(): void {
    this.isManagingMembers = false;
  }

  searchUsers(): void {
    const term = this.userSearchTerm.toLowerCase();
    this.filteredUsers = this.users.filter(user =>
      user.name.toLowerCase().includes(term) ||
      user.email.toLowerCase().includes(term) ||
      user.department.toLowerCase().includes(term) ||
      user.title.toLowerCase().includes(term)
    );
  }

  isUserInGroup(userId: string): boolean {
    if (!this.selectedGroup) return false;
    return this.users.find(u => u.id === userId)?.groups.includes(this.selectedGroup!.id) || false;
  }

  toggleUserGroup(userId: string): void {
    if (!this.selectedGroup) return;

    const userIndex = this.users.findIndex(u => u.id === userId);
    if (userIndex === -1) return;

    const user = this.users[userIndex];
    const groupIndex = user.groups.indexOf(this.selectedGroup.id);

    if (groupIndex === -1) {
      // Add user to group
      user.groups.push(this.selectedGroup.id);
      this.selectedGroup.memberCount++;
    } else {
      // Remove user from group
      user.groups.splice(groupIndex, 1);
      this.selectedGroup.memberCount--;
    }
  }

  saveMemberAssignments(): void {
    if (!this.selectedGroup) return;

    console.log(`Saving member assignments for group ${this.selectedGroup.name}`);
    alert(`Member assignments updated for group: ${this.selectedGroup.name}`);
    this.isManagingMembers = false;
  }

  // Role management
  openManageRoles(): void {
    if (!this.selectedGroup) return;
    this.isManagingRoles = true;
    this.resetSelectedRoles();

    // Set selected roles based on group's roles
    this.selectedGroup.roles.forEach(roleId => {
      this.selectedRoles[roleId] = true;
    });
  }

  closeManageRoles(): void {
    this.isManagingRoles = false;
  }

  resetSelectedRoles(): void {
    this.selectedRoles = {};
    this.roles.forEach(role => {
      this.selectedRoles[role.id] = false;
    });
  }

  toggleRole(roleId: string): void {
    this.selectedRoles[roleId] = !this.selectedRoles[roleId];
  }

  saveRoleAssignments(): void {
    if (!this.selectedGroup) return;

    // Update the group's roles
    this.selectedGroup.roles = Object.keys(this.selectedRoles).filter(roleId => this.selectedRoles[roleId]);

    console.log(`Saving role assignments for group ${this.selectedGroup.name}:`, this.selectedGroup.roles);
    alert(`Role assignments updated for group: ${this.selectedGroup.name}`);
    this.isManagingRoles = false;
  }

  // Helper methods
  getGroupMembers(groupId: string): User[] {
    return this.users.filter(user => user.groups.includes(groupId));
  }

  getParentGroupName(parentId?: string): string {
    if (!parentId) return '';
    const parent = this.groups.find(g => g.id === parentId);
    return parent ? parent.name : '';
  }

  getGroupRoles(groupId: string): Role[] {
    const group = this.groups.find(g => g.id === groupId);
    if (!group) return [];

    return this.roles.filter(role => group.roles.includes(role.id));
  }

  getSubgroups(groupId: string): UserGroup[] {
    return this.groups.filter(group => group.parentGroup === groupId);
  }

  toggleViewMode(): void {
    this.viewMode = this.viewMode === 'grid' ? 'list' : 'grid';
  }
}
