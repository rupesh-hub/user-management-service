import { Component } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'ums-settings',
  standalone: false,
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent {


  profileForm: FormGroup
  passwordForm: FormGroup
  notificationSettings = {
    emailNotifications: true,
    pushNotifications: false,
    smsNotifications: false,
    marketingEmails: true,
  }
  privacySettings = {
    profileVisibility: "public",
    showOnlineStatus: true,
    showActivity: true,
  }
  appearanceSettings = {
    theme: "light",
    fontSize: "medium",
    reducedMotion: false,
  }
  languageSettings = {
    language: "english",
    timeFormat: "12h",
  }
  activeSessions = [
    { device: "Chrome on Windows", location: "New York, USA", lastActive: "2 minutes ago", current: true },
    { device: "Safari on iPhone", location: "Boston, USA", lastActive: "2 days ago", current: false },
    { device: "Firefox on MacOS", location: "San Francisco, USA", lastActive: "5 days ago", current: false },
  ]
  activeTab = "profile"

  constructor(private fb: FormBuilder) {
    this.profileForm = this.fb.group({
      firstName: ["John", Validators.required],
      lastName: ["Doe", Validators.required],
      email: ["john.doe@example.com", [Validators.required, Validators.email]],
      phone: ["(555) 123-4567", Validators.pattern(/^$$\d{3}$$ \d{3}-\d{4}$/)],
    })

    this.passwordForm = this.fb.group({
      currentPassword: ["", Validators.required],
      newPassword: ["", [Validators.required, Validators.minLength(8)]],
      confirmPassword: ["", Validators.required],
    })
  }

  setActiveTab(tab: string) {
    this.activeTab = tab
  }

  saveProfile() {
    if (this.profileForm.valid) {
      console.log("Profile saved:", this.profileForm.value)
      // Implement API call to save profile
    }
  }

  changePassword() {
    if (this.passwordForm.valid) {
      console.log("Password change requested")
      // Implement API call to change password
      this.passwordForm.reset()
    }
  }

  saveNotificationSettings() {
    console.log("Notification settings saved:", this.notificationSettings)
    // Implement API call to save notification settings
  }

  savePrivacySettings() {
    console.log("Privacy settings saved:", this.privacySettings)
    // Implement API call to save privacy settings
  }

  saveAppearanceSettings() {
    console.log("Appearance settings saved:", this.appearanceSettings)
    // Implement API call to save appearance settings
  }

  saveLanguageSettings() {
    console.log("Language settings saved:", this.languageSettings)
    // Implement API call to save language settings
  }

  logoutSession(index: number) {
    if (!this.activeSessions[index].current) {
      console.log("Logging out session:", this.activeSessions[index])
      // Implement API call to log out session
      this.activeSessions.splice(index, 1)
    }
  }

  logoutAllSessions() {
    console.log("Logging out all sessions except current")
    // Implement API call to log out all sessions
    this.activeSessions = this.activeSessions.filter((session) => session.current)
  }

}
