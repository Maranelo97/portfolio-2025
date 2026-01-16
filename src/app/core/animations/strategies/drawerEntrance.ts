import { IAnimationStrategy } from '../../animations/IAnimationsStrategy';
import gsap from 'gsap';

export class DrawerEntranceStrategy implements IAnimationStrategy {
  constructor(
    private drawerSelector: string,
    private backdropSelector: string,
  ) {}

  apply(): void {
    const isMobile = window.innerWidth < 640;
    const xTarget = isMobile ? -100 : -50;

    const tl = gsap.timeline({ defaults: { overwrite: 'auto' } });

    tl.fromTo(
      this.backdropSelector,
      { opacity: 0, backdropFilter: 'blur(0px)' },
      { opacity: 1, backdropFilter: 'blur(10px)', duration: 0.5 },
    )
      .fromTo(
        this.drawerSelector,
        { xPercent: 105, skewX: isMobile ? 0 : -4 },
        {
          xPercent: xTarget,
          skewX: 0,
          visibility: 'visible',
          duration: 1.1,
          ease: 'expo.out',
        },
        '-=0.4',
      )
      .from(
        `${this.drawerSelector} .flex-1 > div > *`,
        {
          y: 30,
          opacity: 0,
          duration: 0.8,
          stagger: 0.08,
          ease: 'power4.out',
        },
        '-=0.6',
      );
  }
}
