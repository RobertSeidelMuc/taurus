import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PortfolioberechnungenService {
  portfolioArray;
  portfolioValue;
  transactionsPortfolio;
  HPR;
  coins;
  webSocket;

  constructor() { 
    this.portfolioArray = [],
    this.transactionsPortfolio = [],
    this.coins = [],
    this.portfolioValue = -1
  }

  portfolioCalculation(portfolio) {
    let portfolioArrayAggr = [0, 0, 0];
    let portfolioArrayTrans = [];

    for (const coin in portfolio) {
      portfolioArrayAggr = [0, 0, 0, 0];
      portfolioArrayTrans = [];
      let coinAmount = 0;
      let coinInvestment = 0;
      let coinTransactions = [];
      for (const transaction in portfolio[coin]) {
        portfolioArrayAggr[0] += portfolio[coin][transaction].Aktuellwert;
        portfolioArrayAggr[1] += portfolio[coin][transaction].Einstandswert;
        portfolioArrayAggr[2] += portfolio[coin][transaction].Menge;
        coinAmount += portfolio[coin][transaction].Menge;
        coinInvestment += portfolio[coin][transaction].Einstandswert;
        
        portfolio[coin][transaction].id = coin + "_" + transaction;
        coinTransactions.push(portfolio[coin][transaction]);

        portfolioArrayTrans.push([
          transaction,  //Keys muessen Elementen einzeln zugewiesen werden, da keine bestimmbare Reihenfolge von Properties in Objekt
          portfolio[coin][transaction].Gekauft_wann,
          portfolio[coin][transaction].Aktuellwert,
          portfolio[coin][transaction].Einstandswert,
          portfolio[coin][transaction].Menge
        ]);

      }
      this.coins.push({
        name: coin,
        amount: coinAmount,
        currentValue: 0,
        investment: coinInvestment,
        transactions: coinTransactions
      });

      portfolioArrayAggr[3] = ((portfolioArrayAggr[0] - portfolioArrayAggr[1]) / portfolioArrayAggr[1]) * 100

      this.portfolioArray.push([[coin],[portfolioArrayAggr],[portfolioArrayTrans]])
      this.portfolioArray.sort((a, b) => (a[0][0]).localeCompare(b[0][0])); //Sortieren nach Coin-Namen
      for (const coin of this.portfolioArray) {
        coin[2][0].sort((a, b) => (b[0]).localeCompare(a[0])) //Sortieren der Transaktionen innerhalb des Coins absteigend nach Transaktionsnr.
      }
    }

    //Untere Gesamt-Transaktionsliste fuer Portfolio generieren
    for (const coin in portfolio) {
      for (const transaction in portfolio[coin]) {
        portfolio[coin][transaction]['Coin'] = coin
        portfolio[coin][transaction]['Transaktion'] =  coin + "_" + transaction
        this.transactionsPortfolio.push([
          portfolio[coin][transaction]['Coin'],
          portfolio[coin][transaction]['Transaktion'],
          portfolio[coin][transaction]['Gekauft_wann'],
          portfolio[coin][transaction]['Aktuellwert'],
          portfolio[coin][transaction]['Einstandswert'],
          portfolio[coin][transaction]['Menge'],
        ])
      }
    }
    this.transactionsPortfolio.sort((a, b) => (b[2].seconds) - a[2].seconds); //Sortieren der unteren Gesamt-Transaktionsliste absteigend nach Zeit

    let totalPurchasePrice = this.transactionsPortfolio.reduce( (a, b) => a + b[4], 0 );

    if (this.coins.length > 0) {
      const subscriptionArray = this.coins.map(coin => `${coin.name.toLowerCase()}usdt@ticker`);
      this.webSocket = new WebSocket('wss://stream.binance.com:9443/ws');
      this.webSocket.onopen = () => {
        this.webSocket.send(JSON.stringify({
          method: "SUBSCRIBE",
          params: subscriptionArray,
          id: 1
        }))
      }

      this.webSocket.onmessage = (event) => {
        const response = JSON.parse(event.data);
        if(response.s) {
          let currentCoin = this.coins.find(coin => `${coin.name}USDT` === response.s);
          currentCoin.currentValue = parseFloat(response.c);
        }
        let portfolioValue = this.coins.reduce( (a, b) => {
          return a + b.currentValue * b.amount}
          , 0 );
        if (portfolioValue > 0) {
          this.portfolioValue = portfolioValue;
        }
        this.HPR = ((this.portfolioValue - totalPurchasePrice) / totalPurchasePrice) * 100;
      }
    }
    else {
      this.portfolioValue = 0;
      this.HPR = 0;
    }
  }
}
