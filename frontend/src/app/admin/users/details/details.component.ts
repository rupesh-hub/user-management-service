import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  employeeId: string;
  joinDate: string;
  status: 'active' | 'inactive' | 'on-leave';
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  personalInfo: {
    dateOfBirth: string;
    gender: string;
    nationality: string;
    maritalStatus: string;
    bloodGroup: string;
    ssn: string;
    passportNumber: string;
    drivingLicense: string;
  };
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
    email: string;
    address: string;
  };
  skills: string[];
  education: {
    degree: string;
    institution: string;
    year: string;
    gpa: string;
  }[];
  workHistory: {
    position: string;
    department: string;
    startDate: string;
    endDate?: string;
    responsibilities: string;
  }[];
  documents: {
    name: string;
    type: string;
    uploadDate: string;
    url: string;
    size: string;
  }[];
  performanceRatings: {
    year: string;
    quarter: string;
    rating: number;
    reviewedBy: string;
    comments: string;
  }[];
  salary: {
    current: number;
    currency: string;
    effectiveDate: string;
    paymentFrequency: string;
    bankDetails: {
      accountNumber: string;
      bankName: string;
      routingNumber: string;
    };
    history: {
      amount: number;
      effectiveDate: string;
      reason: string;
    }[];
  };
  payments: {
    id: string;
    date: string;
    amount: number;
    type: string;
    status: string;
    details: string;
  }[];
  warnings: {
    id: string;
    date: string;
    reason: string;
    issuedBy: string;
    status: string;
    resolution?: string;
    resolutionDate?: string;
  }[];
  profileImage?: string;
  accountStatus: {
    isActive: boolean;
    isBlocked: boolean;
    lastLogin: string;
    lastPasswordChange: string;
    failedLoginAttempts: number;
  };
}


@Component({
  selector: 'ums-details',
  standalone: false,
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss'
})
export class DetailsComponent implements OnInit {
  user: User | null = null;
  loading = true;
  error = false;
  activeTab = 'personal';
  confirmAction: { type: string, show: boolean } = { type: '', show: false };

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Simulate loading
    setTimeout(() => {
      this.loadDummyData();
      this.loading = false;
    }, 1000);
  }

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

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  goBack(): void {
    console.log('Navigate back to users list');
  }

  showConfirmation(actionType: string): void {
    this.confirmAction = { type: actionType, show: true };
  }

  cancelAction(): void {
    this.confirmAction = { type: '', show: false };
  }

  confirmUserAction(): void {
    if (!this.user) return;

    switch (this.confirmAction.type) {
      case 'block':
        console.log(`Blocking user: ${this.user.id}`);
        this.user.accountStatus.isActive = false;
        this.user.accountStatus.isBlocked = true;
        break;
      case 'unblock':
        console.log(`Unblocking user: ${this.user.id}`);
        this.user.accountStatus.isActive = true;
        this.user.accountStatus.isBlocked = false;
        break;
      case 'warn':
        console.log(`Warning user: ${this.user.id}`);
        // In a real app, you would open a form to create a warning
        break;
      case 'delete':
        console.log(`Deleting user: ${this.user.id}`);
        // In a real app, you would delete the user and navigate away
        break;
    }

    this.confirmAction = { type: '', show: false };
  }
}

