import { TestBed } from '@angular/core/testing';
import { ToastNotification } from './ToastNotification';
import { ZoneService } from '../../../core/services/zone';
import { AnimationService } from '../../../core/services/animations';

describe('ToastNotification', () => {
  let tn: any;
  let closedCalled = false;
  const mockZone = {
    runOutside: (fn: any) => fn(),
    setOutsideTimeout: (fn: any) => {
      // call synchronously to simulate timeout
      fn();
      return 1;
    },
    clearOutsideTimeout: () => {},
    run: (fn: any) => fn(),
    createScope: () => ({ register: () => {}, cleanup: () => {} }),
  } as any;
  const mockAnim = { staggerScaleIn: () => {} } as any;
  const mockCdr = { detectChanges: () => {}, markForCheck: () => {} } as any;

  beforeEach(() => {
    tn = Object.create(ToastNotification.prototype);
    tn.type = 'success';
    tn.title = 'T';
    tn.message = 'M';
    tn.duration = 10;
    tn.zoneSvc = mockZone;
    tn.animSvc = mockAnim;
    tn.cdr = mockCdr;
    tn.scope = { register: () => {}, cleanup: () => {} };
    tn.toastContainer = { nativeElement: document.createElement('div') } as any;
    tn.closed = { emit: () => (closedCalled = true) } as any;
  });

  it('show should display and schedule hide', () => {
    tn.show();
    expect(tn.visible).toBeFalse(); // hide called synchronously by our mock timeouts
    expect(closedCalled).toBeTrue();
  });

  it('hide should add fade-out and schedule closed emit', () => {
    closedCalled = false;
    tn.toastContainer = { nativeElement: document.createElement('div') } as any;
    tn.hide();
    expect(tn.toastContainer.nativeElement.classList.contains('fade-out')).toBeTrue();
    expect(closedCalled).toBeTrue();
  });

  it('show should call animSvc when p elements present and register cleanup', () => {
    const spyAnim = jasmine.createSpy('stagger');
    const mockScope = { register: jasmine.createSpy('register'), cleanup: () => {} } as any;
    tn.animSvc = { staggerScaleIn: spyAnim } as any;
    tn.scope = mockScope as any;

    const container = document.createElement('div');
    const p1 = document.createElement('p');
    const p2 = document.createElement('p');
    container.appendChild(p1);
    container.appendChild(p2);
    tn.toastContainer = { nativeElement: container } as any;

    tn.show();

    expect(spyAnim).toHaveBeenCalled();
    expect(mockScope.register).toHaveBeenCalled();

    // verify cleanup calls clearOutsideTimeout
    const clearSpy = jasmine.createSpy('clear');
    const mockZone2 = {
      runOutside: (fn: any) => fn(),
      setOutsideTimeout: (fn: any) => 123,
      clearOutsideTimeout: clearSpy,
      run: (fn: any) => fn(),
      createScope: () => ({ register: () => {}, cleanup: () => {} }),
    } as any;

    tn.zoneSvc = mockZone2;
    const scopeWithRegister = { register: jasmine.createSpy('register') } as any;
    tn.scope = scopeWithRegister;

    tn.show();
    const regFn = scopeWithRegister.register.calls.argsFor(0)[0];
    regFn();
    expect(clearSpy).toHaveBeenCalledWith(123);
  });

  it('ngOnInit should not show when there is no title and message', () => {
    tn.title = '';
    tn.message = '';
    tn.visible = false;
    tn.ngOnInit();
    expect(tn.visible).toBeFalse();
  });

  it('ngOnInit should call show when title or message present', () => {
    const tn2 = Object.create(ToastNotification.prototype) as any;
    tn2.title = 'Hello';
    tn2.message = '';
    spyOn(tn2, 'show');
    tn2.ngOnInit();
    expect(tn2.show).toHaveBeenCalled();
  });

  it('TestBed should instantiate the component and run property initializers & ngOnInit', async () => {
    const scope = {
      register: jasmine.createSpy('register'),
      cleanup: jasmine.createSpy('cleanup'),
    };

    const zoneStub = {
      createScope: () => scope,
      runOutside: (fn: any) => fn(),
      setOutsideTimeout: jasmine.createSpy('setOutsideTimeout').and.returnValue(77),
      clearOutsideTimeout: jasmine.createSpy('clear'),
      run: (fn: any) => fn(),
    } as any;

    const animStub = { staggerScaleIn: jasmine.createSpy('stagger') } as any;

    TestBed.configureTestingModule({
      imports: [ToastNotification],
      providers: [
        { provide: ZoneService, useValue: zoneStub },
        { provide: AnimationService, useValue: animStub },
      ],
    });

    const fixture = TestBed.createComponent(ToastNotification);
    const comp = fixture.componentInstance as any;

    // property initializers should be applied
    expect(comp.type).toBe('success');
    expect(comp.duration).toBe(4000);

    spyOn(comp, 'show').and.callThrough();
    comp.title = 'Hello';
    comp.message = 'world';

    comp.ngOnInit();
    expect(comp.show).toHaveBeenCalled();
  });

  it('show registers cleanup that clears timeout', () => {
    const clearSpy = jasmine.createSpy('clear');
    const mockZone2 = {
      runOutside: (fn: any) => fn(),
      setOutsideTimeout: (fn: any) => 77,
      clearOutsideTimeout: clearSpy,
      run: (fn: any) => fn(),
      createScope: () => ({ register: () => {}, cleanup: () => {} }),
    } as any;

    const scopeWithRegister = { register: jasmine.createSpy('register') } as any;
    tn.zoneSvc = mockZone2;
    tn.scope = scopeWithRegister;
    tn.toastContainer = undefined as any;

    tn.show();

    const regFn = scopeWithRegister.register.calls.argsFor(0)[0];
    regFn();
    expect(clearSpy).toHaveBeenCalledWith(77);
  });

  it('show should call animSvc twice with correct args and register cleanup', () => {
    const spyAnim = jasmine.createSpy('stagger');
    const mockScope = { register: jasmine.createSpy('register'), cleanup: () => {} } as any;
    tn.animSvc = { staggerScaleIn: spyAnim } as any;
    tn.scope = mockScope as any;

    const container = document.createElement('div');
    const p1 = document.createElement('p');
    const p2 = document.createElement('p');
    container.appendChild(p1);
    container.appendChild(p2);
    tn.toastContainer = { nativeElement: container } as any;

    tn.show();

    expect(spyAnim.calls.count()).toBe(2);
    const firstArgs = spyAnim.calls.argsFor(0);
    const secondArgs = spyAnim.calls.argsFor(1);
    expect(Array.isArray(firstArgs[0])).toBeTrue();
    expect(firstArgs[1]).toBe(0.1);
    expect(secondArgs[0]).toBe(container);
    expect(secondArgs[1]).toBe(0);
    expect(mockScope.register).toHaveBeenCalled();
  });

  it('show registers cleanup that clears timeout (alternate path)', () => {
    const clearSpy = jasmine.createSpy('clear');
    const mockZone2 = {
      runOutside: (fn: any) => fn(),
      setOutsideTimeout: (fn: any) => 123,
      clearOutsideTimeout: clearSpy,
      run: (fn: any) => fn(),
      createScope: () => ({ register: () => {}, cleanup: () => {} }),
    } as any;

    tn.zoneSvc = mockZone2;
    const scopeWithRegister = { register: jasmine.createSpy('register') } as any;
    tn.scope = scopeWithRegister;

    tn.show();
    const regFn = scopeWithRegister.register.calls.argsFor(0)[0];
    regFn();
    expect(clearSpy).toHaveBeenCalledWith(123);
  });

  it('hide should add fade-out and call cdr.markForCheck after timeout', () => {
    const markSpy = jasmine.createSpy('mark');
    const mockZone2 = {
      runOutside: (fn: any) => fn(),
      setOutsideTimeout: (fn: any) => {
        // call immediately
        fn();
        return 99;
      },
      clearOutsideTimeout: jasmine.createSpy('clear'),
      run: (fn: any) => fn(),
      createScope: () => ({ register: () => {}, cleanup: () => {} }),
    } as any;

    tn.zoneSvc = mockZone2;
    tn.cdr = { markForCheck: markSpy } as any;
    tn.toastContainer = { nativeElement: document.createElement('div') } as any;
    tn.closed = { emit: () => {} } as any;

    tn.hide();
    expect(tn.toastContainer.nativeElement.classList.contains('fade-out')).toBeTrue();
    expect(markSpy).toHaveBeenCalled();
  });

  it('show should call cdr.detectChanges and schedule hide with duration', () => {
    const detectSpy = jasmine.createSpy('detect');
    const setSpy = jasmine.createSpy('setOutside').and.callFake((fn: any, t?: number) => {
      // call immediately to exercise inner hide branch
      fn();
      return t ?? 0;
    });

    const mockZone3 = {
      runOutside: (fn: any) => fn(),
      setOutsideTimeout: setSpy,
      clearOutsideTimeout: jasmine.createSpy('clear'),
      run: (fn: any) => fn(),
      createScope: () => ({ register: () => {}, cleanup: () => {} }),
    } as any;

    tn.zoneSvc = mockZone3;
    tn.cdr = { detectChanges: detectSpy, markForCheck: jasmine.createSpy('mark') } as any;
    tn.duration = 1234;
    tn.toastContainer = undefined as any;

    tn.show();

    expect(detectSpy).toHaveBeenCalled();
    // first call is the outer timeout (duration), second is the inner hide close timeout (500)
    expect(setSpy.calls.argsFor(0)[1]).toBe(1234);
    expect(setSpy.calls.argsFor(1)[1]).toBe(500);
  });

  it('hide should schedule close with 500ms and emit closed and register cleanup', () => {
    const setSpy = jasmine.createSpy('setOutside').and.callFake((fn: any, t: any) => {
      fn();
      return 55;
    });
    const clearSpy = jasmine.createSpy('clear');
    const closedSpy = jasmine.createSpy('closed');

    const mockZone4 = {
      runOutside: (fn: any) => fn(),
      setOutsideTimeout: setSpy,
      clearOutsideTimeout: clearSpy,
      run: (fn: any) => fn(),
      createScope: () => ({ register: () => {}, cleanup: () => {} }),
    } as any;

    const scope = { register: jasmine.createSpy('register') } as any;

    tn.zoneSvc = mockZone4;
    tn.scope = scope as any;
    tn.cdr = { markForCheck: jasmine.createSpy('mark') } as any;
    tn.closed = { emit: closedSpy } as any;
    tn.toastContainer = { nativeElement: document.createElement('div') } as any;

    tn.hide();

    expect(setSpy).toHaveBeenCalled();
    expect(setSpy.calls.argsFor(0)[1]).toBe(500);
    expect(closedSpy).toHaveBeenCalled();
    expect(tn.visible).toBeFalse();

    const regFn = scope.register.calls.argsFor(0)[0];
    regFn();
    expect(clearSpy).toHaveBeenCalledWith(55);
  });

  it('ngOnDestroy should call scope cleanup', () => {
    const scope = { cleanup: jasmine.createSpy('cleanup') };
    tn.scope = scope as any;
    tn.ngOnDestroy();
    expect(scope.cleanup).toHaveBeenCalled();
  });
});
