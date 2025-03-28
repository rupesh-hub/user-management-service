import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

export interface SecuritySettings {
  mfaEnabled: boolean;
  lastPasswordChange: Date;
  loginHistory: {
    id: string;
    date: Date;
    ip: string;
    device: string;
    location: string;
    status: 'success' | 'failed';
  }[];
  passwordStrength: 'weak' | 'medium' | 'strong';
  recoveryEmail: string;
  recoveryPhone: string;
  sessionTimeout: number; // in minutes
  ipRestrictions: boolean;
}

@Component({
  selector: 'ums-security-privacy',
  standalone: false,
  templateUrl: './security-privacy.component.html',
  styleUrl: './security-privacy.component.scss'
})
export class SecurityPrivacyComponent implements OnInit {

  securitySettings!: SecuritySettings;
  showPasswordModal = false;
  showMfaModal = false;
  passwordForm!: FormGroup;

  constructor(private fb: FormBuilder) {
    // Password Form
    this.passwordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    }, {validator: this.passwordMatchValidator});

  }

  ngOnInit(): void {
    this.initMockData();
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('newPassword')?.value === g.get('confirmPassword')?.value
      ? null : {'mismatch': true};
  }

  changePassword(): void {
    if (this.passwordForm.invalid) {
      // Mark all fields as touched to show validation errors
      Object.keys(this.passwordForm.controls).forEach(key => {
        this.passwordForm.get(key)?.markAsTouched();
      });
      return;
    }

    // Simulate API call
    setTimeout(() => {
      // Update security settings
      this.securitySettings.lastPasswordChange = new Date();
      this.securitySettings.passwordStrength = 'strong';

      // Close modal
      this.closePasswordModal();
    });
  }

  initMockData(): void {
    this.securitySettings = {
      mfaEnabled: true,
      lastPasswordChange: new Date('2023-05-10'),
      loginHistory: [
        {
          id: 'login1',
          date: new Date('2023-06-05T09:30:00'),
          ip: '192.168.1.1',
          device: 'Chrome on Windows',
          location: 'New York, USA',
          status: 'success'
        },
        {
          id: 'login2',
          date: new Date('2023-06-04T14:45:00'),
          ip: '192.168.1.1',
          device: 'Chrome on Windows',
          location: 'New York, USA',
          status: 'success'
        },
        {
          id: 'login3',
          date: new Date('2023-06-03T11:20:00'),
          ip: '192.168.1.1',
          device: 'Mobile App on Android',
          location: 'New York, USA',
          status: 'success'
        },
        {
          id: 'login4',
          date: new Date('2023-06-02T08:15:00'),
          ip: '203.0.113.42',
          device: 'Unknown',
          location: 'Kiev, Ukraine',
          status: 'failed'
        }
      ],
      passwordStrength: 'strong',
      recoveryEmail: 'john.backup@email.com',
      recoveryPhone: '+1 (555) 987-6543',
      sessionTimeout: 120, // 2 hours
      ipRestrictions: false
    };
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  formatDateTime(date: Date): string {
    return new Date(date).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  enableMfa(): void {
    // Simulate API call
    setTimeout(() => {
      this.securitySettings.mfaEnabled = true;

      // Close modal
      this.closeMfaModal();
    });
  }

  openMfaModal(): void {
    this.showMfaModal = true;
  }

  closeMfaModal(): void {
    this.showMfaModal = false;
  }

  openPasswordModal(): void {
    this.passwordForm.reset();
    this.showPasswordModal = true;
  }

  closePasswordModal(): void {
    this.showPasswordModal = false;
  }

  toggleMfa(): void {
    if (this.securitySettings.mfaEnabled) {
      // Disable MFA
      setTimeout(() => {
        this.securitySettings.mfaEnabled = false;

      }, 800);
    } else {
      // Enable MFA (show modal)
      this.openMfaModal();
    }
  }

}
