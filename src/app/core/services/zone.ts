import { Injectable, NgZone, ApplicationRef } from '@angular/core';
import { Subscription } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ZoneService {
  private scopes = new Map<string, (() => void)[]>();

  constructor(
    private ngZone: NgZone,
    private appRef: ApplicationRef,
  ) {}

  runOutside<T>(fn: () => T): T {
    return this.ngZone.runOutsideAngular(fn);
  }

  run<T>(fn: () => T): T {
    return this.ngZone.run(fn);
  }

  setOutsideTimeout(fn: () => void, ms = 0): number {
    return this.ngZone.runOutsideAngular(() => window.setTimeout(fn, ms));
  }

  clearOutsideTimeout(id: number): void {
    // can clear outside or inside; doesn't matter much but keep outside
    this.ngZone.runOutsideAngular(() => clearTimeout(id));
  }

  scheduleFrame(fn: FrameRequestCallback): number {
    return this.ngZone.runOutsideAngular(() => requestAnimationFrame(fn));
  }

  cancelFrame(id: number): void {
    this.ngZone.runOutsideAngular(() => cancelAnimationFrame(id));
  }

  runWhenStable(timeoutMs = 10000): Promise<boolean> {
    return new Promise((resolve) => {
      let sub: Subscription | null = null;
      const timer = setTimeout(() => {
        sub?.unsubscribe();
        resolve(false);
      }, timeoutMs);

      sub = this.appRef.isStable.subscribe((stable) => {
        if (stable) {
          clearTimeout(timer);
          sub?.unsubscribe();
          resolve(true);
        }
      });
    });
  }

  // Simple per-component scope to collect teardown callbacks
  createScope(key: string) {
    this.scopes.set(key, []);
    return {
      register: (fn: () => void) => {
        this.scopes.get(key)!.push(fn);
      },
      cleanup: () => {
        (this.scopes.get(key) || []).forEach((fn) => {
          try {
            fn();
          } catch {}
        });
        this.scopes.delete(key);
      },
    };
  }
}
