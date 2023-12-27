import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { eventModel } from 'src/app/lib/models/eventModel';
import { EventService } from 'src/app/lib/services/event.service';
import jwt_decode from 'jwt-decode';
import { CartService } from 'src/app/lib/services/cart.service';

@Component({
  selector: 'app-event-details',
  templateUrl: './event-details.component.html',
  styleUrls: ['./event-details.component.css']
})
export class EventDetailsComponent implements OnInit {
  event?: eventModel | undefined;
  selectedTicketType?: string;
  ticketQuantity?: number;
  token: string | null = localStorage.getItem('token');
  emailClient?: string
  cartHandle?: any[] = []
  errorMessage?: string;
  wrong?: boolean;

  constructor(
    private eventService: EventService,
    private route: ActivatedRoute,
    private cartService: CartService
  ) { }

  ngOnInit() {
    this.getEventtt()
  }

  getEventtt() {
    const eventId = this.route.snapshot.params['id'];
    this.eventService.getEventId(eventId).subscribe(
      (event) => {
        this.event = event;
        console.log(this.event);
      },
      (error: any) => {
        console.error(error);
      }
    );
  }

  createTicket() {
    if (this.token) {
      const decodedToken: any = jwt_decode(this.token);
      this.emailClient = decodedToken.client.emailClient;
    }
    let cartData = localStorage.getItem("cart");
    let existingCart = cartData ? JSON.parse(cartData) : { tickets: [] };
    // Check if a ticket with the same event and type already exists in the cart
    const existingTicketIndex = existingCart.tickets.findIndex(
      (ticket: { event: string | undefined; type: string | undefined; }) => ticket.event === this.event?.name && ticket.type === this.selectedTicketType
    );
    if (existingTicketIndex !== -1) {
      // Increase the quantity of the existing ticket
      existingCart.tickets[existingTicketIndex].quantity += this.ticketQuantity;
    } else {
      // Create a new ticket
      const newTicket = {
        event: this.event?.name,
        type: this.selectedTicketType,
        quantity: this.ticketQuantity
      };
      existingCart.tickets.push(newTicket);
    }
    const ticketData = {
      emailClient: this.emailClient,
      tickets: existingCart.tickets
    };
    this.cartService.sendCart(ticketData).subscribe({
      next: (response) => {
        this.cartHandle = response;
        localStorage.setItem("cart", JSON.stringify(this.cartHandle));
        window.location.reload()
      },
      error: (error) => {
        this.errorMessage = error.error;
        this.wrong = true;
        setTimeout(() => { this.wrong = false; }, 3000);
      },
      complete: () => console.info('cart completed')
    });
  }
}
