import { TestBed } from '@angular/core/testing';
import { SkeletonService } from './skeleton';

describe('SkeletonService', () => {
  let service: SkeletonService;
  beforeEach(() => TestBed.configureTestingModule({ providers: [SkeletonService] }));

  it('should create', () => {
    service = TestBed.inject(SkeletonService);
    expect(service).toBeTruthy();
  });

  it('should toggle loading state', () => {
    service = TestBed.inject(SkeletonService);
    expect(service.isLoading).toBeTrue();
    service.setLoading(false);
    expect(service.isLoading).toBeFalse();
    service.setLoading(true);
    expect(service.isLoading).toBeTrue();
  });
});
