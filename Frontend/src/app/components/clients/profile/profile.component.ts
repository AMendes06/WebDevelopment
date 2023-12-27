import { Component, OnInit } from '@angular/core';
import jwt_decode from 'jwt-decode';
import { clientModel } from 'src/app/lib/models/clientModel';
import { ClientService } from 'src/app/lib/services/client.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  activeTab: string = 'account';

  setActiveTab(tab: string) {
    this.activeTab = tab;
  }

  token: string | null = localStorage.getItem('token');
  id: string = '';
  firstName?: string = '';
  lastName?: string = '';
  emailClient?: string = '';
  contact?: number = 0;
  nif?: number = 0;

  constructor(private clientService: ClientService) { }

  ngOnInit(): void {
    this.getClient()
  }

  getClient(): void {
    if (this.token) {
      const decodedToken: any = jwt_decode(this.token);
      this.id = decodedToken.client._id;
      this.clientService.getClientId(this.id).subscribe({
        next: (data: clientModel) => {
          this.firstName = data.firstName;
          this.lastName = data.lastName;
          this.emailClient = data.emailClient;
          this.contact = data.contact;
          this.nif = data.nif;
        },
      });
    }
  }
}
