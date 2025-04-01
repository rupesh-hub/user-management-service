import { Component, OnInit, Output,Input, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';

@Component({
  selector: 'ums-change-password',
  standalone: false,
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.scss'
})
export class ChangePasswordComponent implements OnInit {
  @Input() parentComponent: any; // Reference to parent component
  @Output() close = new EventEmitter<void>();

  passwordForm: FormGroup;
  showCurrentPassword = false;
  showNewPassword = false;
  showConfirmPassword = false;
  passwordStrength = 0;
  passwordMessage = '';

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.passwordForm = this.fb.group({
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(8), this.passwordValidator]],
      confirmPassword: ['', [Validators.required]]
    }, {
      validators: [
        this.matchPasswords('newPassword', 'confirmPassword'),
        this.differentFromCurrent('currentPassword', 'newPassword')
      ]
    });

    // Monitor password changes to update strength meter
    this.passwordForm.get('newPassword')?.valueChanges.subscribe(
      (password) => this.updatePasswordStrength(password)
    );
  }

  // Password validator to check strength
  passwordValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) {
      return null;
    }

    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasNumeric = /[0-9]/.test(value);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);

    const valid = hasUpperCase && hasLowerCase && hasNumeric && hasSpecialChar;

    return !valid ? { weakPassword: true } : null;
  }

  // Validator to ensure new password is different from current password
  differentFromCurrent(currentPasswordKey: string, newPasswordKey: string) {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      const currentPasswordControl = formGroup.get(currentPasswordKey);
      const newPasswordControl = formGroup.get(newPasswordKey);

      if (!currentPasswordControl || !newPasswordControl) {
        return null;
      }

      // Skip validation if either field is empty
      if (!currentPasswordControl.value || !newPasswordControl.value) {
        return null;
      }

      // Check if passwords are the same
      if (currentPasswordControl.value === newPasswordControl.value) {
        newPasswordControl.setErrors({
          ...newPasswordControl.errors,
          sameAsCurrentPassword: true
        });
        return { sameAsCurrentPassword: true };
      }

      // If the only error is sameAsCurrentPassword, clear it
      if (newPasswordControl.errors && newPasswordControl.errors['sameAsCurrentPassword']) {
        const { sameAsCurrentPassword, ...otherErrors } = newPasswordControl.errors;
        newPasswordControl.setErrors(Object.keys(otherErrors).length ? otherErrors : null);
      }

      return null;
    };
  }

  // Update password strength meter
  updatePasswordStrength(password: string): void {
    if (!password) {
      this.passwordStrength = 0;
      this.passwordMessage = '';
      return;
    }

    let score = 0;

    // Length check
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;

    // Character type checks
    if (/[A-Z]/.test(password)) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    // Set strength based on score
    if (score <= 2) {
      this.passwordStrength = 1; // Weak
      this.passwordMessage = 'Weak';
    } else if (score <= 4) {
      this.passwordStrength = 2; // Moderate
      this.passwordMessage = 'Moderate';
    } else {
      this.passwordStrength = 3; // Strong
      this.passwordMessage = 'Strong';
    }
  }

  // Custom validator for password match
  matchPasswords(password: string, confirmPassword: string) {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      const passwordControl = formGroup.get(password);
      const confirmPasswordControl = formGroup.get(confirmPassword);

      if (!passwordControl || !confirmPasswordControl) {
        return null;
      }

      if (confirmPasswordControl.errors && !confirmPasswordControl.errors['mismatch']) {
        return null;
      }

      if (passwordControl.value !== confirmPasswordControl.value) {
        confirmPasswordControl.setErrors({ mismatch: true });
        return { mismatch: true };
      } else {
        confirmPasswordControl.setErrors(null);
        return null;
      }
    };
  }

  // Toggle password visibility
  togglePasswordVisibility(field: string): void {
    if (field === 'current') {
      this.showCurrentPassword = !this.showCurrentPassword;
    } else if (field === 'new') {
      this.showNewPassword = !this.showNewPassword;
    } else if (field === 'confirm') {
      this.showConfirmPassword = !this.showConfirmPassword;
    }
  }

  // Close modal
  closePasswordModal(): void {
    // If parent component is provided, use its method
    if (this.parentComponent && typeof this.parentComponent.closePasswordModal === 'function') {
      this.parentComponent.closePasswordModal();
    } else {
      // Otherwise emit close event
      this.close.emit();
    }
  }

  // Submit form
  changePassword(): void {
    if (this.passwordForm.valid) {
      // Implement your password change logic here
      console.log('Password form submitted:', this.passwordForm.value);

      // Simulate API call
      setTimeout(() => {
        // After successful password change
        this.closePasswordModal();
      }, 500);
    } else {
      // Mark all fields as touched to display validation errors
      Object.keys(this.passwordForm.controls).forEach(key => {
        const control = this.passwordForm.get(key);
        control?.markAsTouched();
      });
    }
  }
}
