import {Component, inject, OnInit} from '@angular/core';
import {MessageService} from '../message.service';

@Component({
  selector: 'ums-message',
  standalone: false,
  templateUrl: './message.component.html',
  styleUrl: './message.component.scss'
})
export class MessageComponent implements OnInit {

  protected message: any;

  private _messageService: MessageService = inject(MessageService);

  ngOnInit(): void {
    this._messageService
      .message()
      .subscribe({
        next: (msg) => {
          this.message = msg
        },
        error: (error) => console.error('Error retrieving message:', error)
      })
  }

}
