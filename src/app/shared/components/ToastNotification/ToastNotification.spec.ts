import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ToastNotification } from './ToastNotification';
import { ZoneService } from '../../../core/services/zone';
import { AnimationService } from '../../../core/services/animations';

describe('ToastNotification', () => {
  let component: ToastNotification;
  let fixture: ComponentFixture<ToastNotification>;
  let zoneSvc: ZoneService;
  let animSvc: AnimationService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToastNotification],
      providers: [ZoneService, AnimationService],
    }).compileComponents();

    fixture = TestBed.createComponent(ToastNotification);
    component = fixture.componentInstance;
    zoneSvc = TestBed.inject(ZoneService);
    animSvc = TestBed.inject(AnimationService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not show when initialized without title or message', () => {
    component.title = '';
    component.message = '';
    fixture.detectChanges();
    expect(component.visible).toBeFalse();
  });

  it('should show when initialized with title', () => {
    component.title = 'Test Title';
    component.message = '';
    fixture.detectChanges();
    expect(component.visible).toBeTrue();
  });

  it('should show when initialized with message', () => {
    component.title = '';
    component.message = 'Test Message';
    fixture.detectChanges();
    expect(component.visible).toBeTrue();
  });

  it('should have success type by default', () => {
    expect(component.type).toBe('success');
  });

  it('should allow error type', () => {
    component.type = 'error';
    expect(component.type).toBe('error');
  });

  it('should set progress to 100 on show', () => {
    component.progress = 0;
    component.show();
    expect(component.progress).toBe(100);
  });

  it('show should make component visible', () => {
    component.visible = false;
    component.show();
    expect(component.visible).toBeTrue();
  });

  it('hide should add fade-out class to container', () => {
    component.toastContainer = { nativeElement: document.createElement('div') };
    component.hide();
    expect(component.toastContainer.nativeElement.classList.contains('fade-out')).toBeTrue();
  });

  it('hide should emit closed event', (done) => {
    component.toastContainer = { nativeElement: document.createElement('div') };
    let emitted = false;
    component.closed.subscribe(() => {
      emitted = true;
    });
    component.hide();
    setTimeout(() => {
      expect(emitted).toBeTrue();
      done();
    }, 700);
  });

  it('should have default duration of 4500ms', () => {
    expect(component.duration).toBe(4500);
  });

  it('should allow custom duration', () => {
    component.duration = 3000;
    expect(component.duration).toBe(3000);
  });

  it('should call staggerScaleIn on show when elements exist', () => {
    spyOn(animSvc, 'staggerScaleIn');
    component.toastContainer = {
      nativeElement: document.createElement('div'),
    };
    const span = document.createElement('span');
    component.toastContainer.nativeElement.appendChild(span);

    component.show();

    // The function calls staggerScaleIn with array of elements
    expect(animSvc.staggerScaleIn).toHaveBeenCalled();
  });

  it('should cleanup on destroy', () => {
    const scope = (component as any).scope;
    spyOn(scope, 'cleanup');
    component.ngOnDestroy();
    expect(scope.cleanup).toHaveBeenCalled();
  });

  it('should have visible as false initially', () => {
    expect(component.visible).toBeFalse();
  });

  it('should have progress at 100 initially', () => {
    expect(component.progress).toBe(100);
  });

  it('should start interval on show and clear it when progress reaches zero', (done) => {
    let intervalCb: any = null;
    // make Date.now deterministic so startTime and subsequent calls are predictable
    let nowCalls = 0;
    spyOn(Date, 'now').and.callFake(() => {
      nowCalls++;
      // first call: startTime inside show(); second call: during interval -> elapsed > duration
      return nowCalls === 1 ? 1000 : 1000 + component.duration + 10;
    });

    spyOn(window, 'setInterval').and.callFake((cb: any, _ms?: any) => {
      intervalCb = cb;
      return 999 as any;
    });
    const clearSpy = spyOn(window, 'clearInterval').and.callFake(() => {});
    const hideSpy = spyOn(component, 'hide');
    // ensure zone.run executes synchronously in test
    spyOn(zoneSvc, 'run').and.callFake((fn: any) => fn());

    // show starts the interval
    component.show();
    expect((window.setInterval as any).calls.count()).toBeGreaterThan(0);

    expect(intervalCb).toBeTruthy();
    intervalCb(); // should drive progress to <= 0 and call hide

    // allow zone.run and any timeouts queued inside to execute
    setTimeout(() => {
      expect(hideSpy).toHaveBeenCalled();
      expect(clearSpy).toHaveBeenCalled();
      done();
    }, 0);
  });
});
