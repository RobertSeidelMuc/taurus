import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { take } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import * as firebase from 'firebase/app';

declare var M: any;

@Component({
  selector: 'app-watchlist',
  templateUrl: './watchlist.component.html',
  styleUrls: ['./watchlist.component.css']
})
export class WatchlistComponent implements OnInit {

  UrlTicker = 'https://api.binance.com/api/v3/ticker/24hr'

  @ViewChild("autocomplete") autocomplete;

  pairSelect;
  AutocompleteInstance;
  watchlistInDB;
  watchlistObservable;
  newPairToAdd;
  watchlists;

  priceTicker
  priceTickerSymbol: any = {
    lastPrice: "loading",
    priceChangePercent: 0
  }

  constructor(private http: HttpClient, public auth: AuthService, private afs: AngularFirestore) { }

  clearPairSelect() {
    this.pairSelect = ''
  }

  setPairSelect(event) {
    this.pairSelect = event.target.value;
  }

  
  ngOnInit(): void {
    var elems = document.querySelectorAll('.dropdown-trigger');
    const options = {};
    M.Dropdown.init(elems, options);

    var AutocompleteElems = document.querySelectorAll('.autocomplete');
    M.Autocomplete.init(AutocompleteElems, {
      data: {
      },
      minLength: 0,
      limit: 2,
      onAutocomplete: (e) => (this.newPairToAdd = e)
    })
    this.getPriceTicker();

    this.auth.user.pipe(take(1)).subscribe(e => {
      this.watchlistInDB = this.afs.collection('user').doc(`${e.uid}`)
    });
  }

  addToWatchlist() {
    this.watchlistInDB.update({
      Watchlist: firebase.firestore.FieldValue.arrayUnion(this.newPairToAdd)
    });
  }

  setAddPairWatchlist(event) {
    this.newPairToAdd = event.target.value;
  }

  // Einmalig zur Befüllung der Autocomplete Liste
  getPriceTicker() {
    this.http.get(this.UrlTicker).subscribe(response => {
      this.priceTicker = response
      let symbolObject = {}
      for (let symbol of this.priceTicker) {
        symbolObject[symbol.symbol] = null
      }
      var elem = this.autocomplete.nativeElement
      var autocompleteInstance = M.Autocomplete.getInstance(elem);
      autocompleteInstance.updateData(symbolObject);
    }
    )
  }

}
