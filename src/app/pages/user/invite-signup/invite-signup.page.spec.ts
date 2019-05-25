import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InviteSignupPage } from './invite-signup.page';

describe('InviteSignupPage', () => {
  let component: InviteSignupPage;
  let fixture: ComponentFixture<InviteSignupPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InviteSignupPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InviteSignupPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
