import { IAnimationStrategy } from '../IAnimationsStrategy';
import { gsap } from 'gsap';

export class DrawerExitStrategy implements IAnimationStrategy {
  constructor(
    private drawerSelector: string,
    private backdropSelector: string,
    private onComplete: () => void,
  ) {}

  apply(): void {
    const tl = gsap.timeline({
      onComplete: () => this.onComplete(),
    });

    tl.to(`${this.drawerSelector} .flex-1 > *`, {
      y: 20,
      opacity: 0,
      duration: 0.3,
      stagger: { each: 0.03, from: 'end' },
    })
      .to(
        this.drawerSelector,
        {
          xPercent: 105,
          duration: 0.5,
          ease: 'power4.in',
        },
        '-=0.1',
      )
      .to(
        this.backdropSelector,
        {
          opacity: 0,
          backdropFilter: 'blur(0px)',
          duration: 0.4,
        },
        '-=0.3',
      );
  }
}
