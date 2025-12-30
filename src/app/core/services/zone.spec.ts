import { TestBed } from '@angular/core/testing';
import { NgZone, ApplicationRef } from '@angular/core';
import { ZoneService } from './zone';

class MockAppRef {
  isStable = {
    subscribe: (fn: any) => {
      fn(true);
      return { unsubscribe() {} };
    },
  };
}

describe('ZoneService', () => {
  let svc: ZoneService;
  let ngZone: NgZone;

  beforeEach(() => {
    const mockNgZone = { runOutsideAngular: (fn: any) => fn(), run: (fn: any) => fn() } as any;
    svc = new ZoneService(mockNgZone, new MockAppRef() as any);
  });

  it('runOutside should execute function and return value', () => {
    const res = svc.runOutside(() => 5);
    expect(res).toBe(5);
  });

  it('run should execute and return value', () => {
    const res = svc.run(() => 7);
    expect(res).toBe(7);
  });

  it('setOutsideTimeout and clearOutsideTimeout should return id and clear', (done) => {
    const id = svc.setOutsideTimeout(() => {}, 10);
    expect(typeof id).toBe('number');
    svc.clearOutsideTimeout(id);
    done();
  });

  it('runWhenStable resolves true quickly', async () => {
    const ok = await svc.runWhenStable(100);
    expect(ok).toBeTrue();
  });

  it('scopes create, register and cleanup', () => {
    const s = svc.createScope('test');
    let called = false;
    s.register(() => (called = true));
    s.cleanup();
    expect(called).toBeTrue();
  });

  it('setOutsideTimeout uses setTimeout and clearOutsideTimeout uses clearTimeout', (done) => {
    const spyClear = spyOn(window, 'clearTimeout').and.callThrough();
    const id = svc.setOutsideTimeout(() => {}, 1);
    expect(typeof id).toBe('number');
    svc.clearOutsideTimeout(id);
    expect(spyClear).toHaveBeenCalledWith(id);
    done();
  });

  it('setOutsideTimeout should use default ms when not provided', () => {
    const spySet = spyOn(window as any, 'setTimeout').and.callFake((fn: any, ms?: any) => {
      expect(ms).toBe(0);
      if (fn) fn();
      return 42;
    });

    const id = svc.setOutsideTimeout(() => {});
    expect(id).toBe(42);
    expect(spySet).toHaveBeenCalled();
  });

  it('setOutsideTimeout uses default when ms is explicitly undefined', () => {
    let recordedMs: any = null;
    spyOn(window as any, 'setTimeout').and.callFake((fn: any, ms?: any) => {
      recordedMs = ms;
      if (fn) fn();
      return 999 as any;
    });

    const id = svc.setOutsideTimeout(() => {}, undefined as any);
    expect(recordedMs).toBe(0);
    expect(id).toBe(999 as any);
  });

  it('runWhenStable uses default timeout when undefined and resolves false when timer fires', async () => {
    let recordedMs: any = null;
    spyOn(window as any, 'setTimeout').and.callFake((fn: any, ms?: any) => {
      recordedMs = ms;
      // execute callback immediately to simulate timeout
      if (fn) fn();
      return 555 as any;
    });

    const mockAppRef: any = { isStable: { subscribe: (fn: any) => ({ unsubscribe() {} }) } };
    const slowSvc = new ZoneService(
      { runOutsideAngular: (fn: any) => fn(), run: (fn: any) => fn() } as any,
      mockAppRef,
    );

    const ok = await slowSvc.runWhenStable(undefined as any);
    expect(recordedMs).toBe(10000);
    expect(ok).toBeFalse();
  });

  it('runWhenStable default param resolves true when appRef emits true', async () => {
    const mockAppRef = {
      isStable: {
        subscribe: (fn: any) => {
          fn(true);
          return { unsubscribe() {} };
        },
      },
    } as any;
    const fast = new ZoneService(
      { runOutsideAngular: (fn: any) => fn(), run: (fn: any) => fn() } as any,
      mockAppRef,
    );

    const ok = await fast.runWhenStable();
    expect(ok).toBeTrue();
  });

  it('runWhenStable default timeout should resolve false when timer fires', async () => {
    // Use jasmine clock to fast-forward the default 10s timeout
    jasmine.clock().install();
    try {
      const mockAppRef: any = { isStable: { subscribe: (fn: any) => ({ unsubscribe() {} }) } };
      const slowSvc = new ZoneService(
        { runOutsideAngular: (fn: any) => fn(), run: (fn: any) => fn() } as any,
        mockAppRef,
      );

      const p = slowSvc.runWhenStable();
      // advance past default 10000ms
      jasmine.clock().tick(10050);
      const ok = await p;
      expect(ok).toBeFalse();
    } finally {
      jasmine.clock().uninstall();
    }
  });

  it('scheduleFrame and cancelFrame should call rAF and cAF', () => {
    const rAF = spyOn(window, 'requestAnimationFrame').and.callFake((fn: any) => {
      fn(1);
      return 123;
    });
    const cAF = spyOn(window, 'cancelAnimationFrame').and.callFake(() => {});

    const id = svc.scheduleFrame((t: any) => {});
    expect(rAF).toHaveBeenCalled();

    svc.cancelFrame(id);
    expect(cAF).toHaveBeenCalledWith(id);
  });

  it('runWhenStable should resolve false on timeout', async () => {
    // Mock AppRef that never emits stable
    const mockAppRef: any = { isStable: { subscribe: (fn: any) => ({ unsubscribe() {} }) } };
    const slowSvc = new ZoneService(
      { runOutsideAngular: (fn: any) => fn(), run: (fn: any) => fn() } as any,
      mockAppRef,
    );

    const ok = await slowSvc.runWhenStable(20);
    expect(ok).toBeFalse();
  });

  it('scope cleanup should swallow errors thrown by registered callbacks', () => {
    const s = svc.createScope('err');
    const bad = () => {
      throw new Error('boom');
    };
    s.register(bad);
    expect(() => s.cleanup()).not.toThrow();
  });

  it('createScope cleanup should be safe when called twice (no registered fns)', () => {
    const s = svc.createScope('dup');
    s.cleanup();
    // calling cleanup again should not throw and should be a no-op
    expect(() => s.cleanup()).not.toThrow();
  });

  it('runWhenStable should resolve false when subscribe returns null (no unsubscribe)', async () => {
    const mockAppRef: any = { isStable: { subscribe: (fn: any) => null } };
    const slowSvc = new ZoneService(
      { runOutsideAngular: (fn: any) => fn(), run: (fn: any) => fn() } as any,
      mockAppRef,
    );

    const ok = await slowSvc.runWhenStable(20);
    expect(ok).toBeFalse();
  });
});
