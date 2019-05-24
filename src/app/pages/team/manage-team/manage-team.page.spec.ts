import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageTeamPage } from './manage-team.page';

describe('ManageTeamPage', () => {
  let component: ManageTeamPage;
  let fixture: ComponentFixture<ManageTeamPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageTeamPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageTeamPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
