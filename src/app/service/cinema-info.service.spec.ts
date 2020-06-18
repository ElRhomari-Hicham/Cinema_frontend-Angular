import { TestBed } from '@angular/core/testing';

import { CinemaInfoService } from './cinema-info.service';

describe('CinemaInfoService', () => {
  let service: CinemaInfoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CinemaInfoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
