import {Component, OnInit} from '@angular/core';

export interface Performance {
  overallRating: number;
  taskCompletion: number;
  attendance: number;
  qualityOfWork: number;
  teamwork: number;
  monthlyPerformance: {
    month: string;
    rating: number;
  }[];
  reviews: {
    id: string;
    reviewer: string;
    date: Date;
    rating: number;
    comments: string;
  }[];
  skills: {
    name: string;
    rating: number;
  }[];
  goals: {
    id: string;
    title: string;
    description: string;
    dueDate: Date;
    progress: number;
  }[];
}

@Component({
  selector: 'ums-performances',
  standalone: false,
  templateUrl: './performances.component.html',
  styleUrl: './performances.component.scss'
})
export class PerformancesComponent implements OnInit {

  performance!: Performance;

  ngOnInit(): void {
    this.performance = {
      overallRating: 4.2,
      taskCompletion: 85,
      attendance: 95,
      qualityOfWork: 4.0,
      teamwork: 4.5,
      monthlyPerformance: [
        { month: 'January', rating: 4.0 },
        { month: 'February', rating: 4.1 },
        { month: 'March', rating: 4.3 },
        { month: 'April', rating: 4.2 },
        { month: 'May', rating: 4.4 },
        { month: 'June', rating: 4.2 }
      ],
      reviews: [
        {
          id: 'review1',
          reviewer: 'Jane Smith',
          date: new Date('2023-03-15'),
          rating: 4.5,
          comments: 'Excellent work on the authentication module. Code was clean and well-documented.'
        },
        {
          id: 'review2',
          reviewer: 'Mike Johnson',
          date: new Date('2023-05-20'),
          rating: 4.0,
          comments: 'Good job on the dashboard component. Some minor improvements could be made for performance.'
        }
      ],
      skills: [
        { name: 'Technical Knowledge', rating: 92 },
        { name: 'Problem Solving', rating: 88 },
        { name: 'Communication', rating: 85 },
        { name: 'Teamwork', rating: 90 },
        { name: 'Leadership', rating: 78 },
        { name: 'Time Management', rating: 82 }
      ],
      goals: [
        {
          id: 'goal1',
          title: 'Complete Advanced React Training',
          description: 'Finish the advanced React course and apply knowledge to current projects',
          dueDate: new Date('2023-07-30'),
          progress: 75
        },
        {
          id: 'goal2',
          title: 'Improve Code Review Response Time',
          description: 'Reduce average code review response time to under 24 hours',
          dueDate: new Date('2023-08-15'),
          progress: 60
        },
        {
          id: 'goal3',
          title: 'Mentor Junior Developers',
          description: 'Provide mentorship to at least two junior developers',
          dueDate: new Date('2023-12-31'),
          progress: 90
        }
      ]
    };
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

}
