import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {catchError, Observable, throwError} from 'rxjs';
import {map} from 'rxjs/operators';
import {environment} from '../../environments/environment.development';
import {GlobalResponse, User} from './model/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private BASE_URI = `${environment.API_URL}/users`;
  constructor(private _http: HttpClient) {
  }

  public userByUsername = (username: string): Observable<User | any> => {
    return this._http.get<any>(`${this.BASE_URI}/by.username/${username}`)
      .pipe(
        map((response: GlobalResponse<User>) => {
          if (response.code == '200' || response.status == 'SUCCESS') {
            const user = response.data;

            if (user.enabled)
              user.status = 'active';

            user.position = 'Senior Software Engineer';
            user.department = 'Engineering';
            user.employeeId = 'EMP-2023-001';
            user.joinDate = new Date('2023-01-15');
            user.phone = '+1 (555) 123-4567';
            user.location = 'New York, USA';
            user.bio = 'Experienced software developer with a passion for creating efficient and scalable applications.';
            user.verified = true;
            user.about = {
              address: '123 Tech Street',
              city: 'New York',
              country: 'USA',
              education: 'Master of Computer Science',
              languages: ['English', 'Spanish'],
              skills: ['JavaScript', 'Angular', 'Node.js', 'TypeScript', 'MongoDB']
            }
            return user;
          } else {
            return throwError('User not found');
          }
        }),
        catchError(err => {
          console.error('Error fetching user:', err);
          return throwError(err);
        })
      );
  }

}
