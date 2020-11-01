import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AngularFireFunctions } from '@angular/fire/functions';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { SMA, BollingerBands, RSI, Stochastic } from 'technicalindicators';
const technicalIndicators = require('technicalindicators');
declare var M: any;

import {
  ApexNonAxisChartSeries,
  ApexResponsive,
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexYAxis,
  ApexXAxis,
  ApexTitleSubtitle,
  ApexPlotOptions,
  ApexDataLabels,
  ApexStroke,
  ApexFill,
  ApexGrid,
  ApexMarkers,
  ApexTooltip,
  ApexTheme,
  ApexLegend,
} from "ng-apexcharts";
import { getLocaleDateFormat } from '@angular/common';
import { style } from '@angular/animations';

export type CandleChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  title: ApexTitleSubtitle;
};


export type PercentBuyOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  labels: string[];
  plotOptions: ApexPlotOptions;
  fill: ApexFill;
  colors: string[];
  
};

export type BarChartOptions = {
  theme: ApexTheme;
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  yaxis: ApexYAxis;
  xaxis: ApexXAxis;
  fill: ApexFill;
  title: ApexTitleSubtitle;
};

export type lineOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  dataLabels: ApexDataLabels;
  grid: ApexGrid;
  stroke: ApexStroke;
  title: ApexTitleSubtitle;
  tooltip: ApexTooltip;
  legend: ApexLegend;
};

export type mixedChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  title: ApexTitleSubtitle;
  tooltip: ApexTooltip;
  stroke: any; //ApexStroke
  dataLabels: ApexDataLabels;
  legend: ApexLegend;
};

@Component({
  selector: 'app-asset-detail',
  templateUrl: './asset-detail.component.html',
  styleUrls: ['./asset-detail.component.css']
})
export class AssetDetailComponent implements OnInit {
  @ViewChild("chart") chart: ChartComponent;
  @ViewChild("chart2") chart2: ChartComponent;
  @ViewChild("chart3") chart3: ChartComponent;
  @ViewChild("lineChart") lineChart: ChartComponent;
  @ViewChild("mixedChart") mixedChart: ChartComponent;
  @ViewChild("autocomplete") autocomplete;
  @ViewChild("percentBuy") percentBuy: ChartComponent;
  public CandleChartOptions: Partial<CandleChartOptions>;
  public BarChart1: Partial<BarChartOptions>;
  public lineChartOptions: Partial<lineOptions>;
  public mixedChartOptions: Partial<mixedChartOptions>;
  public percentBuyOptions: Partial<PercentBuyOptions>;
  

  Url = 'https://api.binance.com/api/v3/trades';
  UrlCandle = 'https://api.binance.com/api/v3/klines'
  UrlTicker = 'https://api.binance.com/api/v3/ticker/24hr'
  apiCall = []

  // Chart variables
  candleClose = []
  candleHigh = []
  candleOpen = []
  candleLow = []
  candleData: Array<any> = []
  candleHighPoint = 0;
  candleChartData = []
  rsiChartData = []
  highestRSI = 0;
  volumeData
  smaData = []
  smaData2 = []
  mixedData = []
  // ----------------------
  // Select variables
  intervalSelect
  pairSelect
  previousPairSelect
  pairSelectCheckInterval
  indicatorSelect
  candleSelect
  // ---------------------
  loading = false
  AutocompleteInstance
  showIndeterminate
  priceTicker
  priceTickerSymbol: any = {
    lastPrice: "loading",
    priceChangePercent: 0
  }
  lastPrice;
  // interval instance
  buySellTickerInterval
  getCandleInterval
  priceTickerInterval
  // ---------------------

  //buy/sell variables 
  pairSecondCoins = ["USDT", "BTC", "BUSD", "USDC", "PAX", "NGN", "ETH", "TUSD", "EUR", "TRY", "BNB", "TRX", "RUB", "IDRT", "ZAR", "XRP", "BIDR", "BKRW", "GBP", "UAH"];
  pairFirstCoin;

  testFun = this.fns.httpsCallable('testFunction')
  userCollection
  aktivPortfolioCollection
  constructor(private http: HttpClient, private fns: AngularFireFunctions, public auth: AuthService, private afs: AngularFirestore, public activatedRoute: ActivatedRoute) {

  }

  filterFirstCoin() {
    if (this.pairSelect) {
      let secondCoin = this.pairSecondCoins.find(coin => this.pairSelect.endsWith(coin));
      if (secondCoin) {
        let cutOffLength = secondCoin.length;
        this.pairFirstCoin = this.pairSelect.slice(0, -cutOffLength);
      }
    }
  }

  ngOnInit(): void {
    let assetDetailTS = this;

    this.pairSelect = this.activatedRoute.snapshot.params['id'];
    this.filterFirstCoin();
    this.previousPairSelect = this.pairSelect;
    this.pairSelectCheckInterval = setInterval(() => {
      if (this.previousPairSelect != this.pairSelect) {
        this.filterFirstCoin();
        this.previousPairSelect = this.pairSelect;
      }
    }, 1000);
    technicalIndicators.setConfig('precision', 8);
    var elems = document.querySelectorAll('.dropdown-trigger');
    const options = {};
    var droptDownInstances = M.Dropdown.init(elems, options);

    var AutocompleteElems = document.querySelectorAll('.autocomplete');
    var autocompleteInstance = M.Autocomplete.init(AutocompleteElems, {
      data: {
      },
      minLength: 0,
      limit: 10,
      onAutocomplete: (e) => (this.pairSelect = e, this.getCandle(), this.dailyVolume())
    })

    var intervalSelect = document.querySelectorAll('select');
    var formSelectInstances = M.FormSelect.init(intervalSelect, options);
    this.getPriceTicker()
    this.getCandle()
    this.priceTickerSelectedCoin()
    this.dailyVolume()
    this.buySellTicker()
    this.buySellTickerInterval = setInterval(()=> this.buySellTicker(),10000)
    this.getCandleInterval = setInterval(() => this.getCandle(), 10000),
    this.priceTickerInterval = setInterval(() => (this.priceTickerSelectedCoin(), this.loading = true, setTimeout(() => this.loading = false, 2000)), 10000),

      // Diagramm Struktur

      this.BarChart1 = {
        series: [
          {
            name: "Asset",
            data: []
          }
        ],
        chart: {
          height: 350,
          type: "bar"
        },
        plotOptions: {
          bar: {
            dataLabels: {
              position: "top" // top, center, bottom
            }
          }
        },
        dataLabels: {
          enabled: true,
          formatter: function (val) {
            return val + "";
          },
          offsetY: -20,
          style: {
            fontSize: "12px",
            colors: ["#ffffff"]
          }
        },

        xaxis: {
          categories: [
            "Tag7",
            "Tag6",
            "Tag5",
            "Tag4",
            "Tag3",
            "Gestern",
            "Aktuell"
          ],
          position: "top",
          labels: {
            offsetY: -18
          },
          axisBorder: {
            show: false
          },
          axisTicks: {
            show: false
          },
          crosshairs: {
            fill: {
              type: "gradient",
              gradient: {
                colorFrom: "#D8E3F0",
                colorTo: "#BED1E6",
                stops: [0, 100],
                opacityFrom: 0.4,
                opacityTo: 0.5
              }
            }
          },
          
          tooltip: {
            enabled: true,
            offsetY: -35,
          },
        },
        
        fill: {
          type: "gradient",
          gradient: {
            shade: "light",
            type: "horizontal",
            shadeIntensity: 0.25,
            gradientToColors: undefined,
            inverseColors: false,
            opacityFrom: 1,
            opacityTo: 1,
            stops: [50, 0, 100, 100]
          }
        },

        yaxis: {
          labels: {
            style: {
              colors: "#ffffff"
            },
            formatter: function (val) {
              return val.toFixed(2)
            }
          },
        },

      };
    this.lineChartOptions = {
      series: [
        {
          name: "Desktops",
          data: [10, 41, 35, 51, 49, 62, 69, 91, 148]
        }
      ],
      chart: {
        height: 450,
        type: "line",
        zoom: {
          enabled: false
        }
      },
      dataLabels: {
        enabled: false,

      },
      stroke: {
        curve: "smooth",
        width: 3,
      },
      xaxis: {
        type: "datetime",
        labels: {
          style: {
            colors: "#ffffff"
          },
        }
      },
      yaxis: {
        labels: {
          style: {
            colors: "#ffffff"
          },
          formatter: function (val) {
            if (assetDetailTS.highestRSI > 10 ) {
              return val.toFixed(2)
            }
            else {
              return val.toFixed(6)
            }
          }
        },
      },
      legend: {
        labels: {
          colors: "#ffffff"
        }
      }
    };
    this.mixedChartOptions = {
      series: [

      ],
      chart: {
        height: 550,
        type: "line",
      },
      dataLabels: {
        enabled: false,

      },

      stroke: {
        width: [1, 2, 2, 2]
      },
      /*             tooltip: {
                    shared: true,
                    custom: [
                      function({ seriesIndex, dataPointIndex, w }) {
                        return w.globals.series[seriesIndex][dataPointIndex];
                      },
                      function({ seriesIndex, dataPointIndex, w }) {
                        const o = w.globals.seriesCandleO[seriesIndex][dataPointIndex];
                        const h = w.globals.seriesCandleH[seriesIndex][dataPointIndex];
                        const l = w.globals.seriesCandleL[seriesIndex][dataPointIndex];
                        const c = w.globals.seriesCandleC[seriesIndex][dataPointIndex];
                        return (
                          '<div class="apexcharts-tooltip-candlestick">' +
                          '<div>Open: <span class="value">' +
                          o +
                          "</span></div>" +
                          '<div>High: <span class="value">' +
                          h +
                          "</span></div>" +
                          '<div>Low: <span class="value">' +
                          l +
                          "</span></div>" +
                          '<div>Close: <span class="value">' +
                          c +
                          "</span></div>" +
                          "</div>"
                        );
                      }
                    ]
                  },  */
      xaxis: {
        type: "datetime",
        labels: {
          style: {
            colors: "#ffffff"
          }
        }
      },
      yaxis: {
        labels: {
          style: {
            colors: "#ffffff"
          },
          formatter: function (val) {
            if (assetDetailTS.candleHighPoint > 10 ) {
              return val.toFixed(2)
            }
            else {
              return val.toFixed(6)
            }
          }
        },
      },
      legend: {
        labels: {
          colors: "#ffffff"
        }
      }
    };
    this.percentBuyOptions = {
      series: [70],
      chart: {
        height: 365,
        type: "radialBar"
      },
      plotOptions: {
        radialBar: {
          hollow: {
            size: "70%"
          },
          dataLabels: {
            name: {
              show: true
            },
            value: {
              color: "#ffffff",
              fontSize: "22px"
            }
          },
          track: {
            background: "#e7e7e7",
            strokeWidth: "97%",
            margin: 5, // margin is in pixels
            dropShadow: {
              enabled: true,
              top: 2,
              left: 0,
              opacity: 0.31,
              blur: 2
            }
          },
        }
      },
      colors: [],
      fill: {
        type: "gradient",
        gradient: {
          shade: "dark",
          shadeIntensity: 0.5,
          gradientToColors: ["green"],
          opacityFrom: 1,
          opacityTo: 1,
          stops: [0, 100]
        }
      },
      labels: ["letzte 500 trades"]
    };
  }

  ngOnDestroy() {
    clearInterval(this.getCandleInterval)
    clearInterval(this.priceTickerInterval)
    clearInterval(this.buySellTickerInterval)
    clearInterval(this.pairSelectCheckInterval)
  }

  /// Get Candle Data from Binance
  getCandle() {
    let params = new HttpParams()
      .set('symbol', this.pairSelect ? this.pairSelect : "BTCUSDT")
      .set('limit', this.candleSelect ? this.candleSelect : "100")
      .set('interval', this.intervalSelect ? this.intervalSelect : "1d");

    this.http.get(this.UrlCandle, { params }).subscribe(response => {
      let data: any = response
      this.convertData(data)
    })
  }
  // Convert Data to Chart Format
  convertData(data) {
    let candleData = []
    let highData = [];
    data.map(r => {
      const time = parseFloat(r[0])
      const open = parseFloat(r[1])
      const high = parseFloat(r[2])
      const low = parseFloat(r[3])
      const close = parseFloat(r[4])
      highData.push(high);
      candleData.push(
        {
          x: time,
          y: [open, high, low, close]
        }
      )
    })
    this.candleHighPoint = Math.max(...highData);
    //clear old data
    this.candleClose = []
    this.candleData = candleData
    for (let close of this.candleData) {
      this.candleClose.push(close.y[3])
    }
    //clear old data
    this.candleLow = []
    for (let low of this.candleData) {
      this.candleLow.push(low.y[2])
    }
    //clear old data
    this.candleHigh = []
    for (let high of this.candleData) {
      this.candleHigh.push(high.y[1])
    }
    //clear old data
    this.candleOpen = []
    for (let open of this.candleData) {
      this.candleOpen.push(open.y[0])
    }

    this.candleStick()

  }

  candleStick() {
    this.candleChartData = []
    let candleStickData =
    {
      name: "Candlestick",
      type: "candlestick",
      data: this.candleData
    }
    this.candleChartData.push(candleStickData)
    this.sma()
  }
  sma() {
    // SMA Indicator
    let smaObject = {
      name: "sma",
      type: "line",
      data: []
    }
    // prepare close values

    // sma calculation
    let smaResult = SMA.calculate({ period: 5, values: this.candleClose })
    smaResult.forEach((smaValue, index) => {
      //period verschieben
      let period = index + 4
      const time = this.candleData[period].x
      smaObject.data.push({ x: (time), y: smaValue })
    })
    this.candleChartData.push(smaObject)

    this.bollingerBand()
  }
  bollingerBand() {
    // BollingerBand Indicator
    let BBObjectLow = {
      name: "Lower BollingerBand",
      type: "line",
      data: []
    }
    let BBObjectUp = {
      name: "Upper BollingerBand",
      type: "line",
      data: []
    }

    // BollingerBand calculation
    let bbResult = BollingerBands.calculate({ period: 21, stdDev: 3, values: this.candleClose })
    bbResult.forEach((BBValue, index) => {
      //period verschieben
      let period = index + 20
      const time = this.candleData[period].x
      BBObjectLow.data.push({ x: (time), y: BBValue.lower })
      BBObjectUp.data.push({ x: (time), y: BBValue.upper })
    })
    this.candleChartData.push(BBObjectLow)
    this.candleChartData.push(BBObjectUp)
    this.mixedChart.updateSeries(this.candleChartData)
    this.RSI()
  }
  RSI() {
    // clear old Data 
    this.rsiChartData = []
    // Relative Strength Index
    let RSIObject = {
      name: "Relative Strength Index",
      type: "line",
      data: []
    }
    // RSI calculation
    // fill 14 dummy times to bring Chart in the same spot as others
    this.candleData.forEach((dummytime, index) => {
      if (index < 14) {
        const emptytime = this.candleData[index].x
        RSIObject.data.push({ x: (emptytime), y: 50 })
      }
    })

    let rsiResult = RSI.calculate({ period: 14, values: this.candleClose })
    this.highestRSI = Math.max(...rsiResult);
    rsiResult.forEach((RSIValue, index) => {
      //period verschieben
      let period = index + 14
      const time = this.candleData[period].x
      RSIObject.data.push({ x: (time), y: RSIValue })

    })
    this.rsiChartData.push(RSIObject)
    this.Stoch()
  }
  Stoch() {

    let StochObjectD = {
      name: "Stochastic D",
      type: "line",
      data: []
    }
    let StochObjectK = {
      name: "Stochastic K",
      type: "line",
      data: []
    }

    let stochResult = Stochastic.calculate({ period: 14, low: this.candleLow, high: this.candleHigh, close: this.candleClose, signalPeriod: 3 })

    stochResult.forEach((STOCHValue, index) => {
      //period verschieben

      let period = index + 13
      const time = this.candleData[period].x

      StochObjectD.data.push({ x: (time), y: STOCHValue.d })
      StochObjectK.data.push({ x: (time), y: STOCHValue.k })
    })
    this.rsiChartData.push(StochObjectD)
    this.rsiChartData.push(StochObjectK)
    this.lineChart.updateSeries(this.rsiChartData)
  }



  // 7 Day Volume
  dailyVolume() {
    let params = new HttpParams()
      .set('symbol', this.pairSelect ? this.pairSelect : "BTCUSDT")
      .set('limit', "7")
      .set('interval', "1d");

    this.http.get(this.UrlCandle, { params }).subscribe(response => {
      this.volumeData = []
      let responseDate: any = response
      responseDate.map(r => {
        const volume = parseFloat(r[5])
        this.volumeData.push(
          Math.round(volume)
        )
      })
      this.chart2.updateSeries([{
        data: this.volumeData
      }])
    })
  }

  // Einmalig zur Befüllung der Autocomplete Liste
  getPriceTicker() {
    this.http.get(this.UrlTicker).subscribe(response => {
      this.priceTicker = response
      let symbolObject = {}
      for (let symbol of this.priceTicker) {
        symbolObject[symbol.symbol] = null
      }
      var elem = this.autocomplete.nativeElement
      var autocompleteInstance = M.Autocomplete.getInstance(elem);
      autocompleteInstance.updateData(symbolObject);
    }
    )
  }
  // Ticker zum ausgewählten Asset
  priceTickerSelectedCoin() {
    let params = new HttpParams()
      .set('symbol', this.pairSelect ? this.pairSelect : "BTCUSDT")
    this.http.get(this.UrlTicker, { params }).subscribe(response => {
      this.priceTickerSymbol = response
      this.lastPrice = this.priceTickerSymbol.lastPrice;
    })
  }

  buySellTicker(){
    let params = new HttpParams()
    .set('symbol', this.pairSelect ? this.pairSelect : "BTCUSDT")

  this.http.get("https://api.binance.com/api/v3/trades", { params }).subscribe(response => {
    let data: any = response
    let buyArray=[]
    let sellArray=[]
    let buyQty = 0
    let sellQty = 0
    
    for(let trade of data){
      if(trade.isBuyerMaker == true)
        sellArray.push(trade)
      else{
        buyArray.push(trade)
      }
    }
    for(let buy of buyArray){
      buyQty = buyQty + parseFloat(buy.qty)
    }
    for(let sell of sellArray){
      sellQty = sellQty + parseFloat(sell.qty)
    }
    let total = buyQty + sellQty;
    let buyPercent = (100 * buyQty) / total;
    let buyPercentToString = buyPercent.toString();
    let buyPercentToFixed:any = parseFloat(buyPercentToString).toFixed(0);
    if (this.percentBuy) {
      this.percentBuy.updateSeries([buyPercentToFixed]);
    }
  })
  }
}



