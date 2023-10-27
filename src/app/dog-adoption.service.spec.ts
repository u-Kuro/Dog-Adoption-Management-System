import { TestBed } from '@angular/core/testing';

import { DogAdoptionService } from './dog-adoption.service';

describe('DogAdoptionService', () => {
  let service: DogAdoptionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DogAdoptionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
