import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../services/user.model';
import { AngularFirestore,  AngularFirestoreDocument } from '@angular/fire/firestore';
import { AuthService } from '../services/auth.service';
import { take } from 'rxjs/operators';


@Injectable({ providedIn: 'root' })
export class DatabaseTest {
    userCollection
    aktivPortfolioCollection
  constructor(public auth: AuthService, private afs: AngularFirestore
) { 

}
  // DATENBANK TESTS

  // Gib mir die gesamte User Collection
  getCollection() {
    const Collection = this.afs.collection('user').valueChanges()
    this.userCollection = Collection
  }

  // Gib mir die gesamte aktiv-Portfolio Collection des aktuellen Users
  getUserSubCollection() {
    this.auth.user.pipe(take(1)).subscribe(e => {
      const aktivPortfolioCollection = this.afs.collection(`user/${e.uid}/aktiv-portfolio`)
      const portfolio = aktivPortfolioCollection.valueChanges()
      this.aktivPortfolioCollection = portfolio;
    });
  }

  // Update Daten des aktuellen Users
  updateUserData1() {
    this.auth.user.pipe(take(1)).subscribe(e => {
      const userRef: AngularFirestoreDocument<User> = this.afs.doc(`user/${e.uid}`);
      const data = { 
        uid: e.uid,
        email: "rene.rabeneck@googlemail.com", 
        displayName: "Rene", 
      }
      return userRef.set(data, { merge: true })
    })
  }
}