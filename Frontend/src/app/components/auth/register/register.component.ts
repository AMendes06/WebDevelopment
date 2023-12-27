import { Component } from '@angular/core';
import { AuthService } from '../../../lib/services/auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  firstName: any
  lastName: any
  contact: any
  emailClient: any
  password: any
  nif: any
  errorMessage?: String
  wrong?: boolean


  constructor(private authService: AuthService, private router: Router) {}

  register() {
    this.authService.getRegister(this.firstName, this.lastName, this.contact, this.emailClient, this.password, this.nif).subscribe({
      next: (data) => {
        if(data.auth = true){
          localStorage.setItem('token', data.token);
          this.router.navigate(['/']);
        }
      },
      error: (error) => {
        this.errorMessage = error.error
        this.wrong = true
        setTimeout(()=>{this.wrong=false},3000)
      },
      complete: () => console.info('Auth completed')
    })
  }
}
