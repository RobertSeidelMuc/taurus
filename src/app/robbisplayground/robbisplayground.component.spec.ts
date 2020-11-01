import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RobbisplaygroundComponent } from './robbisplayground.component';

describe('RobbisplaygroundComponent', () => {
  let component: RobbisplaygroundComponent;
  let fixture: ComponentFixture<RobbisplaygroundComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RobbisplaygroundComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RobbisplaygroundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
