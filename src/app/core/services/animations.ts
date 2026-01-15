import { Injectable, inject } from '@angular/core';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PlatformService } from './platform';
import { ZoneService } from './zone';

import { AnimationScope } from '../types/IAnimationScope';
@Injectable({
  providedIn: 'root',
})
export class AnimationService {
  private platformService = inject(PlatformService);
  private zoneService = inject(ZoneService);

  constructor() {
    if (this.platformService.isBrowser) {
      this.zoneService.runOutside(() => {
        gsap.registerPlugin(ScrollTrigger);
      });
    }
  }
  fadeInStagger(elements: HTMLElement[], delay: number = 0): void {
    if (!this.platformService.isBrowser) return;

    this.zoneService.runOutside(() => {
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
        },
      );
    });
  }

  scrollReveal(
    target: HTMLElement,
    direction: 'left' | 'right' | 'up' = 'left',
    isScrub: boolean = true,
    scope?: AnimationScope,
  ): void {
    if (!this.platformService.isBrowser) return;

    const xOffset = direction === 'left' ? -100 : direction === 'right' ? 100 : 0;
    const yOffset = direction === 'up' ? 80 : 0;

    this.zoneService.runOutside(() => {
      const anim = gsap.fromTo(
        target,
        { opacity: 0, x: xOffset, y: yOffset, filter: 'blur(10px)' },
        {
          opacity: 1,
          x: 0,
          y: 0,
          filter: 'blur(0px)',
          duration: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: target,
            start: 'top 105%',
            end: 'bottom center',
            scrub: isScrub ? 1.2 : false,
            toggleActions: isScrub ? '' : 'play none none none',
          },
        },
      );

      scope?.register(() => {
        if (anim.scrollTrigger) anim.scrollTrigger.kill();
        anim.kill();
      });
    });
  }
  applyParallax(selector: string, yMove: number = -30, scope?: AnimationScope): void {
    if (!this.platformService.isBrowser) return;

    this.zoneService.runOutside(() => {
      gsap.utils.toArray(selector).forEach((el: any) => {
        const tween = gsap.to(el, {
          y: yMove,
          scrollTrigger: {
            trigger: el,
            scrub: true,
            start: 'top bottom',
            end: 'bottom top',
          },
        });

        scope?.register(() => {
          if (tween.scrollTrigger) tween.scrollTrigger.kill();
          tween.kill();
        });
      });
    });
  }

  slideInStagger(elements: HTMLElement[]): void {
    if (!this.platformService.isBrowser) return;

    this.zoneService.runOutside(() => {
      gsap.set(elements, { visibility: 'visible', opacity: 0 });

      gsap.fromTo(
        elements,
        {
          opacity: 0,
          y: 60,
          skewY: 3,
        },
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
    });
  }

  staggerScaleIn(
    target: HTMLElement | HTMLElement[] | NodeListOf<HTMLElement>,
    delay: number = 0,
  ): void {
    if (!this.platformService.isBrowser) return;

    const elements = target instanceof HTMLElement ? [target] : target;
    if (Array.from(elements).length === 0) return;

    this.zoneService.runOutside(() => {
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
        },
      );
    });
  }

  fadeOut(target: HTMLElement | HTMLElement[], onComplete?: () => void): void {
    if (!this.platformService.isBrowser) return;

    this.zoneService.runOutside(() => {
      gsap.to(target, {
        opacity: 0,
        duration: 0.4,
        ease: 'power2.inOut',
        onComplete: () => {
          if (onComplete) {
            this.zoneService.run(onComplete);
          }
        },
      });
    });
  }

  heroEntrance(container: HTMLElement, scope?: AnimationScope): void {
    if (!this.platformService.isBrowser) return;

    this.zoneService.runOutside(() => {
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
            onComplete: () =>
              this.applyFloatingHeartbeat(container.querySelector('.hero-name'), scope),
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

      scope?.register(() => tl.kill());
    });
  }

  private applyFloatingHeartbeat(target: Element | null, scope?: AnimationScope): void {
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

  contactEntrance(
    header: HTMLElement,
    form: HTMLElement,
    sidebar: HTMLElement,
    scope?: AnimationScope,
  ): void {
    if (!this.platformService.isBrowser) return;

    this.zoneService.runOutside(() => {
      const tl = gsap.timeline({
        defaults: { ease: 'power4.out', opacity: 0 },
      });

      tl.to(header, { opacity: 1, y: 0, duration: 1.2 })
        .from(sidebar, { x: -50, duration: 1, ease: 'expo.out' }, '-=0.8')
        .from(
          form.querySelectorAll('.relative.group'),
          {
            y: 30,
            duration: 0.8,
            stagger: 0.1,
            clearProps: 'all',
          },
          '-=1',
        );

      scope?.register(() => tl.kill());
    });
  }

  shakeError(elementSelector: string): void {
    if (!this.platformService.isBrowser) return;

    this.zoneService.runOutside(() => {
      gsap.to(elementSelector, {
        x: -10,
        duration: 0.1,
        repeat: 3,
        yoyo: true,
        ease: 'power1.inOut',
        onComplete: () => {
          gsap.set(elementSelector, { x: 0 });
        },
      });
    });
  }

  drawerEntrance(drawerSelector: string, backdropSelector: string): void {
    if (!this.platformService.isBrowser) return;

    this.zoneService.runOutside(() => {
      const isMobile = window.innerWidth < 640;

      const xTarget = isMobile ? -100 : -50;

      const tl = gsap.timeline({ defaults: { overwrite: 'auto' } });

      tl.fromTo(
        backdropSelector,
        { opacity: 0, backdropFilter: 'blur(0px)' },
        { opacity: 1, backdropFilter: 'blur(10px)', duration: 0.5 },
      )
        .fromTo(
          drawerSelector,
          { xPercent: 105, skewX: isMobile ? -0 : -4 },
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
          `${drawerSelector} .flex-1 > div > *`,
          {
            y: 30,
            opacity: 0,
            duration: 0.8,
            stagger: 0.08,
            ease: 'power4.out',
          },
          '-=0.6',
        );
    });
  }

  drawerExit(drawerSelector: string, backdropSelector: string, onComplete: () => void): void {
    if (!this.platformService.isBrowser) return;

    this.zoneService.runOutside(() => {
      const tl = gsap.timeline({
        onComplete: () => this.zoneService.run(() => onComplete()),
      });

      tl.to(`${drawerSelector} .flex-1 > *`, {
        y: 20,
        opacity: 0,
        duration: 0.3,
        stagger: { each: 0.03, from: 'end' },
      })
        .to(
          drawerSelector,
          {
            xPercent: 105,
            duration: 0.5,
            ease: 'power4.in',
          },
          '-=0.1',
        )
        .to(
          backdropSelector,
          {
            opacity: 0,
            backdropFilter: 'blur(0px)',
            duration: 0.4,
          },
          '-=0.3',
        );
    });
  }

  applyTechMorph(elements: HTMLElement[], selectedTech: string): void {
    if (!this.platformService.isBrowser) return;

    this.zoneService.runOutside(() => {
      elements.forEach((el) => {
        const techs = el.getAttribute('data-techs') || '';
        const isMatch = techs.includes(selectedTech);

        gsap.to(el, {
          opacity: isMatch ? 1 : 0.2,
          scale: isMatch ? 1.05 : 0.95,
          filter: isMatch ? 'blur(0px)' : 'blur(8px)',
          duration: 0.6,
          ease: isMatch ? 'back.out(1.7)' : 'power2.out',
          overwrite: 'auto',
        });
      });
    });
  }

  resetTechMorph(elements: HTMLElement[]): void {
    if (!this.platformService.isBrowser) return;

    this.zoneService.runOutside(() => {
      gsap.to(elements, {
        opacity: 1,
        scale: 1,
        filter: 'blur(0px)',
        zIndex: 1,
        duration: 0.5,
        ease: 'power2.inOut',
        clearProps: 'all',
      });
    });
  }
}
