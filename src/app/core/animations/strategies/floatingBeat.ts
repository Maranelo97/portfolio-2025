import { IAnimationStrategy } from '../IAnimationsStrategy';
import { AnimationScope } from '../IAnimationScope';
import gsap from 'gsap';

export class FloatingHeartbeatStrategy implements IAnimationStrategy {
  constructor(private scope?: AnimationScope) {}

  apply(elements: HTMLElement[]): void {
    const target = elements[0];
    if (!target) return;

    const animation = gsap.to(target, {
      y: 15,
      duration: 3,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    });

    this.scope?.register(() => animation.kill());
  }
}
