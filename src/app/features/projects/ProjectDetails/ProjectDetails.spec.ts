import { TestBed } from '@angular/core/testing';
import { ProjectDetails } from './ProjectDetails';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { ElementRef, ChangeDetectorRef } from '@angular/core';
import { of } from 'rxjs';

describe('ProjectDetails', () => {
  it('should exist', () => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of(convertToParamMap({})),
            queryParamMap: of(convertToParamMap({})),
          },
        },
        { provide: ElementRef, useValue: { nativeElement: document.createElement('div') } },
        {
          provide: ChangeDetectorRef,
          useValue: { detectChanges: () => {}, markForCheck: () => {} },
        },
        ProjectDetails,
      ],
    });
    const comp = TestBed.inject(ProjectDetails);
    expect(comp).toBeTruthy();
  });

  it('projectFound should be true by default', () => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of(convertToParamMap({})),
            queryParamMap: of(convertToParamMap({})),
          },
        },
        { provide: ElementRef, useValue: { nativeElement: document.createElement('div') } },
        {
          provide: ChangeDetectorRef,
          useValue: { detectChanges: () => {}, markForCheck: () => {} },
        },
        ProjectDetails,
      ],
    });
    const comp = TestBed.inject(ProjectDetails) as any;
    expect(comp.projectFound).toBeTrue();
  });

  it('activeLens should start as null', () => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of(convertToParamMap({})),
            queryParamMap: of(convertToParamMap({})),
          },
        },
        { provide: ElementRef, useValue: { nativeElement: document.createElement('div') } },
        {
          provide: ChangeDetectorRef,
          useValue: { detectChanges: () => {}, markForCheck: () => {} },
        },
        ProjectDetails,
      ],
    });
    const comp = TestBed.inject(ProjectDetails) as any;
    expect(comp.activeLens()).toBeNull();
  });

  it('isAiLoading should start as false', () => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of(convertToParamMap({})),
            queryParamMap: of(convertToParamMap({})),
          },
        },
        { provide: ElementRef, useValue: { nativeElement: document.createElement('div') } },
        {
          provide: ChangeDetectorRef,
          useValue: { detectChanges: () => {}, markForCheck: () => {} },
        },
        ProjectDetails,
      ],
    });
    const comp = TestBed.inject(ProjectDetails) as any;
    expect(comp.isAiLoading()).toBeFalse();
  });

  it('aiResponse should start as null', () => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of(convertToParamMap({})),
            queryParamMap: of(convertToParamMap({})),
          },
        },
        { provide: ElementRef, useValue: { nativeElement: document.createElement('div') } },
        {
          provide: ChangeDetectorRef,
          useValue: { detectChanges: () => {}, markForCheck: () => {} },
        },
        ProjectDetails,
      ],
    });
    const comp = TestBed.inject(ProjectDetails) as any;
    expect(comp.aiResponse()).toBeNull();
  });

  it('triggerAnimation should call animSvc when browser and items exist', (done) => {
    const mockPlatform = { isBrowser: true } as any;
    const called: any = { val: false };
    const mockAnim = { run: () => (called.val = true) } as any;
    const mockZone = { runOutside: (fn: any) => fn() } as any;

    TestBed.configureTestingModule({
      providers: [
        { provide: ElementRef, useValue: { nativeElement: document.createElement('div') } },
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of(convertToParamMap({})),
            queryParamMap: of(convertToParamMap({})),
          },
        },
        {
          provide: ChangeDetectorRef,
          useValue: { detectChanges: () => {}, markForCheck: () => {} },
        },
        ProjectDetails,
      ],
    });
    const comp = TestBed.inject(ProjectDetails) as any;
    comp.platformService = mockPlatform;
    comp.animSvc = mockAnim;
    comp.zoneService = mockZone;

    // create elements in DOM with class animate-item
    const el = document.createElement('div');
    el.className = 'container';
    const it = document.createElement('div');
    it.className = 'animate-item';
    el.appendChild(it);
    Object.defineProperty(comp, 'el', { value: { nativeElement: el } });

    // run - schedule rAF via setTimeout to avoid gsap internal RAF patches causing recursion
    spyOn(window, 'requestAnimationFrame').and.callFake((fn: any) => {
      return setTimeout(() => fn(0) as any, 0) as any;
    });

    comp['triggerAnimation']();
    // wait for scheduled rAF
    setTimeout(() => {
      expect(called.val).toBeTrue();
      done();
    }, 10);
  });

  it('goToLink should open window when url provided', () => {
    TestBed.configureTestingModule({
      providers: [
        { provide: ElementRef, useValue: { nativeElement: document.createElement('div') } },
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of(convertToParamMap({})),
            queryParamMap: of(convertToParamMap({})),
          },
        },
        {
          provide: ChangeDetectorRef,
          useValue: { detectChanges: () => {}, markForCheck: () => {} },
        },
        ProjectDetails,
      ],
    });

    const comp = TestBed.inject(ProjectDetails) as any;
    spyOn(window, 'open');

    (comp as any).goToLink('http://example.com');
    expect((window.open as any).calls.count()).toBeGreaterThan(0);
  });

  it('goToLink should do nothing when undefined', () => {
    TestBed.configureTestingModule({
      providers: [
        { provide: ElementRef, useValue: { nativeElement: document.createElement('div') } },
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of(convertToParamMap({})),
            queryParamMap: of(convertToParamMap({})),
          },
        },
        {
          provide: ChangeDetectorRef,
          useValue: { detectChanges: () => {}, markForCheck: () => {} },
        },
        ProjectDetails,
      ],
    });

    const comp = TestBed.inject(ProjectDetails) as any;
    spyOn(window, 'open');

    (comp as any).goToLink(undefined);
    expect((window.open as any).calls.count()).toBe(0);
  });

  it('runRealAiAudit should update isAiLoading state', async () => {
    const mockAiService = {
      getProjectAudit: jasmine
        .createSpy('getProjectAudit')
        .and.returnValue(Promise.resolve({ insight: 'test', blueprint: 'test' })),
    } as any;
    const mockCdr = {
      detectChanges: jasmine.createSpy('detectChanges'),
    } as any;

    TestBed.configureTestingModule({
      providers: [
        { provide: ElementRef, useValue: { nativeElement: document.createElement('div') } },
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of(convertToParamMap({})),
            queryParamMap: of(convertToParamMap({})),
          },
        },
        {
          provide: ChangeDetectorRef,
          useValue: mockCdr,
        },
        ProjectDetails,
      ],
    });

    const comp = TestBed.inject(ProjectDetails) as any;
    comp.aiService = mockAiService;
    comp.cdr = mockCdr;

    await comp['runRealAiAudit']('React', { id: '1', title: 'Project' });

    expect(mockCdr.detectChanges).toHaveBeenCalled();
    expect(comp.isAiLoading()).toBeFalse();
  });

  it('runRealAiAudit should handle errors', async () => {
    const mockAiService = {
      getProjectAudit: jasmine
        .createSpy('getProjectAudit')
        .and.returnValue(Promise.reject(new Error('API Error'))),
    } as any;
    const mockCdr = {
      detectChanges: jasmine.createSpy('detectChanges'),
    } as any;

    TestBed.configureTestingModule({
      providers: [
        { provide: ElementRef, useValue: { nativeElement: document.createElement('div') } },
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of(convertToParamMap({})),
            queryParamMap: of(convertToParamMap({})),
          },
        },
        {
          provide: ChangeDetectorRef,
          useValue: mockCdr,
        },
        ProjectDetails,
      ],
    });

    const comp = TestBed.inject(ProjectDetails) as any;
    comp.aiService = mockAiService;
    comp.cdr = mockCdr;

    await comp['runRealAiAudit']('React', { id: '1', title: 'Project' });

    expect(comp.aiResponse()).toEqual({
      insight: 'Error de conexión con el núcleo de IA.',
      blueprint: '[OFFLINE]',
    });
    expect(comp.isAiLoading()).toBeFalse();
  });
});
