import { Component } from '@angular/core';

// Chart.js imports
import {
  Chart,
  LineController,
  BarController,
  DoughnutController,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
import {Metric, User, UserStatus} from '../model/dashboard.model';

// Register Chart.js components
Chart.register(
  LineController,
  BarController,
  DoughnutController,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
);

@Component({
  selector: 'ums-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

  // Metrics data
  metrics: Metric[] = [
    {
      id: 'total-users',
      title: 'Total Users',
      value: 1240,
      change: 40,
      trend: 'up',
      icon: 'users'
    },
    {
      id: 'new-users',
      title: 'New Users',
      value: 185,
      change: 10,
      trend: 'up',
      icon: 'user-plus'
    },
    {
      id: 'active-users',
      title: 'Active Users',
      value: 650,
      change: -5,
      trend: 'down',
      icon: 'user-check'
    },
    {
      id: 'conversion-rate',
      title: 'Conversion Rate',
      value: 28.5,
      change: 12,
      trend: 'up',
      icon: 'percent',
      suffix: '%'
    }
  ];

  // User data
  users: User[] = [
    {
      id: 1,
      name: 'Mark Wilson',
      email: 'markwilson@gmail.com',
      avatar: 'https://i.pinimg.com/736x/d9/7f/67/d97f67defd4275b6003334ea353c39cf.jpg',
      city: 'Melbourne',
      created: 'Aug 16, 2024',
      status: UserStatus.Active,
      role: 'User',
      lastLogin: '2 hours ago'
    },
    {
      id: 2,
      name: 'David Smith',
      email: 'davidsmith@gmail.com',
      avatar: 'https://i.pinimg.com/736x/d9/7f/67/d97f67defd4275b6003334ea353c39cf.jpg',
      city: 'Perth',
      created: 'Aug 14, 2024',
      status: UserStatus.Warned,
      role: 'Editor',
      lastLogin: '1 day ago'
    },
    {
      id: 3,
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      avatar: 'https://i.pinimg.com/736x/d9/7f/67/d97f67defd4275b6003334ea353c39cf.jpg',
      city: 'Brisbane',
      created: 'Aug 10, 2024',
      status: UserStatus.Active,
      role: 'Admin',
      lastLogin: '5 hours ago'
    },
    {
      id: 4,
      name: 'Sofia Johnson',
      email: 'sofiajohnson@gmail.com',
      avatar: 'https://i.pinimg.com/736x/d9/7f/67/d97f67defd4275b6003334ea353c39cf.jpg',
      city: 'Sydney',
      created: 'Aug 5, 2024',
      status: UserStatus.Active,
      role: 'User',
      lastLogin: '3 days ago'
    },
    {
      id: 5,
      name: 'Daniel Miller',
      email: 'danielmiller@gmail.com',
      initials: 'DM',
      initialsColor: 'bg-purple-200 text-purple-800',
      city: 'Melbourne',
      created: 'Jul 28, 2024',
      status: UserStatus.Blocked,
      role: 'User',
      lastLogin: '2 weeks ago'
    },
    {
      id: 6,
      name: 'Emma Thompson',
      email: 'emmathompson@gmail.com',
      avatar: 'https://i.pinimg.com/736x/d9/7f/67/d97f67defd4275b6003334ea353c39cf.jpg',
      city: 'Mornington Peninsula',
      created: 'Jul 20, 2024',
      status: UserStatus.Active,
      role: 'Editor',
      lastLogin: '1 day ago'
    }
  ];

  // Chart data
  chartData = {
    userGrowth: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
      datasets: [{
        label: 'Total Users',
        data: [800, 850, 920, 980, 1050, 1120, 1180, 1240],
        borderColor: '#6366F1',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        tension: 0.4,
        fill: true
      }]
    },
    userActivity: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      datasets: [{
        label: 'Active Users',
        data: [420, 380, 450, 520, 490, 380, 320],
        backgroundColor: '#6366F1'
      }]
    },
    userStatus: {
      labels: ['Active', 'Inactive', 'Warned', 'Blocked'],
      datasets: [{
        data: [650, 390, 120, 80],
        backgroundColor: [
          '#10B981', // green
          '#9CA3AF', // gray
          '#F59E0B', // amber
          '#EF4444'  // red
        ],
        borderWidth: 0
      }]
    }
  };

  // Pagination
  currentPage = 1;
  totalPages = 10;
  itemsPerPage = 10;
  totalItems = 98;

  constructor() {}

  onPageChange(page: number): void {
    this.currentPage = page;
    // Fetch data for the new page
  }
}
