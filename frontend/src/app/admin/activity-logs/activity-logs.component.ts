import {Component, OnInit} from '@angular/core';
import {  FormBuilder, FormGroup } from "@angular/forms"

interface ActivityLog {
  id: string
  timestamp: Date
  user: string
  userEmail: string
  action: string
  category: string
  ipAddress: string
  device: string
  details: string
  status: "success" | "warning" | "error"
}

@Component({
  selector: 'ums-activity-logs',
  standalone: false,
  templateUrl: './activity-logs.component.html',
  styleUrl: './activity-logs.component.scss'
})
export class ActivityLogsComponent implements OnInit {
  filterForm: FormGroup
  activityLogs: ActivityLog[] = []
  filteredLogs: ActivityLog[] = []
  selectedLog: ActivityLog | null = null

  // Pagination
  currentPage = 1
  pageSize = 10
  totalItems = 0

  // Filters
  categories = [
    "All",
    "Login",
    "Logout",
    "Profile Update",
    "Password Change",
    "Settings Change",
    "User Creation",
    "User Deletion",
  ]
  statuses = ["All", "Success", "Warning", "Error"]

  // Retention settings
  retentionPeriod = "90"
  autoDeleteEnabled = true

  // Notification settings
  notifyOnLogin = true
  notifyOnFailedLogin = true
  notifyOnPasswordChange = true
  notifyOnProfileUpdate = false

  // Export options
  exportFormat = "csv"

  constructor(private fb: FormBuilder) {
    this.filterForm = this.fb.group({
      startDate: [""],
      endDate: [""],
      category: ["All"],
      status: ["All"],
      searchTerm: [""],
    })
  }

  ngOnInit(): void {
    // Generate mock data
    this.generateMockData()
    this.applyFilters()

    // Subscribe to form changes
    this.filterForm.valueChanges.subscribe(() => {
      this.applyFilters()
    })
  }

  generateMockData(): void {
    const actions = [
      "Logged in",
      "Logged out",
      "Updated profile",
      "Changed password",
      "Enabled two-factor authentication",
      "Disabled two-factor authentication",
      "Created new user",
      "Deleted user",
      "Updated user permissions",
      "Changed notification settings",
      "Changed privacy settings",
      "Failed login attempt",
    ]

    const categories = [
      "Login",
      "Logout",
      "Profile Update",
      "Password Change",
      "Settings Change",
      "User Creation",
      "User Deletion",
    ]

    const statuses: ("success" | "warning" | "error")[] = ["success", "warning", "error"]
    const devices = [
      "Chrome on Windows",
      "Firefox on MacOS",
      "Safari on iPhone",
      "Edge on Windows",
      "Chrome on Android",
    ]

    const users = [
      { name: "John Doe", email: "john.doe@example.com" },
      { name: "Jane Smith", email: "jane.smith@example.com" },
      { name: "Robert Johnson", email: "robert.johnson@example.com" },
      { name: "Emily Davis", email: "emily.davis@example.com" },
      { name: "Michael Wilson", email: "michael.wilson@example.com" },
    ]

    // Generate 100 random logs
    for (let i = 0; i < 100; i++) {
      const user = users[Math.floor(Math.random() * users.length)]
      const action = actions[Math.floor(Math.random() * actions.length)]
      const category = categories[Math.floor(Math.random() * categories.length)]
      const status = statuses[Math.floor(Math.random() * statuses.length)]
      const device = devices[Math.floor(Math.random() * devices.length)]

      // Random date within the last 30 days
      const date = new Date()
      date.setDate(date.getDate() - Math.floor(Math.random() * 30))

      this.activityLogs.push({
        id: `log-${i + 1}`,
        timestamp: date,
        user: user.name,
        userEmail: user.email,
        action: action,
        category: category,
        ipAddress: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
        device: device,
        details: `User ${user.name} ${action.toLowerCase()} from ${device}`,
        status: status,
      })
    }

    // Sort by timestamp (newest first)
    this.activityLogs.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
    this.totalItems = this.activityLogs.length
  }

  applyFilters(): void {
    const filters = this.filterForm.value

    this.filteredLogs = this.activityLogs.filter((log) => {
      // Date range filter
      if (filters.startDate && new Date(filters.startDate) > log.timestamp) {
        return false
      }

      if (filters.endDate) {
        const endDate = new Date(filters.endDate)
        endDate.setHours(23, 59, 59, 999)
        if (endDate < log.timestamp) {
          return false
        }
      }

      // Category filter
      if (filters.category !== "All" && log.category !== filters.category) {
        return false
      }

      // Status filter
      if (filters.status !== "All" && log.status !== filters.status.toLowerCase()) {
        return false
      }

      // Search term
      if (filters.searchTerm) {
        const searchTerm = filters.searchTerm.toLowerCase()
        return (
          log.user.toLowerCase().includes(searchTerm) ||
          log.userEmail.toLowerCase().includes(searchTerm) ||
          log.action.toLowerCase().includes(searchTerm) ||
          log.details.toLowerCase().includes(searchTerm) ||
          log.ipAddress.includes(searchTerm)
        )
      }

      return true
    })

    this.totalItems = this.filteredLogs.length
    this.currentPage = 1 // Reset to first page when filters change
  }

  resetFilters(): void {
    this.filterForm.reset({
      startDate: "",
      endDate: "",
      category: "All",
      status: "All",
      searchTerm: "",
    })
    this.applyFilters()
  }

  get paginatedLogs(): ActivityLog[] {
    const startIndex = (this.currentPage - 1) * this.pageSize
    return this.filteredLogs.slice(startIndex, startIndex + this.pageSize)
  }

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.pageSize)
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page
    }
  }

  viewLogDetails(log: ActivityLog): void {
    this.selectedLog = log
  }

  closeLogDetails(): void {
    this.selectedLog = null
  }

  exportLogs(): void {
    console.log(`Exporting logs in ${this.exportFormat} format`)
    // Implementation would depend on your backend or export service
    alert(`Logs exported in ${this.exportFormat.toUpperCase()} format`)
  }

  saveRetentionSettings(): void {
    console.log("Retention settings saved:", {
      period: this.retentionPeriod,
      autoDelete: this.autoDeleteEnabled,
    })
    // Implementation would depend on your backend
    alert("Retention settings saved successfully")
  }

  saveNotificationSettings(): void {
    console.log("Notification settings saved:", {
      login: this.notifyOnLogin,
      failedLogin: this.notifyOnFailedLogin,
      passwordChange: this.notifyOnPasswordChange,
      profileUpdate: this.notifyOnProfileUpdate,
    })
    // Implementation would depend on your backend
    alert("Notification settings saved successfully")
  }

  getStatusClass(status: string): string {
    switch (status) {
      case "success":
        return "bg-green-100 text-green-800"
      case "warning":
        return "bg-yellow-100 text-yellow-800"
      case "error":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  clearAllLogs(): void {
    if (confirm("Are you sure you want to clear all logs? This action cannot be undone.")) {
      this.activityLogs = []
      this.filteredLogs = []
      this.totalItems = 0
      console.log("All logs cleared")
    }
  }

  protected readonly Math = Math;
}

