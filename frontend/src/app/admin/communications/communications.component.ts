import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';


interface NotificationChannel {
  id: string
  name: string
  description: string
  isEnabled: boolean
  isConfigurable: boolean
  requiresVerification: boolean
  isVerified: boolean
  settings: any
}

interface NotificationCategory {
  id: string
  name: string
  description: string
  channels: {
    channelId: string
    isEnabled: boolean
  }[]
}

interface NotificationTemplate {
  id: string
  name: string
  description: string
  category: string
  subject: string
  body: string
  variables: string[]
  lastUpdated: Date
}

interface DeliverySchedule {
  id: string
  name: string
  description: string
  isEnabled: boolean
  frequency: "immediate" | "daily" | "weekly" | "monthly"
  timeOfDay?: string
  dayOfWeek?: string
  dayOfMonth?: string
}

@Component({
  selector: 'ums-communications',
  standalone: false,
  templateUrl: './communications.component.html',
  styleUrl: './communications.component.scss'
})
export class CommunicationsComponent implements OnInit {
  // Active tab
  activeTab = "channels"

  // Notification channels
  notificationChannels: NotificationChannel[] = []
  selectedChannel: NotificationChannel | null = null
  isEditingChannel = false
  channelForm: FormGroup

  // Notification categories
  notificationCategories: NotificationCategory[] = []
  selectedCategory: NotificationCategory | null = null
  isEditingCategory = false
  categoryForm: FormGroup

  // Notification templates
  notificationTemplates: NotificationTemplate[] = []
  filteredTemplates: NotificationTemplate[] = []
  selectedTemplate: NotificationTemplate | null = null
  isEditingTemplate = false
  templateForm: FormGroup
  templateSearchTerm = ""
  templateCategoryFilter = "all"

  // Delivery schedules
  deliverySchedules: DeliverySchedule[] = []
  selectedSchedule: DeliverySchedule | null = null
  isEditingSchedule = false
  scheduleForm: FormGroup

  constructor(private fb: FormBuilder) {
    this.channelForm = this.fb.group({
      name: ["", Validators.required],
      description: ["", Validators.required],
      isEnabled: [true],
      settings: this.fb.group({
        // Email settings
        smtpServer: [""],
        smtpPort: [""],
        smtpUsername: [""],
        smtpPassword: [""],
        fromEmail: [""],
        fromName: [""],

        // SMS settings
        apiKey: [""],
        apiSecret: [""],
        fromNumber: [""],

        // Push settings
        firebaseServerKey: [""],
        apnsCertificate: [""],

        // Slack settings
        webhookUrl: [""],
        channel: [""],

        // In-app settings
        storeDuration: ["7"],
        showBadge: [true],
      }),
    })

    this.categoryForm = this.fb.group({
      name: ["", Validators.required],
      description: ["", Validators.required],
    })

    this.templateForm = this.fb.group({
      name: ["", Validators.required],
      description: ["", Validators.required],
      category: ["", Validators.required],
      subject: ["", Validators.required],
      body: ["", Validators.required],
    })

    this.scheduleForm = this.fb.group({
      name: ["", Validators.required],
      description: ["", Validators.required],
      isEnabled: [true],
      frequency: ["immediate", Validators.required],
      timeOfDay: ["09:00"],
      dayOfWeek: ["1"],
      dayOfMonth: ["1"],
    })
  }

  ngOnInit(): void {
    this.generateMockData()
    this.applyTemplateFilters()
  }

  generateMockData(): void {
    // Generate notification channels
    this.notificationChannels = [
      {
        id: "channel-1",
        name: "Email",
        description: "Send notifications via email",
        isEnabled: true,
        isConfigurable: true,
        requiresVerification: true,
        isVerified: true,
        settings: {
          smtpServer: "smtp.example.com",
          smtpPort: "587",
          smtpUsername: "notifications@example.com",
          smtpPassword: "********",
          fromEmail: "notifications@example.com",
          fromName: "Notification System",
        },
      },
      {
        id: "channel-2",
        name: "SMS",
        description: "Send notifications via text message",
        isEnabled: true,
        isConfigurable: true,
        requiresVerification: true,
        isVerified: false,
        settings: {
          apiKey: "abc123",
          apiSecret: "********",
          fromNumber: "+15551234567",
        },
      },
      {
        id: "channel-3",
        name: "Push Notifications",
        description: "Send notifications to mobile devices",
        isEnabled: false,
        isConfigurable: true,
        requiresVerification: false,
        isVerified: false,
        settings: {
          firebaseServerKey: "********",
          apnsCertificate: "********",
        },
      },
      {
        id: "channel-4",
        name: "Slack",
        description: "Send notifications to Slack channels",
        isEnabled: true,
        isConfigurable: true,
        requiresVerification: false,
        isVerified: false,
        settings: {
          webhookUrl: "https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX",
          channel: "#notifications",
        },
      },
      {
        id: "channel-5",
        name: "In-app Notifications",
        description: "Display notifications within the application",
        isEnabled: true,
        isConfigurable: true,
        requiresVerification: false,
        isVerified: false,
        settings: {
          storeDuration: "7",
          showBadge: true,
        },
      },
    ]

    // Generate notification categories
    this.notificationCategories = [
      {
        id: "category-1",
        name: "Account",
        description: "Notifications related to account activities",
        channels: [
          { channelId: "channel-1", isEnabled: true },
          { channelId: "channel-2", isEnabled: false },
          { channelId: "channel-3", isEnabled: false },
          { channelId: "channel-4", isEnabled: false },
          { channelId: "channel-5", isEnabled: true },
        ],
      },
      {
        id: "category-2",
        name: "Security",
        description: "Notifications related to security events",
        channels: [
          { channelId: "channel-1", isEnabled: true },
          { channelId: "channel-2", isEnabled: true },
          { channelId: "channel-3", isEnabled: false },
          { channelId: "channel-4", isEnabled: true },
          { channelId: "channel-5", isEnabled: true },
        ],
      },
      {
        id: "category-3",
        name: "Billing",
        description: "Notifications related to billing and payments",
        channels: [
          { channelId: "channel-1", isEnabled: true },
          { channelId: "channel-2", isEnabled: false },
          { channelId: "channel-3", isEnabled: false },
          { channelId: "channel-4", isEnabled: false },
          { channelId: "channel-5", isEnabled: true },
        ],
      },
      {
        id: "category-4",
        name: "System",
        description: "Notifications related to system events",
        channels: [
          { channelId: "channel-1", isEnabled: true },
          { channelId: "channel-2", isEnabled: false },
          { channelId: "channel-3", isEnabled: false },
          { channelId: "channel-4", isEnabled: true },
          { channelId: "channel-5", isEnabled: true },
        ],
      },
      {
        id: "category-5",
        name: "Marketing",
        description: "Promotional and marketing communications",
        channels: [
          { channelId: "channel-1", isEnabled: true },
          { channelId: "channel-2", isEnabled: false },
          { channelId: "channel-3", isEnabled: false },
          { channelId: "channel-4", isEnabled: false },
          { channelId: "channel-5", isEnabled: false },
        ],
      },
    ]

    // Generate notification templates
    this.notificationTemplates = [
      {
        id: "template-1",
        name: "Welcome Email",
        description: "Sent to new users after registration",
        category: "Account",
        subject: "Welcome to {{appName}}!",
        body: "Hello {{userName}},\n\nWelcome to {{appName}}! We're excited to have you on board.\n\nBest regards,\nThe {{appName}} Team",
        variables: ["appName", "userName"],
        lastUpdated: new Date(2023, 5, 15),
      },
      {
        id: "template-2",
        name: "Password Reset",
        description: "Sent when a user requests a password reset",
        category: "Security",
        subject: "Password Reset Request",
        body: "Hello {{userName}},\n\nWe received a request to reset your password. Click the link below to reset it:\n\n{{resetLink}}\n\nIf you didn't request this, please ignore this email.\n\nBest regards,\nThe {{appName}} Team",
        variables: ["appName", "userName", "resetLink"],
        lastUpdated: new Date(2023, 6, 10),
      },
      {
        id: "template-3",
        name: "Account Locked",
        description: "Sent when a user account is locked due to suspicious activity",
        category: "Security",
        subject: "Account Security Alert",
        body: "Hello {{userName}},\n\nYour account has been locked due to suspicious activity. Please contact support to unlock your account.\n\nBest regards,\nThe {{appName}} Team",
        variables: ["appName", "userName"],
        lastUpdated: new Date(2023, 7, 5),
      },
      {
        id: "template-4",
        name: "Invoice",
        description: "Sent when a new invoice is generated",
        category: "Billing",
        subject: "Invoice #{{invoiceNumber}} for {{appName}}",
        body: "Hello {{userName}},\n\nYour invoice #{{invoiceNumber}} for {{amount}} is now available. You can view and pay it by clicking the link below:\n\n{{invoiceLink}}\n\nBest regards,\nThe {{appName}} Team",
        variables: ["appName", "userName", "invoiceNumber", "amount", "invoiceLink"],
        lastUpdated: new Date(2023, 4, 20),
      },
      {
        id: "template-5",
        name: "Payment Confirmation",
        description: "Sent when a payment is successfully processed",
        category: "Billing",
        subject: "Payment Confirmation",
        body: "Hello {{userName}},\n\nWe've received your payment of {{amount}} for invoice #{{invoiceNumber}}. Thank you for your business!\n\nBest regards,\nThe {{appName}} Team",
        variables: ["appName", "userName", "amount", "invoiceNumber"],
        lastUpdated: new Date(2023, 3, 12),
      },
      {
        id: "template-6",
        name: "System Maintenance",
        description: "Sent before scheduled system maintenance",
        category: "System",
        subject: "Scheduled Maintenance Notice",
        body: "Hello {{userName}},\n\nWe will be performing scheduled maintenance on {{maintenanceDate}} from {{startTime}} to {{endTime}} ({{timezone}}). During this time, the system may be unavailable.\n\nWe apologize for any inconvenience this may cause.\n\nBest regards,\nThe {{appName}} Team",
        variables: ["appName", "userName", "maintenanceDate", "startTime", "endTime", "timezone"],
        lastUpdated: new Date(2023, 2, 8),
      },
      {
        id: "template-7",
        name: "New Feature Announcement",
        description: "Sent when new features are released",
        category: "Marketing",
        subject: "New Features in {{appName}}",
        body: "Hello {{userName}},\n\nWe're excited to announce new features in {{appName}}! Check out {{featureName}} that will help you {{featureBenefit}}.\n\nLearn more: {{featureLink}}\n\nBest regards,\nThe {{appName}} Team",
        variables: ["appName", "userName", "featureName", "featureBenefit", "featureLink"],
        lastUpdated: new Date(2023, 1, 15),
      },
    ]

    // Generate delivery schedules
    this.deliverySchedules = [
      {
        id: "schedule-1",
        name: "Immediate Delivery",
        description: "Send notifications as soon as they are triggered",
        isEnabled: true,
        frequency: "immediate",
      },
      {
        id: "schedule-2",
        name: "Daily Digest",
        description: "Combine notifications and send once per day",
        isEnabled: true,
        frequency: "daily",
        timeOfDay: "09:00",
      },
      {
        id: "schedule-3",
        name: "Weekly Summary",
        description: "Combine notifications and send once per week",
        isEnabled: false,
        frequency: "weekly",
        timeOfDay: "10:00",
        dayOfWeek: "1", // Monday
      },
      {
        id: "schedule-4",
        name: "Monthly Report",
        description: "Combine notifications and send once per month",
        isEnabled: false,
        frequency: "monthly",
        timeOfDay: "09:00",
        dayOfMonth: "1",
      },
    ]
  }

  // Tab navigation
  setActiveTab(tab: string): void {
    this.activeTab = tab
  }

  // Notification channels
  selectChannel(channel: NotificationChannel): void {
    this.selectedChannel = channel
    this.isEditingChannel = false
  }

  editChannel(): void {
    if (!this.selectedChannel) return

    this.isEditingChannel = true

    // Reset form
    this.channelForm.reset({
      name: this.selectedChannel.name,
      description: this.selectedChannel.description,
      isEnabled: this.selectedChannel.isEnabled,
      settings: this.selectedChannel.settings,
    })
  }

  cancelChannelEdit(): void {
    this.isEditingChannel = false
  }

  saveChannel(): void {
    if (!this.selectedChannel || this.channelForm.invalid) return

    const formValues = this.channelForm.value

    // Update the selected channel
    this.selectedChannel = {
      ...this.selectedChannel,
      name: formValues.name,
      description: formValues.description,
      isEnabled: formValues.isEnabled,
      settings: formValues.settings,
    }

    // Update the channel in the channels array
    const index = this.notificationChannels.findIndex((c) => c.id === this.selectedChannel!.id)
    if (index !== -1) {
      this.notificationChannels[index] = this.selectedChannel
    }

    this.isEditingChannel = false
  }

  verifyChannel(): void {
    if (!this.selectedChannel) return

    // In a real application, you would call your API to verify the channel
    alert(`Verification email sent to the administrator for ${this.selectedChannel.name} channel.`)

    // Simulate verification
    setTimeout(() => {
      if (this.selectedChannel) {
        this.selectedChannel.isVerified = true

        // Update the channel in the channels array
        const index = this.notificationChannels.findIndex((c) => c.id === this.selectedChannel!.id)
        if (index !== -1) {
          this.notificationChannels[index] = this.selectedChannel
        }
      }
    }, 2000)
  }

  toggleChannelStatus(channel: NotificationChannel): void {
    channel.isEnabled = !channel.isEnabled
  }

  // Notification categories
  selectCategory(category: NotificationCategory): void {
    this.selectedCategory = category
    this.isEditingCategory = false
  }

  createCategory(): void {
    this.selectedCategory = null
    this.isEditingCategory = true

    // Reset form
    this.categoryForm.reset({
      name: "",
      description: "",
    })
  }

  editCategory(): void {
    if (!this.selectedCategory) return

    this.isEditingCategory = true

    // Reset form
    this.categoryForm.reset({
      name: this.selectedCategory.name,
      description: this.selectedCategory.description,
    })
  }

  cancelCategoryEdit(): void {
    this.isEditingCategory = false
  }

  saveCategory(): void {
    if (this.categoryForm.invalid) return

    const formValues = this.categoryForm.value

    if (this.selectedCategory) {
      // Update existing category
      this.selectedCategory = {
        ...this.selectedCategory,
        name: formValues.name,
        description: formValues.description,
      }

      // Update the category in the categories array
      const index = this.notificationCategories.findIndex((c) => c.id === this.selectedCategory!.id)
      if (index !== -1) {
        this.notificationCategories[index] = this.selectedCategory
      }
    } else {
      // Create new category
      const newCategory: NotificationCategory = {
        id: `category-${this.notificationCategories.length + 1}`,
        name: formValues.name,
        description: formValues.description,
        channels: this.notificationChannels.map((channel) => ({
          channelId: channel.id,
          isEnabled: false,
        })),
      }

      this.notificationCategories.push(newCategory)
      this.selectedCategory = newCategory
    }

    this.isEditingCategory = false
  }

  deleteCategory(category: NotificationCategory): void {
    if (confirm(`Are you sure you want to delete the category "${category.name}"? This action cannot be undone.`)) {
      this.notificationCategories = this.notificationCategories.filter((c) => c.id !== category.id)

      if (this.selectedCategory && this.selectedCategory.id === category.id) {
        this.selectedCategory = null
      }
    }
  }

  toggleCategoryChannel(categoryId: string, channelId: string, isEnabled: boolean): void {
    const category = this.notificationCategories.find((c) => c.id === categoryId)
    if (!category) return

    const channelIndex = category.channels.findIndex((c) => c.channelId === channelId)
    if (channelIndex !== -1) {
      category.channels[channelIndex].isEnabled = isEnabled
    }
  }

  // Notification templates
  applyTemplateFilters(): void {
    let filtered = [...this.notificationTemplates]

    // Apply search term
    if (this.templateSearchTerm) {
      const term = this.templateSearchTerm.toLowerCase()
      filtered = filtered.filter(
        (template) =>
          template.name.toLowerCase().includes(term) ||
          template.description.toLowerCase().includes(term) ||
          template.subject.toLowerCase().includes(term) ||
          template.body.toLowerCase().includes(term),
      )
    }

    // Apply category filter
    if (this.templateCategoryFilter !== "all") {
      filtered = filtered.filter((template) => template.category === this.templateCategoryFilter)
    }

    this.filteredTemplates = filtered
  }

  selectTemplate(template: NotificationTemplate): void {
    this.selectedTemplate = template
    this.isEditingTemplate = false
  }

  createTemplate(): void {
    this.selectedTemplate = null
    this.isEditingTemplate = true

    // Reset form
    this.templateForm.reset({
      name: "",
      description: "",
      category: "",
      subject: "",
      body: "",
    })
  }

  editTemplate(): void {
    if (!this.selectedTemplate) return

    this.isEditingTemplate = true

    // Reset form
    this.templateForm.reset({
      name: this.selectedTemplate.name,
      description: this.selectedTemplate.description,
      category: this.selectedTemplate.category,
      subject: this.selectedTemplate.subject,
      body: this.selectedTemplate.body,
    })
  }

  cancelTemplateEdit(): void {
    this.isEditingTemplate = false
  }

  saveTemplate(): void {
    if (this.templateForm.invalid) return

    const formValues = this.templateForm.value

    // Extract variables from the template
    const variables: string[] = []
    const regex = /{{([^}]+)}}/g
    let match

    while ((match = regex.exec(formValues.subject)) !== null) {
      if (!variables.includes(match[1])) {
        variables.push(match[1])
      }
    }

    while ((match = regex.exec(formValues.body)) !== null) {
      if (!variables.includes(match[1])) {
        variables.push(match[1])
      }
    }

    if (this.selectedTemplate) {
      // Update existing template
      this.selectedTemplate = {
        ...this.selectedTemplate,
        name: formValues.name,
        description: formValues.description,
        category: formValues.category,
        subject: formValues.subject,
        body: formValues.body,
        variables: variables,
        lastUpdated: new Date(),
      }

      // Update the template in the templates array
      const index = this.notificationTemplates.findIndex((t) => t.id === this.selectedTemplate!.id)
      if (index !== -1) {
        this.notificationTemplates[index] = this.selectedTemplate
      }
    } else {
      // Create new template
      const newTemplate: NotificationTemplate = {
        id: `template-${this.notificationTemplates.length + 1}`,
        name: formValues.name,
        description: formValues.description,
        category: formValues.category,
        subject: formValues.subject,
        body: formValues.body,
        variables: variables,
        lastUpdated: new Date(),
      }

      this.notificationTemplates.push(newTemplate)
      this.selectedTemplate = newTemplate
    }

    this.isEditingTemplate = false
    this.applyTemplateFilters()
  }

  deleteTemplate(template: NotificationTemplate): void {
    if (confirm(`Are you sure you want to delete the template "${template.name}"? This action cannot be undone.`)) {
      this.notificationTemplates = this.notificationTemplates.filter((t) => t.id !== template.id)

      if (this.selectedTemplate && this.selectedTemplate.id === template.id) {
        this.selectedTemplate = null
      }

      this.applyTemplateFilters()
    }
  }

  // Delivery schedules
  selectSchedule(schedule: DeliverySchedule): void {
    this.selectedSchedule = schedule
    this.isEditingSchedule = false
  }

  createSchedule(): void {
    this.selectedSchedule = null
    this.isEditingSchedule = true

    // Reset form
    this.scheduleForm.reset({
      name: "",
      description: "",
      isEnabled: true,
      frequency: "immediate",
      timeOfDay: "09:00",
      dayOfWeek: "1",
      dayOfMonth: "1",
    })
  }

  editSchedule(): void {
    if (!this.selectedSchedule) return

    this.isEditingSchedule = true

    // Reset form
    this.scheduleForm.reset({
      name: this.selectedSchedule.name,
      description: this.selectedSchedule.description,
      isEnabled: this.selectedSchedule.isEnabled,
      frequency: this.selectedSchedule.frequency,
      timeOfDay: this.selectedSchedule.timeOfDay || "09:00",
      dayOfWeek: this.selectedSchedule.dayOfWeek || "1",
      dayOfMonth: this.selectedSchedule.dayOfMonth || "1",
    })
  }

  cancelScheduleEdit(): void {
    this.isEditingSchedule = false
  }

  saveSchedule(): void {
    if (this.scheduleForm.invalid) return

    const formValues = this.scheduleForm.value

    if (this.selectedSchedule) {
      // Update existing schedule
      this.selectedSchedule = {
        ...this.selectedSchedule,
        name: formValues.name,
        description: formValues.description,
        isEnabled: formValues.isEnabled,
        frequency: formValues.frequency,
        ...(formValues.frequency !== "immediate" && { timeOfDay: formValues.timeOfDay }),
        ...(formValues.frequency === "weekly" && { dayOfWeek: formValues.dayOfWeek }),
        ...(formValues.frequency === "monthly" && { dayOfMonth: formValues.dayOfMonth }),
      }

      // Update the schedule in the schedules array
      const index = this.deliverySchedules.findIndex((s) => s.id === this.selectedSchedule!.id)
      if (index !== -1) {
        this.deliverySchedules[index] = this.selectedSchedule
      }
    } else {
      // Create new schedule
      const newSchedule: DeliverySchedule = {
        id: `schedule-${this.deliverySchedules.length + 1}`,
        name: formValues.name,
        description: formValues.description,
        isEnabled: formValues.isEnabled,
        frequency: formValues.frequency,
        ...(formValues.frequency !== "immediate" && { timeOfDay: formValues.timeOfDay }),
        ...(formValues.frequency === "weekly" && { dayOfWeek: formValues.dayOfWeek }),
        ...(formValues.frequency === "monthly" && { dayOfMonth: formValues.dayOfMonth }),
      }

      this.deliverySchedules.push(newSchedule)
      this.selectedSchedule = newSchedule
    }

    this.isEditingSchedule = false
  }

  deleteSchedule(schedule: DeliverySchedule): void {
    if (confirm(`Are you sure you want to delete the schedule "${schedule.name}"? This action cannot be undone.`)) {
      this.deliverySchedules = this.deliverySchedules.filter((s) => s.id !== schedule.id)

      if (this.selectedSchedule && this.selectedSchedule.id === schedule.id) {
        this.selectedSchedule = null
      }
    }
  }

  toggleScheduleStatus(schedule: DeliverySchedule): void {
    schedule.isEnabled = !schedule.isEnabled
  }

  // Helper methods
  getChannelById(channelId: string): NotificationChannel | undefined {
    return this.notificationChannels.find((channel) => channel.id === channelId)
  }

  getCategoryById(categoryId: string): NotificationCategory | undefined {
    return this.notificationCategories.find((category) => category.id === categoryId)
  }

  formatDate(date: Date): string {
    return date.toLocaleDateString() + " " + date.toLocaleTimeString()
  }

  getDayOfWeekName(dayOfWeek: string): string {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    return days[Number.parseInt(dayOfWeek, 10) % 7]
  }
}


