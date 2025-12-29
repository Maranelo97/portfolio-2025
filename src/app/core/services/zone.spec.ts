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
});
