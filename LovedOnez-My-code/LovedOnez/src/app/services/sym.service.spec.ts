import { TestBed } from '@angular/core/testing';

import { SymService } from './sym.service';

describe('SymService', () => {
  let service: SymService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SymService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
