export interface Metric {
  id: string
  title: string
  value: number
  change: number
  trend: "up" | "down" | "neutral"
  icon: string
  suffix?: string
}

export enum UserStatus {
  Active = "Active",
  Inactive = "Inactive",
  Warned = "Warned",
  Blocked = "Blocked",
}

export interface User {
  id: number
  name: string
  email: string
  avatar?: string
  initials?: string
  initialsColor?: string
  city: string
  created: string
  status: UserStatus
  role: string
  lastLogin: string
}

