import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { tap, map, take } from 'rxjs/operators';
import { User } from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class AdminAuthGuard implements CanActivate {
  authService: any;
  user$: Observable<User>;

  constructor(private auth:AuthService, private route: Router){}

canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
  if ( this.authService.canDelete(this.user$)) {
    return true;

  } else {
    this.route.navigate(['/login']);
    return false;
  }
  }
}
