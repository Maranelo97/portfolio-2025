import {
  Component,
  ViewChild,
  ElementRef,
  OnDestroy,
  inject,
  afterNextRender,
} from '@angular/core';
import { ZoneService } from '../../core/services/zone';
import { Router } from '@angular/router';
import { gsap } from 'gsap';
import { AnimationService } from '../../core/services/animations';
import { Skills } from './Skills/Skills';
import { Experience } from './Experience/Experience';
import { TechPills } from './TechPills/TechPills';
import { GlassParallaxDirective } from '../../shared/directives/GlassParallax';
import { Button } from '../../shared/components/Button/Button';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [Skills, Experience, TechPills, GlassParallaxDirective, Button],
  styleUrl: './home.css',
  templateUrl: './home.html',
})
export class Home implements OnDestroy {
  private animSvc = inject(AnimationService);
  private zoneSvc = inject(ZoneService);
  private scope = this.zoneSvc.createScope('home-animations');
  private ctx?: gsap.Context;
  private router = inject(Router);

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
    this.ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });
      tl.to('p.font-mono', { opacity: 1, y: 0, duration: 1 })
        .to('.hero-name', { opacity: 1, y: 0, duration: 1.2 }, '-=0.8')
        .to(
          '.hero-subtitle',
          {
            opacity: 1,
            y: 0,
            duration: 1,
            onComplete: () => this.initFloatingEffect(),
          },
          '-=1',
        )
        .to('p.text-gray-400', { opacity: 1, y: 0, duration: 1 }, '-=0.8')
        .to('#ctaButtons', { opacity: 1, scale: 1, duration: 0.8 }, '-=0.5')
        .to(
          ['app-skills', 'tech-pills', 'app-experience'],
          {
            opacity: 1,
            stagger: 0.2,
            duration: 1,
          },
          '-=0.5',
        );
    }, this.heroContent.nativeElement);
  }
  navigateTo(path: string) {
    this.router.navigate([path]);
  }

  private initFloatingEffect() {
    gsap.to('.hero-name', {
      y: 15,
      duration: 3,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    });
  }

  ngOnDestroy(): void {
    this.scope.cleanup();
  }
}
