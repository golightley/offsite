import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedbackRequestSubmittedPage } from './feedback-request-submitted.page';

describe('FeedbackRequestSubmittedPage', () => {
  let component: FeedbackRequestSubmittedPage;
  let fixture: ComponentFixture<FeedbackRequestSubmittedPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeedbackRequestSubmittedPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeedbackRequestSubmittedPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
