import { ProjectsList } from './ProjectsList';

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
    const mockAnim = { slideInStagger: jasmine.createSpy('slideInStagger') };

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
    pl.projectsService = { getAllProjects: () => 'X' } as any;
    pl.ngOnInit();
    expect(pl.projects$).toBe('X');
  });

  it('loadProjects triggers skeleton and animation', () => {
    pl.loadProjects();
    expect(pl.skeletonSvc.setLoading).toHaveBeenCalledWith(true);
    // since mock setOutsideTimeout runs immediately, startTransition should have run
    expect(pl.skeletonSvc.setLoading).toHaveBeenCalledWith(false);
    expect(pl.animSvc.slideInStagger).toHaveBeenCalled();
  });

  it('loadProjects does nothing when not browser', () => {
    pl.platformService = { isBrowser: false } as any;
    pl.skeletonSvc.setLoading.calls.reset();
    pl.loadProjects();
    expect(pl.skeletonSvc.setLoading).not.toHaveBeenCalled();
  });

  it('startTransition is idempotent and triggers animation once', () => {
    pl.animationTriggered = true;
    pl.animSvc.slideInStagger.calls.reset();
    pl.startTransition?.();
    expect(pl.animSvc.slideInStagger).not.toHaveBeenCalled();
  });

  it('triggerListAnimation should not call anim when no cards', () => {
    pl.el = { nativeElement: { querySelectorAll: () => [] } } as any;
    pl.animSvc.slideInStagger.calls.reset();
    (pl as any).triggerListAnimation();
    expect(pl.animSvc.slideInStagger).not.toHaveBeenCalled();
  });

  it('startTransition should call animSvc when cards exist', () => {
    pl.animationTriggered = false;
    pl.el = { nativeElement: { querySelectorAll: () => [{}, {}] } } as any;
    pl.startTransition?.();
    expect(pl.animSvc.slideInStagger).toHaveBeenCalled();
  });

  it('isLoading getter should reflect skeletonSvc state', () => {
    pl.skeletonSvc.isLoading = true;
    expect(pl.isLoading).toBeTrue();
    pl.skeletonSvc.isLoading = false;
    expect(pl.isLoading).toBeFalse();
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
    pl.animSvc.slideInStagger.calls.reset();

    pl.loadProjects();

    expect(pl.skeletonSvc.setLoading).toHaveBeenCalledWith(true);
    expect(pl.skeletonSvc.setLoading).toHaveBeenCalledWith(false);
    expect(pl.animSvc.slideInStagger).toHaveBeenCalled();
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
    pl.animSvc.slideInStagger.calls.reset();

    pl.loadProjects();

    expect(setSpy).toHaveBeenCalled();
    expect(scheduleSpy).toHaveBeenCalled();
    expect(pl.skeletonSvc.setLoading).toHaveBeenCalledWith(false);
  });

  it('triggerListAnimation calls animSvc.slideInStagger with direction left', () => {
    pl.el = { nativeElement: { querySelectorAll: () => [{}, {}] } } as any;
    pl.animSvc.slideInStagger.calls.reset();
    (pl as any).triggerListAnimation();
    expect(pl.animSvc.slideInStagger).toHaveBeenCalled();
    const args = pl.animSvc.slideInStagger.calls.argsFor(0);
    expect(args[1]).toBe('left');
  });
});
