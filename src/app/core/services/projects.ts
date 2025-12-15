import { Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { IProject } from '../types/IProject';


const MOCK_PROJECTS: IProject[] = [
  {
    id: 'ecommerce-fullstack',
    title: 'E-commerce Moderno (Angular & NestJS)',
    shortDescription: 'Plataforma de comercio electrónico con manejo de inventario en tiempo real.',
    cardImageUrl: 'assets/img/project-ecommerce.jpg',
    technologies: ['Angular', 'NgRx', 'NestJS', 'PostgreSQL', 'Stripe'],
    completionDate: 'Diciembre 2025',
    fullDescription: 'Desarrollo de un sistema E-commerce de principio a fin, enfatizando la performance y la seguridad. El frontend utiliza NgRx para la gestión de estado y el backend, construido con NestJS (Node.js), implementa microservicios para autenticación y pagos.',
    repoUrl: 'https://github.com/marianosantos/ecommerce',
    liveUrl: 'https://ecommerce.marianosantos.dev'
  },
  {
    id: 'landing-page-gsap',
    title: 'Landing Page Animada',
    shortDescription: 'Web de alto impacto visual con animaciones complejas controladas por scroll.',
    cardImageUrl: 'assets/img/project-landing.jpg',
    technologies: ['Angular', 'GSAP', 'ScrollTrigger', 'Tailwind CSS'],
    completionDate: 'Septiembre 2025',
    fullDescription: 'Página de marketing diseñada para captar la atención del usuario a través de animaciones cinéticas. Se utilizó la integración profunda de GSAP con Angular para garantizar que las animaciones sean fluidas y no afecten el rendimiento de la aplicación ni el SSR.',
    repoUrl: 'https://github.com/marianosantos/animated-landing',
    liveUrl: 'https://gsap-landing.marianosantos.dev'
  },
  {
    id: 'api-management-tool',
    title: 'Herramienta de Gestión de APIs',
    shortDescription: 'SPA para visualizar y gestionar endpoints de múltiples servicios REST.',
    cardImageUrl: 'assets/img/project-api.jpg',
    technologies: ['Angular', 'RxJS', 'Sass', 'D3.js'],
    completionDate: 'Agosto 2024',
    fullDescription: 'Una herramienta interna para desarrolladores que simplifica la monitorización y prueba de APIs. Utiliza gráficos interactivos de D3.js para visualizar métricas de latencia y errores, todo gestionado con potentes *pipelines* de RxJS.',
    repoUrl: 'https://github.com/marianosantos/api-manager'
    // liveUrl intencionalmente vacío para simular proyecto interno
  }
];

@Injectable({
    providedIn: 'root'
})
export class ProjectsService {
    constructor(){}

    getAllProjects(): Observable<IProject[]> {
    // Usamos 'of' de RxJS para devolver el array como un Observable,
    // imitando el comportamiento de 'HttpClient'
    return of(MOCK_PROJECTS); 
  }


getProjectById(id: string): Observable<IProject | null> { // <-- Definimos el tipo de retorno como IProject | null
    const project = MOCK_PROJECTS.find(p => p.id === id);
    
    // Usamos 'map' para garantizar que 'undefined' se convierta en 'null'
    return of(project).pipe(
        map(p => p || null) 
    );
}
}