import { Component, OnInit } from '@angular/core';
import { KlineCandleChart } from '../helperclasses/charts/KlineCandleChart';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-robbisplayground',
  templateUrl: './robbisplayground.component.html',
  styleUrls: ['./robbisplayground.component.css'],
})

export class RobbisplaygroundComponent implements OnInit {
  klineChart1;
  klineChart2;
  http: HttpClient;

  constructor(http: HttpClient) {
    this.http = http;

  }

  ngOnInit(): void {
    this.klineChart1 = new KlineCandleChart(this.http);
    const title1 = "Märkte vergleichen";
    const symbolsAndNames1 = [
      {
        symbol: "ETHUSDT",
        name: "ETH/USDT"
      },
      {
        symbol: "BCHUSDT",
        name: "BCH/USDT"
      },
      {
        symbol: "LTCUSDT",
        name: "ETH/BTC"
      },
    ];
    const interval1 = "1d";
    const limit1 = 200;
    this.klineChart1.initKlineChartData(title1, symbolsAndNames1, interval1, limit1)

    this.klineChart2 = new KlineCandleChart(this.http);
    const title2 = "Noch mehr Märkte";
    const symbolsAndNames2 = [
      {
        symbol: "DENTUSDT",
        name: "DENT/USDT"
      },
      {
        symbol: "BTTUSDT",
        name: "BTT/USDT"
      },
    ];
    const interval2 = "1d";
    const limit2 = 300;
    this.klineChart2.initKlineChartData(title2, symbolsAndNames2, interval2, limit2)
  }
}
