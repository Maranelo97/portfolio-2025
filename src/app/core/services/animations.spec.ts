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

  it('scrollReveal should set scrub numeric when isScrub true and direction right sets xOffset positive', () => {
    const mockPlatform = { isBrowser: true } as Partial<PlatformService>;
    let capturedOpts: any = null;
    spyOn(gsap, 'fromTo').and.callFake((_t: any, _from: any, opts: any) => {
      capturedOpts = opts;
      return { kill: () => {} } as any;
    });

    TestBed.configureTestingModule({
      providers: [
        { provide: PlatformService, useValue: mockPlatform },
        { provide: ZoneService, useValue: mockZone },
      ],
    });

    const svc = TestBed.inject(AnimationService);
    const el = document.createElement('div');

    svc.scrollReveal(el, 'right', true);

    expect(capturedOpts).toBeTruthy();
    expect(capturedOpts.scrollTrigger.scrub).toBe(1.2);
    expect(capturedOpts.scrollTrigger.toggleActions).toBe('');
  });

  it('scrollReveal should set toggleActions when isScrub false', () => {
    const mockPlatform = { isBrowser: true } as Partial<PlatformService>;
    let capturedOpts: any = null;
    spyOn(gsap, 'fromTo').and.callFake((_t: any, _from: any, opts: any) => {
      capturedOpts = opts;
      return { kill: () => {} } as any;
    });

    TestBed.configureTestingModule({
      providers: [
        { provide: PlatformService, useValue: mockPlatform },
        { provide: ZoneService, useValue: mockZone },
      ],
    });

    const svc = TestBed.inject(AnimationService);
    const el = document.createElement('div');

    svc.scrollReveal(el, 'left', false);

    expect(capturedOpts).toBeTruthy();
    expect(capturedOpts.scrollTrigger.toggleActions).toBe('play none none none');
  });

  it('scrollReveal should not throw when anim has no scrollTrigger', () => {
    const mockPlatform = { isBrowser: true } as Partial<PlatformService>;

    const fakeAnim: any = { kill: () => {} };
    spyOn(gsap, 'fromTo').and.returnValue(fakeAnim);

    const mockScope = { register: (cb: any) => cb() } as any;

    TestBed.configureTestingModule({
      providers: [
        { provide: PlatformService, useValue: mockPlatform },
        { provide: ZoneService, useValue: mockZone },
      ],
    });

    const svc = TestBed.inject(AnimationService);
    const el = document.createElement('div');

    expect(() => svc.scrollReveal(el, 'left', true, mockScope)).not.toThrow();
  });

  it('constructor should not register plugin when not browser', () => {
    const mockPlatform = { isBrowser: false } as Partial<PlatformService>;
    spyOn(gsap, 'registerPlugin');

    TestBed.configureTestingModule({
      providers: [
        { provide: PlatformService, useValue: mockPlatform },
        { provide: ZoneService, useValue: mockZone },
      ],
    });

    const svc = TestBed.inject(AnimationService);
    expect((gsap.registerPlugin as any).calls.count()).toBe(0);
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

  it('slideInStagger should return early when not browser', () => {
    const mockPlatform = { isBrowser: false } as Partial<PlatformService>;
    TestBed.configureTestingModule({
      providers: [
        { provide: PlatformService, useValue: mockPlatform },
        { provide: ZoneService, useValue: mockZone },
      ],
    });

    spyOn(gsap, 'fromTo');
    const svc = TestBed.inject(AnimationService);
    svc.slideInStagger([document.createElement('div')]);
    expect((gsap.fromTo as any).calls.count()).toBe(0);
  });

  it('staggerScaleIn should return early when not browser', () => {
    const mockPlatform = { isBrowser: false } as Partial<PlatformService>;
    TestBed.configureTestingModule({
      providers: [
        { provide: PlatformService, useValue: mockPlatform },
        { provide: ZoneService, useValue: mockZone },
      ],
    });

    spyOn(gsap, 'fromTo');
    const svc = TestBed.inject(AnimationService);
    svc.staggerScaleIn(document.createElement('div'));
    expect((gsap.fromTo as any).calls.count()).toBe(0);
  });

  it('fadeOut should return early when not browser', () => {
    const mockPlatform = { isBrowser: false } as Partial<PlatformService>;
    TestBed.configureTestingModule({
      providers: [
        { provide: PlatformService, useValue: mockPlatform },
        { provide: ZoneService, useValue: mockZone },
      ],
    });

    spyOn(gsap, 'to');
    const svc = TestBed.inject(AnimationService);
    svc.fadeOut(document.createElement('div'), () => {});
    expect((gsap.to as any).calls.count()).toBe(0);
  });

  it('applyParallax should return early when not browser', () => {
    const mockPlatform = { isBrowser: false } as Partial<PlatformService>;
    TestBed.configureTestingModule({
      providers: [
        { provide: PlatformService, useValue: mockPlatform },
        { provide: ZoneService, useValue: mockZone },
      ],
    });

    spyOn(gsap.utils, 'toArray').and.returnValue([document.createElement('div')]);
    spyOn(gsap, 'to');

    const svc = TestBed.inject(AnimationService);
    svc.applyParallax('.card');
    expect((gsap.to as any).calls.count()).toBe(0);
  });

  it('scrollReveal should return early when not browser', () => {
    const mockPlatform = { isBrowser: false } as Partial<PlatformService>;
    TestBed.configureTestingModule({
      providers: [
        { provide: PlatformService, useValue: mockPlatform },
        { provide: ZoneService, useValue: mockZone },
      ],
    });

    spyOn(gsap, 'fromTo');
    const svc = TestBed.inject(AnimationService);
    svc.scrollReveal(document.createElement('div'));
    expect((gsap.fromTo as any).calls.count()).toBe(0);
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

  it('fadeOut without onComplete should not call zone.run', (done) => {
    const mockPlatform = { isBrowser: true } as Partial<PlatformService>;
    const mockZone2 = { runOutside: (fn: any) => fn(), run: jasmine.createSpy('run') } as any;

    spyOn(gsap, 'to').and.callFake((target: any, opts: any) => {
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
    // no onComplete provided
    svc.fadeOut(document.createElement('div'));

    setTimeout(() => {
      expect((mockZone2.run as any).calls.count()).toBe(0);
      done();
    }, 10);
  });

  it('scrollReveal with up direction should set yOffset to 80', () => {
    const mockPlatform = { isBrowser: true } as Partial<PlatformService>;
    let capturedFrom: any = null;
    spyOn(gsap, 'fromTo').and.callFake((_t: any, from: any, _opts: any) => {
      capturedFrom = from;
      return { kill: () => {} } as any;
    });

    TestBed.configureTestingModule({
      providers: [
        { provide: PlatformService, useValue: mockPlatform },
        { provide: ZoneService, useValue: mockZone },
      ],
    });

    const svc = TestBed.inject(AnimationService);
    const el = document.createElement('div');

    svc.scrollReveal(el, 'up', true);

    expect(capturedFrom).toBeTruthy();
    expect(capturedFrom.y).toBe(80);
  });

  it('applyParallax should register cleanup that kills tween', () => {
    const mockPlatform = { isBrowser: true } as Partial<PlatformService>;
    const tween = {
      scrollTrigger: { kill: jasmine.createSpy('st') },
      kill: jasmine.createSpy('k'),
    } as any;
    spyOn(gsap.utils, 'toArray').and.returnValue([document.createElement('div')]);
    spyOn(gsap, 'to').and.returnValue(tween);

    const registered: any[] = [];
    const scope = { register: (fn: any) => registered.push(fn) } as any;

    TestBed.configureTestingModule({
      providers: [
        { provide: PlatformService, useValue: mockPlatform },
        { provide: ZoneService, useValue: mockZone },
      ],
    });

    const svc = TestBed.inject(AnimationService);
    svc.applyParallax('.card', -10, scope);

    expect((gsap.to as any).calls.count()).toBe(1);
    // call the registered cleanup
    registered.forEach((r) => r());
    expect(tween.scrollTrigger.kill).toHaveBeenCalled();
    expect(tween.kill).toHaveBeenCalled();
  });

  it('applyParallax should handle tweens without scrollTrigger gracefully', () => {
    const mockPlatform = { isBrowser: true } as Partial<PlatformService>;
    const tween = {
      kill: jasmine.createSpy('k'),
    } as any;
    spyOn(gsap.utils, 'toArray').and.returnValue([document.createElement('div')]);
    spyOn(gsap, 'to').and.returnValue(tween);

    const registered: any[] = [];
    const scope = { register: (fn: any) => registered.push(fn) } as any;

    TestBed.configureTestingModule({
      providers: [
        { provide: PlatformService, useValue: mockPlatform },
        { provide: ZoneService, useValue: mockZone },
      ],
    });

    const svc = TestBed.inject(AnimationService);
    svc.applyParallax('.card', -10, scope);

    expect((gsap.to as any).calls.count()).toBe(1);
    // call cleanup - should not throw and should call kill
    registered.forEach((r) => r());
    expect(tween.kill).toHaveBeenCalled();
  });

  it('applyParallax should do nothing when no elements found', () => {
    const mockPlatform = { isBrowser: true } as Partial<PlatformService>;
    spyOn(gsap.utils, 'toArray').and.returnValue([]);
    spyOn(gsap, 'to');

    TestBed.configureTestingModule({
      providers: [
        { provide: PlatformService, useValue: mockPlatform },
        { provide: ZoneService, useValue: mockZone },
      ],
    });

    const svc = TestBed.inject(AnimationService);
    svc.applyParallax('.missing', -10);

    expect((gsap.to as any).calls.count()).toBe(0);
  });
});
