import {Component, inject} from '@angular/core';
import {NgForm} from '@angular/forms';
import {Router} from '@angular/router';
import {AuthenticationService} from '../../services/authentication.service';

@Component({
  selector: 'ums-forget-password',
  standalone: false,
  templateUrl: './forget-password.component.html',
  styleUrl: './forget-password.component.scss'
})
export class ForgetPasswordComponent {

  private _router: Router = inject(Router);
  private _authenticationService: AuthenticationService = inject(
    AuthenticationService
  );

  model = {
    username: '',
  };

  isLoading = false;

  constructor() {
    this._authenticationService.isAuthenticated$
      .subscribe((isAuthenticated) => {
        if (isAuthenticated) {
          this._router.navigate(['/dashboard']);
        }
      });
  }

  onSubmits(form: NgForm) {
    if (form.valid) {
      this.isLoading = true;

      this._authenticationService
        .forgetPasswordRequest(this.model.username)
        .subscribe({
          next: () => {
            this._router.navigate(['/reset-password']);
          },
          error: (error) => {
            console.error('Error sending forget password request', error);
          },
          complete: () => {
            form.resetForm();
            this.isLoading = false;
          },
        });
    }
  }

}
