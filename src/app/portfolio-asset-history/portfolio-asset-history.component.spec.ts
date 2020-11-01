import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PortfolioAssetHistoryComponent } from './portfolio-asset-history.component';

describe('PortfolioAssetHistoryComponent', () => {
  let component: PortfolioAssetHistoryComponent;
  let fixture: ComponentFixture<PortfolioAssetHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PortfolioAssetHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PortfolioAssetHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
