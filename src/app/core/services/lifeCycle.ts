import {
  Injectable,
  afterNextRender,
  inject,
  Injector,
  runInInjectionContext,
} from '@angular/core';
import { ZoneService } from '../services/zone';

@Injectable({ providedIn: 'root' })
export class LifeCycleService {
  private zoneSvc = inject(ZoneService);
  private injector = inject(Injector);
  scheduleAnimationAfterRender(callback: () => void, options?: { runOutside?: boolean }): void {
    runInInjectionContext(this.injector, () => {
      afterNextRender(() => {
        if (options?.runOutside) {
          this.zoneSvc.runOutside(() => callback());
        } else {
          callback();
        }
      });
    });
  }
}
