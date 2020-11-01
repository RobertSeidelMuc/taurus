import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { environment } from '../../environments/environment';
import { CookieService } from "ngx-cookie-service";


declare var M;

const cryptoCurrencyNames = require('cryptocurrencies');
const TOP_TEN_CURRENCIES = ["BTC", "ETH", "XRP", "BCH", "LTC", "BNB", "EOS", "ADA", "XTZ", "LINK"]
const STABLE_COINS = ["BUSD", "USDT", "TUSD", "PAX", "USDC", "DAI"];
const ICON_BASE_URL = "../assets/cryptocurrency-icons/svg/color/";

interface CurrencyObject {
  symbol: string;
  icon: string;
  currentPrice: string;
  changeInPercent: string;
  positive: number;
}

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent implements OnInit {
  @ViewChild("modal3") modal3;
  @ViewChild("modal4") modal4;
  webSocketAllTickers;
  closingWebSocket = false;
  cryptoCurrencyNames;
  tickerDisplay;
  tableDropDownArrow = "arrow_drop_down"
  lastFiveInvisible = true;
  topsDisplay;
  datafetcher;
  flopCurrencies;
  topCurrencies;
  error;
  success;
  email;
  password;
  errorMessage;
  cookieMessage;
  cookieDismiss;
  cookieLinkText;
  public href: string = "";
  hasConsentedCookies;


  constructor(public auth: AuthService, private cookieService: CookieService) {
    this.cryptoCurrencyNames = cryptoCurrencyNames;
  }

  initializeCurrencyObject = (symbol) => {
    return {
      symbol: symbol,
      icon: `${ICON_BASE_URL}${symbol.toLowerCase()}.svg`,
      currentPrice: '',
      changeInPercent: '–',
      positive: 0
    }
  }

  // closeModal1(){
  //   var elem = this.appComponent.modal1.nativeElement
  //   var modalInstance = M.Modal.getInstance(elem);
  //   modalInstance.close();
  //   this.appComponent.success = false
  // }
  // closeModal2(){
  //   var elem = this.appComponent.modal2.nativeElement
  //   var modalInstance = M.Modal.getInstance(elem);
  //   modalInstance.close();
  //   this.appComponent.success = false
  // }

  fillCurrencyData = (currencyObject, currencyData) => {
    let currentPrice = '';
    if (parseFloat(currencyData.c) < 1) {
      currentPrice = parseFloat(currencyData.c).toLocaleString('de-DE', { style: 'currency', currency: 'USD', maximumFractionDigits: 6, minimumFractionDigits: 6 });
    }
    else {
      currentPrice = parseFloat(currencyData.c).toLocaleString('de-DE', { style: 'currency', currency: 'USD' });
    }
    currencyObject.currentPrice = currentPrice;

    currencyData.P = parseFloat(currencyData.P);
    if (currencyData.P > 0) {
      currencyObject.changeInPercent = `+${currencyData.P.toLocaleString('de-DE', { style: 'decimal', maximumFractionDigits: 2, minimumFractionDigits: 2 })}${String.fromCharCode(160)}%`;
      currencyObject.positive = 1;
    }
    else if (currencyData.P < 0) {
      currencyObject.changeInPercent = `${currencyData.P.toLocaleString('de-DE', { style: 'decimal', maximumFractionDigits: 2, minimumFractionDigits: 2 })}${String.fromCharCode(160)}%`;
      currencyObject.positive = -1;
    }
    else {
      currencyObject.changeInPercent = `${currencyData.P.toLocaleString('de-DE', { style: 'decimal', maximumFractionDigits: 2, minimumFractionDigits: 2 })}${String.fromCharCode(160)}%`;
      currencyObject.positive = 0;
    }

    return currencyObject;
  }

  connectWebSocket = () => {
    this.webSocketAllTickers = new WebSocket("wss://stream.binance.com:9443/ws/!ticker@arr");

    this.webSocketAllTickers.onmessage = (event) => {
      const allTickersData = JSON.parse(event.data);
      let tickersDataFilteredForUSDT = allTickersData.filter(tickerData => tickerData.s.endsWith("USDT"));

      tickersDataFilteredForUSDT = tickersDataFilteredForUSDT.map(tickerData => {
        tickerData.s = tickerData.s.slice(0, (tickerData.s).length - 4);
        return tickerData;
      });

      // process data for the display of top ten currencies
      this.tickerDisplay.map(ticker => {
        const tickerData = tickersDataFilteredForUSDT.find(dataSet => dataSet.s === ticker.symbol);
        if (tickerData) {
          ticker = this.fillCurrencyData(ticker, tickerData);
        }
      });

      //process data for the display of top and flop currencies
      let flopsIncluded = true;
      let topsIncluded = true;

      if (this.flopCurrencies) {
        for (let currency of this.flopCurrencies) {

          if (!tickersDataFilteredForUSDT.find(ticker => ticker.s === currency.symbol)) {
            flopsIncluded = false;
            return;
          }
        }
      }
      if (this.topCurrencies) {
        for (let currency of this.topCurrencies) {
          if (!tickersDataFilteredForUSDT.find(ticker => ticker.s === currency.symbol)) {
            topsIncluded = false;
            return;
          }
        }
      }

      const sortedByPercent = tickersDataFilteredForUSDT.sort((a, b) => a.P - b.P);
      if (flopsIncluded) {
        const newFlops = [];
        for (let i = 0; i < 3; i++) {
          let newFlopCurrency: CurrencyObject = this.initializeCurrencyObject(sortedByPercent[i].s);
          newFlopCurrency = this.fillCurrencyData(newFlopCurrency, sortedByPercent[i]);
          newFlops.push(newFlopCurrency);
        }
        this.flopCurrencies = newFlops;
      }
      if (topsIncluded) {
        const newTops = [];
        for (let i = 0; i < 3; i++) {
          let newTopCurrency: CurrencyObject = this.initializeCurrencyObject(sortedByPercent[sortedByPercent.length - i - 1].s);
          newTopCurrency = this.fillCurrencyData(newTopCurrency, sortedByPercent[sortedByPercent.length - i - 1]);
          newTops.push(newTopCurrency);
        }
        this.topCurrencies = newTops;
      }
    }
  }

  expandTable = () => {
    this.lastFiveInvisible = !this.lastFiveInvisible;
    if (this.lastFiveInvisible) {
      this.tableDropDownArrow = "arrow_drop_down";
    }
    else {
      this.tableDropDownArrow = "arrow_drop_up";
    }
  }

  ngAfterViewInit() {
    var modalElems = document.querySelectorAll('.modal');
    var modalInstance = M.Modal.init(modalElems, {});
  }

  async signUp() {
    const signUp = this.auth.emailSignUp(this.email, this.password)
    await signUp.then(
      () => {
        this.error = false
        this.success = true
        setTimeout(() => this.closeModal2(), 2000)
      }
    ).catch(e => (this.error = true, this.errorMessage = e.message))
  }
  async signIn() {
    const signIn = this.auth.emailSignin(this.email, this.password)
    await signIn.then(
      () => {
        this.error = false
        this.success = true
        setTimeout(() => this.closeModal1(), 2000)
      }
    )
      .catch(e => (this.error = true, this.errorMessage = e.message))

  }

  async googleLogin() {
    const signIn = this.auth.googleSignin()
    await signIn.then(
      () => {
        this.error = false
        this.success = true
        setTimeout(() => this.closeModal1(), 2000)
        setTimeout(() => this.closeModal2(), 2000)
      }
    )
      .catch(e => (this.error = true, this.errorMessage = e.message))
  }
  async githubLogin() {
    const signIn = this.auth.googleSignin()
    await signIn.then(
      () => {
        this.error = false
        this.success = true
        setTimeout(() => this.closeModal1(), 2000)
        setTimeout(() => this.closeModal2(), 2000)
      }
    )
      .catch(e => (this.error = true, this.errorMessage = e.message))
  }

  closeModal1() {
    var elem = this.modal3.nativeElement
    var modalInstance = M.Modal.getInstance(elem);
    modalInstance.close();
    this.success = false
  }
  closeModal2() {
    var elem = this.modal4.nativeElement
    var modalInstance = M.Modal.getInstance(elem);
    modalInstance.close();
    this.success = false
  }

  checkCookieStatus() {
    this.hasConsentedCookies = this.cookieService.get('cookieconsent_status');
  }

  ngOnInit(): void {
    this.tickerDisplay = TOP_TEN_CURRENCIES.map(arraySymbol => {
      const currencyObject: CurrencyObject = this.initializeCurrencyObject(arraySymbol)
      return currencyObject;
    });

    this.connectWebSocket();

    this.webSocketAllTickers.onclose = () => {
      if (!this.closingWebSocket) {
        console.log("Connection to WebSocket closed. Attempting reconnect.");
        this.connectWebSocket();
      }
    }
  }

  ngOnDestroy() {
    this.closingWebSocket = true;
    this.webSocketAllTickers.close();
  }
}
