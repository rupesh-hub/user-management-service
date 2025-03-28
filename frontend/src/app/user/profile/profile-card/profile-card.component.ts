import { Component, OnInit, inject } from '@angular/core';
import { UserService } from '../../user.service';
import { faCheckCircle, faShieldCat, faPhone, faLocationPinLock, faMailBulk, faCalendar, faInfoCircle, faPencil } from '@fortawesome/free-solid-svg-icons';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from '../../model/user.model';

@Component({
  selector: 'ums-profile-card',
  standalone: false,
  templateUrl: './profile-card.component.html',
  styleUrls: ['./profile-card.component.scss']
})
export class ProfileCardComponent implements OnInit {
  private _userService: UserService = inject(UserService);
  protected faCheckCircle = faCheckCircle;
  protected faShield = faShieldCat;
  protected faPhone = faPhone;
  protected faLocationArrow = faLocationPinLock;
  protected faMailBulk = faMailBulk;
  protected faCalendar = faCalendar;
  protected faInfoCircle = faInfoCircle;
  protected faPencil = faPencil;

  // User data
  user!: User;
  isLoading = true;

  // Forms - declare first, initialize in constructor
  personalForm!: FormGroup;
  aboutForm!: FormGroup;

  // Edit states
  isEditing = false;
  isSaving = false;
  editSection: 'personal' | 'about' | null = null;

  constructor(private fb: FormBuilder) {
    this.initEmptyForms();
  }

  private initEmptyForms(): void {
    this.personalForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      position: ['', Validators.required],
      department: ['', Validators.required],
      location: ['', Validators.required],
      bio: ['']
    });

    this.aboutForm = this.fb.group({
      address: [''],
      city: [''],
      country: [''],
      education: [''],
      languages: [''],
      skills: ['']
    });
  }

  ngOnInit(): void {
    const username: string = localStorage.getItem('username')!;
    this._userService.userByUsername(username)
      .subscribe({
        next: (user) => {
          this.user = user;
          this.updateFormValues();
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error fetching user:', error);
          this.isLoading = false;
        }
      });
  }

  private updateFormValues(): void {
    this.personalForm.patchValue({
      firstName: this.user.firstName,
      lastName: this.user.lastName,
      email: this.user.email,
      phone: this.user.phone,
      position: this.user.position,
      department: this.user.department,
      location: this.user.location,
      bio: this.user.bio
    });

    this.aboutForm.patchValue({
      address: this.user.about.address,
      city: this.user.about.city,
      country: this.user.about.country,
      education: this.user.about.education,
      languages: this.user.about.languages.join(', '),
      skills: this.user.about.skills.join(', ')
    });
  }

  startEditing(section: 'personal' | 'about'): void {
    this.isEditing = true;
    this.editSection = section;
  }

  cancelEditing(): void {
    this.isEditing = false;
    this.editSection = null;
    this.updateFormValues();
  }

  saveInfo(): void {
    if (this.editSection === 'personal' && this.personalForm.invalid) {
      this.markFormGroupTouched(this.personalForm);
      return;
    }
    if (this.editSection === 'about' && this.aboutForm.invalid) {
      this.markFormGroupTouched(this.aboutForm);
      return;
    }

    this.isSaving = true;

    setTimeout(() => {
      if (this.editSection === 'personal') {
        this.user = {
          ...this.user,
          ...this.personalForm.value
        };
      } else if (this.editSection === 'about') {
        const formValues = this.aboutForm.value;
        const languages = formValues.languages.split(',').map((lang: string) => lang.trim()).filter((lang: string) => lang);
        const skills = formValues.skills.split(',').map((skill: string) => skill.trim()).filter((skill: string) => skill);

        this.user = {
          ...this.user,
          about: {
            ...this.user.about,
            address: formValues.address,
            city: formValues.city,
            country: formValues.country,
            education: formValues.education,
            languages,
            skills
          }
        };
      }

      this.isEditing = false;
      this.isSaving = false;
      this.editSection = null;
    }, 800);
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  uploadProfileImage(event: any): void {
    const file = event.target.files[0];
    if (file) {
      setTimeout(() => {
        this.user.profile.path = URL.createObjectURL(file);
      }, 1000);
    }
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
    // this.editSection = this.isEditing ? section : null;

    if (!this.isEditing) {
      // Reset form to original values based on section
      this.personalForm.patchValue({
        firstName: this.user.firstName,
        lastName: this.user.lastName,
        email: this.user.email,
        phone: this.user.phone,
        position: this.user.position,
        department: this.user.department,
        location: this.user.location,
        bio: this.user.bio
      });

      this.aboutForm.patchValue({
        address: this.user.about.address,
        city: this.user.about.city,
        country: this.user.about.country,
        education: this.user.about.education,
        languages: this.user.about.languages.join(', '),
        skills: this.user.about.skills.join(', ')
      });
    }
  }
}
