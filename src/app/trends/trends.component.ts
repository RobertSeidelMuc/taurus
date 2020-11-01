import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { iconList } from '../global_constants/iconlist';

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
  selector: 'app-trends',
  templateUrl: './trends.component.html',
  styleUrls: ['./trends.component.css']
})
export class TrendsComponent implements OnInit {
  webSocketAllTickers;
  closingWebSocket = false;
  cryptoCurrencyNames;
  tickerDisplay;
  tableDropDownArrow = "arrow_drop_down";
  lastFiveInvisible = true;
  topsDisplay;
  datafetcher;
  flopCurrencies;
  topCurrencies;

  constructor(public auth: AuthService) { 
    this.cryptoCurrencyNames = cryptoCurrencyNames;
  }

  initializeCurrencyObject = (symbol) => {
    let iconURL;
    if (iconList.includes(symbol.toLowerCase())) {
      iconURL = `${ICON_BASE_URL}${symbol.toLowerCase()}.svg`;
    }
    else {
      iconURL = "../assets/cryptocurrency-icons/svg/color/generic.svg";
    }

    return {
      symbol: symbol,
      icon: iconURL,
      currentPrice: '',
      changeInPercent: '–',
      positive: 0
    }
  }

  fillCurrencyData = (currencyObject, currencyData) => {
    let currentPrice = '';
    if (parseFloat(currencyData.c) < 1) {
      currentPrice = parseFloat(currencyData.c).toLocaleString('de-DE', { style: 'currency', currency: 'USD', maximumFractionDigits: 6, minimumFractionDigits: 6});
    }
    else {
      currentPrice = parseFloat(currencyData.c).toLocaleString('de-DE', { style: 'currency', currency: 'USD'});
    }
    currencyObject.currentPrice = currentPrice;

    currencyData.P = parseFloat(currencyData.P);
    if (currencyData.P >  0) {
      currencyObject.changeInPercent = `+${currencyData.P.toLocaleString('de-DE', {style: 'decimal', maximumFractionDigits: 2, minimumFractionDigits: 2})}${String.fromCharCode(160)}%`;
      currencyObject.positive = 1;
    }
    else if (currencyData.P <  0) {
      currencyObject.changeInPercent  = `${currencyData.P.toLocaleString('de-DE', {style: 'decimal', maximumFractionDigits: 2, minimumFractionDigits: 2})}${String.fromCharCode(160)}%`;
      currencyObject.positive = -1;
    }
    else {
      currencyObject.changeInPercent  = `${currencyData.P.toLocaleString('de-DE', {style: 'decimal', maximumFractionDigits: 2, minimumFractionDigits: 2})}${String.fromCharCode(160)}%`;
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
        for (let i=0; i<3; i++) {
          let newFlopCurrency:CurrencyObject = this.initializeCurrencyObject(sortedByPercent[i].s);
          newFlopCurrency = this.fillCurrencyData(newFlopCurrency, sortedByPercent[i]);
          newFlops.push(newFlopCurrency);
        }
        this.flopCurrencies = newFlops;
      }
      if (topsIncluded) {
        const newTops = [];
        for (let i=0; i<3; i++) {
          let newTopCurrency:CurrencyObject = this.initializeCurrencyObject(sortedByPercent[sortedByPercent.length - i - 1].s);
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

  ngOnInit(): void {
    this.tickerDisplay = TOP_TEN_CURRENCIES.map(arraySymbol => { 
      const currencyObject: CurrencyObject = this.initializeCurrencyObject(arraySymbol)
      return currencyObject;
    });

    this.connectWebSocket();

    this.webSocketAllTickers.onclose = () => {
      if (!this.closingWebSocket) {
        this.connectWebSocket();
      }
    }
  }

  ngOnDestroy() {
    this.closingWebSocket = true;
    this.webSocketAllTickers.close();
  }
}
