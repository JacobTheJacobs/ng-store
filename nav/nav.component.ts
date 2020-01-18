import { Component, OnInit, Output, EventEmitter,OnDestroy } from "@angular/core";
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: "app-nav",
  templateUrl: "./nav.component.html",
  styleUrls: ["./nav.component.css"]
})
export class NavComponent implements OnInit, OnDestroy {
  @Output() public sidenavToggle = new EventEmitter();

   isAuth = false;
   authSubsription: Subscription;

  constructor(private auth: AuthService) {}

  ngOnInit() {
    this.authSubsription = this.auth.authChange.subscribe(// storing the subscription
      authStatus => {this.isAuth = authStatus;}
      );
  }

  
  ngOnDestroy() {
    this.authSubsription.unsubscribe(); // removes unneedded memory
  }

  public onToggleSidenav = () => {
    this.sidenavToggle.emit();
  };

  onLogout() {
   this.auth.logout();
  }
}
