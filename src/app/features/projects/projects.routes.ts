// src/app/features/home/home.routes.ts

import { Routes } from '@angular/router';
import { ProjectsList } from './ProjectsList/ProjectsList';
import { ProjectDetails } from './ProjectDetails/ProjectDetails';

// Define la variable que será exportada y cargada por Lazy Loading
export const PROJECTS_ROUTES: Routes = [
  {
    // Ruta base para /projects
    path: '',
    component: ProjectsList,
    title: 'Mis Proyectos | Portafolio Pro',
  },
  {
    // Ruta dinámica para un proyecto individual: /projects/:id
    // El slug ':id' será el Project.id (ej. /projects/ecommerce-angular)
    path: ':id',
    component: ProjectDetails,
    // Nota: El título final de la página se puede establecer dinámicamente en el componente.
  },
  // Opcional: Redirigir si alguien navega a /projects/mal-escrito
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full',
  },
];
