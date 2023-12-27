import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class CartService {

  constructor(private http: HttpClient) { }

  sendCart(ticketData: any): Observable<any>{
    return this.http.post<any>(environment.apiUrl + 'handleCart',ticketData ,httpOptions).pipe(catchError(this.handleError));
  }

  pointsDiscout(cartData: any): Observable<any> {
    return this.http.post<any>(environment.apiUrl + 'discountPoints', cartData, httpOptions).pipe(catchError(this.handleError));
  }
  

  handleError(error: HttpErrorResponse) {
    return throwError(() => {
      return error;
    });
  }
}
