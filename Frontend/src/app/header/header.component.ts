import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginStatusComponent } from '../components/auth/login-status/login-status.component';
import jwt_decode from 'jwt-decode';
import { ClientService } from '../lib/services/client.service';
import { clientModel } from '../lib/models/clientModel';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  token: string | null =  localStorage.getItem('token');
  id: string = '';
  firstName?: string = '';
  lastName?: string = '';
  points?: number = 0;

  constructor(
    private router: Router,
    public loginStatus:LoginStatusComponent,
    private clientService: ClientService) {}

  ngOnInit(): void {
    this.getName()
  }

  getName(): void {
    if (this.token) {
      const decodedToken: any = jwt_decode(this.token);
      this.id = decodedToken.client._id;
      this.clientService.getClientId(this.id).subscribe({
        next: (data: clientModel) => {
          this.firstName = data.firstName;
          this.lastName = data.lastName;
          this.points = data.points;
        },
      });
    }
  }

  toHome(): void{
    this.router.navigate(['/']);
  }
  toProperty(): void{
    this.router.navigate(['/property']);
  }

  toEvent(): void{
    this.router.navigate(['/event']);
  }

  toLogin(): void {
    this.router.navigate(['/login']);
  }

  toSettings(): void {
    this.router.navigate(['/settings']);
  }

  toProfile(): void {
    this.router.navigate(['/profile']);
  }

  toTickets(): void{
    this.router.navigate(['/tickets'])
  }

  logout(): void {
    localStorage.removeItem("token");
    localStorage.removeItem("cart");
    this.router.navigate(['/login']);
  }
}