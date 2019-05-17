import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PopoverReportComponent } from './popover-report.component';

describe('PopoverReportComponent', () => {
  let component: PopoverReportComponent;
  let fixture: ComponentFixture<PopoverReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopoverReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PopoverReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
