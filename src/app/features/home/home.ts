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

// Sub-componentes y Directivas
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
  // Inyecciones
  private animSvc = inject(AnimationService);
  private zoneSvc = inject(ZoneService);
  private router = inject(Router);

  // Datos de la UI
  readonly name = 'Mariano Santos';
  readonly title = 'Full-Stack Developer & Angular Specialist.';
  readonly description =
    'Transformando ideas complejas en soluciones web de alto rendimiento y escalables.';

  // Referencias a la Vista
  @ViewChild('heroContent') heroContent!: ElementRef<HTMLElement>;

  // Gestión de Memoria y Animaciones
  private scope = this.zoneSvc.createScope('home-animations');

  constructor() {
    /**
     * Usamos afterNextRender para asegurar que el DOM esté listo
     * y las animaciones se ejecuten solo en el cliente (SSR Friendly).
     */
    afterNextRender(() => {
      if (this.heroContent) {
        // Delegamos TODA la lógica de GSAP al servicio
        this.animSvc.heroEntrance(this.heroContent.nativeElement, this.scope);
      }
    });
  }

  navigateTo(path: string): void {
    this.router.navigate([path]);
  }

  ngOnDestroy(): void {
    /**
     * Al limpiar el scope, el servicio se encarga de matar:
     * 1. La Timeline de entrada.
     * 2. El loop infinito del efecto flotante.
     */
    this.scope.cleanup();
  }
}
