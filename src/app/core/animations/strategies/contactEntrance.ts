import { IAnimationStrategy } from '../../animations/IAnimationsStrategy';
import { AnimationScope } from '../../animations/IAnimationScope';
import gsap from 'gsap';

export class ContactEntranceStrategy implements IAnimationStrategy {
  constructor(
    private refs: {
      header: HTMLElement;
      form: HTMLElement;
      sidebar: HTMLElement;
    },
    private scope?: AnimationScope,
  ) {}

  apply(): void {
    const { header, form, sidebar } = this.refs;

    const tl = gsap.timeline({
      defaults: { ease: 'power4.out', opacity: 0 },
    });

    tl.to(header, { opacity: 1, y: 0, duration: 1.2 })
      .from(sidebar, { x: -50, duration: 1, ease: 'expo.out' }, '-=0.8')
      .from(
        form.querySelectorAll('.relative.group'),
        {
          y: 30,
          opacity: 0, // Añadimos opacity 0 explícito ya que está en defaults
          duration: 0.8,
          stagger: 0.1,
          clearProps: 'all',
        },
        '-=1',
      );

    this.scope?.register(() => tl.kill());
  }
}
