import { TestBed } from '@angular/core/testing';

import { LinedatafetcherService } from './linedatafetcher.service';

describe('LinedatafetcherService', () => {
  let service: LinedatafetcherService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LinedatafetcherService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
