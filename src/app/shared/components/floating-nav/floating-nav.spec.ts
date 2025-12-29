import { TestBed } from '@angular/core/testing';
import { FloatingNav } from './floating-nav';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { FloatingCalcPositionService } from './floatingCalc';

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
    spyOn(document, 'createElement').and.callFake(
      () => ({ href: '', download: '', click: jasmine.createSpy('click') }) as any,
    );
    comp.isOpen = true;
    comp.downloadCv();
    expect(comp.isOpen).toBeFalse();
    expect((document.createElement as any).calls.count()).toBeGreaterThan(0);
  });
});
