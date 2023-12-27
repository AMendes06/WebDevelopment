import { CartService } from 'src/app/lib/services/cart.service';
import { Component, OnInit } from '@angular/core';
import { TicketsService } from 'src/app/lib/services/tickets.service';
import { loadStripe } from '@stripe/stripe-js';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cart: any;
  errorMessage?: string;
  wrong?: boolean;

  constructor(
    private ticketService: TicketsService,
    private cartService: CartService
  ) { }

  ngOnInit() {
    this.getCartFromLocalStorage();
  }

  getCartFromLocalStorage() {
    const cartData = localStorage.getItem('cart');
    if (cartData) {
      this.cart = JSON.parse(cartData);
    }
  }

  toUsePoints() {
    const cartData = localStorage.getItem('cart');
  
    if (cartData) {
      const cart = JSON.parse(cartData);
      cart.usePoints = this.cart.usePoints;
  
      if (cart.usePoints) {
        cart.pointsToSpend = this.cart.pointsToSpend;
      } else {
        cart.pointsToSpend = 0;
      }
  
      const updatedCartData = JSON.stringify(cart);
      localStorage.setItem('cart', updatedCartData);
  
      this.cartService.pointsDiscout(cart).subscribe({
        next: (response) => {
          const updatedTickets = response.tickets;
          cart.tickets = updatedTickets;
  
          const totalPrice = updatedTickets.reduce((total: number, ticket: { price: number; quantity: number; }) => total + (ticket.price * ticket.quantity), 0);
          cart.totalPrice = totalPrice;
  
          const updatedCartData = JSON.stringify(cart);
          localStorage.setItem('cart', updatedCartData);
  
          window.location.reload();
        },
        error: (error) => {
          this.errorMessage = error.error;
          this.wrong = true;
          setTimeout(() => { this.wrong = false; }, 3000);
        }
      });
    }
  }
  
  
  checkoutCart() {
    const cartData = localStorage.getItem('cart');
    if (!cartData) {
      return;
    }
    const { emailClient, tickets, totalPrice } = JSON.parse(cartData);
    const requestData = {
      emailClient: emailClient,
      tickets: tickets || [],
      totalPrice: totalPrice
    };
    this.ticketService.payment(requestData).subscribe(async (res: any) => {
        const stripe = await loadStripe('pk_test_51NH70CCtH88rjNYBWz8Tufy4X8InLiYNnOVYdr7HrBKZeNQLqTAzVTqD9xXD4CRi3qXmbDdKfkJzn0vb8cPULZ6V00nu2ZP93G');
        if (stripe) {
          stripe.redirectToCheckout({
            sessionId: res.sessionId,
          })
        }
      });
  }
  
  cancelCart() {
    localStorage.removeItem('cart');
    window.location.reload()
  }
}
