import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.css']
})
export class SideNavComponent implements OnInit {
  @Output() sidenavClose = new EventEmitter();

isAuth = false;
authSubsription: Subscription; //for subscribing and un unsuscribe
  
    constructor(private auth: AuthService) {

    }

  ngOnInit() {
    this.authSubsription = this.auth.authChange.subscribe(
      // storing the subscription
      authStatus => {
        this.isAuth = authStatus;
      }
    );
  }

  public onSidenavClose = () => {
    this.sidenavClose.emit();
  }

  onLogout() {
    this.auth.logout();
  }

}
