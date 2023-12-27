import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { LoginStatusComponent } from 'src/app/components/auth/login-status/login-status.component';

@Injectable({
  providedIn: 'root'
})
export class LoginStatusGuard implements CanActivate {
  constructor(private LoginStatus: LoginStatusComponent, private router: Router) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.LoginStatus.getStatus() == false) {
      this.router.navigate(['/login'])
      return false
    }
    return true;
  }

}
