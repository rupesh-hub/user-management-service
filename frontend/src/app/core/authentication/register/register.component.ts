import { Component, OnInit, inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'ums-register',
  standalone: false,
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnInit{

  private authService: AuthenticationService = inject(AuthenticationService);
  registrationForm: FormGroup;
  fileError: string | null = null;
  selectedFile: File | null = null;
  previewUrl: string | null = null;
  passwordStrength = 0;
  passwordMessage = '';

  // Multi-step form properties
  currentStep = 1;
  totalSteps = 4;
  stepTitles = ['Personal Information', 'Account Setup', 'Address Information', 'Employment Information'];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    // private _toastService: ToastService
  ) {}

  public ngOnInit(): void {
    this.authService.isAuthenticated$.subscribe((isAuthenticated) => {
      if (isAuthenticated) {
        this.router.navigate(['/dashboard']);
      }
    });

    this.registrationForm = this.fb.group({
      // Step 1: Personal Information
      personalInfo: this.fb.group({
        firstName: ['', [Validators.required, Validators.minLength(2)]],
        lastName: ['', [Validators.required, Validators.minLength(2)]],
        email: ['', [Validators.required, Validators.email]],
        phone: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
        dateOfBirth: ['', [Validators.required, this.ageValidator]],
        profile: [null]
      }),

      // Step 2: Account Setup
      accountSetup: this.fb.group({
        username: ['', [Validators.required]],
        password: ['', [Validators.required, this.passwordValidator]],
        confirmPassword: ['', [Validators.required]]
      }, {
        validators: this.matchPasswords('password', 'confirmPassword')
      }),

      // Step 3: Address Information
      addressInfo: this.fb.group({
        street: ['', Validators.required],
        city: ['', Validators.required],
        state: ['', Validators.required],
        zipCode: ['', [Validators.required, Validators.pattern(/^\d{5}(-\d{4})?$/)]],
        country: ['', Validators.required]
      }),

      // Step 4: Employment Information
      employmentInfo: this.fb.group({
        companyName: ['', Validators.required],
        position: ['', Validators.required],
        department: ['', Validators.required],
        startDate: ['', Validators.required],
        employeeId: ['', Validators.required],
        salary: ['', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
        employmentType: ['', Validators.required],
        managerName: ['', Validators.required],
        emergencyContact: this.fb.group({
          name: ['', Validators.required],
          relationship: ['', Validators.required],
          phone: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]]
        })
      })
    });

    // Monitor password changes to update strength meter
    this.registrationForm.get('accountSetup.password')?.valueChanges.subscribe(
      (password) => this.updatePasswordStrength(password)
    );
  }

  // Age validator to ensure employee is at least 18 years old
  ageValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) {
      return null; // Let required validator handle empty values
    }

    const birthDate = new Date(control.value);
    const today = new Date();

    // Calculate age
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    // Adjust age if birthday hasn't occurred yet this year
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age < 18 ? { underage: true } : null;
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

  get currentFormGroup(): FormGroup {
    if (this.currentStep === 1) return this.registrationForm.get('personalInfo') as FormGroup;
    if (this.currentStep === 2) return this.registrationForm.get('accountSetup') as FormGroup;
    if (this.currentStep === 3) return this.registrationForm.get('addressInfo') as FormGroup;
    return this.registrationForm.get('employmentInfo') as FormGroup;
  }

  nextStep(): void {
    if (this.currentFormGroup.valid && this.currentStep < this.totalSteps) {
      this.currentStep++;
      window.scrollTo(0, 0);
    } else {
      this.markFormGroupTouched(this.currentFormGroup);
    }
  }

  prevStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
      window.scrollTo(0, 0);
    }
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.fileError = null;
    this.previewUrl = null;

    if (input?.files?.length) {
      const file = input.files[0];

      // Validate file type
      if (!file.type.startsWith('image/')) {
        this.fileError = 'Only image files are allowed.';
        input.value = '';
        this.registrationForm.get('personalInfo.profile')?.setValue(null);
        this.selectedFile = null;
        return;
      }

      // Validate file size (e.g., max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB in bytes
      if (file.size > maxSize) {
        this.fileError = 'File size must not exceed 5MB.';
        input.value = '';
        this.registrationForm.get('personalInfo.profile')?.setValue(null);
        this.selectedFile = null;
        return;
      }

      // Store the file and create preview
      this.selectedFile = file;
      this.registrationForm.get('personalInfo')?.patchValue({ profile: file });
      this.createImagePreview(file);
    }
  }

  private createImagePreview(file: File): void {
    const reader = new FileReader();
    reader.onload = () => {
      this.previewUrl = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  // Custom Validator for Password Strength
  passwordValidator(control: AbstractControl): ValidationErrors | null {
    const hasNumber = /\d/.test(control.value);
    const hasUpperCase = /[A-Z]/.test(control.value);
    const hasLowerCase = /[a-z]/.test(control.value);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(control.value);
    const valid = hasNumber && hasUpperCase && hasLowerCase && hasSpecialChar;
    return !valid ? { weakPassword: true } : null;
  }

  // Custom Validator for Confirm Password Match
  matchPasswords(password: string, confirmPassword: string) {
    return (formGroup: AbstractControl) => {
      const passwordControl = formGroup.get(password);
      const confirmPasswordControl = formGroup.get(confirmPassword);

      if (
        confirmPasswordControl?.errors &&
        !confirmPasswordControl.errors['passwordMismatch']
      ) {
        return;
      }

      if (passwordControl?.value !== confirmPasswordControl?.value) {
        confirmPasswordControl?.setErrors({ passwordMismatch: true });
      } else {
        confirmPasswordControl?.setErrors(null);
      }
    };
  }

  navigateToAuthentication() {
    this.router.navigate(['/login']);
  }

  // Helper method to mark all controls as touched
  markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  onSubmit() {
    if (this.registrationForm.valid) {
      const formData = new FormData();
      const personalInfo = this.registrationForm.get('personalInfo')?.value;
      const accountSetup = this.registrationForm.get('accountSetup')?.value;
      const addressInfo = this.registrationForm.get('addressInfo')?.value;
      const employmentInfo = this.registrationForm.get('employmentInfo')?.value;

      // Personal Info
      formData.append('firstName', personalInfo.firstName);
      formData.append('lastName', personalInfo.lastName);
      formData.append('email', personalInfo.email);
      formData.append('phone', personalInfo.phone);
      formData.append('dateOfBirth', personalInfo.dateOfBirth);

      // Account Setup
      formData.append('username', accountSetup.username);
      formData.append('password', accountSetup.password);
      formData.append('confirmPassword', accountSetup.password);

      // Address Info
      formData.append('street', addressInfo.street);
      formData.append('city', addressInfo.city);
      formData.append('state', addressInfo.state);
      formData.append('zipCode', addressInfo.zipCode);
      formData.append('country', addressInfo.country);

      // Employment Info
      formData.append('companyName', employmentInfo.companyName);
      formData.append('position', employmentInfo.position);
      formData.append('department', employmentInfo.department);
      formData.append('startDate', employmentInfo.startDate);
      formData.append('employeeId', employmentInfo.employeeId);
      formData.append('salary', employmentInfo.salary);
      formData.append('employmentType', employmentInfo.employmentType);
      formData.append('managerName', employmentInfo.managerName);
      formData.append('emergencyContactName', employmentInfo.emergencyContact.name);
      formData.append('emergencyContactRelationship', employmentInfo.emergencyContact.relationship);
      formData.append('emergencyContactPhone', employmentInfo.emergencyContact.phone);

      localStorage.setItem('email', personalInfo.email);

      // Only append profile if a file was selected
      if (this.selectedFile) {
        formData.append('profile', this.selectedFile, this.selectedFile.name);
      }

      this.authService.register(formData).subscribe({
        next: () => {
          localStorage.setItem('username', accountSetup.username);
          this.router.navigate(['/validate-token']);
        },
        error: (error) => {
          // this._toastService.show(error.error.message, 'DANGER', null);
          console.error('Registration failed', error);
        },
      });
      console.log(this.registrationForm.value);
    } else {
      // Mark all form controls as touched to display validation errors
      Object.keys(this.registrationForm.controls).forEach(key => {
        const control = this.registrationForm.get(key);
        if (control instanceof FormGroup) {
          this.markFormGroupTouched(control);
        }
      });
    }
  }


}

