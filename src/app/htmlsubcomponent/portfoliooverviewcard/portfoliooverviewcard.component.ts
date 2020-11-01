import { Component, OnInit, Input } from '@angular/core';
import { PortfolioberechnungenService } from '../../services/portfolioberechnungen.service';
import { AuthService } from '../../services/auth.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { take } from 'rxjs/operators';

declare var M;

@Component({
  selector: 'app-portfoliooverviewcard',
  templateUrl: './portfoliooverviewcard.component.html',
  styleUrls: ['./portfoliooverviewcard.component.css']
})
export class PortfoliooverviewcardComponent implements OnInit {
  @Input() portfolio;
  @Input() imageIndex;
  myUserID;
  imageURL;
  calculations;
  deleteModalId;
  deleteModalIdHref;
  deletionValidation;
  deleteModalIdInput;
  newPortfolioName;
  renameModalId;
  renameModalIdHref;
  renameModalIdInput;
  portfolioDevelopment;
  positiveDevelopment;
  developmentInterval;

  constructor(public auth: AuthService, private afs: AngularFirestore) {   
    this.calculations = new PortfolioberechnungenService;
  };

  deletePortfolio() {
    this.afs.collection(`user/${this.myUserID}/aktiv-portfolio/`).doc(this.portfolio.id).delete().then(function () { }).catch(function (error) {
      console.error("Error removing portfolio: ", error);
    });
  }

  renamePortfolio() {
    this.afs.collection(`user/${this.myUserID}/aktiv-portfolio/`).doc(this.portfolio.id).update({name: this.newPortfolioName});
  }

  setDeletionValidation(event) {
    this.deletionValidation = event.target.value;
  }

  resetDeletionInput() {
    this.deletionValidation = null;
  }

  resetRenameInput() {
    this.newPortfolioName = null;
  }

  setNewName(event) {
    this.newPortfolioName = event.target.value;
  }

  ngOnInit(): void {
    this.deleteModalId = this.portfolio.id + "-delete-portfolio-modal";
    this.deleteModalIdInput = this.deleteModalId + "-input";
    this.renameModalId = this.portfolio.id + "-rename-portfolio-modal";
    this.renameModalIdInput = this.renameModalId + "-input";
    this.deleteModalIdHref = "#" + this.deleteModalId;
    this.renameModalIdHref = "#" + this.renameModalId;
    
    this.imageURL = `../../../assets/graphics/portfolio-images/${(this.imageIndex + 5) % 5}.jpg`;
    if (this.portfolio.assets) {
      this.calculations.portfolioCalculation(this.portfolio.assets);
      
      this.developmentInterval = setInterval(() => {
        if (!this.calculations.HPR) {
          this.calculations.HPR = 0;
        }
  
        this.positiveDevelopment = 0;
        this.portfolioDevelopment = this.calculations.HPR.toLocaleString('de-DE', {style: 'decimal', maximumFractionDigits: 2, minimumFractionDigits: 2}) + String.fromCharCode(160) + "%";
        if (this.calculations.HPR > 0) {
          this.portfolioDevelopment = "+" + this.portfolioDevelopment;
          this.positiveDevelopment = 1;
        }
        else if (this.calculations.HPR < 0) {
          this.positiveDevelopment = -1;
        }
        else {
          this.portfolioDevelopment = " " + this.portfolioDevelopment;
        }
      }, 250);
    }

    const options = {};
    var elems = document.querySelectorAll('.modal');
    var instances = M.Modal.init(elems, options);

    this.auth.user.pipe(take(1)).subscribe(e => {
      this.myUserID = e.uid;
    });
  }

  ngOnDestroy() {
    clearInterval(this.developmentInterval);
    if (this.calculations.webSocket) {
      if (this.calculations.webSocket.readyState === WebSocket.OPEN) {
        this.calculations.webSocket.close();
      }
    }
  }
}
