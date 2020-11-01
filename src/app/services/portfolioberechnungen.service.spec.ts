import { TestBed } from '@angular/core/testing';

import { PortfolioberechnungenService } from './portfolioberechnungen.service';

describe('PortfolioberechnungenService', () => {
  let service: PortfolioberechnungenService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PortfolioberechnungenService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
