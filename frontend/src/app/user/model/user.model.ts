export interface GlobalResponse<T> {
  message: string;
  status: string;
  code: string;
  data: T;
}

export interface User {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  roles: Role[];
  enabled: boolean;
  profile: Profile;
  position: string;
  department: string;
  employeeId: string;
  joinDate: Date;
  phone: string;
  location: string;
  bio: string;
  verified: boolean;

  status: 'active' | 'inactive' | 'on-leave' | 'suspended';
  about: {
    address: string;
    city: string;
    country: string;
    education: string;
    languages: string[];
    skills: string[];
  };
}

export interface Role {
  createdOn: string;
  createdBy: string;
  modifiedOn: string;
  modifiedBy: string;
  enabled: boolean;
  id: number;
  name: string;
}

export interface Profile {
  id: number;
  path: string;
  filename: string;
  contentType: string;
  size: number;
  createdOn: string;
  modifiedOn: string;
  modifiedBy: string;
}
