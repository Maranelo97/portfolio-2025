import { Injectable, ElementRef } from '@angular/core';
import gsap from 'gsap';
import { ZoneService } from '../services/zone';

@Injectable({ providedIn: 'root' })
export class ProjectFilterService {
  constructor(private zoneSvc: ZoneService) {}

  applyTechFilter(containerRef: ElementRef, tech: string): void {
    this.zoneSvc.runOutside(() => {
      const wrappers = containerRef.nativeElement.querySelectorAll('.perspective-wrapper');

      wrappers.forEach((el: HTMLElement) => {
        const techs = el.getAttribute('data-techs') || '';
        const isMatch = techs.includes(tech);

        gsap.to(el, {
          opacity: isMatch ? 1 : 0.2,
          scale: isMatch ? 1.05 : 0.95,
          filter: isMatch ? 'blur(0px)' : 'blur(8px)',
          duration: 0.6,
          ease: isMatch ? 'back.out(1.7)' : 'power2.out',
          overwrite: true,
        });
      });
    });
  }

  resetFilter(containerRef: ElementRef): void {
    this.zoneSvc.runOutside(() => {
      const wrappers = containerRef.nativeElement.querySelectorAll('.perspective-wrapper');

      gsap.to(wrappers, {
        opacity: 1,
        scale: 1,
        filter: 'blur(0px)',
        duration: 0.5,
        clearProps: 'all',
        ease: 'power2.inOut',
      });
    });
  }
}
