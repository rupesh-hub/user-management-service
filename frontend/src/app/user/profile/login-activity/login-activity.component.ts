import {Component, OnInit} from '@angular/core';

export interface Activity {
  id: string;
  type: 'login' | 'profile_update' | 'task_completed' | 'role_change' | 'security_change' | 'other';
  description: string;
  date: Date;
  details?: any;
}

@Component({
  selector: 'ums-login-activity',
  standalone: false,
  templateUrl: './login-activity.component.html',
  styleUrl: './login-activity.component.scss'
})
export class LoginActivityComponent implements OnInit {

  activities: Activity[] = [];

  ngOnInit():void {
    this.activities = [
      {
        id: 'act1',
        type: 'login',
        description: 'Logged in from Chrome on Windows',
        date: new Date('2023-06-05T09:30:00'),
        details: {
          ip: '192.168.1.1',
          location: 'New York, USA'
        }
      },
      {
        id: 'act2',
        type: 'profile_update',
        description: 'Updated profile information',
        date: new Date('2023-06-04T15:45:00'),
        details: {
          fields: ['bio', 'skills']
        }
      },
      {
        id: 'act3',
        type: 'task_completed',
        description: 'Completed task: "Code Review"',
        date: new Date('2023-06-03T14:20:00'),
        details: {
          taskId: 'task2',
          project: 'Authentication Module'
        }
      },
      {
        id: 'act4',
        type: 'security_change',
        description: 'Enabled two-factor authentication',
        date: new Date('2023-06-02T11:10:00')
      },
      {
        id: 'act5',
        type: 'login',
        description: 'Failed login attempt',
        date: new Date('2023-06-02T08:15:00'),
        details: {
          ip: '203.0.113.42',
          location: 'Kiev, Ukraine',
          reason: 'Invalid password'
        }
      },
      {
        id: 'act6',
        type: 'other',
        description: 'Downloaded Employee Handbook',
        date: new Date('2023-06-01T16:30:00'),
        details: {
          documentId: 'doc2'
        }
      }
    ];

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


}
