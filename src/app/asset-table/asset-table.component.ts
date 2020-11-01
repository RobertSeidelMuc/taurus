import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { iconList } from '../global_constants/iconlist';
const ICON_BASE_URL = "../assets/cryptocurrency-icons/svg/color/";

declare var M: any;
@Component({
  selector: 'app-asset-table',
  templateUrl: './asset-table.component.html',
  styleUrls: ['./asset-table.component.css']
})
export class AssetTableComponent implements OnInit {
  // 0520118849745
  constructor(private http: HttpClient) { }
  UrlTicker = 'https://api.binance.com/api/v3/ticker/24hr'
  priceTicker
  filteredAssets
  selected
  pairSecondCoins = ["USDT", "BTC", "BUSD", "USDC", "PAX", "NGN", "ETH", "TUSD", "EUR", "TRY", "BNB", "TRX", "RUB", "IDRT", "ZAR", "XRP", "BIDR", "BKRW", "GBP", "UAH"];
  secondCoin
  firstCoin
  iconURL
  cutOffLength

  ngOnInit(): void {
    this.filterFirstCoin();
    const options = {};
    var elems = document.querySelectorAll('select');
    var instances = M.FormSelect.init(elems, options);
    this.getPriceTicker()
    setInterval(() => this.filterTicker(), 5000)
  }

  ngOnChanges() {
    this.filterTicker()
  }

  filterFirstCoin() {
    if (this.selected) {
      this.secondCoin = this.pairSecondCoins.find(coin => this.selected.endsWith(coin));
    }
    else {
      this.secondCoin = "USDT";
    }

    this.cutOffLength = this.secondCoin.length;
  }

  filterTicker() {
    if (!this.cutOffLength) {
      this.cutOffLength = 4;
    }

    let cutted = []
    let filtered = []
    for (let asset of this.priceTicker) {
      if (asset.symbol.endsWith(this.selected ? this.selected : "USDT")) {
        if (asset.lastPrice > 0) {
          filtered.push(asset)
        }
      }
    }
    for (let asset of filtered) {
      const firstCoin = asset.symbol.slice(0, -this.cutOffLength);
      let iconURL;
      if (iconList.includes(firstCoin.toLowerCase())) {
        iconURL = `${ICON_BASE_URL}${firstCoin.toLowerCase()}.svg`;
      }
      else {
        iconURL = "../assets/cryptocurrency-icons/svg/color/generic.svg";
      }

      let cuttedPrice
      if (asset.lastPrice > 100) {
        cuttedPrice = parseFloat(asset.lastPrice).toLocaleString('de-DE', { style: 'decimal', maximumFractionDigits: 2, minimumFractionDigits: 2});
      }
      else if (asset.lastPrice > 1) {

        cuttedPrice = parseFloat(asset.lastPrice).toLocaleString('de-DE', { style: 'decimal', maximumFractionDigits: 4, minimumFractionDigits: 4});
      }
      else if (asset.lastPrice > 0) {
        cuttedPrice = parseFloat(asset.lastPrice).toLocaleString('de-DE', { style: 'decimal', maximumFractionDigits: 6, minimumFractionDigits: 6});
      }
      let priceChangeFormatted = `${parseFloat(asset.priceChangePercent).toLocaleString('de-DE', {style: 'decimal', maximumFractionDigits: 2, minimumFractionDigits: 2})}${String.fromCharCode(160)}%`;

      let assetObject = {
        symbol: asset.symbol,
        lastPrice: cuttedPrice,
        priceChangePercentFormatted: priceChangeFormatted,
        priceChangePercent: asset.priceChangePercent,
        volume: parseFloat(asset.quoteVolume).toLocaleString('de-DE', { style: 'decimal', maximumFractionDigits: 0}),
        icon: iconURL 
      }
      cutted.push(assetObject)
    }
    cutted.sort((a, b) => b.volume - a.volume);
    this.filteredAssets = cutted;
  }

  getPriceTicker() {
    this.http.get(this.UrlTicker).subscribe(response => {
      this.priceTicker = response
      this.filterTicker()
    })
  }
}
