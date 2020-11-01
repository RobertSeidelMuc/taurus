import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { firestore } from 'firebase';
import { AuthService } from '../services/auth.service';


declare const M: any;

@Component({
  selector: 'app-tomsplayground',
  templateUrl: './tomsplayground.component.html',
  styleUrls: ['./tomsplayground.component.css']
})
export class TomsplaygroundComponent implements OnInit {
  notifications: Observable<any[]>;
  test: any;
  firestore: AngularFirestore;
  userDoc: any;
  usersCollection: AngularFirestoreCollection<any>;
  Names: any;
userCollection;



  constructor(firestore: AngularFirestore, public auth: AuthService) {
    this.firestore = firestore;
  }

  ngOnInit(): void {

      var elems = document.querySelectorAll('.modal');
      const options = {};
      var instances = M.Modal.init(elems, options);

  }

  validateLogin() {

  }

  getCollection2() {
    this.Names = [];
    const userCollection = this.firestore.collection('user')
    const users = userCollection.valueChanges()
    this.userCollection.forEach(a => {
      a.forEach(item => {
        const name = item.name;
        this.Names.push(name);
      });
    });
    // this.userCollection = Object.values(users)
    users.subscribe(r => console.log(r))
    }

    getCollection() {
      const Collection = this.firestore.collection('user').valueChanges()
      this.userCollection = Collection
      }

      
      

}



