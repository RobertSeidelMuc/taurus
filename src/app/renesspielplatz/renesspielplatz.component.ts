import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AngularFireFunctions } from '@angular/fire/functions';
import { AuthService } from '../services/auth.service';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
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

export type PieChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: any;
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
};

export type mixedChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  title: ApexTitleSubtitle;
  tooltip: ApexTooltip;
  stroke: any; //ApexStroke
};
@Component({
  selector: 'app-renesspielplatz',
  templateUrl: './renesspielplatz.component.html',
  styleUrls: ['./renesspielplatz.component.css']
})

export class RenesspielplatzComponent implements OnInit {
  @ViewChild("chart") chart: ChartComponent;
  @ViewChild("chart2") chart2: ChartComponent;
  @ViewChild("chart3") chart3: ChartComponent;
  @ViewChild("lineChart") lineChart: ChartComponent;
  @ViewChild("mixedChart") mixedChart: ChartComponent;
  @ViewChild("autocomplete") autocomplete;
  public CandleChartOptions: Partial<CandleChartOptions>;
  public BarChart1: Partial<BarChartOptions>;
  public lineChartOptions: Partial<lineOptions>;
  public chartOptions3: Partial<PieChartOptions>;
  public mixedChartOptions: Partial<mixedChartOptions>;


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
  candleChartData = []
  rsiChartData = []
  volumeData
  smaData = []
  smaData2 = []
  mixedData = []
  // ----------------------
  // Select variables
  intervalSelect
  pairSelect
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

  testFun = this.fns.httpsCallable('testFunction')
  userCollection
  aktivPortfolioCollection
  constructor(private http: HttpClient, private fns: AngularFireFunctions, public auth: AuthService, private afs: AngularFirestore, ) {

  }

  ngOnInit(): void {
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
    setInterval(() => this.getCandle(), 10000),
    setInterval(() => (this.priceTickerSelectedCoin(), this.loading=true, setTimeout(() => this.loading=false, 2000)), 10000),

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
            inverseColors: true,
            opacityFrom: 1,
            opacityTo: 1,
            stops: [50, 0, 100, 100]
          }
        },

        yaxis: {
          axisBorder: {
            show: false
          },
          axisTicks: {
            show: false
          },
          labels: {
            formatter: function (val) {
              return val.toFixed(2)
            }
          }
        },
        title: {
          text: "Volume letzten 7 Tage",
          floating: false,
          offsetY: 320,
          align: "center",
          style: {
            color: "#ffffff"
          }
        },

      };
    this.chartOptions3 = {
      series: [],
      chart: {
        type: "donut"
      },
      labels: ["Team A", "Team B", "Team C", "Team D", "Team E"],
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200
            },
            legend: {
              position: "bottom"
            }
          }
        }
      ]
    };

    this.lineChartOptions = {
      series: [
        {
          name: "Desktops",
          data: [10, 41, 35, 51, 49, 62, 69, 91, 148]
        }
      ],

      chart: {
        height: 350,
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
      title: {
        text: "RSI & Stochastic Indicator (14)",
        align: "left"
      },
      grid: {
        row: {
          colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
          opacity: 0.5
        }
      },
      xaxis: {
        type: "datetime"
      },
      yaxis: {
        labels: {
          formatter: function (val) {
            return val.toFixed(2)
          }
        }
      }
    };
    this.mixedChartOptions = {
      series: [

      ],
      chart: {
        height: 550,
        type: "line"
      },
      title: {
        text: "CandleStick Chart",
        align: "left",
        style: {
          color:"#ffffff"
        }
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
            return val.toFixed(6)
          }
        },

      },
    };
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
    data.map(r => {
      const time = parseFloat(r[0])
      const open = parseFloat(r[1])
      const high = parseFloat(r[2])
      const low = parseFloat(r[3])
      const close = parseFloat(r[4])
      candleData.push(
        {
          x: time,
          y: [open, high, low, close]
        }
      )
    })
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
    })
  }


}



