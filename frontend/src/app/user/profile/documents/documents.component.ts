import {Component, OnInit} from '@angular/core';

export interface Document {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadDate: Date;
  category: string;
  url: string;
}

@Component({
  selector: 'ums-documents',
  standalone: false,
  templateUrl: './documents.component.html',
  styleUrl: './documents.component.scss'
})
export class DocumentsComponent implements OnInit {

  documents: Document[] = [];

  ngOnInit() {
    this.documents = [
      {
        id: 'doc1',
        name: 'Project Requirements.pdf',
        type: 'pdf',
        size: 2048576, // 2MB
        uploadDate: new Date('2023-05-15'),
        category: 'Project',
        url: '#'
      },
      {
        id: 'doc2',
        name: 'Employee Handbook.pdf',
        type: 'pdf',
        size: 5242880, // 5MB
        uploadDate: new Date('2023-04-10'),
        category: 'HR',
        url: '#'
      },
      {
        id: 'doc3',
        name: 'API Documentation.docx',
        type: 'docx',
        size: 1048576, // 1MB
        uploadDate: new Date('2023-06-01'),
        category: 'Technical',
        url: '#'
      },
      {
        id: 'doc4',
        name: 'Performance Review Template.xlsx',
        type: 'xlsx',
        size: 524288, // 512KB
        uploadDate: new Date('2023-05-20'),
        category: 'HR',
        url: '#'
      },
      {
        id: 'doc5',
        name: 'Project Timeline.png',
        type: 'png',
        size: 2097152, // 2MB
        uploadDate: new Date('2023-05-25'),
        category: 'Project',
        url: '#'
      }
    ];
  }

  uploadDocument(event: any): void {
    const file = event.target.files[0];
    if (file) {
      // Simulate API call
      setTimeout(() => {
        const newDocument: Document = {
          id: `doc${this.documents.length + 1}`,
          name: file.name,
          type: file.name.split('.').pop() || '',
          size: file.size,
          uploadDate: new Date(),
          category: 'Other',
          url: URL.createObjectURL(file)
        };

        this.documents.push(newDocument);
      }, 1000);
    }
  }

  deleteDocument(id: string): void {
    // Simulate API call
    setTimeout(() => {
      const index = this.documents.findIndex(d => d.id === id);
      if (index !== -1) {
        this.documents.splice(index, 1);
      }
    }, 800);
  }


  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }


}
