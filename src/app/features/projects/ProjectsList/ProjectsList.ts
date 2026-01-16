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
import { ProjectFilterService } from '../../../core/services/projectFilter';
import { ListEntranceStrategy, TechMorphStrategy, ResetTechMorphStrategy } from '@strategies';

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
  private filterSvc = inject(ProjectFilterService);
  activeLens = signal<string | null>(null);

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
        const techs = projects.flatMap((p) => p.technologies);
        this.availableTechs = [...new Set(techs)].sort();
        this.cdr.detectChanges();
      }),
    );
  }

  loadProjects(): void {
    if (!this.platformService.isBrowser) return;

    this.skeletonSvc.setLoading(true);
    this.cdr.markForCheck();
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

    this.zoneSvc.run(() => {
      this.skeletonSvc.setLoading(false);
      this.cdr.detectChanges();

      this.zoneSvc.scheduleFrame(() => this.triggerListAnimation());
    });
  }

  private triggerListAnimation(): void {
    const cards = Array.from(this.el.nativeElement.querySelectorAll('app-card')) as HTMLElement[];
    this.animSvc.run(cards, new ListEntranceStrategy());
  }

  selectLens(tech: string) {
    const wrappers = Array.from(
      this.el.nativeElement.querySelectorAll('.perspective-wrapper'),
    ) as HTMLElement[];

    if (this.activeLens() === tech) {
      this.activeLens.set(null);
      this.filterSvc.resetFilter(this.el);
      this.animSvc.run(wrappers, new ResetTechMorphStrategy());
    } else {
      this.activeLens.set(tech);
      this.filterSvc.applyTechFilter(this.el, tech);
      this.animSvc.run(wrappers, new TechMorphStrategy(tech));
    }
  }
}
