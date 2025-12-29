import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  OnInit,
  ChangeDetectorRef,
} from '@angular/core';
import { first, Observable } from 'rxjs';
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

  constructor() {
    afterNextRender(() => {
      this.loadProjects();
    });
  }

  get isLoading() {
    return this.skeletonSvc.isLoading;
  }

  ngOnInit() {
    this.projects$ = this.projectsService.getAllProjects();
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
      this.animSvc.slideInStagger(Array.from(cards), 'left');
    }
  }
}
