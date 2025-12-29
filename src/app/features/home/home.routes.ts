// src/app/features/home/home.routes.ts

import { Routes } from '@angular/router';
import { Home } from './home';

// Define la variable que será exportada y cargada por Lazy Loading
export const HOME_ROUTES: Routes = [
  {
    path: '', // La ruta relativa es vacía, ya que app.routes.ts ya maneja el path base (/)
    component: Home,
  },
];
