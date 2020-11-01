import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TomsplaygroundComponent } from './tomsplayground.component';

describe('TomsplaygroundComponent', () => {
  let component: TomsplaygroundComponent;
  let fixture: ComponentFixture<TomsplaygroundComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TomsplaygroundComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TomsplaygroundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
