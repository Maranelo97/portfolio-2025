import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Card } from '../../../shared/components/Card/Card';
import { IProject } from '../../../core/types/IProject';
import { ProjectsService } from '../../../core/services/projects';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-projects-list',
  standalone: true,
  imports: [Card, AsyncPipe],
  templateUrl: './ProjectList.html',
  styleUrl: './ProjectsList.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectsList implements OnInit {
  public projects$!: Observable<IProject[]>;

  public isLoading = true;

  constructor(private projectsService: ProjectsService) {}

  ngOnInit() {
    this.loadProjects();
  }

  loadProjects(): void {
    this.projects$ = this.projectsService.getAllProjects();

    this.projects$.subscribe(() => {
      this.isLoading = false;
    });
  }
}
