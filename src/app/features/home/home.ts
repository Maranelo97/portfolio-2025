import {
  Component,
  ViewChild,
  ElementRef,
  OnDestroy,
  inject,
  afterNextRender,
} from '@angular/core';
import { Router } from '@angular/router';
import { ZoneService } from '../../core/services/zone';
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
  private router = inject(Router);

  readonly name = 'Mariano Santos';
  readonly title = 'Full-Stack Developer & Angular Specialist.';
  readonly description =
    'Transformando ideas complejas en soluciones web de alto rendimiento y escalables.';

  @ViewChild('heroContent') heroContent!: ElementRef<HTMLElement>;

  private scope = this.zoneSvc.createScope('home-animations');

  constructor() {
    afterNextRender(() => {
      if (this.heroContent) {
        this.animSvc.heroEntrance(this.heroContent.nativeElement, this.scope);
      }
    });
  }

  navigateTo(path: string): void {
    this.router.navigate([path]);
  }

  ngOnDestroy(): void {
    this.scope.cleanup();
  }
}
