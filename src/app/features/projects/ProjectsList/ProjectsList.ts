import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  OnInit,
  ChangeDetectorRef,
  signal,
} from '@angular/core';
import { first, Observable, tap } from 'rxjs';
import { Card } from '../../../shared/components/Card/Card';
import { IProject } from '../../../core/types/IProject';
import { ProjectsService } from '../../../core/services/projects';
import { AsyncPipe } from '@angular/common';
import { PlatformService } from '../../../core/services/platform';
import { AnimationService } from '../../../core/services/animations';
import { SkeletonService } from '../../../core/services/skeleton';
import { SkeletonUI } from '../../../shared/components/Skeleton/Skeleton';
import { afterNextRender } from '@angular/core';
import { GlassParallaxDirective } from '../../../shared/directives/GlassParallax';
import { ZoneService } from '../../../core/services/zone';
import gsap from 'gsap';
@Component({
  selector: 'app-projects-list',
  standalone: true,
  imports: [Card, AsyncPipe, SkeletonUI, GlassParallaxDirective],
  templateUrl: './ProjectList.html',
  styleUrl: './ProjectsList.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectsList implements OnInit {
  private animationTriggered = false;
  public projects$!: Observable<IProject[]>;
  private zoneSvc = inject(ZoneService);
  private cdr = inject(ChangeDetectorRef);
  protected projectsService = inject(ProjectsService);
  private skeletonSvc = inject(SkeletonService);
  private platformService = inject(PlatformService);
  private animSvc = inject(AnimationService);
  private el = inject(ElementRef);
  activeLens = signal<string | null>(null);

  // Lista dinámica de tecnologías únicas extraídas de los proyectos
  public availableTechs: string[] = [];

  constructor() {
    afterNextRender(() => {
      this.loadProjects();
    });
  }

  get isLoading() {
    return this.skeletonSvc.isLoading;
  }

  ngOnInit() {
    this.projects$ = this.projectsService.getAllProjects().pipe(
      tap((projects) => {
        // Extraemos techs únicas
        const techs = projects.flatMap((p) => p.technologies);
        this.availableTechs = [...new Set(techs)].sort();

        // Forzamos detección para que las pills aparezcan
        this.cdr.detectChanges();
      }),
    );
  }

  loadProjects(): void {
    if (!this.platformService.isBrowser) return;

    this.skeletonSvc.setLoading(true);
    this.cdr.markForCheck();

    // Usamos tu ZoneService
    this.zoneSvc.runOutside(() => {
      this.projects$.pipe(first()).subscribe({
        next: () => {
          this.zoneSvc.setOutsideTimeout(() => this.startTransition(), 800);
        },
        error: () => this.startTransition(),
      });
    });
  }

  private startTransition(): void {
    if (this.animationTriggered) return;
    this.animationTriggered = true;

    // Volvemos a la zona para actualizar UI
    this.zoneSvc.run(() => {
      this.skeletonSvc.setLoading(false);
      this.cdr.detectChanges();

      // Animación de entrada de la lista
      this.zoneSvc.scheduleFrame(() => this.triggerListAnimation());
    });
  }

  private triggerListAnimation(): void {
    const cards = this.el.nativeElement.querySelectorAll('app-card');
    if (cards.length > 0) {
      this.animSvc.slideInStagger(Array.from(cards));
    }
  }

  selectLens(tech: string) {
    if (this.activeLens() === tech) {
      this.activeLens.set(null);
      this.resetMorph();
    } else {
      this.activeLens.set(tech);
      this.applyMorph(tech); // Aquí es donde usas GSAP
    }
  }

  private applyMorph(tech: string) {
    this.zoneSvc.runOutside(() => {
      const wrappers = this.el.nativeElement.querySelectorAll('.perspective-wrapper');

      wrappers.forEach((el: HTMLElement) => {
        const techs = el.getAttribute('data-techs') || '';
        const isMatch = techs.includes(tech);

        gsap.to(el, {
          opacity: isMatch ? 1 : 0.2,
          scale: isMatch ? 1.05 : 0.95,
          filter: isMatch ? 'blur(0px)' : 'blur(8px)',
          duration: 0.6,
          ease: isMatch ? 'back.out(1.7)' : 'power2.out',
          overwrite: true, // Evita conflictos si el usuario clickea rápido
        });
      });
    });
  }
  private resetMorph() {
    if (!this.platformService.isBrowser) return;

    this.zoneSvc.runOutside(() => {
      const cards = this.el.nativeElement.querySelectorAll('.perspective-wrapper');
      gsap.to(cards, {
        opacity: 1,
        scale: 1,
        filter: 'blur(0px)',
        zIndex: 1,
        duration: 0.5,
        clearProps: 'all', // Limpia los estilos de GSAP para que no interfieran con el hover
        ease: 'power2.inOut',
      });
    });
  }
}
