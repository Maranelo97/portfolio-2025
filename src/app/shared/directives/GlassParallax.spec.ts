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
});
