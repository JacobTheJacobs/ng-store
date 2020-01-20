import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import {
  AngularFirestore,
  AngularFirestoreCollection,

} from '@angular/fire/firestore';

import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { User } from '../user';
import { first } from 'rxjs/operators';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private userCollection: AngularFirestoreCollection<User>;
  private users: Observable<User[]>;

  private isAuthenticated = false;
  authChange = new Subject<boolean>();



  public currentUser: any;
  public userStatus: string;
  public userStatusChanges: BehaviorSubject<string> = new BehaviorSubject<string>(this.userStatus);
  



  setUserStatus(userStatus: any): void {
    this.userStatus = userStatus;
    this.userStatusChanges.next(userStatus);
  }



  constructor(
    private db: AngularFirestore,
    private afAuth: AngularFireAuth,
    public router: Router
  ) {
    this.userCollection = db.collection<User>('users');
    this.users = this.userCollection.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;

          return { id, ...data };
        });
      })
    );
  }




registerUser(value) {
    return new Promise<any>((resolve, reject) => {
      this.afAuth.auth
        .createUserWithEmailAndPassword(value.email, value.password)
        .then(
          res => {
            console.log('User id after reigstration = ' + res.user.uid);
            const user: User = {
              email: value.email,
              id: res.user.uid,
              name: value.name,
              password: value.password,
               roles: {
                   subscriber: true
                    },
                balance: 0
            };
            this.userCollection.doc(res.user.uid).set(user);
            resolve(res);
          },
          err => {
            alert(err);
          }
        );
    });
  }



isAuth() {

    return this.isAuthenticated;
  }


login(email: string, password: string) {
    this.afAuth.auth
      .signInWithEmailAndPassword(email, password)
      .then(user => {
 this.db.collection("users").ref.where("email", "==", user.user.email).onSnapshot(snap =>{
          snap.forEach(userRef => {
            console.log("userRef", userRef.data());
            this.currentUser = userRef.data();
            this.setUserStatus(this.currentUser)
            if(userRef.data().role === "admin") {
              this.router.navigate(["/admin"]);
              this.isAuthenticated = true;
              this.authChange.next(true);
            }else{
              this.router.navigate(["/home"]);
              this.isAuthenticated = true;
              this.authChange.next(true);
            }
          })
        })
       
      }).catch(err => err)
  }

logout() {
    this.authChange.next(false);
    this.router.navigate(['/login']);
    this.isAuthenticated = false;
  


}
}
