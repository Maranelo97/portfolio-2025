import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  OnInit,
  NgZone,
  ChangeDetectorRef,
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

@Component({
  selector: 'app-projects-list',
  standalone: true,
  imports: [Card, AsyncPipe, SkeletonUI],
  templateUrl: './ProjectList.html',
  styleUrl: './ProjectsList.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectsList implements OnInit {
  private animationTriggered = false;
  public projects$!: Observable<IProject[]>;

  private ngZone = inject(NgZone);
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
    this.animationTriggered = false;
    this.cdr.markForCheck();

    this.ngZone.runOutsideAngular(() => {
      const safetyTimer = setTimeout(() => this.startTransition(), 1000);

      this.projects$.pipe(first()).subscribe({
        next: () => {
          clearTimeout(safetyTimer);
          setTimeout(() => this.startTransition(), 800);
        },
        error: () => {
          clearTimeout(safetyTimer);
          this.startTransition();
        },
      });
    });
  }

  private startTransition(): void {
    if (this.animationTriggered) return;
    this.animationTriggered = true;

    this.ngZone.run(() => {
      this.skeletonSvc.setLoading(false);
      this.cdr.detectChanges();

      requestAnimationFrame(() => this.triggerListAnimation());
    });
  }

  private triggerListAnimation(): void {
    this.ngZone.runOutsideAngular(() => {
      const root = this.el.nativeElement;
      const cards = root.querySelectorAll('app-card');
      if (cards.length > 0) {
        this.animSvc.slideInStagger(Array.from(cards), 'left');
      }
    });
  }
}
