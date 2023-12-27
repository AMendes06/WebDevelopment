import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from 'src/app/lib/services/cart.service';
import { TicketsService } from 'src/app/lib/services/tickets.service';

@Component({
  selector: 'app-success',
  templateUrl: './success.component.html',
  styleUrls: ['./success.component.css']
})
export class SuccessComponent implements OnInit {
  cart: any;
  errorMessage?: string;
  wrong?: boolean;

  constructor(
    private ticketService: TicketsService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.ifSuccess();
  }

  ifSuccess() {
    const cartData = localStorage.getItem('cart');
    this.ticketService.checkout(cartData).subscribe();
    localStorage.removeItem('cart');
    this.router.navigate(['/tickets'])
  }
}
