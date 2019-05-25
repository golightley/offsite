import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvitedTeamListPage } from './invited-team-list.page';

describe('InvitedTeamListPage', () => {
  let component: InvitedTeamListPage;
  let fixture: ComponentFixture<InvitedTeamListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvitedTeamListPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvitedTeamListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
