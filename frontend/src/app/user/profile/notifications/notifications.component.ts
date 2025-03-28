import {Component, OnInit} from '@angular/core';

export interface Notification {
  id: string;
  title: string;
  message: string;
  date: Date;
  read: boolean;
  type: 'info' | 'warning' | 'success' | 'error';
  actionUrl?: string;
}

@Component({
  selector: 'ums-notifications',
  standalone: false,
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.scss'
})
export class NotificationsComponent implements OnInit {

  notifications: Notification[] = [];

  ngOnInit(): void {
    this.notifications = [
      {
        id: 'notif1',
        title: 'Task Assigned',
        message: 'You have been assigned a new task: "API Documentation"',
        date: new Date('2023-06-05T10:30:00'),
        read: false,
        type: 'info',
        actionUrl: '/profile/tasks'
      },
      {
        id: 'notif2',
        title: 'Performance Review',
        message: 'Your quarterly performance review is scheduled for next week',
        date: new Date('2023-06-04T14:15:00'),
        read: true,
        type: 'info',
        actionUrl: '/profile/performance'
      },
      {
        id: 'notif3',
        title: 'Security Alert',
        message: 'Unusual login attempt detected from Kiev, Ukraine',
        date: new Date('2023-06-02T08:20:00'),
        read: false,
        type: 'warning',
        actionUrl: '/profile/security'
      },
      {
        id: 'notif4',
        title: 'Task Overdue',
        message: 'The task "API Documentation" is now overdue',
        date: new Date('2023-06-05T08:00:00'),
        read: false,
        type: 'error',
        actionUrl: '/profile/tasks'
      },
      {
        id: 'notif5',
        title: 'Document Shared',
        message: 'Sarah Williams shared a document with you: "Project Requirements"',
        date: new Date('2023-06-03T11:45:00'),
        read: true,
        type: 'info',
        actionUrl: '/profile/documents'
      }
    ];

  }

  updateNotificationBadge(): void {
    // const unreadNotifications = this.notifications.filter(notification =>
    //   !notification.read
    // ).length;

    // Update badge count
    // const notificationMenuItem = this.menuItems.find(item => item.route === 'notifications');
    // if (notificationMenuItem) {
    //   notificationMenuItem.badge = unreadNotifications;
    // }
  }

  markNotificationAsRead(id: string): void {
    // Simulate API call
    setTimeout(() => {
      const index = this.notifications.findIndex(n => n.id === id);
      if (index !== -1) {
        this.notifications[index].read = true;
      }

      // Update badge
      this.updateNotificationBadge();
    }, 500);
  }

  markAllNotificationsAsRead(): void {
    // Simulate API call
    setTimeout(() => {
      this.notifications.forEach(n => n.read = true);

      // Update badge
      this.updateNotificationBadge();
    }, 500);
  }

  deleteNotification(id: string): void {
    // Simulate API call
    setTimeout(() => {
      const index = this.notifications.findIndex(n => n.id === id);
      if (index !== -1) {
        this.notifications.splice(index, 1);
      }

      // Update badge
      this.updateNotificationBadge();
    }, 500);
  }

  getNotificationClass(type: string): string {
    switch (type) {
      case 'info':
        return 'bg-blue-100 text-blue-800 border border-blue-200';
      case 'warning':
        return 'bg-amber-100 text-amber-800 border border-amber-200';
      case 'success':
        return 'bg-green-100 text-green-800 border border-green-200';
      case 'error':
        return 'bg-red-100 text-red-800 border border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
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
