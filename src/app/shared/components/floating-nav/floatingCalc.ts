import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class FloatingCalcPositionService {
  calculateDirections(rect: DOMRect): { dirX: number; dirY: number } {
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    return {
      dirX: rect.left > centerX ? -1 : 1,
      dirY: rect.top > centerY ? -1 : 1,
    };
  }
}
