import {Component, inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {AuthenticationService} from '../../services/authentication.service';
import {filter, take} from 'rxjs/operators';
import {JwtTokenValidatorService} from '../../services/jwt-token-validator.service';

@Component({
  selector: 'ums-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  errorMessage: string = '';
  private router: Router = inject(Router);
  protected isAuthenticated: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private _authenticationService: AuthenticationService,
    private _jwtTokenValidatorService: JwtTokenValidatorService
  ) {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this._authenticationService.isAuthenticated$
      .pipe(take(1))
      .subscribe((isLogged: boolean) => {
        if (isLogged) {
          this.isAuthenticated = true;
          const authorities = this._jwtTokenValidatorService.getAuthorities();
          if (authorities.includes("admin"))
            this.router.navigate(['/admin']);
          else
            this.router.navigate(['/users']);
        }
      });
  }

  protected onLogin = () => {
    if (this.loginForm.valid) {
      const {username, password} = this.loginForm.value;
      this._authenticationService.login(username, password).subscribe({
        next: (response: boolean) => {
          if (response && response === true) this.isAuthenticated = true;
        },
        error: (error) => {
          this.errorMessage = error.error.message;
          this.loginForm.reset();
        },
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }

  protected loginWithGoogle = () => {
    console.log('Logging in with Google');
  };

  protected loginWithGitHub = () => {
    console.log('Logging in with GitHub');
  };

  protected navigateToRegister = () => {
    this.router.navigate(['/register']);
  }

  protected navigateToForgetPassword = () => {
    this.router.navigate(['/forgot-password']);
  }


}
