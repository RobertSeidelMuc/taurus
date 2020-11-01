import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransaktionsfeldComponent } from './transaktionsfeld.component';

describe('TransaktionsfeldComponent', () => {
  let component: TransaktionsfeldComponent;
  let fixture: ComponentFixture<TransaktionsfeldComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransaktionsfeldComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransaktionsfeldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
