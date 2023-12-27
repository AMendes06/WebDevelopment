import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import jwt_decode from 'jwt-decode';
import { clientModel } from 'src/app/lib/models/clientModel';
import { ClientService } from 'src/app/lib/services/client.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
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
  errorMessage?: string;
  wrong?: boolean;
  successMessage: string | null = null;


  constructor(private clientService: ClientService, private router: Router) { }

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

  updateSettings() {
    if (this.token) {
      const decodedToken: any = jwt_decode(this.token);
      this.id = decodedToken.client._id;

      const updatedClientData = {
        firstName: this.firstName,
        lastName: this.lastName,
        emailClient: this.emailClient,
        contact: this.contact,
        nif: this.nif
      };

      this.clientService.updateClient(this.id, updatedClientData).subscribe({
        next: (data) => {
          if (data && data.message) {
            this.successMessage = data.message;
            setTimeout(() => {
              this.successMessage = ''; 
            }, 3000);
          }
        },
        error: (error) => {
            this.errorMessage = error.error;
            this.wrong = true;
            setTimeout(() => { this.wrong = false; }, 3000)
        },
        complete: () => {
          console.info('Settings update completed');
        }
      });
    }
  }

  confirmDeleteAccount(): void {
    if (this.token) {
      const decodedToken: any = jwt_decode(this.token);
      this.id = decodedToken.client._id;
    }
    if (confirm("Are you sure you want to delete your account?")) {
      this.clientService.deleteClient(this.id).subscribe({
        next: (data) => {
          if (data && data.message) {
            this.successMessage = data.message;
            setTimeout(() => {
              this.successMessage = ''; 
            }, 3000);
          }
        },
        error: (error) => {
            this.errorMessage = error.error;
            this.wrong = true;
            setTimeout(() => { this.wrong = false; }, 3000)
        },
        complete: () => {
          console.info('Client Deleted');
          localStorage.removeItem('token')
          window.location.reload()
        }});
    } else {

    }
  }
}
