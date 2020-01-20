import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { AuthService } from './auth.service';
import { tap, map, take, switchMap } from 'rxjs/operators';
import { User } from '../user';


@Injectable()
export class AdminAuthGuard implements CanActivate {

  constructor(private auth: AuthService, private route: Router) {}



  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    const currentUser = this.auth.currentUser;
    if (currentUser) {
      // check if the route is retricted by role
      if (next.data.roles && next.data.roles.indexOf(currentUser.roles) === -1) {
        // role not authorized
        this.route.navigate(['/login']);

      } else {
        return true;
      }
    }

  }
}
