import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { take } from 'rxjs/operators';
import * as firebase from 'firebase/app';


const cryptoCurrencyNames = require('cryptocurrencies');
const ICON_BASE_URL = "../../assets/cryptocurrency-icons/svg/color/";


@Component({
  selector: 'app-watchlistcard',
  templateUrl: './watchlistcard.component.html',
  styleUrls: ['./watchlistcard.component.css']
})
export class WatchlistcardComponent implements OnInit {
  cryptoCurrencyNames;
  myUserID;
  myUser;
  watchlist;
  watchlistDisplay;
  websocket;
  watchlistObjects;
  entr2del;
  user;
  pairSecondCoins = ["USDT", "BTC", "BUSD", "USDC", "PAX", "NGN", "ETH", "TUSD", "EUR", "TRY", "BNB", "TRX", "RUB", "IDRT", "ZAR", "XRP", "BIDR", "BKRW", "GBP", "UAH"];

  constructor(
    public auth: AuthService,
    private afs: AngularFirestore
  ) {
    this.cryptoCurrencyNames = cryptoCurrencyNames;
    this.watchlist = [];
    this.watchlistDisplay = [];
    this.entr2del = '';
  }

delFromWatchlist() {
  this.user.update({
    Watchlist: firebase.firestore.FieldValue.arrayRemove(this.entr2del[0])
  });

//   washingtonRef.update({
//     regions: firebase.firestore.FieldValue.arrayRemove("east_coast")
// });
}

set2Del(symbol) {
  this.entr2del = symbol;
}

  ngOnInit(): void {
    


    this.auth.user.pipe(take(1)).subscribe(e => {
      this.myUserID = e.uid;
      this.user = this.afs.doc(`user/${e.uid}`)
      
      this.myUser = this.user.valueChanges()
      this.myUser.subscribe(res => {
        if (res.Watchlist) {
          this.watchlist = res.Watchlist;
          this.watchlistObjects = this.watchlist.map( s => {
            let firstCoin;
            let secondCoin = this.pairSecondCoins.find(coin => s.endsWith(coin));
            if (secondCoin) {
              let cutOffLength = secondCoin.length;
              firstCoin = s.slice(0, -cutOffLength);
            }
            
            let myObject = {
              symbol: s,
              currentPrice: 0,
              changePercentage: 0,
              icon: `${ICON_BASE_URL}${firstCoin.toLowerCase()}.svg`
            };
            return myObject;
          })
          let paramsString = this.watchlist.map(s => `${s.toLowerCase()}@ticker`)
          this.websocket = new WebSocket('wss://stream.binance.com:9443/ws')
          this.websocket.onopen = () => {
            this.websocket.send(JSON.stringify(
              { method: 'SUBSCRIBE', params: paramsString, id: 1 }))
          }
          this.websocket.onmessage = (evt) => {
            const response = JSON.parse(evt.data);
            if (response.s) {
              let watchlistEntry = this.watchlistObjects.find(watchlistObject => `${watchlistObject.symbol}` === response.s);
              if (watchlistEntry) {
              watchlistEntry.currentPrice = parseFloat(response.c);
              watchlistEntry.changePercentage = parseFloat(response.P);
              }
            }
          };
        }
      });
    });

  }

}
