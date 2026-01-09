import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ElementRef,
  inject,
  ChangeDetectorRef,
  afterNextRender,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, ParamMap } from '@angular/router'; // Importamos ActivatedRoute
import { Observable, switchMap, of, tap, catchError } from 'rxjs';
import { IProject } from '../../../core/types/IProject';
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
  private projectsService = inject(ProjectsService);
  private platformService = inject(PlatformService);
  private animSvc = inject(AnimationService);
  private el = inject(ElementRef);
  private cdr = inject(ChangeDetectorRef);

  private zoneService = inject(ZoneService);

  constructor() {
    // Registramos la intención de animar una vez que el componente se renderice
    afterNextRender(() => {
      this.triggerAnimation();
    });
  }

  ngOnInit(): void {
    this.project$ = this.route.paramMap.pipe(
      switchMap((params: ParamMap) => {
        const id = params.get('id');
        if (!id) return of(null);
        return this.projectsService.getProjectById(id);
      }),
      tap((project) => {
        if (project) {
          this.projectFound = true;
          this.cdr.markForCheck();

          // CABALLOS DE FUERZA: Disparamos la animación cuando el DOM esté listo con datos
          this.zoneService.runOutside(() => {
            setTimeout(() => {
              this.triggerAnimation();
            }, 100); // Pequeño delay para asegurar que el @if (project) se renderizó
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
}
