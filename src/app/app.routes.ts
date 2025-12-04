import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./features/home/home.routes').then((m) => m.HOME_ROUTES),
  },
  {
    path: 'projects',
    loadChildren: () => import('./features/projects/projects.routes').then((m) => m.PROJECTS_ROUTES)
  },
  {
    path: 'contact',
    loadChildren: () => import('./features/contact/contact.routes').then((m) => m.CONTACT_ROUTES)
  },
  { path: '**', redirectTo: '' },
];
