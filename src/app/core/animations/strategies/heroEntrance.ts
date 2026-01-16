import { AnimationScope } from '../IAnimationScope';
import { IAnimationStrategy } from '../IAnimationsStrategy';
import gsap from 'gsap';

export class HeroEntranceStrategy implements IAnimationStrategy {
  constructor(
    private scope?: AnimationScope,
    private onHeartbeatTrigger?: (target: HTMLElement) => void,
  ) {}

  apply(elements: HTMLElement[]): void {
    const container = elements[0];
    if (!container) return;

    const tl = gsap.timeline({
      defaults: { ease: 'power4.out', duration: 1 },
    });

    tl.from(container.querySelectorAll('p.font-mono'), {
      opacity: 0,
      y: 20,
    })
      .from(
        container.querySelectorAll('.hero-name'),
        {
          opacity: 0,
          y: 40,
          duration: 1.2,
          clearProps: 'all',
        },
        '-=0.8',
      )
      .from(
        container.querySelectorAll('.hero-subtitle'),
        {
          opacity: 0,
          y: 30,
          onComplete: () => {
            const nameEl = container.querySelector('.hero-name') as HTMLElement;
            if (nameEl && this.onHeartbeatTrigger) {
              this.onHeartbeatTrigger(nameEl);
            }
          },
        },
        '-=1',
      )
      .from(
        container.querySelectorAll('p.text-gray-400'),
        {
          opacity: 0,
          y: 20,
        },
        '-=0.8',
      )
      .from(
        container.querySelectorAll('#ctaButtons'),
        {
          opacity: 0,
          scale: 0.8,
          y: 20,
          duration: 0.8,
        },
        '-=0.5',
      )
      .from(
        container.querySelectorAll('app-skills, tech-pills, app-experience'),
        {
          opacity: 0,
          y: 30,
          stagger: 0.2,
          duration: 0.8,
        },
        '-=0.5',
      );
    this.scope?.register(() => tl.kill());
  }

  applyFloatingHeartbeat(target: Element | null, scope?: AnimationScope): void {
    if (!target) return;
    const hover = gsap.to(target, {
      y: 15,
      duration: 3,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    });
    scope?.register(() => hover.kill());
  }
}
