import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  constructor(private http: HttpClient) { }

  getLogin(emailClient: string, password: string): Observable<any> {
    return this.http.post(environment.apiUrl + 'loginAPI', new LoginModel(emailClient, password), httpOptions).pipe(catchError(this.handleError));
  }

  getRegister(firstName: string, lastName: string, contact: number, emailClient: string, password: string, nif: number): Observable<any> {
    return this.http.post(environment.apiUrl + 'registerAPI', new RegisterModel(firstName, lastName, contact, emailClient, password, nif), httpOptions).pipe(catchError(this.handleError));
  }

  handleError(error: HttpErrorResponse) {
    return throwError(() => {
      return error;
    });
  }
}

export class LoginModel {
  constructor(public emailClient: string, public password: string) { }
}

export class RegisterModel {
  constructor(public firstName: string, public lastName: string, public contact: number, public emailClient: string, public password: string, public nif: number) { }
}
