import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';
import {FormsModule} from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { RobbisplaygroundComponent } from './robbisplayground/robbisplayground.component';
import { RenesspielplatzComponent } from './renesspielplatz/renesspielplatz.component';
import { TomsplaygroundComponent } from './tomsplayground/tomsplayground.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgApexchartsModule } from 'ng-apexcharts';

import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';

import { environment } from '../environments/environment';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { MiniAreaChartComponent } from './helperclasses/charts/mini-area-chart/mini-area-chart.component';
import { PortfolioComponent } from './portfolio/portfolio.component';
import { TopsflopscardComponent } from './htmlsubcomponent/topsflopscard/topsflopscard.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { TrendsComponent } from './trends/trends.component';
import { PortfolioDetailComponent } from './portfolio-detail/portfolio-detail.component';
import { TestkaufComponent } from './testkauf/testkauf.component';
import { TransaktionsfeldComponent } from './htmlsubcomponent/transaktionsfeld/transaktionsfeld.component';
import { PortfolioOverviewComponent } from './portfolio-overview/portfolio-overview.component';
import { PortfoliooverviewcardComponent } from './htmlsubcomponent/portfoliooverviewcard/portfoliooverviewcard.component';
import { WrongRouteComponent } from './wrong-route/wrong-route.component';
import { registerLocaleData } from '@angular/common';
import localeDe from '@angular/common/locales/de';
import localeDeExtra from '@angular/common/locales/extra/de';
import { PortfolioAssetDetailComponent } from './portfolio-asset-detail/portfolio-asset-detail.component';
import { WatchlistComponent } from './watchlist/watchlist.component';
import { WatchlistcardComponent } from './htmlsubcomponent/watchlistcard/watchlistcard.component';
import { ImpressumComponent } from './impressum/impressum.component';
import { DatenschutzComponent } from './datenschutz/datenschutz.component';
import { AssetTableComponent } from './asset-table/asset-table.component';
import { AssetDetailComponent } from './asset-detail/asset-detail.component';
import { PortfolioAssetHistoryComponent } from './portfolio-asset-history/portfolio-asset-history.component';

import { CookieService } from "ngx-cookie-service";

registerLocaleData(localeDe, localeDeExtra);


@NgModule({
  declarations: [
    AppComponent,
    RobbisplaygroundComponent,
    RenesspielplatzComponent,
    TomsplaygroundComponent,
    LandingPageComponent,
    MiniAreaChartComponent,
    PortfolioComponent,
    TopsflopscardComponent,
    DashboardComponent,
    TrendsComponent,
    PortfolioDetailComponent,
    TestkaufComponent,
    TransaktionsfeldComponent,
    PortfolioOverviewComponent,
    PortfoliooverviewcardComponent,
    PortfolioAssetDetailComponent,
    WatchlistComponent,
    WatchlistcardComponent,
    ImpressumComponent,
    DatenschutzComponent,
    WrongRouteComponent,
    AssetTableComponent,
    AssetDetailComponent,
    PortfolioAssetHistoryComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    NgApexchartsModule,
    BrowserModule,
    AngularFirestoreModule,
    AngularFireModule.initializeApp(environment.firebase),
    FormsModule

  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'de-DE' },
    CookieService
  ],
  bootstrap: [AppComponent]
})

export class AppModule { }