// src/app/features/projects/ProjectsList/ProjectsList.ts
import { ChangeDetectionStrategy, Component, ElementRef, inject, OnInit } from '@angular/core';
import { Observable, map } from 'rxjs'; // Importamos map de rxjs
import { Card } from '../../../shared/components/Card/Card';
import { IProject } from '../../../core/types/IProject';
import { CardUI } from '../../../shared/components/Card/CardUI'; // Nuestra interfaz Pro
import { ProjectsService } from '../../../core/services/projects';
import { AsyncPipe, CommonModule } from '@angular/common';
import { PlatformService } from '../../../core/services/platform';
import { AnimationService } from '../../../core/services/animations';

@Component({
  selector: 'app-projects-list',
  standalone: true,
  imports: [Card, AsyncPipe, CommonModule],
  templateUrl: './ProjectList.html',
  styleUrl: './ProjectsList.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectsList implements OnInit {
  public projects$!: Observable<IProject[]>;
  public isLoading = true;
  private el = inject(ElementRef);

  constructor(
    private projectsService: ProjectsService,
    private platformService: PlatformService,
    private animSvc: AnimationService
  ) {}

  ngOnInit() {
    this.loadProjects();
  }

  loadProjects(): void {
    this.projects$ = this.projectsService.getAllProjects();

    this.projects$.subscribe(() => {
      this.isLoading = false;

      // Esperamos a que Angular renderice el @for en el DOM
      setTimeout(() => {
        this.triggerListAnimation();
      }, 50);
    });
  }
  /**
   * EL MAPPER: Aquí convertimos la data de negocio en data visual.
   * Si el día de mañana IProject cambia, solo tocas este método.
   */
mapToCard(project: IProject): CardUI {
    return {
      title: project.title,
      description: project.shortDescription,
      imageUrl: project.cardImageUrl,
      tags: project.technologies,
      footerText: project.completionDate, // Usamos la fecha en el footer
      link: ['/projects', project.id],
      variant: 'project', // 👈 Importante para el estilo
    };
  }
  private triggerListAnimation(): void {
    if (this.platformService.isBrowser) {
      // Buscamos todos los componentes app-card dentro de la lista
      const cards = this.el.nativeElement.querySelectorAll('app-card');
      if (cards.length > 0) {
        this.animSvc.slideInStagger(Array.from(cards), 'left');
      }
    }
  }
}
