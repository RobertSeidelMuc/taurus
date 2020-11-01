import { Component, OnInit, Input } from '@angular/core';
const ICON_BASE_URL = "../assets/cryptocurrency-icons/svg/color/";

@Component({
  selector: '[app-portfolio-asset-detail]',
  templateUrl: './portfolio-asset-detail.component.html',
  styleUrls: ['./portfolio-asset-detail.component.css']
})
export class PortfolioAssetDetailComponent implements OnInit {
  @Input() coin;
  @Input() index;
  tableDropDownArrow = "arrow_drop_down";
  tableDropDownHinweis = "Transaktionen dieses Coins einblenden";
  transactionsInvisible = true;
  iconUrl;

  constructor() { }
  
  expandTable = () => {
    this.transactionsInvisible = !this.transactionsInvisible;
    if (this.transactionsInvisible) {
      this.tableDropDownArrow = "arrow_drop_down";
      this.tableDropDownHinweis = "Transaktionen dieses Coins einblenden";
    }
    else {
      this.tableDropDownArrow = "arrow_drop_up";
      this.tableDropDownHinweis = "Transaktionen dieses Coins ausblenden";
    }
  }

  ngOnInit(): void {
    this.iconUrl = `${ICON_BASE_URL}${this.coin.name.toLowerCase()}.svg`;
  }

}
