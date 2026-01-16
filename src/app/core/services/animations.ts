import { Injectable, inject } from '@angular/core';
import { PlatformService } from './platform';
import { ZoneService } from './zone';
import { IAnimationStrategy } from '../animations/IAnimationsStrategy';
@Injectable({ providedIn: 'root' })
export class AnimationService {
  private platformService = inject(PlatformService);
  private zoneService = inject(ZoneService);

  run(elements: any, strategy: IAnimationStrategy): void {
    if (!this.platformService.isBrowser) return;
    const elArray = this.normalize(elements);
    this.zoneService.runOutside(() => {
      requestAnimationFrame(() => strategy.apply(elArray));
    });
  }

  private normalize(el: any): HTMLElement[] {
    if (Array.isArray(el)) return el;
    if (el instanceof NodeList) return Array.from(el) as HTMLElement[];
    if (el instanceof HTMLElement) return [el];
    return [];
  }
}
