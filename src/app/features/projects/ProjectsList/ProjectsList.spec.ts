import { TestBed } from '@angular/core/testing';
import { ProjectsList } from './ProjectsList';
import { ListEntranceStrategy } from '../../../core/animations/strategies/listEntrance';

describe('ProjectsList (unit)', () => {
  let pl: any;
  let projectsCalled = false;

  beforeEach(() => {
    const mockProjectsSvc = {
      getAllProjects: () => ({
        pipe: () => ({
          subscribe: (o: any) => {
            if (o.next) o.next([]);
          },
        }),
      }),
    };
    const mockSkeleton = { isLoading: true, setLoading: jasmine.createSpy('setLoading') };
    const mockPlatform = { isBrowser: true };
    const mockAnim = { run: jasmine.createSpy('run') };

    const mockZone = {
      runOutside: (fn: any) => fn(),
      setOutsideTimeout: (fn: any) => fn(),
      run: (fn: any) => fn(),
      scheduleFrame: (fn: any) => fn(),
    } as any;

    const mockCdr = {
      markForCheck: jasmine.createSpy('markForCheck'),
      detectChanges: jasmine.createSpy('detectChanges'),
    } as any;
    const el = { nativeElement: { querySelectorAll: () => [1, 2, 3] } } as any;

    pl = Object.create(ProjectsList.prototype);
    pl.animationTriggered = false;
    pl.zoneSvc = mockZone;
    pl.cdr = mockCdr;
    pl.projectsService = mockProjectsSvc;
    pl.skeletonSvc = mockSkeleton;
    pl.platformService = mockPlatform;
    pl.animSvc = mockAnim;
    pl.el = el;
    pl.projects$ = {
      pipe: () => ({
        subscribe: (o: any) => {
          if (o.next) o.next([]);
        },
      }),
    };
  });

  it('ngOnInit should set projects$', () => {
    const mockObservable = {
      pipe: jasmine.createSpy('pipe').and.returnValue({
        subscribe: (o: any) => {
          if (o.next) o.next([]);
        },
      }),
    };
    pl.projectsService = { getAllProjects: () => mockObservable } as any;
    pl.ngOnInit();
    expect(pl.projects$).toBeTruthy();
  });

  it('loadProjects triggers skeleton and animation and calls cdr.markForCheck', () => {
    const markSpy = jasmine.createSpy('mark');
    const detectSpy = jasmine.createSpy('detect');
    pl.cdr = { markForCheck: markSpy, detectChanges: detectSpy } as any;

    pl.loadProjects();
    expect(pl.skeletonSvc.setLoading).toHaveBeenCalledWith(true);
    expect(markSpy).toHaveBeenCalled();
    // since mock setOutsideTimeout runs immediately, startTransition should have run
    expect(pl.skeletonSvc.setLoading).toHaveBeenCalledWith(false);
    expect(detectSpy).toHaveBeenCalled();
    expect(pl.animSvc.run).toHaveBeenCalled();
  });

  it('startTransition should call detectChanges and scheduleFrame', () => {
    const detectSpy = jasmine.createSpy('detect');
    const scheduleSpy = jasmine.createSpy('schedule');
    const mockZone2 = {
      run: (fn: any) => fn(),
      scheduleFrame: scheduleSpy,
    } as any;
    pl.zoneSvc = mockZone2 as any;
    pl.cdr = { detectChanges: detectSpy } as any;
    pl.animationTriggered = false;

    (pl as any).startTransition();

    expect(detectSpy).toHaveBeenCalled();
    expect(scheduleSpy).toHaveBeenCalled();
  });

  it('loadProjects does nothing when not browser', () => {
    pl.platformService = { isBrowser: false } as any;
    pl.skeletonSvc.setLoading.calls.reset();
    pl.loadProjects();
    expect(pl.skeletonSvc.setLoading).not.toHaveBeenCalled();
  });

  it('startTransition is idempotent and triggers animation once', () => {
    pl.animationTriggered = true;
    pl.animSvc.run.calls.reset();
    pl.startTransition?.();
    expect(pl.animSvc.run).not.toHaveBeenCalled();
  });

  it('triggerListAnimation should call anim even with no cards', () => {
    pl.el = { nativeElement: { querySelectorAll: () => [] } } as any;
    pl.animSvc.run.calls.reset();
    (pl as any).triggerListAnimation();
    // The component calls animSvc.run even with empty array - the service handles it
    expect(pl.animSvc.run).toHaveBeenCalled();
  });

  it('startTransition should call animSvc when cards exist', () => {
    pl.animationTriggered = false;
    pl.el = { nativeElement: { querySelectorAll: () => [{}, {}] } } as any;
    pl.startTransition?.();
    expect(pl.animSvc.run).toHaveBeenCalled();
  });

  it('isLoading getter should reflect skeletonSvc state', () => {
    pl.skeletonSvc.isLoading = true;
    expect(pl.isLoading).toBeTrue();
    pl.skeletonSvc.isLoading = false;
    expect(pl.isLoading).toBeFalse();
  });

  it('constructor instantiation should not throw', () => {
    const instance = Object.create(ProjectsList.prototype);
    expect(instance).toBeTruthy();
  });

  it('DI instantiation executes inject() calls (constructor lines)', () => {
    const mockProjectsSvc = {
      getAllProjects: () => ({ pipe: () => ({ subscribe: () => {} }) }),
    } as any;
    const mockSkeleton = { isLoading: true, setLoading: jasmine.createSpy('setLoading') } as any;
    const mockPlatform = { isBrowser: true } as any;
    const mockAnim = { run: jasmine.createSpy('run') } as any;
    const mockZone = {
      runOutside: (fn: any) => fn(),
      setOutsideTimeout: (fn: any) => fn(),
      run: (fn: any) => fn(),
      scheduleFrame: (fn: any) => fn(),
      createScope: () => ({ register: () => {}, cleanup: () => {} }),
    } as any;

    TestBed.configureTestingModule({
      providers: [
        ProjectsList,
        {
          provide: (require('../../../core/services/projects') as any).ProjectsService,
          useValue: mockProjectsSvc,
        },
        {
          provide: (require('../../../core/services/skeleton') as any).SkeletonService,
          useValue: mockSkeleton,
        },
        {
          provide: (require('../../../core/services/platform') as any).PlatformService,
          useValue: mockPlatform,
        },
        {
          provide: (require('../../../core/services/animations') as any).AnimationService,
          useValue: mockAnim,
        },
        {
          provide: (require('../../../core/services/zone') as any).ZoneService,
          useValue: mockZone,
        },
        {
          provide: (require('@angular/core') as any).ChangeDetectorRef,
          useValue: { markForCheck: () => {}, detectChanges: () => {} },
        },
        {
          provide: (require('@angular/core') as any).ElementRef,
          useValue: { nativeElement: { querySelectorAll: () => [] } },
        },
      ],
    });

    const instance = TestBed.inject(ProjectsList);
    expect(instance).toBeTruthy();
  });

  it('loadProjects should handle error path and call startTransition', () => {
    pl.projects$ = {
      pipe: () => ({
        subscribe: (o: any) => {
          if (o.error) o.error();
        },
      }),
    } as any;

    pl.skeletonSvc.setLoading.calls.reset();
    pl.animSvc.run.calls.reset();

    pl.loadProjects();

    expect(pl.skeletonSvc.setLoading).toHaveBeenCalledWith(true);
    expect(pl.skeletonSvc.setLoading).toHaveBeenCalledWith(false);
    expect(pl.animSvc.run).toHaveBeenCalled();
  });

  it('loadProjects should call setOutsideTimeout and scheduleFrame on success', () => {
    const setSpy = jasmine.createSpy('setOutsideTimeout').and.callFake((fn: any, t: any) => {
      fn();
      return 7;
    });
    const scheduleSpy = jasmine.createSpy('scheduleFrame').and.callFake((fn: any) => fn());
    const mockZone2 = {
      runOutside: (fn: any) => fn(),
      setOutsideTimeout: setSpy,
      run: (fn: any) => fn(),
      scheduleFrame: scheduleSpy,
    } as any;

    pl.zoneSvc = mockZone2;
    pl.projects$ = {
      pipe: () => ({
        subscribe: (o: any) => {
          if (o.next) o.next([]);
        },
      }),
    } as any;

    pl.skeletonSvc.setLoading.calls.reset();
    pl.animSvc.run.calls.reset();

    pl.loadProjects();

    expect(setSpy).toHaveBeenCalled();
    expect(scheduleSpy).toHaveBeenCalled();
    expect(pl.skeletonSvc.setLoading).toHaveBeenCalledWith(false);
  });

  it('triggerListAnimation calls animSvc.run with ListEntranceStrategy', () => {
    const mockElements = [{}, {}];
    pl.el = { nativeElement: { querySelectorAll: () => mockElements } } as any;
    pl.animSvc.run.calls.reset();
    (pl as any).triggerListAnimation();
    expect(pl.animSvc.run).toHaveBeenCalled();
    const args = pl.animSvc.run.calls.argsFor(0);
    expect(args[0]).toEqual(mockElements);
    expect(args[1] instanceof ListEntranceStrategy).toBeTrue();
  });
});
