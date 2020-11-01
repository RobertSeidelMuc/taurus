import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { AuthService } from '../../services/auth.service';

const cryptoCurrencyNames = require('cryptocurrencies');

@Component({
  selector: 'app-topsflopscard',
  templateUrl: './topsflopscard.component.html',
  styleUrls: ['./topsflopscard.component.css']
})
export class TopsflopscardComponent implements OnInit {
  @Input() title;
  @Input() currencydata;
  cryptoCurrencyNames;

  constructor(public auth: AuthService) {
    this.cryptoCurrencyNames = cryptoCurrencyNames;
   }

  ngOnChanges(changes: SimpleChanges) {
    // only run when property "data" changed
    if (changes['currencydata']) {
    }
  }

  ngOnInit(): void {
  }

}
