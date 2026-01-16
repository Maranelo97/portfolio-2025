import { IAnimationStrategy } from '../IAnimationsStrategy';
import gsap from 'gsap';

export class StaggerScaleStrategy implements IAnimationStrategy {
  constructor(private delay: number = 0) {}

  apply(elements: HTMLElement[]): void {
    if (elements.length === 0) return;

    gsap.fromTo(
      elements,
      {
        opacity: 0,
        scale: 0.5,
        filter: 'blur(4px)',
      },
      {
        opacity: 1,
        scale: 1,
        filter: 'blur(0px)',
        duration: 0.5,
        stagger: 0.08,
        ease: 'back.out(1.7)',
        delay: this.delay,
        clearProps: 'all',
      },
    );
  }
}

export class ShakeErrorStrategy implements IAnimationStrategy {
  apply(elements: HTMLElement[]): void {
    if (elements.length === 0) return;

    gsap.to(elements, {
      x: -10,
      duration: 0.1,
      repeat: 3,
      yoyo: true,
      ease: 'power1.inOut',
      onComplete: () => {
        gsap.set(elements, { x: 0 });
      },
    });
  }
}
