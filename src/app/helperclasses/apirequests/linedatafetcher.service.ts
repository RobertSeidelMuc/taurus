import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class LinedatafetcherService {
  http: HttpClient;
  baseEndpoint: string;
  klineEndpoint: string;

  constructor(http: HttpClient) { 
    this.http = http;
    this.baseEndpoint = 'https://api.binance.com';
    this.klineEndpoint = '/api/v3/klines';
  }

  fetchKlineData = (symbol, interval, limit) => {
    const requestURL = this.baseEndpoint + this.klineEndpoint + "?symbol=" + symbol + "&interval=" + 
    interval + "&limit=" + limit;
    
    return new Promise(resolve => {
      this.http.get<[]>(requestURL)
      .subscribe(response => {
        resolve(this.convertToLineGraphData(response));
      });
    });
  }

  convertToLineGraphData = (dataArray) => {
    const lineGraphData = dataArray.map(dataSet => {
      const openTime = dataSet[0];
      const close = parseFloat(dataSet[4]);
      return [openTime, close]
    })

    return lineGraphData;
  }
}
