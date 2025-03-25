import {HttpClient} from '@angular/common/http';
import {Injectable, inject} from '@angular/core';
import {Router} from '@angular/router';

import {
  BehaviorSubject,
  Observable,
  catchError,
  map,
  of,
  tap,
} from 'rxjs';
import {environment} from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  isAuthenticated$: Observable<boolean> = this.isAuthenticatedSubject.asObservable();

  public authenticatedUser$ = new BehaviorSubject<any>({});

  private router: Router = inject(Router);
  private httpClient: HttpClient = inject(HttpClient);
  private BASE_URL = `${environment.API_URL}/authentication`;

  constructor() {
    this.checkAuthStatus();
  }

  public login = (username: string, password: string): Observable<boolean> => {
    return this.httpClient
      .post<any>(`${this.BASE_URL}/login`, {
        username,
        password,
      })
      .pipe(
        tap({
          next: (response) => {
            const data = response.data;
            if (data && data.access_token) {
              this.storeToLocalStorage(data);
              this.isAuthenticatedSubject.next(true);
              if (data.roles.includes("admin"))
                this.router.navigate(['/admin']);
              else
                this.router.navigate(['/users']);
            } else {
              this.isAuthenticatedSubject.next(false);
            }
          },
          error: (err) => {
            console.error('Login failed', err);
            this.isAuthenticatedSubject.next(false);
          },
        })
      );
  }

  private checkAuthStatus = (): void => {
    const token = localStorage.getItem('access_token');
    this.isAuthenticatedSubject.next(!!token);
  }

  public isAuthenticated = (): Observable<boolean> => {
    return this.isAuthenticated$;
  }

  public forgetPasswordRequest = (username: string): Observable<any> => {
    return this.httpClient
      .get(`${this.BASE_URL}/forgot-password?username=${username}`)
      .pipe(
        map((response) => {
          return response;
        }),
        catchError((err) => {
          console.error('Forget password request failed', err);
          return of(null);
        })
      );
  };

  public validateOTP = (token: string): Observable<boolean> => {
    const username = localStorage.getItem('username');
    return this.httpClient
      .get(`${this.BASE_URL}/validate-confirmation-token?token=${token}&type=ACCOUNT_ACTIVATED&username=${username}`)
      .pipe(
        map((response) => {
          return !!response;
        }),
        catchError((err) => {
          console.error('OTP validation failed', err);
          return of(false);
        })
      );
  };

  public resendConfirmationToken = (username: string) => {
    return this.httpClient
      .get(`${this.BASE_URL}/resend-confirmation-token?username=${username}`)
      .pipe(
        map((response) => {
          return response;
        }),
        catchError((err) => {
          console.error('Resend confirmation token failed', err);
          return of(null);
        })
      );
  }


  public resetPassword = (
    password: string,
    confirmPassword: string,
    token: string,
    username: string
  ): Observable<boolean> => {
    return this.httpClient
      .post(`${this.BASE_URL}/reset-password`, {
        password,
        confirmPassword,
        token,
        username
      })
      .pipe(
        map((response) => {
          return !!response;
        }),
        catchError((err) => {
          console.error('Password reset failed', err);
          return of(false);
        })
      );
  };

  public register = (formData: any): Observable<any> => {
    return this.httpClient.post(
      `${this.BASE_URL}/register`,
      formData
    );
  };


  public logout = () => {
    localStorage.clear();
    this.isAuthenticatedSubject.next(false);
    this.router.navigate(['/login']);
  }

  private storeToLocalStorage = (response: any): void => {
    if (response.access_token) localStorage.setItem('access_token', response.access_token);
    localStorage.setItem('name', response.name);
    localStorage.setItem('email', response.email);
    localStorage.setItem('username', response.username);
    localStorage.setItem('profile', response.profile);

    this.authenticatedUser$.next({
      name: localStorage.getItem('name'),
      email: localStorage.getItem('email'),
      username: localStorage.getItem('username'),
      profile: localStorage.getItem('profile'),
    });
  };

}
