import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ForgotEmailConfirmPage } from './forgot-email-confirm.page';

describe('ForgotEmailConfirmPage', () => {
  let component: ForgotEmailConfirmPage;
  let fixture: ComponentFixture<ForgotEmailConfirmPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ForgotEmailConfirmPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ForgotEmailConfirmPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
