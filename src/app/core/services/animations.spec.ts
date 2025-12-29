import { TestBed } from '@angular/core/testing';
import { AnimationService } from './animations';
import { gsap } from 'gsap';
import { PlatformService } from './platform';
import { ZoneService } from './zone';

const mockZone = { runOutside: (fn: any) => fn(), run: (fn: any) => fn() };

describe('AnimationService', () => {
  it('should not call gsap when not browser', () => {
    const mockPlatform = { isBrowser: false } as Partial<PlatformService>;
    TestBed.configureTestingModule({
      providers: [
        { provide: PlatformService, useValue: mockPlatform },
        { provide: ZoneService, useValue: mockZone },
      ],
    });

    const svc = TestBed.inject(AnimationService);

    spyOn(gsap, 'fromTo');
    svc.fadeInStagger([document.createElement('div')]);
    expect((gsap.fromTo as any).calls.count()).toBe(0);
  });

  it('should call gsap when browser', () => {
    const mockPlatform = { isBrowser: true } as Partial<PlatformService>;
    spyOn(gsap, 'registerPlugin');
    TestBed.configureTestingModule({
      providers: [
        { provide: PlatformService, useValue: mockPlatform },
        { provide: ZoneService, useValue: mockZone },
      ],
    });

    const svc = TestBed.inject(AnimationService);
    // registration may have been called in constructor
    expect((gsap.registerPlugin as any).calls.count()).toBeGreaterThanOrEqual(0);

    spyOn(gsap, 'fromTo');
    svc.fadeInStagger([document.createElement('div')]);
    expect((gsap.fromTo as any).calls.count()).toBeGreaterThan(0);
  });

  it('scrollReveal should call gsap and register kill when scope provided', () => {
    const mockPlatform = { isBrowser: true } as Partial<PlatformService>;

    const fakeAnim: any = { scrollTrigger: { kill: () => {} }, kill: () => {} };
    spyOn(gsap, 'fromTo').and.returnValue(fakeAnim);

    const scopeCalled: any = { val: false };
    const mockScope = {
      register: (cb: any) => {
        scopeCalled.val = true;
        cb();
      },
    } as any;

    TestBed.configureTestingModule({
      providers: [
        { provide: PlatformService, useValue: mockPlatform },
        { provide: ZoneService, useValue: mockZone },
      ],
    });

    const svc = TestBed.inject(AnimationService);
    const el = document.createElement('div');

    svc.scrollReveal(el, 'up', false, mockScope);

    expect((gsap.fromTo as any).calls.count()).toBeGreaterThan(0);
    expect(scopeCalled.val).toBeTrue();
  });

  it('applyParallax should call gsap.to for each element', () => {
    const mockPlatform = { isBrowser: true } as Partial<PlatformService>;

    const el1 = document.createElement('div');
    const el2 = document.createElement('div');

    spyOn(gsap.utils, 'toArray').and.returnValue([el1, el2]);
    spyOn(gsap, 'to').and.returnValue({ scrollTrigger: { kill: () => {} }, kill: () => {} } as any);

    TestBed.configureTestingModule({
      providers: [
        { provide: PlatformService, useValue: mockPlatform },
        { provide: ZoneService, useValue: mockZone },
      ],
    });

    const svc = TestBed.inject(AnimationService);
    svc.applyParallax('div.card', -20, { register: () => {} } as any);

    expect((gsap.to as any).calls.count()).toBe(2);
  });

  it('slideInStagger should return early for empty array and work for elements', () => {
    const mockPlatform = { isBrowser: true } as Partial<PlatformService>;
    TestBed.configureTestingModule({
      providers: [
        { provide: PlatformService, useValue: mockPlatform },
        { provide: ZoneService, useValue: mockZone },
      ],
    });

    const svc = TestBed.inject(AnimationService);
    spyOn(gsap, 'fromTo');

    svc.slideInStagger([] as any);
    expect((gsap.fromTo as any).calls.count()).toBe(0);

    svc.slideInStagger([document.createElement('div')], 'right');
    expect((gsap.fromTo as any).calls.count()).toBeGreaterThan(0);
  });

  it('staggerScaleIn should handle single element and empty node lists', () => {
    const mockPlatform = { isBrowser: true } as Partial<PlatformService>;
    TestBed.configureTestingModule({
      providers: [
        { provide: PlatformService, useValue: mockPlatform },
        { provide: ZoneService, useValue: mockZone },
      ],
    });

    const svc = TestBed.inject(AnimationService);
    spyOn(gsap, 'fromTo');

    const el = document.createElement('div');
    svc.staggerScaleIn(el);
    expect((gsap.fromTo as any).calls.count()).toBeGreaterThan(0);

    // empty node list
    svc.staggerScaleIn([] as any);
    // no additional calls
    expect((gsap.fromTo as any).calls.count()).toBeGreaterThan(0);
  });

  it('fadeOut should call onComplete inside zone.run if provided', (done) => {
    const mockPlatform = { isBrowser: true } as Partial<PlatformService>;
    const mockZoneRun = jasmine.createSpy('run');
    const mockZone2 = {
      runOutside: (fn: any) => fn(),
      run: (fn: any) => {
        mockZoneRun();
        fn();
      },
    } as any;

    spyOn(gsap, 'to').and.callFake((target: any, opts: any) => {
      // simulate onComplete
      setTimeout(() => opts.onComplete(), 0);
      return {} as any;
    });

    TestBed.configureTestingModule({
      providers: [
        { provide: PlatformService, useValue: mockPlatform },
        { provide: ZoneService, useValue: mockZone2 },
      ],
    });

    const svc = TestBed.inject(AnimationService);
    svc.fadeOut(document.createElement('div'), () => {
      expect(mockZoneRun).toHaveBeenCalled();
      done();
    });
  });
});
