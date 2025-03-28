import { Component } from '@angular/core';
import { Router} from '@angular/router';

@Component({
  selector: 'ums-unauthorized',
  standalone: false,
  templateUrl: './unauthorized.component.html',
  styleUrl: './unauthorized.component.scss'
})
export class UnauthorizedComponent {

  constructor(private router: Router) {}

  goToHome() {
    this.router.navigate(['/']);
  }

}
