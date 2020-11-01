import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { take } from 'rxjs/operators';

declare var M: any;

@Component({
  selector: 'app-portfolio-overview',
  templateUrl: './portfolio-overview.component.html',
  styleUrls: ['./portfolio-overview.component.css']
})
export class PortfolioOverviewComponent implements OnInit {
  calculations;
  featureDetectInitialized = false;
  portolioOnServer;
  portfolioObservable;
  portfolios;
  newPortfolioName;
  tapTargetElems;
  tapTargetElem;
  myUserID;
  
  constructor(public auth: AuthService, private afs: AngularFirestore) { }

  addPortfolio() {
    this.afs.collection(`user/${this.myUserID}/aktiv-portfolio`).add({
      name: this.newPortfolioName
    })
      .then(function (docRef) {
      })
      .catch(function (error) {
        console.error("Fehler beim Anlegen des Doks: ", error);
      })
  }

  setNewPortfolioName(event) {
    this.newPortfolioName = event.target.value;
  }

  resetPortfolioNameInput() {
    this.newPortfolioName = null;
  }

  ngAfterViewChecked() {
    if (!this.tapTargetElems) {
      if (document.querySelectorAll('.tap-target').length > 0) {
        this.tapTargetElems = document.querySelectorAll('.tap-target');
      }
    }
    if (this.tapTargetElems && !this.tapTargetElem) {
      this.tapTargetElem = document.querySelector('.tap-target');
    }
    if (this.tapTargetElems && this.tapTargetElem && !this.featureDetectInitialized) {
      const tapTargetInstances = M.TapTarget.init(this.tapTargetElems, {});
      const tapTargetInstance = M.TapTarget.getInstance(this.tapTargetElem);
  
      setTimeout(()=>tapTargetInstance.open(), 500);
      setTimeout(()=>tapTargetInstance.close(), 3000);
      this.featureDetectInitialized = true;
    }
  }

  sortTable(portfolio) {
    if (!portfolio.sortUpwards) {
      portfolio.assetKeyArray.sort((a, b) => (a[0]).localeCompare(b[0]));
    }
    else {
      portfolio.assetKeyArray.sort((a, b) => (b[0]).localeCompare(a[0]));
    }
    portfolio.sortUpwards = !portfolio.sortUpwards;

  }

  ngAfterViewInit() {
    const modalOptions = {};
    var modalElems = document.querySelectorAll('.modal');
    var modalInstances = M.Modal.init(modalElems, modalOptions);

    this.auth.user.pipe(take(1)).subscribe(e => {
      this.myUserID = e.uid;
      this.portolioOnServer = this.afs.collection(`user/${e.uid}/aktiv-portfolio`)
      this.portfolioObservable = this.portolioOnServer.valueChanges({ idField: 'id' }).subscribe(res => { 
        // res = res.sort((a, b) => (a.name).localeCompare(b.name));
        let portfolioDaten = res.map(portfolio => {
          let portfolioObjekt = {
            name: portfolio.name,
            id: portfolio.id,
            assets: {}
          }
          for (const element in portfolio) {
            if (element != "name" && element != "id") {
              portfolioObjekt.assets[element] = portfolio[element];
            }
          }
          return portfolioObjekt;
        });
        this.portfolios = portfolioDaten;
      });
    });
  }

  ngOnInit(): void {
  }
}
