import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MiniAreaChartComponent } from './mini-area-chart.component';

describe('MiniAreaChartComponent', () => {
  let component: MiniAreaChartComponent;
  let fixture: ComponentFixture<MiniAreaChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MiniAreaChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MiniAreaChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
