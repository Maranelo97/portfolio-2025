import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ElementRef,
  inject,
  ChangeDetectorRef,
  afterNextRender,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, ParamMap } from '@angular/router'; // Importamos ActivatedRoute
import { Observable, switchMap, of, tap, catchError, map, firstValueFrom } from 'rxjs';
import { IProject } from '../../../core/types/IProject';
import { AiAuditService } from '../../../core/services/AiAudit';
import { ProjectsService } from '../../../core/services/projects';
import { PlatformService } from '../../../core/services/platform';
import { AnimationService } from '../../../core/services/animations';
import { ZoneService } from '../../../core/services/zone';
import { Button } from '../../../shared/components/Button/Button';
import { GlassParallaxDirective } from '../../../shared/directives/GlassParallax';

@Component({
  selector: 'app-project-details',
  imports: [CommonModule, Button, GlassParallaxDirective],
  templateUrl: './ProjectDetails.html',
  styleUrl: './ProjectDetails.css',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectDetails implements OnInit {
  public project$!: Observable<IProject | null>;
  public projectFound = true;
  private route = inject(ActivatedRoute);
  private aiService = inject(AiAuditService);
  private projectsService = inject(ProjectsService);
  private platformService = inject(PlatformService);
  private animSvc = inject(AnimationService);
  private el = inject(ElementRef);
  private cdr = inject(ChangeDetectorRef);

  private zoneService = inject(ZoneService);
  public activeLens = signal<string | null>(null);
  public isAiLoading = signal(false);
  public aiResponse = signal<{ insight: string; blueprint: string } | null>(null);

  constructor() {
    // Registramos la intención de animar una vez que el componente se renderice
    afterNextRender(() => {
      this.triggerAnimation();
    });
  }

  ngOnInit(): void {
    this.project$ = this.route.paramMap.pipe(
      switchMap((params) => {
        const id = params.get('id');
        return id ? this.projectsService.getProjectById(id) : of(null);
      }),
      switchMap((project) => {
        // Retornamos los queryParams pero vinculados al proyecto actual
        return this.route.queryParamMap.pipe(
          tap(async (params) => {
            const tech = params.get('tech');
            this.activeLens.set(tech);

            // SI HAY TECH Y PROYECTO -> DISPARAMOS IA REAL
            if (tech && project) {
              await this.runRealAiAudit(tech, project);
            } else {
              this.aiResponse.set(null);
            }

            this.cdr.detectChanges();
          }),
          map(() => project),
        );
      }),
      tap((project) => {
        if (project) {
          this.zoneService.runOutside(() => {
            setTimeout(() => this.triggerAnimation(), 100);
          });
        }
      }),
    );
  }
  private triggerAnimation(): void {
    if (!this.platformService.isBrowser) return;

    this.zoneService.runOutside(() => {
      requestAnimationFrame(() => {
        const items = this.el.nativeElement.querySelectorAll('.animate-item');
        if (items.length > 0) {
          // Asegúrate de que tu animSvc.slideInStagger tenga un ease tipo expo.out
          this.animSvc.slideInStagger(Array.from(items));
        }
      });
    });
  }

  protected goToLink(url: string | undefined): void {
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  }

  private async runRealAiAudit(tech: string, project: IProject) {
    this.isAiLoading.set(true);
    this.cdr.detectChanges();

    try {
      const response = await this.aiService.getProjectAudit(tech, project);
      this.aiResponse.set(response);
    } catch (error) {
      this.aiResponse.set({
        insight: 'Error de conexión con el núcleo de IA.',
        blueprint: '[OFFLINE]',
      });
    } finally {
      this.isAiLoading.set(false);
      this.cdr.detectChanges();
    }
  }
}
