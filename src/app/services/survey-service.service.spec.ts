import { TestBed } from '@angular/core/testing';

import { SurveyServiceService } from './survey-service.service';

describe('SurveyServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SurveyServiceService = TestBed.get(SurveyServiceService);
    expect(service).toBeTruthy();
  });
});
