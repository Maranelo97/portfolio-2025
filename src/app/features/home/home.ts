import {
  Component,
  ViewChild,
  ElementRef,
  OnDestroy,
  inject,
  afterNextRender,
} from '@angular/core';
import { ZoneService } from '../../core/services/zone';
import { RouterLink } from '@angular/router';
import { gsap } from 'gsap';
import { AnimationService } from '../../core/services/animations';
import { Skills } from './Skills/Skills';
import { Experience } from './Experience/Experience';
import { TechPills } from './TechPills/TechPills';
import { GlassParallaxDirective } from '../../shared/directives/GlassParallax';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, Skills, Experience, TechPills, GlassParallaxDirective],
  styleUrl: './home.css',
  templateUrl: './home.html',
})
export class Home implements OnDestroy {
  private animSvc = inject(AnimationService);
  private zoneSvc = inject(ZoneService);
  private scope = this.zoneSvc.createScope('home-animations');
  private ctx?: gsap.Context;

  readonly name = 'Mariano Santos';
  readonly title = 'Full-Stack Developer & Angular Specialist.';
  readonly description =
    'Transformando ideas complejas en soluciones web de alto rendimiento y escalables.';

  @ViewChild('heroContent') heroContent!: ElementRef;
  @ViewChild('ctaButtons') ctaButtons!: ElementRef;

  constructor() {
    afterNextRender(() => {
      this.zoneSvc.runOutside(() => {
        this.initAnimations();
      });
    });
  }

  private initAnimations(): void {
    if (!this.heroContent) return;

    this.ctx = gsap.context(() => {
      const hero = this.heroContent.nativeElement;
      const elements = Array.from(hero.children) as HTMLElement[];

      // 1. FADE INICIAL: Ahora ignoramos CTA Buttons para que sean visibles siempre
      const fadeGroup = elements.filter(
        (el) =>
          el.tagName !== 'APP-EXPERIENCE' &&
          el !== this.ctaButtons.nativeElement && // Ignoramos el contenedor de botones
          el.tagName !== 'TECH-PILLS',
      );

      this.animSvc.fadeInStagger(fadeGroup);

      this.scope.register(() => this.ctx?.revert());

      // 2. TECH PILLS Y EXPERIENCIA (se mantienen igual)
      const techsEl = hero.querySelector('tech-pills') as HTMLElement;
      if (techsEl) {
        this.animSvc.staggerScaleIn(techsEl, 0.6);
      }

      const experienceEl = hero.querySelector('app-experience') as HTMLElement;
      if (experienceEl) {
        this.animSvc.scrollReveal(experienceEl, 'left', true);
      }

      this.animSvc.applyParallax('.experience-item');
    }, this.heroContent.nativeElement);
  }

  ngOnDestroy(): void {
    this.scope.cleanup();
  }
}
