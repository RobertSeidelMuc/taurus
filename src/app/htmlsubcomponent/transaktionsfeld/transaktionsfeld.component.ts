import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { take } from 'rxjs/operators';

declare var M: any;

const cryptoCurrencyNames = require('cryptocurrencies');
const ICON_BASE_URL = "../assets/cryptocurrency-icons/svg/color/";

@Component({
  selector: 'app-transaktionsfeld',
  templateUrl: './transaktionsfeld.component.html',
  styleUrls: ['./transaktionsfeld.component.css']
})
export class TransaktionsfeldComponent implements OnInit {
  @Input() symbol;
  icon;
  portolioOnServer;
  portfolioObservable;
  portfolios;
  portfolioNames;
  selectedPortfolio;
  selectedPortfolioName;
  cryptoCurrencyNames;
  portfolioAmount;
  modalBuyHref;
  modalSellHref;
  modalBuyId;
  modalSellId;
  currentRateFloat;
  currentRateFormatted = '–';
  changeInPercent = '–';
  myUserID;
  requestedAmount = 0;
  totalPriceFloat = 0;
  totalPriceFormatted = '';
  updateTotalPriceInterval;
  positive;
  webSocket;
  newID4Frontend;
  portfolioNamesSel;

  constructor(public auth: AuthService, private afs: AngularFirestore) {
    this.cryptoCurrencyNames = cryptoCurrencyNames;
    this.portfolioAmount = 0;
   }

   transaction(type) {
    const portfolio = this.selectedPortfolio;
    const coin = this.symbol;

    if (!portfolio[coin]) {
      portfolio[coin] = {}
    }

    const newId = Object.keys(portfolio[coin]).length;

    let newIdString;
    if (newId < 10) {
      newIdString = "trID_00" + newId;
    }
    else if (newId < 100) {
      newIdString = "trID_0" + newId;
    }
    else {
      newIdString = "trID_" + newId;
    }

    let amount = this.requestedAmount;
    let value = this.currentRateFloat * this.requestedAmount
    if (type === "sell") {
      amount = amount * -1;
      value = value * -1;
    }

    let asset = {
      Einstandskurs: this.currentRateFloat,
      Einstandswert: value,
      Gekauft_wann: new Date(),
      Menge: amount
    }
    
    portfolio[coin][newIdString] = asset;

    this.newID4Frontend = newIdString;

    this.afs.collection(`user/${this.myUserID}/aktiv-portfolio/`)
      .doc(this.selectedPortfolio.id)
        .update(portfolio );
    
    this.calculatePortfolioAmount();
  }

  sellAsset() {

  }

  onAmountInput(event) {
    this.requestedAmount = parseFloat(event.target.value);
    this.totalPriceFloat = this.requestedAmount * this.currentRateFloat;
    this.totalPriceFormatted = this.totalPriceFloat.toLocaleString('de-DE', { style: 'currency', currency: 'USD'});
  }

  updateTotalPrice() {
    if (this.requestedAmount != 0) {
      this.totalPriceFloat = this.requestedAmount * this.currentRateFloat;
      this.totalPriceFormatted = this.totalPriceFloat.toLocaleString('de-DE', { style: 'currency', currency: 'USD'});
    }
  }

  selectPortfolio(portfolioName) {
    if (portfolioName === 'Neues Portfolio...') {

    }
    this.newID4Frontend = '';
    this.selectedPortfolioName = portfolioName;
    this.selectedPortfolio = this.portfolios.find(portfolio => portfolio.name === portfolioName);
    this.calculatePortfolioAmount();
  }

  calculatePortfolioAmount() {
    let amount = 0;
    for (let transaction in this.selectedPortfolio[this.symbol]) {
      amount += this.selectedPortfolio[this.symbol][transaction]['Menge'];
    }
    this.portfolioAmount = amount;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['symbol']) {
      this.setSymbolData();
    }
  }

  setSymbolData() {
    if(this.updateTotalPriceInterval) {
      clearInterval(this.updateTotalPriceInterval);
    }
    if (this.webSocket) {
      if (this.webSocket.readyState === WebSocket.OPEN) {
        this.webSocket.close();
      }
    }

    if (this.symbol) {
      this.icon = `${ICON_BASE_URL}${this.symbol.toLowerCase()}.svg`;
      this.modalBuyHref = `#modal-buy-${this.symbol}`;
      this.modalSellHref = `#modal-sell-${this.symbol}`;
      this.modalBuyId = `modal-buy-${this.symbol}`;
      this.modalSellId = `modal-sell-${this.symbol}`;

      this.webSocket = new WebSocket(`wss://stream.binance.com:9443/ws/${this.symbol.toLowerCase()}usdt@ticker`)

      this.webSocket.onmessage = (event) => {
        const currencyData = JSON.parse(event.data);
        this.currentRateFloat = currencyData.c;
        if (parseFloat(currencyData.c) < 1) {
          this.currentRateFormatted = parseFloat(currencyData.c).toLocaleString('de-DE', { style: 'currency', currency: 'USD'});
        }
        else {
          this.currentRateFormatted = parseFloat(currencyData.c).toLocaleString('de-DE', { style: 'currency', currency: 'USD'});
        }

        currencyData.P = parseFloat(currencyData.P);
        if (currencyData.P >  0) {
          this.changeInPercent = `+${currencyData.P.toLocaleString('de-DE', {style: 'decimal', maximumFractionDigits: 2, minimumFractionDigits: 2})}${String.fromCharCode(160)}%`;
          this.positive = 1;
        }
        else if (currencyData.P <  0) {
          this.changeInPercent  = ` ${currencyData.P.toLocaleString('de-DE', {style: 'decimal', maximumFractionDigits: 2, minimumFractionDigits: 2})}${String.fromCharCode(160)}%`;
          this.positive = -1;
        }
        else {
          this.changeInPercent  = `${currencyData.P.toLocaleString('de-DE', {style: 'decimal', maximumFractionDigits: 2, minimumFractionDigits: 2})}${String.fromCharCode(160)}%`;
          this.positive = 0;
        }
      }

      this.updateTotalPriceInterval = setInterval(() => this.updateTotalPrice(), 1000);
    }
  }

  ngOnInit(): void {
    this.auth.user.pipe(take(1)).subscribe(e => {
      this.myUserID = e.uid;
    });

    this.auth.user.pipe(take(1)).subscribe(e => {
      this.portolioOnServer = this.afs.collection(`user/${e.uid}/aktiv-portfolio`)
      this.portfolioObservable = this.portolioOnServer.valueChanges({ idField: 'id' }).subscribe(res => {    
        this.portfolios = res; 
        this.portfolioNames = res.map(portfolio => portfolio.name).sort((a, b) => (a).localeCompare(b));

        this.portfolioNamesSel = ([...this.portfolioNames])
        this.portfolioNamesSel.push('Neues Portfolio...');

        setTimeout(() => {
          var formElems = document.querySelectorAll('select');
          var formInstances = M.FormSelect.init(formElems, options);
        }, 250);
      });
    });

    



    const options = { };
    var modalElems = document.querySelectorAll('.modal');
    var modalinstances = M.Modal.init(modalElems, options);

    if(!this.symbol) {
      this.symbol = "BTC";
    }
    this.setSymbolData();
  }

  ngOnDestroy() {
    if(this.updateTotalPriceInterval) {
      clearInterval(this.updateTotalPriceInterval);
    }
    if (this.webSocket) {
      if (this.webSocket.readyState === WebSocket.OPEN) {
        this.webSocket.close();
      }
    }
  }
}
