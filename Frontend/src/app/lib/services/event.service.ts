import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { eventModel } from 'src/app/lib/models/eventModel';
import { environment } from 'src/environments/environment';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class EventService {

  constructor(private http: HttpClient) { }

  getEvent(): Observable<eventModel[]>{
    return this.http.get<eventModel[]>(environment.apiUrl + 'getEvents', httpOptions).pipe(catchError(this.handleError));;
  }

  getEventId(id: string): Observable<eventModel>{
    return this.http.get<eventModel>(environment.apiUrl + `eventByid/${id}`, httpOptions).pipe(catchError(this.handleError));;
  }

  handleError(error: HttpErrorResponse) {
    return throwError(() => {
      return error;
    });
  }
}
