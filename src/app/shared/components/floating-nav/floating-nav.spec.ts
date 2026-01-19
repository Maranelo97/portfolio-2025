import { TestBed } from '@angular/core/testing';
import { FloatingNav } from './floating-nav';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { FloatingCalcPositionService } from './floatingCalc';
import { of } from 'rxjs';

describe('FloatingNav', () => {
  let comp: FloatingNav;
  let routerSpy: any;
  let locSpy: any;

  beforeEach(() => {
    routerSpy = {
      navigate: jasmine.createSpy('navigate'),
      url: '/',
      events: { pipe: () => ({ subscribe() {} }) },
    };
    locSpy = { back: jasmine.createSpy('back') };
    const calc = { calculateDirections: () => ({ dirX: -1, dirY: -1 }) };

    TestBed.configureTestingModule({
      providers: [
        FloatingNav,
        { provide: Router, useValue: routerSpy },
        { provide: Location, useValue: locSpy },
        { provide: FloatingCalcPositionService, useValue: calc },
      ],
    });

    comp = TestBed.inject(FloatingNav);
  });

  it('goBack should call location.back and close', () => {
    comp.isOpen = true;
    comp.goBack();
    expect(locSpy.back).toHaveBeenCalled();
    expect(comp.isOpen).toBeFalse();
  });

  it('goToHome should navigate and close', () => {
    comp.isOpen = true;
    comp.goToHome();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/']);
    expect(comp.isOpen).toBeFalse();
  });

  it('downloadCv should create and click link', () => {
    const fake = { href: '', download: '', click: jasmine.createSpy('click') } as any;
    spyOn(document, 'createElement').and.returnValue(fake);
    comp.isOpen = true;
    comp.downloadCv();
    expect(comp.isOpen).toBeFalse();
    expect((document.createElement as any).calls.count()).toBeGreaterThan(0);
    expect(fake.click.calls.count()).toBeGreaterThan(0);
  });

  it('ngOnInit should set shouldShowBackButton$ based on router url', (done) => {
    // root url should be false
    const { NavigationEnd } = require('@angular/router');
    routerSpy.url = '/';
    // ensure events is an observable that emits a NavigationEnd
    routerSpy.events = of(new NavigationEnd(1, '/', '/')) as any;

    const instance = TestBed.inject(FloatingNav);
    instance.ngOnInit();
    // take only the first emission (startWith) to avoid multiple calls
    const { take } = require('rxjs/operators');
    instance.shouldShowBackButton$.pipe(take(1)).subscribe((val: any) => {
      expect(val).toBeFalse();
      done();
    });
  });

  it('ngOnInit should emit true when not on root url', (done) => {
    const { NavigationEnd } = require('@angular/router');
    routerSpy.url = '/about';
    routerSpy.events = of(new NavigationEnd(1, '/about', '/about')) as any;

    const instance = TestBed.inject(FloatingNav);
    instance.ngOnInit();
    const { take } = require('rxjs/operators');
    instance.shouldShowBackButton$.pipe(take(1)).subscribe((val: any) => {
      expect(val).toBeTrue();
      done();
    });
  });

  it('onDragEnded should set dirX and dirY from calc service', () => {
    const instance = TestBed.inject(FloatingNav);
    const fakeEvent: any = {
      source: {
        getRootElement: () => ({
          getBoundingClientRect: () => ({ left: 0, top: 0, width: 10, height: 10 }),
        }),
      },
    };
    instance.onDragEnded(fakeEvent as any);
    expect(instance.dirX).toBe(-1);
    expect(instance.dirY).toBe(-1);
  });

  it('toggleMenu should not toggle when dragging (isDragging flag set)', () => {
    const instance = TestBed.inject(FloatingNav);
    instance.isOpen = false;
    (instance as any).isDragging = true;

    const ev = new Event('click');
    spyOn(ev, 'stopPropagation');
    instance.toggleMenu(ev);

    expect(ev.stopPropagation).toHaveBeenCalled();
    expect(instance.isOpen).toBeFalse();
  });

  it('toggleMenu should toggle when not dragging and call stopPropagation', () => {
    const instance = TestBed.inject(FloatingNav);
    instance.isOpen = false;
    spyOn(document, 'querySelector').and.returnValue(null);

    const ev: any = new Event('click');
    ev.stopPropagation = jasmine.createSpy('stop');

    instance.toggleMenu(ev);
    expect(ev.stopPropagation).toHaveBeenCalled();
    expect(instance.isOpen).toBeTrue();

    // toggle again should close
    instance.toggleMenu(ev);
    expect(instance.isOpen).toBeFalse();
  });
});
