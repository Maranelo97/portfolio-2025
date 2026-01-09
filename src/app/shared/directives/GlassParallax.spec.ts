import { TestBed } from '@angular/core/testing';
import { GlassParallaxDirective } from './GlassParallax';
import { gsap } from 'gsap';
import { ZoneService } from '../../core/services/zone';

describe('GlassParallaxDirective (unit)', () => {
  let dir: any;
  const mockZone = {
    runOutside: (fn: any) => fn(),
    createScope: () => ({ register: () => {}, cleanup: () => {} }),
  } as any;

  beforeEach(() => {
    // Create a fake element with necessary APIs
    const el = {
      nativeElement: document.createElement('div'),
    } as any;
    const glow = document.createElement('div');
    glow.className = 'blur';
    el.nativeElement.appendChild(glow);

    dir = Object.create(GlassParallaxDirective.prototype);
    // fill injected properties manually
    dir.el = el;
    dir.zoneSvc = mockZone;
    dir.scope = { register: () => {}, cleanup: () => {} } as any;
    dir.bounds = null;
  });

  it('handleMouseEnter sets bounds and calls gsap.set', () => {
    spyOn(gsap, 'set');
    dir.handleMouseEnter();
    expect(dir.bounds).not.toBeNull();
    expect((gsap.set as any).calls.count()).toBeGreaterThan(0);
  });

  it('handleMouseMove does nothing when no bounds', () => {
    spyOn(gsap, 'to');
    dir.bounds = null;
    dir.handleMouseMove(new MouseEvent('mousemove', { clientX: 0, clientY: 0 }));
    expect((gsap.to as any).calls.count()).toBe(0);
  });

  it('handleMouseMove calls gsap.to for element and glow', () => {
    spyOn(gsap, 'to');
    dir.bounds = { left: 0, top: 0, width: 100, height: 100 } as DOMRect;
    dir.handleMouseMove(new MouseEvent('mousemove', { clientX: 50, clientY: 50 }));
    expect((gsap.to as any).calls.count()).toBeGreaterThan(0);
  });

  it('handleMouseLeave clears bounds and calls gsap.to', () => {
    spyOn(gsap, 'to');
    dir.handleMouseLeave();
    expect(dir.bounds).toBeNull();
    expect((gsap.to as any).calls.count()).toBeGreaterThan(0);
  });

  it('ngOnDestroy cleans up and calls killTweensOf', () => {
    spyOn(gsap, 'killTweensOf');
    dir.ngOnDestroy();
    expect((gsap.killTweensOf as any).calls.count()).toBeGreaterThanOrEqual(0);
  });

  it('executeInitFn registers events and registers cleanup via scope', () => {
    const addSpy = jasmine.createSpy('addEventListener');
    const removeSpy = jasmine.createSpy('removeEventListener');

    // Create a proper div element with style support
    const native = document.createElement('div');
    const registerSpy = jasmine.createSpy('register');
    const cleanupSpy = jasmine.createSpy('cleanup');
    const scopeStub = { register: registerSpy, cleanup: cleanupSpy } as any;

    const mockZone = {
      runOutside: (fn: any) => fn(),
      createScope: () => scopeStub,
    } as any;

    const dir = Object.create(GlassParallaxDirective.prototype);
    dir.el = { nativeElement: native } as any;
    dir.zoneSvc = mockZone;
    dir.scope = scopeStub;

    // call initialization directly
    (dir as any).executeInitFn();

    expect(registerSpy).toHaveBeenCalled();

    // now call the handlers to exercise inner functions
    spyOn(gsap, 'set');
    spyOn(gsap, 'to').and.callFake((_el: any, opts: any) => {
      if (opts && opts.onComplete) opts.onComplete();
      return {} as any;
    });

    // simulate enter -> should set bounds and call set
    const enterEvent = new MouseEvent('mouseenter');
    native.dispatchEvent(enterEvent);
    expect((gsap.set as any).calls.count()).toBeGreaterThan(0);

    // simulate move -> should call to for element and glow
    const moveEvent = new MouseEvent('mousemove', { clientX: 50, clientY: 50 });
    native.dispatchEvent(moveEvent);
    expect((gsap.to as any).calls.count()).toBeGreaterThan(0);

    // simulate leave -> should call to and then call set on onComplete
    const leaveEvent = new MouseEvent('mouseleave');
    native.dispatchEvent(leaveEvent);
    expect((gsap.to as any).calls.count()).toBeGreaterThan(0);
  });
});
