import { ChangeDetectionStrategy, Component, OnInit, ElementRef, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, ParamMap} from '@angular/router'; // Importamos ActivatedRoute
import { Observable, switchMap, of, tap, catchError } from 'rxjs';
import { IProject } from '../../../core/types/IProject';
import { ProjectsService } from '../../../core/services/projects';
import { PlatformService } from '../../../core/services/platform';
import { AnimationService } from '../../../core/services/animations';

@Component({
  selector: 'app-project-details',
  imports: [CommonModule],
  templateUrl: './ProjectDetails.html',
  styleUrl: './ProjectDetails.css',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectDetails implements OnInit {
  public project$!: Observable<IProject | null>;
  public projectFound = true;

  constructor(
    private route: ActivatedRoute,
    private projectsService: ProjectsService,
    private platformService: PlatformService, // Inyectado aquí
    private animSvc: AnimationService,         // Inyectado aquí
    private el: ElementRef                     // Inyectado aquí
  ) {}

  ngOnInit(): void {
    this.project$ = this.route.paramMap.pipe(
      switchMap((params: ParamMap) => {
        const id = params.get('id');
        if (!id) {
          this.projectFound = false;
          return of<IProject | null>(null);
        }
        
        return this.projectsService.getProjectById(id).pipe(
          tap(project => {
            this.projectFound = !!project;
            if (project) {
              this.animateIn();
            }
          }),
          catchError(error => {
            this.projectFound = false;
            return of<IProject | null>(null);
          })
        );
      })
    );
  }

  private animateIn(): void {
    // Aquí usamos 'this' para acceder a los servicios del constructor
    if (!this.platformService.isBrowser) return;

    setTimeout(() => {
      const items = this.el.nativeElement.querySelectorAll('.animate-item');
      if (items.length > 0) {
        this.animSvc.fadeInStagger(Array.from(items));
      }
    }, 50);
  }
}