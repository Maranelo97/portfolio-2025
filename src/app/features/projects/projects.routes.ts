import { Routes } from '@angular/router';
import { ProjectsList } from './ProjectsList/ProjectsList';
import { ProjectDetails } from './ProjectDetails/ProjectDetails';

export const PROJECTS_ROUTES: Routes = [
  {
    path: '',
    component: ProjectsList,
    title: 'Mis Proyectos | Portafolio Pro',
    data: { animation: 'ProjectsList' },
  },
  {
    path: ':id',
    component: ProjectDetails,
    data: { animation: 'ProjectDetails' },
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full',
  },
];
