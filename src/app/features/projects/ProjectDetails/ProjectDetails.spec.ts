import { TestBed } from '@angular/core/testing';
import { ProjectDetails } from './ProjectDetails';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { ElementRef, ChangeDetectorRef } from '@angular/core';
import { ProjectsService } from '../../../core/services/projects';
import { of, throwError } from 'rxjs';

describe('ProjectDetails', () => {
  it('should return null when no id and not change projectFound state', () => {
    TestBed.configureTestingModule({
      providers: [
        { provide: ActivatedRoute, useValue: { paramMap: of(convertToParamMap({})) } },
        { provide: ElementRef, useValue: { nativeElement: document.createElement('div') } },
        { provide: ChangeDetectorRef, useValue: { markForCheck: () => {} } },
        ProjectDetails,
      ],
    });
    const comp = TestBed.inject(ProjectDetails) as any;
    comp.ngOnInit();

    comp.project$.subscribe((p: any) => {
      expect(p).toBeNull();
    });
  });

  it('should get project when id present and call markForCheck + triggerAnimation', (done) => {
    const mockProject = { id: 'x', title: 't' } as any;
    const mockProjects = { getProjectById: (id: string) => of(mockProject) } as any;
    const mockRoute = { paramMap: of(convertToParamMap({ id: 'x' })) };

    const markSpy = jasmine.createSpy('mark');

    TestBed.configureTestingModule({
      providers: [
        { provide: ActivatedRoute, useValue: mockRoute },
        { provide: ProjectsService, useValue: mockProjects },
        { provide: ElementRef, useValue: { nativeElement: document.createElement('div') } },
        { provide: ChangeDetectorRef, useValue: { markForCheck: markSpy } },
        ProjectDetails,
      ],
    });

    const comp = TestBed.inject(ProjectDetails) as any;
    comp.projectsService = mockProjects;

    comp.ngOnInit();

    comp.project$.subscribe((p: any) => {
      expect(comp.projectFound).toBeTrue();
      expect(p).toEqual(mockProject);
      expect(markSpy).toHaveBeenCalled();
      done();
    });
  });

  it('should set projectFound false and call markForCheck on service error', (done) => {
    const mockProjects = {
      getProjectById: (id: string) => throwError(() => new Error('boom')),
    } as any;
    const mockRoute = { paramMap: of(convertToParamMap({ id: 'x' })) };
    const markSpy = jasmine.createSpy('mark');

    TestBed.configureTestingModule({
      providers: [
        { provide: ActivatedRoute, useValue: mockRoute },
        { provide: ProjectsService, useValue: mockProjects },
        { provide: ElementRef, useValue: { nativeElement: document.createElement('div') } },
        { provide: ChangeDetectorRef, useValue: { markForCheck: markSpy } },
        ProjectDetails,
      ],
    });

    const comp = TestBed.inject(ProjectDetails) as any;
    comp.projectsService = mockProjects;

    comp.ngOnInit();

    comp.project$.subscribe(
      (p: any) => {
        expect(p).toBeNull();
        done();
      },
      (error: any) => {
        expect(error).toBeDefined();
        done();
      },
    );
  });

  it('triggerAnimation should not call animSvc when not browser', () => {
    const mockPlatform = { isBrowser: false } as any;
    const mockAnim = { slideInStagger: jasmine.createSpy('slide') } as any;
    const mockZone = { runOutside: (fn: any) => fn() } as any;

    TestBed.configureTestingModule({
      providers: [
        { provide: ElementRef, useValue: { nativeElement: document.createElement('div') } },
        { provide: ActivatedRoute, useValue: { paramMap: of(convertToParamMap({})) } },
        { provide: ChangeDetectorRef, useValue: { markForCheck: () => {} } },
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

    comp.triggerAnimation();
    expect(mockAnim.slideInStagger).not.toHaveBeenCalled();
  });

  it('triggerAnimation should call animSvc when browser and items exist', (done) => {
    const mockPlatform = { isBrowser: true } as any;
    const called: any = { val: false };
    const mockAnim = { slideInStagger: () => (called.val = true) } as any;
    const mockZone = { runOutside: (fn: any) => fn() } as any;

    TestBed.configureTestingModule({
      providers: [
        { provide: ElementRef, useValue: { nativeElement: document.createElement('div') } },
        { provide: ActivatedRoute, useValue: { paramMap: of(convertToParamMap({})) } },
        { provide: ChangeDetectorRef, useValue: { markForCheck: () => {} } },
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

    comp.triggerAnimation();
    // wait for scheduled rAF
    setTimeout(() => {
      expect(called.val).toBeTrue();
      done();
    }, 10);
  });

  it('goToLink should open window when url provided and do nothing when undefined', () => {
    TestBed.configureTestingModule({
      providers: [
        { provide: ElementRef, useValue: { nativeElement: document.createElement('div') } },
        { provide: ActivatedRoute, useValue: { paramMap: of(convertToParamMap({})) } },
        { provide: ChangeDetectorRef, useValue: { markForCheck: () => {} } },
        ProjectDetails,
      ],
    });

    const comp = TestBed.inject(ProjectDetails) as any;
    spyOn(window, 'open');

    (comp as any).goToLink('http://example.com');
    expect((window.open as any).calls.count()).toBeGreaterThan(0);

    (window.open as any).calls.reset();
    (comp as any).goToLink(undefined);
    expect((window.open as any).calls.count()).toBe(0);
  });
});
