import { TestBed } from '@angular/core/testing';

import { BlynkService } from './blynk.service';

describe('BlynkService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BlynkService = TestBed.get(BlynkService);
    expect(service).toBeTruthy();
  });
});
