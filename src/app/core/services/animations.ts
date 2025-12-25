// src/app/core/services/animation.service.ts
import { Injectable, inject } from '@angular/core';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PlatformService } from './platform';

@Injectable({
  providedIn: 'root',
})
export class AnimationService {
  private platformService = inject(PlatformService);

  constructor() {
    if (this.platformService.isBrowser) {
      gsap.registerPlugin(ScrollTrigger);
    }
  }

  /**
   * Crea una entrada en cascada (Stagger) para una lista de elementos
   */
  fadeInStagger(elements: HTMLElement[], delay: number = 0): void {
    if (!this.platformService.isBrowser) return;

    gsap.fromTo(
      elements,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        stagger: 0.15,
        duration: 0.5,
        ease: 'power3.out',
        delay,
      }
    );
  }

  /**
   * Vincula el movimiento de un elemento al scroll (Efecto Slide + Blur)
   */
  scrollReveal(
    target: HTMLElement,
    direction: 'left' | 'right' | 'up' = 'left',
    isScrub: boolean = true
  ): void {
    if (!this.platformService.isBrowser) return;

    const xOffset = direction === 'left' ? -100 : direction === 'right' ? 100 : 0;
    const yOffset = direction === 'up' ? 50 : 0;

    gsap.fromTo(
      target,
      { opacity: 0, x: xOffset, y: yOffset, filter: 'blur(10px)' },
      {
        opacity: 1,
        x: 0,
        y: 0,
        filter: 'blur(0px)',
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: target,
          start: 'top 95%',
          end: 'top 60%',
          // CONFIGURACIÓN DUAL:
          // Si es scrub (Experiencia): sigue el scroll.
          // Si NO es scrub (Botones): se dispara completo y vuelve al subir.
          scrub: isScrub ? 1.2 : false,
          toggleActions: isScrub ? '' : 'play reverse restart reverse',
        },
      }
    );
  }
  /**
   * Crea un efecto de paralaje suave para elementos individuales (como las Cards)
   */
  applyParallax(selector: string, yMove: number = -30): void {
    if (!this.platformService.isBrowser) return;

    gsap.utils.toArray(selector).forEach((el: any) => {
      gsap.to(el, {
        y: yMove,
        scrollTrigger: {
          trigger: el,
          scrub: true,
          start: 'top bottom',
          end: 'bottom top',
        },
      });
    });
  }

  slideInStagger(elements: HTMLElement[], direction: 'left' | 'right' = 'left'): void {
    if (!this.platformService.isBrowser || elements.length === 0) return;

    const xOffset = direction === 'left' ? -50 : 50;

    gsap.fromTo(
      elements,
      { opacity: 0, x: xOffset, filter: 'blur(10px)' },
      {
        opacity: 1,
        x: 0,
        filter: 'blur(0px)',
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out',
        clearProps: 'opacity,transform,filter', 
      }
    );
  }

  staggerScaleIn(
    target: HTMLElement | HTMLElement[] | NodeListOf<HTMLElement>,
    delay: number = 0
  ): void {
    if (!this.platformService.isBrowser) return;

    const elements = target instanceof HTMLElement ? [target] : target;

    if (Array.from(elements).length === 0) return;

    gsap.fromTo(
      elements,
      { opacity: 0, scale: 0.5, filter: 'blur(4px)' },
      {
        opacity: 1,
        scale: 1,
        filter: 'blur(0px)',
        duration: 0.5,
        stagger: 0.08,
        ease: 'back.out(1.7)',
        delay: delay,
        clearProps: 'all',
      }
    );
  }

  fadeOut(target: HTMLElement | HTMLElement[], onComplete?: () => void): void {
    if (!this.platformService.isBrowser) return;

    gsap.to(target, {
      opacity: 0,
      duration: 0.4,
      ease: 'power2.inOut',
      onComplete: () => {
        if (onComplete) onComplete();
      },
    });
  }
}
