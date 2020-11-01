import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { KlineCandleChart } from '../helperclasses/charts/KlineCandleChart';
import { AngularFireFunctions } from '@angular/fire/functions';
import { AuthService } from '../services/auth.service';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { User } from '../services/user.model';
import { take } from 'rxjs/operators';
import { db } from 'functions/src/config';
import { Routes, RouterModule, Router } from '@angular/router';
import { CollectionReference } from '@google-cloud/firestore';
import { PortfolioDetailComponent } from '../portfolio-detail/portfolio-detail.component';



@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.css']
})

export class PortfolioComponent implements OnInit {
  myUserID;

  aktivPortfolioCollection;
  portfolioTabellenDaten;
  portfolioObjekte;
  objectkeys = Object.keys;
  totalValueAllPortfolios = 0;
  totalAmountAllPortfolios = 0;

  constructor(public auth: AuthService, private afs: AngularFirestore, private router: Router) {
  }

  sortTable(portfolio) {
    if (!portfolio.sortUpwards) {
      portfolio.assetKeyArray.sort((a, b) => (a[0]).localeCompare(b[0]));
    }
    else {
      portfolio.assetKeyArray.sort((a, b) => (b[0]).localeCompare(a[0]));
    }
    portfolio.sortUpwards = !portfolio.sortUpwards;

  }

  ngOnInit(): void {
    this.auth.user.pipe(take(1)).subscribe(e => {
      this.myUserID = e.uid;
      const aktivPortfolioCollection = this.afs.collection(`user/${e.uid}/aktiv-portfolio`)
      const portfolio = aktivPortfolioCollection.valueChanges({ idField: 'id' })
      this.aktivPortfolioCollection = portfolio;
      this.aktivPortfolioCollection.subscribe(res => {
        this.portfolioTabellenDaten = res;
        this.portfolioObjekte = this.portfolioTabellenDaten.map(portfolio => {

          let portfolioObjekt = {
            id: portfolio.id,
            name: portfolio.name, //Name des Portfolios
            assets: {},
            sortUpwards: false,
            assetKeyArray: [],
            totalPortfolioValue: 0,
            totalPortfolioAmount: 0
          }
          let totalPortfolioValue_Temp = 0;
          let totalPortfolioAmount_Temp = 0;
          for (let entry in portfolio) {
            if (entry != "name" && entry != "id") { //Falls 'entry' ein Coin ist
              for (let transaction in portfolio[entry]) {
                totalPortfolioValue_Temp += portfolio[entry][transaction]['Aktuellwert']
                totalPortfolioAmount_Temp += portfolio[entry][transaction]['Menge']
              }
            }
            portfolioObjekt.assetKeyArray = Object.keys(portfolioObjekt.assets);
            this.sortTable(portfolioObjekt);
          }
          portfolioObjekt.totalPortfolioValue += totalPortfolioValue_Temp;
          portfolioObjekt.totalPortfolioAmount += totalPortfolioAmount_Temp;
          return portfolioObjekt;
        });
        this.totalValueAllPortfolios = this.portfolioObjekte.reduce((a, b) => a + b['totalPortfolioValue'], 0)
        this.totalAmountAllPortfolios = this.portfolioObjekte.reduce((a, b) => a + b['totalPortfolioAmount'], 0)
      });
    })

  }

  updateUserSubCollection() {
    this.auth.user.pipe(take(1)).subscribe(e => {
      const aktivPortfolioCollection = this.afs.collection(`user/${e.uid}/aktiv-portfolio`)
      const portfolio = aktivPortfolioCollection.valueChanges()
      this.aktivPortfolioCollection = portfolio
    })
  }

  addRecFirebase() {
    this.afs.collection(`user/${this.myUserID}/aktiv-portfolio`).doc('test').set({
      ABC: "XYZx"
    })
  }
  addRecFirebase_w_ID() {
    this.afs.collection(`user/${this.myUserID}/aktiv-portfolio`).add({
      name: "eins"
    })
      .then(function (docRef) {
      })
      .catch(function (error) {
        console.error("Fehler beim Anlegen des Doks: ", error);
      })
  }

  deleteRecFirebase() {
    this.afs.collection(`user/${this.myUserID}/aktiv-portfolio`).doc("test").delete().then(function () {
      console.log("Document successfully deleted!");
    }).catch(function (error) {
      console.error("Error removing document: ", error);
    });
  }

  //////////////////  BEGIN TESTDATEN-GENERATOR  /////////////////////
  shuffleArray(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
    return array;
  }

  randomTime(start, end) {
    // get the difference between the 2 dates, multiply it by 0-1, 
    // and add it to the start date to get a new date 
    var diff = end.getTime() - start.getTime();
    var new_diff = diff * Math.random();
    var date = new Date(start.getTime() + new_diff);
    return date;
  }

  randomIntFromInterval(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  addTestPortfolio() {
    this.auth.user.pipe(take(1)).subscribe(e => {
      const aktivPortfolioCollection = this.afs.collection(`user/${this.myUserID}/aktiv-portfolio`)
      let myTestPortfolio = {};
      let myTestCoinsBasis = ['ETH', 'BTC', 'BNB', 'BCH', 'XRP', 'XTZ', 'LTC', 'EOS', 'ADA'];
      let myTestCoinsBasisBuyPrice = [227, 9100, 15, 222, 0.177, 2.34, 41.51, 2.4, 0.094];
      // let myTestCoins = this.shuffleArray(myTestCoinsBasis)
      let myTestCoins = myTestCoinsBasis;
      let rdmPrice = 0;
      let rdmAmount = 0;
      const noCoins = this.randomIntFromInterval(2, 8)
      for (let counterCoins = 0; counterCoins < noCoins; counterCoins++) {
        const noTransactions = this.randomIntFromInterval(2, 10);
        for (let counterTrans = 0; counterTrans < noTransactions; counterTrans++) {
          rdmPrice = this.randomIntFromInterval(100, 1000);
          rdmAmount = this.randomIntFromInterval(10, 20);
          myTestPortfolio[myTestCoins[counterCoins]] = {
            ...myTestPortfolio[myTestCoins[counterCoins]],
            [`trID_00${counterTrans}`]: {
              Menge: rdmAmount,
              // Einstandswert: rdmPrice,
              Einstandswert: myTestCoinsBasisBuyPrice[counterCoins] * rdmAmount,
              // Aktuellwert: rdmPrice * (1 + ((this.randomIntFromInterval(1, 40) / 100) * (this.randomIntFromInterval(1, 10) % 2 == 0 ? 1 : -1))),
              Aktuellwert: 0,
              // Gekauft_wann: new Date() 
              Gekauft_wann: this.randomTime(new Date("12-10-2019 10:30"), new Date("07-12-2020 02:10")) //mm/dd
            }
          }
        }
      }
      myTestPortfolio['name'] = `Testportfolio ${this.randomIntFromInterval(1000, 9999)}`
      aktivPortfolioCollection.add(myTestPortfolio)
        .then(docRef => console.log("Portfolio geschrieben, ID: ", docRef.id));
      ;
    })
  }
  //////////////////  END TESTDATEN-GENERATOR  /////////////////////

}
