import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {Message} from './model/message.model';
import {environment} from '../../environments/environment.development';
import {catchError} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  private BASE_URL: string = `${environment.API_URL}/messages`;

  constructor(private _http: HttpClient) {
  }

  public message(): Observable<Message> {
    const headers = new HttpHeaders().set('Accept', 'application/json');
    return this._http.get<Message>(this.BASE_URL, { headers }).pipe(
      catchError((error) => {
        console.error('Error getting message:', error);
        return throwError(() => new Error('Failed to fetch message. Please try again later.'));
      })
    );
  }

}
