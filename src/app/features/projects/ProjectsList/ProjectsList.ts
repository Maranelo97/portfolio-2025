import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Card } from '../../../shared/components/Card/Card';
import { CommonModule } from '@angular/common';
import { IProject } from '../../../core/types/IProject';
import { ProjectsService } from '../../../core/services/projects';

@Component({
  selector: 'app-projects-list',
  standalone: true,
  imports: [CommonModule, Card],
  templateUrl: './ProjectList.html',
  styleUrl: './ProjectsList.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectsList implements OnInit{ 
// 1. Observable que almacenará la lista de proyectos
  public projects$!: Observable<IProject[]>;

  // Opcional: variable para simular el estado de carga
  public isLoading = true;

  constructor(private projectsService: ProjectsService){

  }

  ngOnInit(){
    this.loadProjects()
  }

  loadProjects(): void {
    // 2. Obtener el Observable del servicio
    this.projects$ = this.projectsService.getAllProjects();
    
    // (Opcional) Simular el fin de la carga para manejar el spinner si existiera
    this.projects$.subscribe(() => {
      this.isLoading = false;
    });
  }

public trackByFn(index: number, item: IProject): string {
      return item.id; // Retorna el ID único del proyecto
    }

}
