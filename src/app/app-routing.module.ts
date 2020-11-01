import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RobbisplaygroundComponent } from './robbisplayground/robbisplayground.component';
import { RenesspielplatzComponent } from './renesspielplatz/renesspielplatz.component';
import { TomsplaygroundComponent } from './tomsplayground/tomsplayground.component'
import { LandingPageComponent } from './landing-page/landing-page.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DatenschutzComponent } from './datenschutz/datenschutz.component';
import { ImpressumComponent } from './impressum/impressum.component';
import { TrendsComponent } from './trends/trends.component';
import { PortfolioComponent } from './portfolio/portfolio.component';
import { PortfolioDetailComponent } from './portfolio-detail/portfolio-detail.component';
import { TestkaufComponent } from './testkauf/testkauf.component';
import { WatchlistComponent } from './watchlist/watchlist.component';
import { AuthGuard } from './services/auth.guard';
import { WrongRouteComponent } from './wrong-route/wrong-route.component';
import { AssetTableComponent } from './asset-table/asset-table.component';
import { AssetDetailComponent } from './asset-detail/asset-detail.component';



const routes: Routes = [
  { path: '', component: LandingPageComponent },
  { path: 'dashboard', component: DashboardComponent,canActivate: [AuthGuard] },
  { path: 'datenschutz', component: DatenschutzComponent },
  { path: 'impressum', component: ImpressumComponent },
  { path: 'trends', component: TrendsComponent,canActivate: [AuthGuard] },
  { path: 'portfolio', component: PortfolioComponent,canActivate: [AuthGuard] },
  { path: 'portfolio-detail/:id', component: PortfolioDetailComponent,canActivate: [AuthGuard] },
  { path: 'rene', component: RenesspielplatzComponent,canActivate: [AuthGuard] },
  { path: 'robert', component: RobbisplaygroundComponent,canActivate: [AuthGuard] },
  { path: 'thomas', component: TomsplaygroundComponent,canActivate: [AuthGuard] },
  { path: 'testkauf', component: TestkaufComponent,canActivate: [AuthGuard] },
  { path: 'watchlist', component: WatchlistComponent,canActivate: [AuthGuard] },
  { path: 'assets', component: AssetTableComponent ,canActivate: [AuthGuard] },
  { path: 'asset-detail', component: AssetDetailComponent ,canActivate: [AuthGuard] },
  { path: 'asset-detail/:id', component: AssetDetailComponent ,canActivate: [AuthGuard] },
  { path: '**', pathMatch   : 'full', component: WrongRouteComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppRoutingModule { }
