import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PortfoliooverviewcardComponent } from './portfoliooverviewcard.component';

describe('PortfoliooverviewcardComponent', () => {
  let component: PortfoliooverviewcardComponent;
  let fixture: ComponentFixture<PortfoliooverviewcardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PortfoliooverviewcardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PortfoliooverviewcardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
