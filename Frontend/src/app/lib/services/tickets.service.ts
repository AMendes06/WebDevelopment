import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TicketsService {

  private getHttpOptions(): any {
    const token = localStorage.getItem('token'); 
    const httpOptions = {
      headers: new HttpHeaders({ 
      'Content-Type': 'application/json', 
      'Authorization': token ? `Bearer ${token}` : '' }), withCredentials: true
    }; return httpOptions;
  }

  constructor(private http: HttpClient) { }

  getTickets(): Observable<any> {
    return this.http.get(environment.apiUrl + 'getTickets', this.getHttpOptions()).pipe(catchError(this.handleError));
  }

  getTicketToClient(emailClient:string): Observable<any>{
    return this.http.get(environment.apiUrl + `ticketsByClient/${emailClient}`, this.getHttpOptions()).pipe(catchError(this.handleError));
  }

  checkout(cartData :any): Observable<any>{
    return this.http.post(environment.apiUrl + 'checkoutCart', cartData ,this.getHttpOptions()).pipe(catchError(this.handleError));
  }

  payment(cartData :any): Observable<any>{
    return this.http.post(environment.apiUrl + 'payment', cartData ,this.getHttpOptions()).pipe(catchError(this.handleError));
  }

  sendTicket(id: string, emailClient: string): Observable<any> {
    return this.http.put(environment.apiUrl + `sendTicket/${id}`, { emailClient }, this.getHttpOptions()).pipe(catchError(this.handleError));
  }

  handleError(error: HttpErrorResponse) {
    return throwError(() => {
      return error;
    });
  }
}
