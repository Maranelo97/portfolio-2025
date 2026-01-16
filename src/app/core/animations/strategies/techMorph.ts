import { IAnimationStrategy } from '@animations/IAnimationsStrategy';
import gsap from 'gsap';

export class TechMorphStrategy implements IAnimationStrategy {
  constructor(private selectedTech: string) {}

  apply(elements: HTMLElement[]): void {
    elements.forEach((el) => {
      const techs = el.getAttribute('data-techs') || '';
      const isMatch = techs.includes(this.selectedTech);

      gsap.to(el, {
        opacity: isMatch ? 1 : 0.2,
        scale: isMatch ? 1.05 : 0.95,
        filter: isMatch ? 'blur(0px)' : 'blur(8px)',
        duration: 0.6,
        ease: isMatch ? 'back.out(1.7)' : 'power2.out',
        overwrite: 'auto',
      });
    });
  }
}

export class ResetTechMorphStrategy implements IAnimationStrategy {
  apply(elements: HTMLElement[]): void {
    gsap.to(elements, {
      opacity: 1,
      scale: 1,
      filter: 'blur(0px)',
      zIndex: 1,
      duration: 0.5,
      ease: 'power2.inOut',
      clearProps: 'all',
    });
  }
}
