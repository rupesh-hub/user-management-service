import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

export interface Task {
  id: string;
  title: string;
  description: string;
  assignedDate: Date;
  dueDate: Date;
  status: 'pending' | 'in-progress' | 'completed' | 'overdue';
  priority: 'high' | 'medium' | 'low';
  project: string;
  assignedBy: string;
  progress?: number;
}

@Component({
  selector: 'ums-tasks',
  standalone: false,
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.scss'
})
export class TasksComponent implements OnInit {

  tasks: Task[] = [];
  taskForm!: FormGroup;
  selectedTask: Task | null = null;
  showTaskModal: boolean = false;

  constructor(private fb: FormBuilder) {
  }

  ngOnInit() {
    // Initialize forms
    this.initForms();
    // Update badges
    this.updateTaskBadge();
    this.initMockData();
  }


  initForms(): void {
    // Task Form
    this.taskForm = this.fb.group({
      id: [''],
      title: ['', Validators.required],
      description: ['', Validators.required],
      dueDate: ['', Validators.required],
      priority: ['medium', Validators.required],
      project: ['', Validators.required],
      status: ['pending', Validators.required]
    });
  }

  updateTaskBadge(): void {
    const pendingTasks = this.tasks.filter(task =>
      task.status === 'pending' || task.status === 'overdue'
    ).length;
  }

  initMockData(): void {

    // Mock Tasks
    this.tasks = [
      {
        id: 'task1',
        title: 'Complete Project Documentation',
        description: 'Finalize the documentation for the new feature release',
        assignedDate: new Date('2023-06-01'),
        dueDate: new Date('2023-06-10'),
        status: 'in-progress',
        priority: 'high',
        project: 'Feature Release 2.0',
        assignedBy: 'Jane Smith',
        progress: 65
      },
      {
        id: 'task2',
        title: 'Code Review',
        description: 'Review pull requests for the authentication module',
        assignedDate: new Date('2023-06-03'),
        dueDate: new Date('2023-06-07'),
        status: 'completed',
        priority: 'medium',
        project: 'Authentication Module',
        assignedBy: 'Mike Johnson',
        progress: 100
      },
      {
        id: 'task3',
        title: 'Bug Fixes',
        description: 'Address reported bugs in the dashboard component',
        assignedDate: new Date('2023-06-05'),
        dueDate: new Date('2023-06-12'),
        status: 'pending',
        priority: 'high',
        project: 'Dashboard Enhancement',
        assignedBy: 'Sarah Williams',
        progress: 0
      },
      {
        id: 'task4',
        title: 'Team Meeting',
        description: 'Attend weekly team sync-up meeting',
        assignedDate: new Date('2023-06-02'),
        dueDate: new Date('2023-06-09'),
        status: 'completed',
        priority: 'low',
        project: 'Team Collaboration',
        assignedBy: 'Team Lead',
        progress: 100
      },
      {
        id: 'task5',
        title: 'Performance Optimization',
        description: 'Optimize database queries for better performance',
        assignedDate: new Date('2023-06-04'),
        dueDate: new Date('2023-06-14'),
        status: 'in-progress',
        priority: 'medium',
        project: 'Performance Enhancement',
        assignedBy: 'Database Admin',
        progress: 40
      },
      {
        id: 'task6',
        title: 'API Documentation',
        description: 'Update API documentation with new endpoints',
        assignedDate: new Date('2023-05-28'),
        dueDate: new Date('2023-06-05'),
        status: 'overdue',
        priority: 'high',
        project: 'API Development',
        assignedBy: 'Product Manager',
        progress: 75
      }
    ];
  }

  openTaskModal(task: Task | null = null): void {
    this.selectedTask = task;

    if (task) {
      // Edit existing task
      this.taskForm.patchValue({
        id: task.id,
        title: task.title,
        description: task.description,
        dueDate: task.dueDate,
        priority: task.priority,
        project: task.project,
        status: task.status
      });
    } else {
      // Create new task
      this.taskForm.reset({
        id: '',
        title: '',
        description: '',
        dueDate: '',
        priority: 'medium',
        project: '',
        status: 'pending'
      });
    }

    this.showTaskModal = true;
  }

  closeTaskModal(): void {
    this.showTaskModal = false;
    this.selectedTask = null;
  }


  saveTask(): void {
    if (this.taskForm.invalid) {
      // Mark all fields as touched to show validation errors
      Object.keys(this.taskForm.controls).forEach(key => {
        this.taskForm.get(key)?.markAsTouched();
      });
      return;
    }

    const formValues = this.taskForm.value;

    // Simulate API call
    setTimeout(() => {
      if (formValues.id) {
        // Update existing task
        const index = this.tasks.findIndex(t => t.id === formValues.id);
        if (index !== -1) {
          this.tasks[index] = {
            ...this.tasks[index],
            ...formValues,
            progress: formValues.status === 'completed' ? 100 :
              formValues.status === 'pending' ? 0 :
                this.tasks[index].progress || 50
          };
        }
      } else {
        // Create new task
        const newTask: Task = {
          ...formValues,
          id: `task${this.tasks.length + 1}`,
          assignedDate: new Date(),
          assignedBy: 'System',
          progress: formValues.status === 'completed' ? 100 :
            formValues.status === 'pending' ? 0 : 50
        };

        this.tasks.push(newTask);
      }

      // Update badge
      this.updateTaskBadge();

      // Close modal
      this.closeTaskModal();

    }, 800);
  }

  deleteTask(id: string): void {
    // Simulate API call
    setTimeout(() => {
      const index = this.tasks.findIndex(t => t.id === id);
      if (index !== -1) {
        this.tasks.splice(index, 1);
      }

      // Update badge
      this.updateTaskBadge();
    }, 800);
  }

  getBadgeClass(priority: string): string {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border border-red-200';
      case 'medium':
        return 'bg-amber-100 text-amber-800 border border-amber-200';
      case 'low':
        return 'bg-green-100 text-green-800 border border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border border-green-200';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800 border border-blue-200';
      case 'pending':
        return 'bg-amber-100 text-amber-800 border border-amber-200';
      case 'overdue':
        return 'bg-red-100 text-red-800 border border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  }

}
