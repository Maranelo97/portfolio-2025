import { TestBed } from '@angular/core/testing';
import { PLATFORM_ID } from '@angular/core';
import { PlatformService } from './platform';

describe('PlatformService', () => {
  it('should set isBrowser true when platform is browser', () => {
    TestBed.configureTestingModule({
      providers: [PlatformService, { provide: PLATFORM_ID, useValue: 'browser' }],
    });
    const svc = TestBed.inject(PlatformService);
    expect(svc.isBrowser).toBeTrue();
  });

  it('should set isServer true when platform is server', () => {
    TestBed.configureTestingModule({
      providers: [PlatformService, { provide: PLATFORM_ID, useValue: 'server' }],
    });
    const svc = TestBed.inject(PlatformService);
    expect(svc.isServer).toBeTrue();
  });
});
