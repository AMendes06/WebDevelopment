import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { propertyModel } from 'src/app/lib/models/propertyModel';
import { environment } from 'src/environments/environment';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class PropertyService {

  constructor(private http: HttpClient) { }
  
  getProperty(): Observable<propertyModel[]>{
    return this.http.get<propertyModel[]>(environment.apiUrl + 'getProperties', httpOptions).pipe(catchError(this.handleError));;
  }

  getEventsFromProperty(propertyName:string): Observable<any>{
    return this.http.get(environment.apiUrl + `eventsByProperty/${propertyName}`, httpOptions).pipe(catchError(this.handleError));
  }

  handleError(error: HttpErrorResponse) {
    return throwError(() => {
      return error;
    });
  }
}
