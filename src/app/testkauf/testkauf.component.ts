import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-testkauf',
  templateUrl: './testkauf.component.html',
  styleUrls: ['./testkauf.component.css']
})
export class TestkaufComponent implements OnInit {
  objekt = {};
  myUserID;
  aktivPortfolioCollection;
  portfolioTabellenDaten;
  portfolioObjekte;
  showBuyOption = [];

  constructor(public auth: AuthService, private afs: AngularFirestore) { }

  ngOnInit(): void {
  }

}
