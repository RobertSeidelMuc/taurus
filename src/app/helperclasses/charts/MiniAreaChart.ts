import { Inject, Injectable, ViewChild } from '@angular/core';
import {
  ChartComponent,
  ApexChart,
  ApexAxisChartSeries,
  ApexTitleSubtitle,
  ApexDataLabels,
  ApexFill,
  ApexYAxis,
  ApexXAxis,
  ApexTooltip,
  ApexMarkers,
  ApexAnnotations,
  ApexStroke
} from "ng-apexcharts";
import { KlineCandleDataFetcher } from "../apirequests/KlineCandleDataFetcher";
import { HttpClient } from '@angular/common/http';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  markers: ApexMarkers;
  title: ApexTitleSubtitle;
  fill: ApexFill;
  yaxis: ApexYAxis;
  xaxis: ApexXAxis;
  tooltip: ApexTooltip;
  stroke: ApexStroke;
  annotations: ApexAnnotations;
  colors: any;
  toolbar: any;
};

@Injectable({
  providedIn: 'root'
})

export class KlineCandleChart {
  @ViewChild("chart", { static: false }) chart: ChartComponent
  public chartOptions: Partial<ChartOptions>;
  public activeOptionButton = "all";
  public updateOptionsData = {
    "1m": {
      xaxis: {
        min: new Date("28 Jan 2013").getTime(),
        max: new Date("27 Feb 2013").getTime()
      }
    },
    "6m": {
      xaxis: {
        min: new Date("27 Sep 2012").getTime(),
        max: new Date("27 Feb 2013").getTime()
      }
    },
    "1y": {
      xaxis: {
        min: new Date("27 Feb 2012").getTime(),
        max: new Date("27 Feb 2013").getTime()
      }
    },
    "1yd": {
      xaxis: {
        min: new Date("01 Jan 2013").getTime(),
        max: new Date("27 Feb 2013").getTime()
      }
    },
    all: {
      xaxis: {
        min: undefined,
        max: undefined
      }
    }
  };


  http: HttpClient;
  klineGraphData: Array<[number,number]>[] = [];
  klineDataFetcher: KlineCandleDataFetcher;

  constructor(@Inject(HttpClient) http) {
    this.http = http;
    this.klineDataFetcher = new KlineCandleDataFetcher(this.http);
  }

  getKlineData = async (dataType, symbolsAndNames, interval, limit) => { 
    const series = []
    if (dataType === "kline") {
      for (let nameDataSet of symbolsAndNames) {
        await this.klineDataFetcher.fetchKlineData(nameDataSet.symbol, interval, limit);
      }
      this.klineGraphData = this.klineDataFetcher.klineGraphDataGetter;
      for (let i = 0; i < symbolsAndNames.length; i++) {
        const seriesDataSet = {
                                name: symbolsAndNames[i].name,
                                data: this.klineGraphData[i]
                              };
        series.push(seriesDataSet);
      }
    }
    else if (dataType === "candle") {
      
    }
    this.series = series;
  }

  public initKlineChartData = (title, symbolsAndNames, interval="1d", limit="500") => {    
    this.getKlineData('kline', symbolsAndNames, interval, limit);
    this.chart = {
      type: "area",
      stacked: false,
      height: 350,
      zoom: {
        type: "x",
        enabled: true,
        autoScaleYaxis: true
      },
      toolbar: {
        autoSelected: "zoom"
      }
    };
    this.dataLabels = {
      enabled: false
    };
    this.markers = {
      size: 0
    };
    this.title = {
      text: title,
      align: "left"
    };
    this.fill = {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        inverseColors: false,
        opacityFrom: 0.5,
        opacityTo: 0,
        stops: [0, 90, 100]
      }
    };
    this.yaxis = {
      labels: {
        formatter: function(val) {
          return (val).toFixed(2);
        }
      },
      title: {
        text: "Preis"
      }
    };
    this.xaxis = {
      type: "datetime"
    };
    this.tooltip = {
      shared: false,
      y: {
        formatter: function(val) {
          if (val > 50) {
            return (val).toFixed(0);
          }
          else if (val > 1) {
            return (val).toFixed(3);
          }
          else {
            return (val).toFixed(5);
          }
        }
      }
    };
  }

  public initCandleChartData = () => {

  }
}