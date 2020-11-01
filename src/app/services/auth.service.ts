import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { User } from './user.model';

import { auth } from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';

import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthService {
  user: Observable<User>
  currentUser
  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router
) { 
  this.user = this.afAuth.authState.pipe(
    switchMap(user => {
      if(user){
        this.currentUser = user
        return this.afs.doc<User>(`user/${user.uid}`).valueChanges();
      } else {
        return of(null)
      }
    })
  )
}

async emailSignin (email, password) {
    return await this.afAuth.signInWithEmailAndPassword(email, password)

}
async emailSignUp (email, password) {
  return await this.afAuth.createUserWithEmailAndPassword(email, password)
  // return this.updateUserData(credential.user)
}
  async googleSignin() {
    const provider = new auth.GoogleAuthProvider();
    return await this.afAuth.signInWithPopup(provider);

  }

  async githubSignin() {
    const provider = new auth.GithubAuthProvider();
    return await this.afAuth.signInWithPopup(provider);
  }

  async signOut() {
    await this.afAuth.signOut();
    this.router.navigate(['/']);
  }



// alternative

/* async googleSignin() {
  const provider = new auth.GoogleAuthProvider();
  const credential = await this.afAuth.signInWithPopup(provider);
  return this.updateUserData(credential.user);
} */

/*   private updateUserData(user) {
    const userRef: AngularFirestoreDocument<User> = this.afs.doc(`user/${user.uid}`);
    const data = { 
      uid: user.uid, 
      email: user.email, 
      displayName: user.displayName, 
      photoURL: user.photoURL
    } 

    return userRef.set(data, { merge: true })

  } */



}