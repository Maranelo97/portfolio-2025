import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, ParamMap, RouterLink } from '@angular/router'; // Importamos ActivatedRoute
import { Observable, switchMap, of, tap, catchError } from 'rxjs';
import { IProject } from '../../../core/types/IProject';
import { ProjectsService } from '../../../core/services/projects';

@Component({
  selector: 'app-project-details',
  imports: [CommonModule, RouterLink],
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
    private projectsService: ProjectsService
  ){}

ngOnInit(): void {
    this.project$ = this.route.paramMap.pipe(
      // 1. switchMap: Cambia el Observable del parámetro de la ruta 
      //    al Observable que obtiene el proyecto del servicio.
      switchMap((params: ParamMap) => {
        const id = params.get('id');
        if (!id) {
          // Si el ID es nulo, devuelve un Observable de null
          this.projectFound = false;
          return of<IProject | null>(null);
        }
        
        // 2. Llama al servicio para obtener el proyecto
        return this.projectsService.getProjectById(id).pipe(
          tap(project => {
            // 3. Verifica el resultado y establece el estado 'projectFound'
            this.projectFound = !!project;
            if (project) {
              // Opcional: Establecer el título de la página dinámicamente (PRO touch)
              // document.title = `${project.title} | Portafolio Pro`; 
            }
          }),
          // 4. Manejo de error si la búsqueda falla
          catchError(error => {
            console.error('Error fetching project:', error);
            this.projectFound = false;
            return of<IProject | null>(null);
          })
        );
      })
    );
  }
}
