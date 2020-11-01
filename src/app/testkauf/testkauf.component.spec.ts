import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestkaufComponent } from './testkauf.component';

describe('TestkaufComponent', () => {
  let component: TestkaufComponent;
  let fixture: ComponentFixture<TestkaufComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestkaufComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestkaufComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
