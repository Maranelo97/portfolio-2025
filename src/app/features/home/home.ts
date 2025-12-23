import { Component, AfterViewInit, ViewChild, ElementRef, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlatformService } from '../../core/services/platform';
import { RouterLink } from '@angular/router';
import { gsap } from 'gsap';
import { AnimationService } from '../../core/services/animations';
import { Skills } from './Skills/Skills';
import { Experience } from './Experience/Experience';
import { TechPills } from './TechPills/TechPills';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, Skills, Experience, TechPills],
  styleUrl: './home.css',
  templateUrl: './home.html',
})
export class Home implements AfterViewInit, OnDestroy {
  private animSvc = inject(AnimationService);
  private platformService = inject(PlatformService);
  private ctx?: gsap.Context;

  readonly name = 'Mariano Santos';
  readonly title = 'Full-Stack Developer & Angular Specialist.';
  readonly description =
    'Transformando ideas complejas en soluciones web de alto rendimiento y escalables.';

  @ViewChild('heroContent') heroContent!: ElementRef;
  @ViewChild('ctaButtons') ctaButtons!: ElementRef;

  ngAfterViewInit(): void {
    if (this.platformService.isBrowser) {
      this.ctx = gsap.context(() => {
        const hero = this.heroContent.nativeElement;
        const elements = Array.from(hero.children) as HTMLElement[];

        // 1. FADE INICIAL (Texto y Skills)
        const fadeGroup = elements.filter(
          (el) =>
            el.tagName !== 'APP-EXPERIENCE' &&
            el !== this.ctaButtons.nativeElement &&
            el.tagName !== 'TECH-PILLS'
        );
        this.animSvc.fadeInStagger(fadeGroup);

        const techsEl = hero.querySelector('tech-pills') as HTMLElement;
        if (techsEl) {
          this.animSvc.staggerScaleIn(techsEl, 0.6);
        }

        // 2. EXPERIENCIA (Slide desde la izquierda - Dinámico)
        const experienceEl = hero.querySelector('app-experience') as HTMLElement;
        if (experienceEl) {
          this.animSvc.scrollReveal(experienceEl, 'left', true);
        }
        // 3. BOTONES (Slide desde la derecha - Dinámico)
        if (this.ctaButtons) {
          this.animSvc.scrollReveal(this.ctaButtons.nativeElement, 'right', false);
        }

        // 4. Paralaje para las cards
        this.animSvc.applyParallax('.experience-item');
      }, this.heroContent.nativeElement);
    }
  }

  ngOnDestroy(): void {
    this.ctx?.revert();
  }
}
