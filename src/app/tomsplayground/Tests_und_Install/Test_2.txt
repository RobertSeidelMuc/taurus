import { Component } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/observable/combineLatest';

export interface Item {
  text: string;
  color: string;
  size: string;
}

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ]
})
export class AppComponent {
  items$: Observable<Item[]>;
  sizeFilter$: BehaviorSubject<string|null>;
  colorFilter$: BehaviorSubject<string|null>;
  
  constructor(afs: AngularFirestore) {
    this.sizeFilter$ = new BehaviorSubject(null);
    this.colorFilter$ = new BehaviorSubject(null);
    this.items$ = Observable.combineLatest(
      this.sizeFilter$,
      this.colorFilter$
    ).switchMap(([size, color]) => 
      afs.collection<Item>('items', ref => {
        let query : firebase.firestore.Query = ref;
        if (size) { query = query.where('size', '==', size) };
        if (color) { query = query.where('color', '==', color) };
        return query;
      }).valueChanges()
    );
  }
  filterBySize(size: string|null) {
    this.sizeFilter$.next(size); 
  }
  filterByColor(color: string|null) {
    this.colorFilter$.next(color); 
  }
}
