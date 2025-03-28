import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

export interface Settings {
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
    taskReminders: boolean;
    mentions: boolean;
    systemUpdates: boolean;
  };
  appearance: {
    theme: 'light' | 'dark' | 'system';
    fontSize: 'small' | 'medium' | 'large';
    compactMode: boolean;
  };
  privacy: {
    profileVisibility: 'all' | 'team' | 'department' | 'private';
    activityVisibility: 'all' | 'team' | 'department' | 'private';
    showOnlineStatus: boolean;
    allowTagging: boolean;
    allowMessaging: boolean;
  };
  language: string;
  timezone: string;
}

@Component({
  selector: 'ums-settings',
  standalone: false,
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  settings!: Settings;
  settingsForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    // Initialize settings first
    this.mock();

    // Then create the form with the initialized settings
    this.initForm();
  }

  private initForm(): void {
    this.settingsForm = this.fb.group({
      notifications: this.fb.group({
        email: [this.settings.notifications.email],
        push: [this.settings.notifications.push],
        sms: [this.settings.notifications.sms],
        taskReminders: [this.settings.notifications.taskReminders],
        mentions: [this.settings.notifications.mentions],
        systemUpdates: [this.settings.notifications.systemUpdates]
      }),
      appearance: this.fb.group({
        theme: [this.settings.appearance.theme],
        fontSize: [this.settings.appearance.fontSize],
        compactMode: [this.settings.appearance.compactMode]
      }),
      privacy: this.fb.group({
        profileVisibility: [this.settings.privacy.profileVisibility],
        activityVisibility: [this.settings.privacy.activityVisibility],
        showOnlineStatus: [this.settings.privacy.showOnlineStatus],
        allowTagging: [this.settings.privacy.allowTagging],
        allowMessaging: [this.settings.privacy.allowMessaging]
      }),
      language: [this.settings.language],
      timezone: [this.settings.timezone]
    });
  }

  private mock(): void {
    this.settings = {
      notifications: {
        email: true,
        push: true,
        sms: false,
        taskReminders: true,
        mentions: true,
        systemUpdates: true,
      },
      appearance: {
        theme: 'light',
        fontSize: 'medium',
        compactMode: false,
      },
      privacy: {
        profileVisibility: 'all',
        activityVisibility: 'team',
        showOnlineStatus: true,
        allowTagging: true,
        allowMessaging: true,
      },
      language: 'english',
      timezone: 'America/New_York',
    };
  }

  updateSettings(): void {
    if (this.settingsForm.valid) {
      // Update the settings object with form values
      this.settings = {
        ...this.settings,
        ...this.settingsForm.value
      };

      // Here you would typically call a service to save the settings
      console.log('Updated settings:', this.settings);
      // this.settingsService.updateSettings(this.settings).subscribe(...);
    }
  }
}
