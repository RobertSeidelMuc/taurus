import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RenesspielplatzComponent } from './renesspielplatz.component';

describe('RenesspielplatzComponent', () => {
  let component: RenesspielplatzComponent;
  let fixture: ComponentFixture<RenesspielplatzComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RenesspielplatzComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RenesspielplatzComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
