import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ICandleData } from '../../interfaces/icandledata'

@Injectable({
  providedIn: 'root'
})

export class KlineCandleDataFetcher {
  baseEndpoint: string;
  klineEndpoint: string;
  symbol: string;
  interval: string;  
  klineData: Array<string|number>[] = [];
  klineGraphData: Array<[number, number]>[] = [];
  candleGraphData: ICandleData[];
  http: HttpClient;

  constructor(@Inject(HttpClient) http) {
    this.baseEndpoint = 'https://api.binance.com';
    this.klineEndpoint = '/api/v3/klines';
    this.http = http;
  }

  fetchKlineData = (symbol, interval, limit) => {
    const requestURL = this.baseEndpoint + this.klineEndpoint + "?symbol=" + symbol + "&interval=" + 
    interval + "&limit=" + limit;
    
    return new Promise(resolve => {
      this.http.get<[]>(requestURL)
      .subscribe(response => {
        this.klineData.push(response);
        this.convertToLineGraphData(response);
        resolve();
      });
    });
  }

  convertToLineGraphData = (dataArray) => {
    const lineGraphData = dataArray.map(dataSet => {
      const openTime = dataSet[0];
      const close = parseFloat(dataSet[4]);
      return [openTime, close]
    })

    this.klineGraphData.push(lineGraphData);
  }

  convertToCandleGraphData = (dataArray) => {
    const candleGraphData = dataArray.map(dataSet => {
      const openTime = dataSet[0];
      const open = dataSet[1];
      const high = dataSet[2];
      const low = dataSet[3];
      const close = dataSet[4];
      return {
        x: new Date(openTime),
        y: [open, high, low, close]
      }
    })

    this.candleGraphData.push(candleGraphData);
  }

  get klineDataGetter() {
    return this.klineData;
  }

  get klineGraphDataGetter() {
    return this.klineGraphData;
  }
}
