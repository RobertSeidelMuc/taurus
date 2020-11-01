import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { PortfolioberechnungenService } from '../services/portfolioberechnungen.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { take } from 'rxjs/operators';
import { AppComponent } from '../app.component';
import { HttpClient, HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-portfolio-detail',
  templateUrl: './portfolio-detail.component.html',
  styleUrls: ['./portfolio-detail.component.css']
})
export class PortfolioDetailComponent implements OnInit {
  activatedRoute: ActivatedRoute;
  calculations;
  myUserID;
  myPortfolio;
  portfolio;
  transactionsPortfolio;
  portfolioValue;
  HPR;
  objectkeys = Object.keys;
  tableDropDownArrow = "arrow_drop_down";
  tableDropDownHinweis = "Alle Transaktionen dieses Portfolios einblenden";
  previousThanLastFiveInvisible = true;
  coinDoubles = [];
  ///Tests
  assetSum
  assetValues = [];

  constructor(
    private http: HttpClient,
    activatedRoute: ActivatedRoute,
    public auth: AuthService,
    private afs: AngularFirestore,
    private appComponent: AppComponent
  ) {
    this.activatedRoute = activatedRoute,
      this.transactionsPortfolio = [],
      this.calculations = new PortfolioberechnungenService
  }

  expandTable = () => {
    this.previousThanLastFiveInvisible = !this.previousThanLastFiveInvisible;
    if (this.previousThanLastFiveInvisible) {
      this.tableDropDownArrow = "arrow_drop_down";
      this.tableDropDownHinweis = "Frühere Transaktionen dieses Portfolios einblenden";
    }
    else {
      this.tableDropDownArrow = "arrow_drop_up";
      this.tableDropDownHinweis = "Frühere Transaktionen dieses Portfolios ausblenden";
    }
  }

  findCoinValue(name, amount) {
    return this.calculations.coins.find(coin => name === coin.name).currentValue * amount;
  }

  ngOnInit(): void {
    const PortfolioId = this.activatedRoute.snapshot.params['id'];
    this.auth.user.pipe(take(1)).subscribe(e => {
      this.myUserID = e.uid;
      const aktivPortfolio = this.afs.doc(`user/${e.uid}/aktiv-portfolio/${PortfolioId}`)
      this.myPortfolio = aktivPortfolio.valueChanges()
      this.myPortfolio.subscribe(portfolio => {
        this.appComponent.setbreadcrumbSecond = portfolio.name;
        this.portfolio = {
          name: portfolio.name,
          id: portfolio.id,
          assets: {}
        }
        for (const element in portfolio) {
          if (element != "name" && element != "id") {
            this.portfolio.assets[element] = portfolio[element];
          }
        }

        this.calculations.portfolioCalculation(this.portfolio.assets);
        for (const coin of this.calculations.coins) {
          this.coinDoubles.push(coin);
          this.coinDoubles.push(coin);
        }
        // his.getCandle()
      });
    });
  }



/*   getCandle() {

    this.assetValues = []
    for (let coin in this.portfolio.assets) {
      let qty = 0
      for (let transaction in this.portfolio.assets[coin]) {
        qty = qty + this.portfolio.assets[coin][transaction]["Menge"]
        
      }
      let symbol = coin + "USDT"
      fetch(`https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=1d&limit=14`)
        .then((resp) => resp.json()) // Transform the data into json
        .then((resp) => {
          this.assetValues.push({
            name: coin,
            candleData: resp,
            qty: qty

          })
        })
    }
    setTimeout(() => console.log(this.assetValues), 2000)
    setTimeout(() => this.calculateAssetSum(), 2000)
  }
  calculateAssetSum(){
    for(let asset of this.assetValues){
      let sum = asset.qty * asset.candleData[13][4]
      this.assetSum.push(sum)
    }
  }


  calculateDays(){
    let value = []
    for(let asset of this.assetValues){
      let dailyPricePerAsset = []
      for(let dayPrice of asset.candleData ){
        dailyPricePerAsset.push((parseFloat(dayPrice[4])* asset.qty)) 
      }
      value.push(dailyPricePerAsset)
    }
    console.log(value)
  } */
}
