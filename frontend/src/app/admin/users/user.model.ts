// src/app/models/employee.model.ts
export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface PersonalInfo {
  dateOfBirth: string;
  gender: string;
  nationality: string;
  maritalStatus: string;
  bloodGroup: string;
  ssn: string;
  passportNumber: string;
  drivingLicense: string;
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
  email: string;
  address: string;
}

export interface Education {
  degree: string;
  institution: string;
  year: string;
  gpa: string;
}

export interface WorkHistory {
  position: string;
  department: string;
  startDate: string;
  endDate?: string;
  responsibilities: string;
}

export interface Document {
  name: string;
  type: string;
  uploadDate: string;
  url: string;
  size: string;
}

export interface PerformanceRating {
  year: string;
  quarter: string;
  rating: number;
  reviewedBy: string;
  comments: string;
}

export interface BankDetails {
  accountNumber: string;
  bankName: string;
  routingNumber: string;
}

export interface SalaryHistory {
  amount: number;
  effectiveDate: string;
  reason: string;
}

export interface Salary {
  current: number;
  currency: string;
  effectiveDate: string;
  paymentFrequency: string;
  bankDetails: BankDetails;
  history: SalaryHistory[];
}

export interface Payment {
  id: string;
  date: string;
  amount: number;
  type: string;
  status: string;
  details: string;
}

export interface Warning {
  id: string;
  date: string;
  reason: string;
  issuedBy: string;
  status: string;
  resolution: string;
  resolutionDate: string;
}

export interface AccountStatus {
  isActive: boolean;
  isBlocked: boolean;
  lastLogin: string;
  lastPasswordChange: string;
  failedLoginAttempts: number;
}

export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  employeeId: string;
  joinDate: string;
  status: string;
  address: Address;
  personalInfo: PersonalInfo;
  emergencyContact: EmergencyContact;
  skills: string[];
  education: Education[];
  workHistory: WorkHistory[];
  documents: Document[];
  performanceRatings: PerformanceRating[];
  salary: Salary;
  payments: Payment[];
  warnings: Warning[];
  profileImage: string;
  accountStatus: AccountStatus;
}
