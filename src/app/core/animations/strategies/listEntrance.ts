import { IAnimationStrategy } from '../IAnimationsStrategy';
import gsap from 'gsap';

export class ListEntranceStrategy implements IAnimationStrategy {
  apply(elements: HTMLElement[]): void {
    gsap.set(elements, { visibility: 'visible', opacity: 0 });
    gsap.fromTo(
      elements,
      { opacity: 0, y: 60, skewY: 3 },
      {
        opacity: 1,
        y: 0,
        skewY: 0,
        duration: 1.4,
        stagger: 0.2,
        ease: 'expo.out',
        clearProps: 'all',
      },
    );
  }
}
