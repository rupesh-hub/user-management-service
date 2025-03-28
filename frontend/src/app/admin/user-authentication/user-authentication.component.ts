import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';


interface PasswordPolicy {
  minLength: number;
  requireUppercase: boolean;
  requireLowercase: boolean;
  requireNumbers: boolean;
  requireSpecialChars: boolean;
  preventPasswordReuse: number;
  expirationDays: number;
  lockoutThreshold: number;
  lockoutDuration: number;
}

interface MfaMethod {
  id: string;
  name: string;
  description: string;
  isEnabled: boolean;
  isDefault: boolean;
  setupRequired: boolean;
  icon: string;
}

interface SsoProvider {
  id: string;
  name: string;
  description: string;
  isEnabled: boolean;
  logo: string;
  usageCount: number;
  lastConfigured: Date;
}

interface SocialProvider {
  id: string;
  name: string;
  isEnabled: boolean;
  logo: string;
  usageCount: number;
  clientId: string;
  clientSecret: string;
}

interface LoginAttempt {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  timestamp: Date;
  ipAddress: string;
  device: string;
  browser: string;
  location: string;
  status: 'success' | 'failed';
  failureReason?: string;
}

interface ActiveSession {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  startTime: Date;
  lastActivity: Date;
  ipAddress: string;
  device: string;
  browser: string;
  location: string;
  isCurrent: boolean;
}

@Component({
  selector: 'ums-user-authentication',
  standalone: false,
  templateUrl: './user-authentication.component.html',
  styleUrl: './user-authentication.component.scss'
})
export class UserAuthenticationComponent implements OnInit {
  // Active tab
  activeTab = 'password-policies';

  // Password Policies
  passwordPolicyForm: FormGroup;

  // MFA Settings
  mfaMethods: MfaMethod[] = [];
  mfaEnforcement: 'optional' | 'required' | 'risk-based' = 'optional';
  mfaRememberDevice = 30; // days

  // SSO Providers
  ssoProviders: SsoProvider[] = [];
  selectedSsoProvider: SsoProvider | null = null;
  isEditingSso = false;
  ssoForm: FormGroup;

  // Social Login
  socialProviders: SocialProvider[] = [];
  selectedSocialProvider: SocialProvider | null = null;
  isEditingSocial = false;
  socialForm: FormGroup;

  // Login Attempts
  loginAttempts: LoginAttempt[] = [];
  filteredLoginAttempts: LoginAttempt[] = [];
  loginAttemptsSearchTerm = '';
  loginAttemptsDateFilter: 'all' | 'today' | 'week' | 'month' = 'all';
  loginAttemptsStatusFilter: 'all' | 'success' | 'failed' = 'all';

  // Session Management
  activeSessions: ActiveSession[] = [];
  filteredSessions: ActiveSession[] = [];
  sessionSearchTerm = '';
  sessionTimeout = 120; // minutes
  maxConcurrentSessions = 5;
  enforceOneSession = false;
  rememberMeDuration = 14; // days

  constructor(private fb: FormBuilder) {
    // Initialize password policy form
    this.passwordPolicyForm = this.fb.group({
      minLength: [8, [Validators.required, Validators.min(6), Validators.max(128)]],
      requireUppercase: [true],
      requireLowercase: [true],
      requireNumbers: [true],
      requireSpecialChars: [true],
      preventPasswordReuse: [5, [Validators.required, Validators.min(0), Validators.max(24)]],
      expirationDays: [90, [Validators.required, Validators.min(0), Validators.max(365)]],
      lockoutThreshold: [5, [Validators.required, Validators.min(1), Validators.max(10)]],
      lockoutDuration: [30, [Validators.required, Validators.min(1), Validators.max(1440)]]
    });

    // Initialize SSO form
    this.ssoForm = this.fb.group({
      name: ['', Validators.required],
      isEnabled: [true],
      entityId: ['', Validators.required],
      acsUrl: ['', Validators.required],
      metadataUrl: [''],
      certificate: ['']
    });

    // Initialize Social Login form
    this.socialForm = this.fb.group({
      name: ['', Validators.required],
      isEnabled: [true],
      clientId: ['', Validators.required],
      clientSecret: ['', Validators.required],
      redirectUri: ['', Validators.required],
      scope: ['']
    });
  }

  ngOnInit(): void {
    this.generateMockData();
    this.applyLoginAttemptsFilters();
    this.applySessionFilters();
  }

  generateMockData(): void {
    // Generate MFA methods
    this.mfaMethods = [
      {
        id: 'mfa-1',
        name: 'Authenticator App',
        description: 'Use Google Authenticator, Microsoft Authenticator, or similar apps',
        isEnabled: true,
        isDefault: true,
        setupRequired: true,
        icon: 'mobile'
      },
      {
        id: 'mfa-2',
        name: 'SMS Verification',
        description: 'Receive a verification code via text message',
        isEnabled: true,
        isDefault: false,
        setupRequired: true,
        icon: 'message-circle'
      },
      {
        id: 'mfa-3',
        name: 'Email Verification',
        description: 'Receive a verification code via email',
        isEnabled: true,
        isDefault: false,
        setupRequired: false,
        icon: 'mail'
      },
      {
        id: 'mfa-4',
        name: 'Security Keys',
        description: 'Use hardware security keys like YubiKey',
        isEnabled: false,
        isDefault: false,
        setupRequired: true,
        icon: 'key'
      },
      {
        id: 'mfa-5',
        name: 'Biometric Authentication',
        description: 'Use fingerprint, face recognition, or other biometric methods',
        isEnabled: false,
        isDefault: false,
        setupRequired: true,
        icon: 'fingerprint'
      }
    ];

    // Generate SSO providers
    this.ssoProviders = [
      {
        id: 'sso-1',
        name: 'Okta',
        description: 'Enterprise identity provider with advanced security features',
        isEnabled: true,
        logo: 'okta',
        usageCount: 245,
        lastConfigured: new Date(2023, 5, 15)
      },
      {
        id: 'sso-2',
        name: 'Azure AD',
        description: 'Microsoft\'s cloud-based identity and access management service',
        isEnabled: true,
        logo: 'azure',
        usageCount: 187,
        lastConfigured: new Date(2023, 4, 22)
      },
      {
        id: 'sso-3',
        name: 'Google Workspace',
        description: 'Google\'s suite of cloud computing, productivity and collaboration tools',
        isEnabled: false,
        logo: 'google',
        usageCount: 0,
        lastConfigured: new Date(2023, 3, 10)
      }
    ];

    // Generate Social Login providers
    this.socialProviders = [
      {
        id: 'social-1',
        name: 'Google',
        isEnabled: true,
        logo: 'google',
        usageCount: 356,
        clientId: 'google-client-id-example',
        clientSecret: 'google-client-secret-example'
      },
      {
        id: 'social-2',
        name: 'Facebook',
        isEnabled: true,
        logo: 'facebook',
        usageCount: 128,
        clientId: 'facebook-client-id-example',
        clientSecret: 'facebook-client-secret-example'
      },
      {
        id: 'social-3',
        name: 'Apple',
        isEnabled: false,
        logo: 'apple',
        usageCount: 0,
        clientId: '',
        clientSecret: ''
      },
      {
        id: 'social-4',
        name: 'Microsoft',
        isEnabled: false,
        logo: 'microsoft',
        usageCount: 0,
        clientId: '',
        clientSecret: ''
      },
      {
        id: 'social-5',
        name: 'GitHub',
        isEnabled: true,
        logo: 'github',
        usageCount: 87,
        clientId: 'github-client-id-example',
        clientSecret: 'github-client-secret-example'
      }
    ];

    // Generate Login Attempts
    const users = [
      { id: 'user-1', name: 'John Doe', email: 'john.doe@example.com' },
      { id: 'user-2', name: 'Jane Smith', email: 'jane.smith@example.com' },
      { id: 'user-3', name: 'Robert Johnson', email: 'robert.johnson@example.com' },
      { id: 'user-4', name: 'Emily Davis', email: 'emily.davis@example.com' }
    ];

    const devices = [
      'Chrome on Windows',
      'Firefox on MacOS',
      'Safari on iPhone',
      'Edge on Windows',
      'Chrome on Android'
    ];

    const locations = [
      'New York, USA',
      'London, UK',
      'Tokyo, Japan',
      'Sydney, Australia',
      'Berlin, Germany'
    ];

    const failureReasons = [
      'Invalid password',
      'Account locked',
      'MFA verification failed',
      'Expired password',
      'Suspicious location'
    ];

    this.loginAttempts = [];

    // Generate 50 login attempts
    for (let i = 0; i < 50; i++) {
      const user = users[Math.floor(Math.random() * users.length)];
      const device = devices[Math.floor(Math.random() * devices.length)];
      const browser = device.split(' on ')[0];
      const location = locations[Math.floor(Math.random() * locations.length)];
      const status = Math.random() > 0.7 ? 'failed' : 'success';

      // Random date within the last 30 days
      const date = new Date();
      date.setDate(date.getDate() - Math.floor(Math.random() * 30));

      this.loginAttempts.push({
        id: `login-${i + 1}`,
        userId: user.id,
        userName: user.name,
        userEmail: user.email,
        timestamp: date,
        ipAddress: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
        device: device.split(' on ')[1],
        browser: browser,
        location: location,
        status: status,
        ...(status === 'failed' ? { failureReason: failureReasons[Math.floor(Math.random() * failureReasons.length)] } : {})
      });
    }

    // Sort by timestamp (newest first)
    this.loginAttempts.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

    // Generate Active Sessions
    this.activeSessions = [];

    // Generate 10 active sessions
    for (let i = 0; i < 10; i++) {
      const user = users[Math.floor(Math.random() * users.length)];
      const device = devices[Math.floor(Math.random() * devices.length)];
      const browser = device.split(' on ')[0];
      const location = locations[Math.floor(Math.random() * locations.length)];

      // Random start time within the last 7 days
      const startTime = new Date();
      startTime.setDate(startTime.getDate() - Math.floor(Math.random() * 7));

      // Random last activity time between start time and now
      const lastActivity = new Date();
      const timeDiff = lastActivity.getTime() - startTime.getTime();
      lastActivity.setTime(startTime.getTime() + Math.floor(Math.random() * timeDiff));

      this.activeSessions.push({
        id: `session-${i + 1}`,
        userId: user.id,
        userName: user.name,
        userEmail: user.email,
        startTime: startTime,
        lastActivity: lastActivity,
        ipAddress: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
        device: device.split(' on ')[1],
        browser: browser,
        location: location,
        isCurrent: i === 0 // First session is current
      });
    }

    // Sort by last activity (newest first)
    this.activeSessions.sort((a, b) => b.lastActivity.getTime() - a.lastActivity.getTime());
  }

  // Tab Navigation
  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  // Password Policies
  savePasswordPolicy(): void {
    if (this.passwordPolicyForm.invalid) return;

    console.log('Saving password policy:', this.passwordPolicyForm.value);
    alert('Password policy saved successfully');
    // In a real application, you would send this to your backend
  }

  // MFA Methods
  toggleMfaMethod(methodId: string): void {
    const method = this.mfaMethods.find(m => m.id === methodId);
    if (method) {
      method.isEnabled = !method.isEnabled;
    }
  }

  setDefaultMfaMethod(methodId: string): void {
    this.mfaMethods.forEach(method => {
      method.isDefault = method.id === methodId;
    });
  }

  saveMfaSettings(): void {
    console.log('Saving MFA settings:', {
      methods: this.mfaMethods,
      enforcement: this.mfaEnforcement,
      rememberDevice: this.mfaRememberDevice
    });
    alert('MFA settings saved successfully');
    // In a real application, you would send this to your backend
  }

  // SSO Providers
  selectSsoProvider(provider: SsoProvider): void {
    this.selectedSsoProvider = provider;
    this.isEditingSso = false;
  }

  createSsoProvider(): void {
    this.selectedSsoProvider = null;
    this.isEditingSso = true;
    this.ssoForm.reset({
      name: '',
      isEnabled: true,
      entityId: '',
      acsUrl: '',
      metadataUrl: '',
      certificate: ''
    });
  }

  editSsoProvider(): void {
    if (!this.selectedSsoProvider) return;

    this.isEditingSso = true;
    this.ssoForm.patchValue({
      name: this.selectedSsoProvider.name,
      isEnabled: this.selectedSsoProvider.isEnabled,
      entityId: 'example-entity-id', // Mock data
      acsUrl: 'https://example.com/acs', // Mock data
      metadataUrl: 'https://example.com/metadata', // Mock data
      certificate: '-----BEGIN CERTIFICATE-----\nMIIDXTCCAkWgAwIBAgIJAJC1HiIAZAiIMA0GCSqGSIb3DQEBCwUAMEUxCzAJBgNV\nBAYTAkFVMRMwEQYDVQQIDApTb21lLVN0YXRlMSEwHwYDVQQKDBhJbnRlcm5ldCBX\naWRnaXRzIFB0eSBMdGQwHhcNMTkwNjA3MDk1OTQ0WhcNMjAwNjA2MDk1OTQ0WjBF\nMQswCQYDVQQGEwJBVTETMBEGA1UECAwKU29tZS1TdGF0ZTEhMB8GA1UECgwYSW50\nZXJuZXQgV2lkZ2l0cyBQdHkgTHRkMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIB\nCgKCAQEAjmz3QUJt\n-----END CERTIFICATE-----' // Mock data
    });
  }

  cancelSsoEdit(): void {
    this.isEditingSso = false;
  }

  saveSsoProvider(): void {
    if (this.ssoForm.invalid) return;

    const formValues = this.ssoForm.value;

    if (this.selectedSsoProvider) {
      // Update existing provider
      const index = this.ssoProviders.findIndex(p => p.id === this.selectedSsoProvider!.id);
      if (index !== -1) {
        this.ssoProviders[index] = {
          ...this.selectedSsoProvider,
          name: formValues.name,
          isEnabled: formValues.isEnabled,
          lastConfigured: new Date()
        };
        this.selectedSsoProvider = this.ssoProviders[index];
      }
    } else {
      // Create new provider
      const newProvider: SsoProvider = {
        id: `sso-${this.ssoProviders.length + 1}`,
        name: formValues.name,
        description: `${formValues.name} SSO integration`,
        isEnabled: formValues.isEnabled,
        logo: formValues.name.toLowerCase(),
        usageCount: 0,
        lastConfigured: new Date()
      };

      this.ssoProviders.push(newProvider);
      this.selectedSsoProvider = newProvider;
    }

    this.isEditingSso = false;
    console.log('Saving SSO provider:', formValues);
    alert('SSO provider saved successfully');
    // In a real application, you would send this to your backend
  }

  deleteSsoProvider(provider: SsoProvider): void {
    if (confirm(`Are you sure you want to delete the SSO provider "${provider.name}"? This action cannot be undone.`)) {
      this.ssoProviders = this.ssoProviders.filter(p => p.id !== provider.id);

      if (this.selectedSsoProvider && this.selectedSsoProvider.id === provider.id) {
        this.selectedSsoProvider = null;
      }
    }
  }

  // Social Login Providers
  selectSocialProvider(provider: SocialProvider): void {
    this.selectedSocialProvider = provider;
    this.isEditingSocial = false;
  }

  createSocialProvider(): void {
    this.selectedSocialProvider = null;
    this.isEditingSocial = true;
    this.socialForm.reset({
      name: '',
      isEnabled: true,
      clientId: '',
      clientSecret: '',
      redirectUri: 'https://yourdomain.com/auth/callback',
      scope: 'email profile'
    });
  }

  editSocialProvider(): void {
    if (!this.selectedSocialProvider) return;

    this.isEditingSocial = true;
    this.socialForm.patchValue({
      name: this.selectedSocialProvider.name,
      isEnabled: this.selectedSocialProvider.isEnabled,
      clientId: this.selectedSocialProvider.clientId,
      clientSecret: this.selectedSocialProvider.clientSecret,
      redirectUri: 'https://yourdomain.com/auth/callback', // Mock data
      scope: 'email profile' // Mock data
    });
  }

  cancelSocialEdit(): void {
    this.isEditingSocial = false;
  }

  saveSocialProvider(): void {
    if (this.socialForm.invalid) return;

    const formValues = this.socialForm.value;

    if (this.selectedSocialProvider) {
      // Update existing provider
      const index = this.socialProviders.findIndex(p => p.id === this.selectedSocialProvider!.id);
      if (index !== -1) {
        this.socialProviders[index] = {
          ...this.selectedSocialProvider,
          name: formValues.name,
          isEnabled: formValues.isEnabled,
          clientId: formValues.clientId,
          clientSecret: formValues.clientSecret
        };
        this.selectedSocialProvider = this.socialProviders[index];
      }
    } else {
      // Create new provider
      const newProvider: SocialProvider = {
        id: `social-${this.socialProviders.length + 1}`,
        name: formValues.name,
        isEnabled: formValues.isEnabled,
        logo: formValues.name.toLowerCase(),
        usageCount: 0,
        clientId: formValues.clientId,
        clientSecret: formValues.clientSecret
      };

      this.socialProviders.push(newProvider);
      this.selectedSocialProvider = newProvider;
    }

    this.isEditingSocial = false;
    console.log('Saving social provider:', formValues);
    alert('Social login provider saved successfully');
    // In a real application, you would send this to your backend
  }

  deleteSocialProvider(provider: SocialProvider): void {
    if (confirm(`Are you sure you want to delete the social login provider "${provider.name}"? This action cannot be undone.`)) {
      this.socialProviders = this.socialProviders.filter(p => p.id !== provider.id);

      if (this.selectedSocialProvider && this.selectedSocialProvider.id === provider.id) {
        this.selectedSocialProvider = null;
      }
    }
  }

  // Login Attempts
  applyLoginAttemptsFilters(): void {
    let filtered = [...this.loginAttempts];

    // Apply search term
    if (this.loginAttemptsSearchTerm) {
      const term = this.loginAttemptsSearchTerm.toLowerCase();
      filtered = filtered.filter(attempt =>
        attempt.userName.toLowerCase().includes(term) ||
        attempt.userEmail.toLowerCase().includes(term) ||
        attempt.ipAddress.includes(term) ||
        attempt.location.toLowerCase().includes(term)
      );
    }

    // Apply date filter
    const now = new Date();
    if (this.loginAttemptsDateFilter === 'today') {
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      filtered = filtered.filter(attempt => attempt.timestamp >= today);
    } else if (this.loginAttemptsDateFilter === 'week') {
      const weekAgo = new Date(now);
      weekAgo.setDate(weekAgo.getDate() - 7);
      filtered = filtered.filter(attempt => attempt.timestamp >= weekAgo);
    } else if (this.loginAttemptsDateFilter === 'month') {
      const monthAgo = new Date(now);
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      filtered = filtered.filter(attempt => attempt.timestamp >= monthAgo);
    }

    // Apply status filter
    if (this.loginAttemptsStatusFilter !== 'all') {
      filtered = filtered.filter(attempt => attempt.status === this.loginAttemptsStatusFilter);
    }

    this.filteredLoginAttempts = filtered;
  }

  // Session Management
  applySessionFilters(): void {
    let filtered = [...this.activeSessions];

    // Apply search term
    if (this.sessionSearchTerm) {
      const term = this.sessionSearchTerm.toLowerCase();
      filtered = filtered.filter(session =>
        session.userName.toLowerCase().includes(term) ||
        session.userEmail.toLowerCase().includes(term) ||
        session.ipAddress.includes(term) ||
        session.location.toLowerCase().includes(term) ||
        session.browser.toLowerCase().includes(term) ||
        session.device.toLowerCase().includes(term)
      );
    }

    this.filteredSessions = filtered;
  }

  terminateSession(sessionId: string): void {
    if (confirm('Are you sure you want to terminate this session?')) {
      const session = this.activeSessions.find(s => s.id === sessionId);
      if (session && !session.isCurrent) {
        this.activeSessions = this.activeSessions.filter(s => s.id !== sessionId);
        this.applySessionFilters();
        alert('Session terminated successfully');
      } else if (session && session.isCurrent) {
        alert('Cannot terminate your current session');
      }
    }
  }

  terminateAllSessions(): void {
    if (confirm('Are you sure you want to terminate all other sessions?')) {
      this.activeSessions = this.activeSessions.filter(s => s.isCurrent);
      this.applySessionFilters();
      alert('All other sessions terminated successfully');
    }
  }

  saveSessionSettings(): void {
    console.log('Saving session settings:', {
      sessionTimeout: this.sessionTimeout,
      maxConcurrentSessions: this.maxConcurrentSessions,
      enforceOneSession: this.enforceOneSession,
      rememberMeDuration: this.rememberMeDuration
    });
    alert('Session settings saved successfully');
    // In a real application, you would send this to your backend
  }

  // Helper methods
  getStatusClass(status: string): string {
    return status === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  }

  formatTimeAgo(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.round(diffMs / 1000);
    const diffMin = Math.round(diffSec / 60);
    const diffHour = Math.round(diffMin / 60);
    const diffDay = Math.round(diffHour / 24);

    if (diffSec < 60) {
      return `${diffSec} seconds ago`;
    } else if (diffMin < 60) {
      return `${diffMin} minutes ago`;
    } else if (diffHour < 24) {
      return `${diffHour} hours ago`;
    } else if (diffDay < 30) {
      return `${diffDay} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  }
}

