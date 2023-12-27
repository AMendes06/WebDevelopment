import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { clientModel } from '../models/clientModel';
import { environment } from 'src/environments/environment';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  constructor(private http: HttpClient) { }

  getClientId(id: string): Observable<clientModel>{
    return this.http.get<clientModel>(environment.apiUrl + `clientById/${id}`, httpOptions).pipe(catchError(this.handleError));;
  }

  updateClient(id: string, dataClient: any): Observable<clientModel>{
    return this.http.put<clientModel>(environment.apiUrl + `updateClient/${id}`, dataClient ,httpOptions).pipe(catchError(this.handleError));;
  }

  deleteClient(id: string): Observable<clientModel>{
    return this.http.delete<clientModel>(environment.apiUrl + `deleteClient/${id}` ,httpOptions).pipe(catchError(this.handleError));;
  }

  handleError(error: HttpErrorResponse) {
    return throwError(() => {
      return error;
    });
  }
}
