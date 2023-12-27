import { Component } from '@angular/core';
import { AuthService } from '../../../lib/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  emailClient: any;
  password: any;
  errorMessage?: string;
  wrong?: boolean;
  
  constructor(private authService: AuthService, private router: Router) {}

  login() {
    this.authService.getLogin(this.emailClient, this.password).subscribe({
      next: (data) => {
        if (data.auth === true) {
          localStorage.setItem("token", data.token);
          this.router.navigate(['/']);
        }
      },
      error: (error) => {
        this.errorMessage = error.error;
        this.wrong = true;
        setTimeout(() => { this.wrong = false; }, 3000);
      },
      complete: () => console.info('Auth completed')
    });
  }
}
