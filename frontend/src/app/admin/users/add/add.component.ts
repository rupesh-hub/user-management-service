import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { Employee } from '../user.model';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';


@Component({
  selector: 'ums-add',
  standalone: false,
  templateUrl: './add.component.html',
  styleUrl: './add.component.scss'
})
export class AddComponent implements OnInit {
  employeeForm!: FormGroup;
  currentStep = 1;
  totalSteps = 7;
  user: Employee | null = null;

  // For profile image preview
  profileImagePreview: SafeUrl | null = null;

  // For document upload
  @ViewChild('fileInput') fileInput!: ElementRef;

  // Track completed steps
  completedSteps: boolean[] = [false, false, false, false, false, false, false];

  constructor(
    private fb: FormBuilder,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadDummyData();
    this.patchFormWithDummyData();
  }

  initForm(): void {
    this.employeeForm = this.fb.group({
      // Step 1: Basic Information
      basicInfo: this.fb.group({
        id: [''],
        firstName: ['', [Validators.required]],
        lastName: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        phone: ['', [Validators.required]],
        position: ['', [Validators.required]],
        department: ['', [Validators.required]],
        employeeId: ['', [Validators.required]],
        joinDate: ['', [Validators.required]],
        status: ['active', [Validators.required]],
        profileImage: ['']
      }),

      // Step 2: Address
      address: this.fb.group({
        street: ['', [Validators.required]],
        city: ['', [Validators.required]],
        state: ['', [Validators.required]],
        zipCode: ['', [Validators.required]],
        country: ['', [Validators.required]]
      }),

      // Step 3: Personal Information
      personalInfo: this.fb.group({
        dateOfBirth: ['', [Validators.required]],
        gender: ['', [Validators.required]],
        nationality: ['', [Validators.required]],
        maritalStatus: ['', [Validators.required]],
        bloodGroup: [''],
        ssn: ['', [Validators.required]],
        passportNumber: [''],
        drivingLicense: ['']
      }),

      // Step 4: Emergency Contact
      emergencyContact: this.fb.group({
        name: ['', [Validators.required]],
        relationship: ['', [Validators.required]],
        phone: ['', [Validators.required]],
        email: ['', [Validators.email]],
        address: ['']
      }),

      // Step 5: Skills and Education
      skillsEducation: this.fb.group({
        skills: this.fb.array([]),
        education: this.fb.array([])
      }),

      // Step 6: Work History
      workHistory: this.fb.array([]),

      // Step 7: Documents
      documents: this.fb.array([])
    });

    // Subscribe to value changes to update completed steps
    this.employeeForm.valueChanges.subscribe(() => {
      this.updateCompletedSteps();
    });
  }

  // Check if current step is valid
  isCurrentStepValid(): boolean {
    switch (this.currentStep) {
      case 1:
        return this.employeeForm.get('basicInfo')!.valid;
      case 2:
        return this.employeeForm.get('address')!.valid;
      case 3:
        return this.employeeForm.get('personalInfo')!.valid;
      case 4:
        return this.employeeForm.get('emergencyContact')!.valid;
      case 5:
        return this.employeeForm.get('skillsEducation')!.valid &&
          this.skills.length > 0;
      case 6:
        return this.workHistoryArray.length > 0 &&
          this.workHistoryArray.controls.every(control => control.valid);
      case 7:
        return true; // Documents are optional
      default:
        return false;
    }
  }

  // Update completed steps based on form validity
  updateCompletedSteps(): void {
    this.completedSteps[0] = this.employeeForm.get('basicInfo')!.valid;
    this.completedSteps[1] = this.employeeForm.get('address')!.valid;
    this.completedSteps[2] = this.employeeForm.get('personalInfo')!.valid;
    this.completedSteps[3] = this.employeeForm.get('emergencyContact')!.valid;
    this.completedSteps[4] = this.employeeForm.get('skillsEducation')!.valid && this.skills.length > 0;
    this.completedSteps[5] = this.workHistoryArray.length > 0 &&
      this.workHistoryArray.controls.every(control => control.valid);
    this.completedSteps[6] = true; // Documents are optional
  }

  // Check if a step is accessible
  isStepAccessible(step: number): boolean {
    // First step is always accessible
    if (step === 1) return true;

    // Other steps are accessible if all previous steps are completed
    for (let i = 0; i < step - 1; i++) {
      if (!this.completedSteps[i]) return false;
    }

    return true;
  }

  // Navigation methods
  nextStep(): void {
    if (this.currentStep < this.totalSteps && this.isCurrentStepValid()) {
      this.markCurrentStepAsTouched();
      if (this.isCurrentStepValid()) {
        this.completedSteps[this.currentStep - 1] = true;
        this.currentStep++;
        window.scrollTo(0, 0);
      }
    } else {
      this.markCurrentStepAsTouched();
    }
  }

  prevStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
      window.scrollTo(0, 0);
    }
  }

  goToStep(step: number): void {
    if (step >= 1 && step <= this.totalSteps && this.isStepAccessible(step)) {
      // If trying to move forward, validate current step first
      if (step > this.currentStep) {
        this.markCurrentStepAsTouched();
        if (!this.isCurrentStepValid()) {
          return; // Don't proceed if current step is invalid
        }
      }

      this.currentStep = step;
      window.scrollTo(0, 0);
    }
  }

  // Mark all controls in current step as touched to trigger validation
  markCurrentStepAsTouched(): void {
    switch (this.currentStep) {
      case 1:
        this.markFormGroupTouched(this.employeeForm.get('basicInfo') as FormGroup);
        break;
      case 2:
        this.markFormGroupTouched(this.employeeForm.get('address') as FormGroup);
        break;
      case 3:
        this.markFormGroupTouched(this.employeeForm.get('personalInfo') as FormGroup);
        break;
      case 4:
        this.markFormGroupTouched(this.employeeForm.get('emergencyContact') as FormGroup);
        break;
      case 5:
        this.markFormGroupTouched(this.employeeForm.get('skillsEducation') as FormGroup);
        break;
      case 6:
        this.workHistoryArray.controls.forEach(control => {
          this.markFormGroupTouched(control as FormGroup);
        });
        break;
      case 7:
        this.documentsArray.controls.forEach(control => {
          this.markFormGroupTouched(control as FormGroup);
        });
        break;
    }
  }

  // Form array getters
  get skills(): FormArray {
    return this.employeeForm.get('skillsEducation.skills') as FormArray;
  }

  get education(): FormArray {
    return this.employeeForm.get('skillsEducation.education') as FormArray;
  }

  get workHistoryArray(): FormArray {
    return this.employeeForm.get('workHistory') as FormArray;
  }

  get documentsArray(): FormArray {
    return this.employeeForm.get('documents') as FormArray;
  }

  // Add/remove form array items
  addSkill(): void {
    this.skills.push(this.fb.control('', Validators.required));
  }

  removeSkill(index: number): void {
    this.skills.removeAt(index);
  }

  addEducation(): void {
    this.education.push(
      this.fb.group({
        degree: ['', Validators.required],
        institution: ['', Validators.required],
        year: ['', Validators.required],
        gpa: ['']
      })
    );
  }

  removeEducation(index: number): void {
    this.education.removeAt(index);
  }

  addWorkHistory(): void {
    this.workHistoryArray.push(
      this.fb.group({
        position: ['', Validators.required],
        department: ['', Validators.required],
        startDate: ['', Validators.required],
        endDate: [''],
        responsibilities: ['']
      })
    );
  }

  removeWorkHistory(index: number): void {
    this.workHistoryArray.removeAt(index);
  }

  addDocument(): void {
    this.documentsArray.push(
      this.fb.group({
        name: ['', Validators.required],
        type: ['', Validators.required],
        uploadDate: [new Date().toISOString().split('T')[0]],
        url: ['#'],
        size: ['']
      })
    );
  }

  removeDocument(index: number): void {
    this.documentsArray.removeAt(index);
  }

  // Form submission
  onSubmit(): void {
    this.markFormGroupTouched(this.employeeForm);

    if (this.employeeForm.valid) {
      console.log('Form submitted:', this.employeeForm.value);
      // Here you would typically send the data to your backend
      alert('Employee data submitted successfully!');
    } else {
      // Find the first invalid step and navigate to it
      for (let i = 0; i < this.totalSteps; i++) {
        if (!this.completedSteps[i]) {
          this.currentStep = i + 1;
          break;
        }
      }
      alert('Please fix the errors in the form before submitting.');
    }
  }

  // Helper to mark all controls as touched
  markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      } else if (control instanceof FormArray) {
        control.controls.forEach(c => {
          if (c instanceof FormGroup) {
            this.markFormGroupTouched(c);
          } else {
            c.markAsTouched();
          }
        });
      }
    });
  }

  // Load dummy data
  loadDummyData(): void {
    this.user = {
      id: '1001',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@company.com',
      phone: '+1 (555) 123-4567',
      position: 'Senior Software Engineer',
      department: 'Engineering',
      employeeId: 'EMP-2021-0042',
      joinDate: '2021-03-15',
      status: 'active',
      address: {
        street: '123 Tech Lane',
        city: 'San Francisco',
        state: 'CA',
        zipCode: '94107',
        country: 'United States'
      },
      personalInfo: {
        dateOfBirth: '1988-05-12',
        gender: 'Male',
        nationality: 'American',
        maritalStatus: 'Married',
        bloodGroup: 'O+',
        ssn: 'XXX-XX-1234',
        passportNumber: 'P12345678',
        drivingLicense: 'DL987654321'
      },
      emergencyContact: {
        name: 'Jane Doe',
        relationship: 'Spouse',
        phone: '+1 (555) 987-6543',
        email: 'jane.doe@example.com',
        address: '123 Tech Lane, San Francisco, CA'
      },
      skills: ['JavaScript', 'TypeScript', 'Angular', 'React', 'Node.js', 'MongoDB', 'AWS'],
      education: [
        {
          degree: 'Master of Computer Science',
          institution: 'Stanford University',
          year: '2019',
          gpa: '3.9'
        },
        {
          degree: 'Bachelor of Science in Computer Engineering',
          institution: 'MIT',
          year: '2017',
          gpa: '3.8'
        }
      ],
      workHistory: [
        {
          position: 'Senior Software Engineer',
          department: 'Engineering',
          startDate: '2021-03-15',
          endDate: undefined,
          responsibilities: 'Leading the frontend development team, architecting new features, code reviews'
        },
        {
          position: 'Software Engineer',
          department: 'Product Development',
          startDate: '2019-06-01',
          endDate: '2021-03-14',
          responsibilities: 'Developing new features, fixing bugs, writing unit tests'
        },
        {
          position: 'Junior Developer',
          department: 'Web Development',
          startDate: '2017-08-15',
          endDate: '2019-05-31',
          responsibilities: 'Maintaining existing codebase, implementing UI components'
        }
      ],
      documents: [
        {
          name: 'Employment Contract',
          type: 'pdf',
          uploadDate: '2021-03-15',
          url: '#',
          size: '2.4 MB'
        },
        {
          name: 'Performance Review 2022',
          type: 'pdf',
          uploadDate: '2022-12-15',
          url: '#',
          size: '1.8 MB'
        },
        {
          name: 'Training Certificate - AWS',
          type: 'pdf',
          uploadDate: '2022-05-20',
          url: '#',
          size: '1.2 MB'
        },
        {
          name: 'ID Proof',
          type: 'jpg',
          uploadDate: '2021-03-10',
          url: '#',
          size: '3.5 MB'
        },
        {
          name: 'Resume',
          type: 'docx',
          uploadDate: '2021-03-01',
          url: '#',
          size: '1.1 MB'
        }
      ],
      performanceRatings: [
        {
          year: '2023',
          quarter: 'Q2',
          rating: 5,
          reviewedBy: 'Michael Johnson',
          comments: 'John consistently exceeds expectations. His work on the new authentication system was exceptional and delivered ahead of schedule.'
        },
        {
          year: '2023',
          quarter: 'Q1',
          rating: 4,
          reviewedBy: 'Michael Johnson',
          comments: 'Strong performance this quarter. John has shown great leadership in mentoring junior developers.'
        },
        {
          year: '2022',
          quarter: 'Q4',
          rating: 5,
          reviewedBy: 'Sarah Williams',
          comments: 'Outstanding contribution to the project. John\'s technical expertise was crucial in solving several complex issues.'
        },
        {
          year: '2022',
          quarter: 'Q3',
          rating: 4,
          reviewedBy: 'Sarah Williams',
          comments: 'Good performance overall. John has been proactive in suggesting improvements to our development processes.'
        }
      ],
      salary: {
        current: 120000,
        currency: 'USD',
        effectiveDate: '2023-01-01',
        paymentFrequency: 'Monthly',
        bankDetails: {
          accountNumber: 'XXXX-XXXX-1234',
          bankName: 'Chase Bank',
          routingNumber: 'XXX-XXX-XXX'
        },
        history: [
          {
            amount: 120000,
            effectiveDate: '2023-01-01',
            reason: 'Annual Increment'
          },
          {
            amount: 110000,
            effectiveDate: '2022-01-01',
            reason: 'Annual Increment'
          },
          {
            amount: 95000,
            effectiveDate: '2021-03-15',
            reason: 'Initial Salary'
          }
        ]
      },
      payments: [
        {
          id: 'PAY-2023-07',
          date: '2023-07-31',
          amount: 10000,
          type: 'Salary',
          status: 'Paid',
          details: 'July 2023 Salary'
        },
        {
          id: 'PAY-2023-06',
          date: '2023-06-30',
          amount: 10000,
          type: 'Salary',
          status: 'Paid',
          details: 'June 2023 Salary'
        },
        {
          id: 'PAY-2023-05',
          date: '2023-05-31',
          amount: 10000,
          type: 'Salary',
          status: 'Paid',
          details: 'May 2023 Salary'
        },
        {
          id: 'PAY-2023-04',
          date: '2023-04-30',
          amount: 10000,
          type: 'Salary',
          status: 'Paid',
          details: 'April 2023 Salary'
        },
        {
          id: 'BON-2023-Q1',
          date: '2023-04-15',
          amount: 5000,
          type: 'Bonus',
          status: 'Paid',
          details: 'Q1 2023 Performance Bonus'
        }
      ],
      warnings: [
        {
          id: 'WARN-2022-01',
          date: '2022-08-15',
          reason: 'Late submission of project deliverables',
          issuedBy: 'Michael Johnson',
          status: 'Resolved',
          resolution: 'Improved time management and met all subsequent deadlines',
          resolutionDate: '2022-09-30'
        }
      ],
      profileImage: 'https://randomuser.me/api/portraits/men/44.jpg',
      accountStatus: {
        isActive: false,
        isBlocked: true,
        lastLogin: '2023-07-31T09:45:22',
        lastPasswordChange: '2023-05-15T14:30:00',
        failedLoginAttempts: 0
      }
    };
  }

  // Patch form with dummy data
  patchFormWithDummyData(): void {
    if (!this.user) return;

    // Patch basic info
    this.employeeForm.get('basicInfo')?.patchValue({
      id: this.user.id,
      firstName: this.user.firstName,
      lastName: this.user.lastName,
      email: this.user.email,
      phone: this.user.phone,
      position: this.user.position,
      department: this.user.department,
      employeeId: this.user.employeeId,
      joinDate: this.user.joinDate,
      status: this.user.status,
      profileImage: this.user.profileImage
    });

    // Set profile image preview
    this.profileImagePreview = this.sanitizer.bypassSecurityTrustUrl(this.user.profileImage);

    // Patch address
    this.employeeForm.get('address')?.patchValue(this.user.address);

    // Patch personal info
    this.employeeForm.get('personalInfo')?.patchValue(this.user.personalInfo);

    // Patch emergency contact
    this.employeeForm.get('emergencyContact')?.patchValue(this.user.emergencyContact);

    // Patch skills
    this.user.skills.forEach(skill => {
      this.skills.push(this.fb.control(skill));
    });

    // Patch education
    this.user.education.forEach(edu => {
      this.education.push(
        this.fb.group({
          degree: [edu.degree],
          institution: [edu.institution],
          year: [edu.year],
          gpa: [edu.gpa]
        })
      );
    });

    // Patch work history
    this.user.workHistory.forEach(work => {
      this.workHistoryArray.push(
        this.fb.group({
          position: [work.position],
          department: [work.department],
          startDate: [work.startDate],
          endDate: [work.endDate || ''],
          responsibilities: [work.responsibilities]
        })
      );
    });

    // Patch documents
    this.user.documents.forEach(doc => {
      this.documentsArray.push(
        this.fb.group({
          name: [doc.name],
          type: [doc.type],
          uploadDate: [doc.uploadDate],
          url: [doc.url],
          size: [doc.size]
        })
      );
    });

    // Update completed steps after patching data
    this.updateCompletedSteps();
  }

  // Get step name
  getStepName(step: number): string {
    switch (step) {
      case 1:
        return 'Basic Info';
      case 2:
        return 'Address';
      case 3:
        return 'Personal Info';
      case 4:
        return 'Emergency Contact';
      case 5:
        return 'Skills & Education';
      case 6:
        return 'Work History';
      case 7:
        return 'Documents';
      default:
        return `Step ${step}`;
    }
  }

  // Profile image upload methods
  onProfileImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      // Update form value with file name
      this.employeeForm.get('basicInfo.profileImage')?.setValue(file.name);

      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        this.profileImagePreview = this.sanitizer.bypassSecurityTrustUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  triggerProfileImageUpload(): void {
    const fileInput = document.getElementById('profileImageUpload') as HTMLInputElement;
    fileInput.click();
  }

  // Document upload methods
  onDocumentSelected(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const docGroup = this.documentsArray.at(index) as FormGroup;

      // Update form values with file metadata
      docGroup.patchValue({
        name: file.name,
        type: this.getFileExtension(file.name),
        size: this.formatFileSize(file.size),
        uploadDate: new Date().toISOString().split('T')[0]
      });
    }
  }

  triggerDocumentUpload(index: number): void {
    const fileInput = document.getElementById(`documentUpload${index}`) as HTMLInputElement;
    fileInput.click();
  }

  // Helper methods for file handling
  getFileExtension(filename: string): string {
    return filename.split('.').pop()?.toLowerCase() || '';
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  getFileIcon(fileType: string): string {
    switch(fileType.toLowerCase()) {
      case 'pdf':
        return 'file-pdf';
      case 'doc':
      case 'docx':
        return 'file-word';
      case 'xls':
      case 'xlsx':
        return 'file-excel';
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return 'file-image';
      default:
        return 'file';
    }
  }
}
