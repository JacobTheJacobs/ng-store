import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import {
  AngularFirestore,
  AngularFirestoreCollection
} from '@angular/fire/firestore';

import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
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
  user$: Observable<User>;

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
                   admin: true
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





  // tslint:disable-next-line: adjacent-overload-signatures
   isAuth() {
    return this.isAuthenticated;
  }



  login(email: string, password: string) {
    this.afAuth.auth
      .signInWithEmailAndPassword(email, password)
      .then(value => {
        console.log('Nice, it worked!');

        this.isAuthenticated = true;
        this.authChange.next(true);

        this.router.navigate(['home']);
      })
      .catch(err => {
        console.log('Something went wrong:', err.message);
      });
  }

 logout() {
    this.authChange.next(false);
    this.router.navigate(['/login']);
    this.isAuthenticated = false;
  }




canRead(user: User): boolean {
  const allowed = ['admin', 'editor', 'subscriber'];
  return this.checkAuthorization(user, allowed);
}

canEdit(user: User): boolean {
  const allowed = ['admin', 'editor'];
  return this.checkAuthorization(user, allowed);
}

canDelete(user: User): boolean {
  const allowed = ['admin'];
  return this.checkAuthorization(user, allowed);
}



// determines if user has matching role
private checkAuthorization(user: User, allowedRoles: string[]): boolean {
  if (!user) { return false }
  for (const role of allowedRoles) {
    if ( user.roles[role] ) {
      return true;
    }
  }
  return false;
}


}
