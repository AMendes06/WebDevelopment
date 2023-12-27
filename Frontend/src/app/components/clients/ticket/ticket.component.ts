import { Component, OnInit } from '@angular/core';
import { TicketsService } from 'src/app/lib/services/tickets.service';
import jwt_decode from 'jwt-decode';


@Component({
  selector: 'app-ticket',
  templateUrl: './ticket.component.html',
  styleUrls: ['./ticket.component.css']
})
export class TicketComponent implements OnInit {
  token: string | null = localStorage.getItem('token');
  emailClient: string = '';
  tickets?: any[];
  errorMessage?: string;
  wrong?: boolean;
  recipientEmail: any
  id?: string;
  successMessage: string | null = null;

  constructor(private ticketService: TicketsService) { }

  ngOnInit() {
    this.ticketsClient()
  }

  ticketsClient() {
    if (this.token) {
      const decodedToken: any = jwt_decode(this.token);
      this.emailClient = decodedToken.client.emailClient;
    }
    this.ticketService.getTicketToClient(this.emailClient).subscribe({
      next: (data) => {
        this.tickets = data;
      },
      error: (error) => {
        this.errorMessage = error.error;
        this.wrong = true;
        setTimeout(() => { this.wrong = false; }, 3000);
      },
      complete: () => console.info('')
    });
  }
  
  generateTicketNumber() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let ticketNumber = 'TICKET-';
    for (let i = 0; i < 6; i++) {
      ticketNumber += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return ticketNumber;
  }

  generateSeatInfo() {
    const sections = ['A', 'B', 'C', 'D'];
    const rows = ['1', '2', '3', '4', '5'];
    const seats = ['1', '2', '3', '4', '5', '6'];
    const randomSection = sections[Math.floor(Math.random() * sections.length)];
    const randomRow = rows[Math.floor(Math.random() * rows.length)];
    const randomSeat = seats[Math.floor(Math.random() * seats.length)];
    return `Section ${randomSection}, Row ${randomRow}, Seat ${randomSeat}`;
  }

  generateSubTickets(ticket: { tickets: any[]; }) {
    const subTickets = [];
    const quantity = ticket.tickets[0].quantity;

    for (let i = 0; i < quantity; i++) {
      const subTicket = {
        ...ticket.tickets[0],
        quantity: 1
      };

      subTickets.push(subTicket);
    }
    return subTickets;
  }
}