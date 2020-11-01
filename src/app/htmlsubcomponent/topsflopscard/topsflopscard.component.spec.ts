import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TopsflopscardComponent } from './topsflopscard.component';

describe('TopsflopscardComponent', () => {
  let component: TopsflopscardComponent;
  let fixture: ComponentFixture<TopsflopscardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TopsflopscardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TopsflopscardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
