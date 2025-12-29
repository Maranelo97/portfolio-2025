import { TestBed } from '@angular/core/testing';
import { ProjectDetails } from './ProjectDetails';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { ElementRef, ChangeDetectorRef } from '@angular/core';
import { ProjectsService } from '../../../core/services/projects';
import { of } from 'rxjs';

describe('ProjectDetails', () => {
  it('should mark projectFound false when no id', () => {
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
      expect(comp.projectFound).toBeFalse();
      expect(p).toBeNull();
    });
  });

  it('should get project when id present', (done) => {
    const mockProject = { id: 'x', title: 't' } as any;
    const mockProjects = { getProjectById: (id: string) => of(mockProject) } as any;
    const mockRoute = { paramMap: of(convertToParamMap({ id: 'x' })) };

    TestBed.configureTestingModule({
      providers: [
        { provide: ActivatedRoute, useValue: mockRoute },
        { provide: ProjectsService, useValue: mockProjects },
        { provide: ElementRef, useValue: { nativeElement: document.createElement('div') } },
        { provide: ChangeDetectorRef, useValue: { markForCheck: () => {} } },
        ProjectDetails,
      ],
    });

    const comp = TestBed.inject(ProjectDetails) as any;
    comp.projectsService = mockProjects;
    comp.ngOnInit();

    comp.project$.subscribe((p: any) => {
      expect(comp.projectFound).toBeTrue();
      expect(p).toEqual(mockProject);
      done();
    });
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

    // run
    comp.triggerAnimation();
    // animation uses requestAnimationFrame -> wait one tick
    setTimeout(() => {
      expect(called.val).toBeTrue();
      done();
    }, 20);
  });
});
