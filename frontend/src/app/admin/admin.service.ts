import {Injectable, inject} from '@angular/core';
import {environment} from '../../environments/environment.development';
import {HttpClient, HttpParams} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {catchError, throwError} from 'rxjs';

interface UserFilterParams {
  page?: number;
  size?: number;
  search?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  username?: string;
  active?: boolean;
  createdAfter?: string; // ISO date string
  createdBefore?: string; // ISO date string
  sortBy?: string;
  sortDirection?: 'ASC' | 'DESC';
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private BASE_URL: string = `${environment.API_URL}/users`;
  private _http: HttpClient = inject(HttpClient);

  constructor() {
  }

  getUsers(filterParams: UserFilterParams = {}) {
    // Set default values
    const params = {
      page: filterParams.page || 0,
      size: filterParams.size || 10,
      sortBy: filterParams.sortBy || 'createdOn',
      sortDirection: filterParams.sortDirection || 'DESC',
      ...filterParams // Spread the remaining filter params
    };

    // Convert to HttpParams
    let httpParams = new HttpParams();
    for (const key in params) {
      if (params[key] !== undefined && params[key] !== null) {
        httpParams = httpParams.set(key, params[key].toString());
      }
    }

    return this._http.get<any>(this.BASE_URL, { params: httpParams }).pipe(
      map((response: any) => {
        if (response.code === '200' && response.status === 'SUCCESS') {
          return {
            users: response.data.map(user => this.transformUser(user)),
            pagination: response.page
          };
        }
        throw new Error(response.message || 'Failed to fetch users');
      }),
      catchError(err => {
        console.error('Error fetching users:', err);
        return throwError(() => new Error('Failed to load users. Please try again later.'));
      })
    );
  }

  private transformUser(user: any): any {
    return {
      id: user.userId,  // Add this line
      name: `${user.firstName} ${user.lastName}`,
      email: user.email,
      username: user.username,
      roles: user.roles?.map((role: any) => role.name) || [],
      status: user.enabled ? 'Active' : 'Inactive',
      dateAdded: user.profile?.createdOn || new Date().toISOString(),
      lastActive: user.profile?.modifiedOn || new Date().toISOString(),
      avatar: user.profile?.path || '',
      initials: `${user.firstName?.charAt(0) || ''}${user.lastName?.charAt(0) || ''}`.toUpperCase(),
      initialsColor: this.generateRandomColor()
    };
  }

  private generateRandomColor(): string {
    return `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;
  }
}
