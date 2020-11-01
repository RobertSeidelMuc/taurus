import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PortfolioAssetDetailComponent } from './portfolio-asset-detail.component';

describe('PortfolioAssetDetailComponent', () => {
  let component: PortfolioAssetDetailComponent;
  let fixture: ComponentFixture<PortfolioAssetDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PortfolioAssetDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PortfolioAssetDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
