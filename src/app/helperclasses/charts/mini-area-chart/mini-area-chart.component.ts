import { Component, OnInit, ViewChild, Input } from '@angular/core';
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
import { LinedatafetcherService } from '../../apirequests/linedatafetcher.service'

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
  grid?: any;
};

@Component({
  selector: 'app-mini-area-chart',
  templateUrl: './mini-area-chart.component.html',
  styleUrls: ['./mini-area-chart.component.css']
})
export class MiniAreaChartComponent implements OnInit {
  @Input() symbol;
  @Input() colorindicator;
  @Input() changeinpercent;
  seriesdata: Array<[number, number]>;
  datafetcher;
  seriesColor;
  formerChange;
  checkChangesInterval;
  twoMinuteInterval;

  @ViewChild("chart", { static: false }) chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;
  public activeOptionButton = "all";

  constructor(datafetcher: LinedatafetcherService) {
    this.datafetcher = datafetcher;
  }

  updateChartOptions = async (colorChange) => {
    this.seriesdata = await this.datafetcher.fetchKlineData(`${this.symbol}USDT`, "1h", 25);
    if (!colorChange) {
      this.chart.updateSeries([
        {
          data: this.seriesdata,
        },
      ]);
    }
    else {
      this.chartOptions = {
        series: [
          {
            data: this.seriesdata
          }
        ],
        chart: {
          type: "area",
          height: "auto",
          animations: {
            enabled: false
          },
          toolbar: {
            show: false
          },
          zoom: {
            enabled: false
          }
        },
        annotations: { },
        dataLabels: {
          enabled: false
        },
        markers: {
          size: 0
        },
        xaxis: {
          labels: {
            show: false
          },
          axisTicks: {
            show: false
          },
          axisBorder: {
            show: false
          }
        },
        yaxis: {
          labels: {
            show: false
          },
          axisTicks: {
            show: false
          },
          axisBorder: {
            show: false
          }
        },
        tooltip: {
          enabled: false
        },
        fill: {
          type: "gradient",
          gradient: {
            shadeIntensity: 1,
            opacityFrom: 0.7,
            opacityTo: 0.9,
            stops: [0, 100]
          }
        },
        grid: {
          show: false
        },
        stroke: {
          width: 1.5,
          curve: 'smooth',
          lineCap: 'round'
        },
        colors: [this.seriesColor]
      }
    }
  }

  checkForChanges = () => {
    //check if the path has changed from negative to positive or vice versa
    let update = false;
    let currentChange = this.changeinpercent.repeat(1);
    let color = "#f44336";
    let colorChange = false;
    currentChange = currentChange.replace(",", ".");

    if (parseFloat(currentChange) * this.formerChange <= 0) {
      if (parseFloat(currentChange) >= 0) {
        color = "#32cd32";
      }
  
      if (this.seriesColor !== color) {
        update = true;
        colorChange = true;
        this.seriesColor = color;
      }
    }
    if (parseFloat(currentChange) - this.formerChange >= 0.5 || parseFloat(currentChange) - this.formerChange <= -0.5) {
      update = true;
    }

    if (update) {
      this.formerChange = parseFloat(currentChange);
      this.updateChartOptions(colorChange);
    }
  }

  ngOnInit(): void {
    let changeTransformString = this.changeinpercent.repeat(1);
    changeTransformString = changeTransformString.replace(",", ".");
    this.formerChange = parseFloat(changeTransformString);
    if (this.colorindicator >= 0) {
      this.seriesColor = "#32cd32";
    }
    else {
      this.seriesColor = "#f44336";
    }
    (async () => {
      this.seriesdata = await this.datafetcher.fetchKlineData(`${this.symbol}USDT`, "1h", 24);
      this.chartOptions = {
        series: [
          {
            data: this.seriesdata
          }
        ],
        chart: {
          type: "area",
          height: "auto",
          animations: {
            enabled: false
          },
          toolbar: {
            show: false
          },
          zoom: {
            enabled: false
          }
        },
        annotations: { },
        dataLabels: {
          enabled: false
        },
        markers: {
          size: 0
        },
        xaxis: {
          labels: {
            show: false
          },
          axisTicks: {
            show: false
          },
          axisBorder: {
            show: false
          }
        },
        yaxis: {
          labels: {
            show: false
          },
          axisTicks: {
            show: false
          },
          axisBorder: {
            show: false
          }
        },
        tooltip: {
          enabled: false
        },
        fill: {
          type: "gradient",
          gradient: {
            shadeIntensity: 1,
            opacityFrom: 0.7,
            opacityTo: 0.9,
            stops: [0, 100]
          }
        },
        grid: {
          show: false
        },
        stroke: {
          width: 1.5,
          curve: 'smooth',
          lineCap: 'round'
        },
        colors: [this.seriesColor]
      }
    })();
    this.checkChangesInterval = setInterval(() => this.checkForChanges(), 1000);
    this.twoMinuteInterval = setInterval(() => this.updateChartOptions(this.seriesColor), 2 * 60 * 1000);
  }

  ngOnDestroy() {
    clearInterval(this.checkChangesInterval);
    clearInterval(this.twoMinuteInterval);
  }
}
