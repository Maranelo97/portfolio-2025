import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ISkills } from '../../../core/types/ISkills';

@Component({
  selector: 'app-skills',
  imports: [],
  templateUrl: './Skills.html',
  styleUrl: './Skills.css',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Skills {
  public readonly domains: ISkills[] = [
    {
      title: 'Frontend Development',
      // Ícono de código (Heroicon Outline: Code)
      icon: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4',
      skills: [
        'Angular (Experto)',
        'TypeScript',
        'RxJS',
        'NgRx',
        'Standalone Components',
        'HTML5 & CSS3',
      ],
    },
    {
      title: 'Styling & UX/UI',
      // Ícono de brocha (Heroicon Outline: Paintbrush)
      icon: 'M7.5 14.5a2 2 0 00-2-2h-3a2 2 0 00-2 2v3a2 2 0 002 2h3a2 2 0 002-2v-3zm0 0a2 2 0 002 2h3a2 2 0 002-2v-3a2 2 0 00-2-2h-3a2 2 0 00-2 2v3z',
      skills: [
        'Tailwind CSS (Experto)',
        'Bootstrap',
        'Sass/Less',
        'Diseño Responsivo',
        'Diseño de Patrones',
      ],
    },
    {
      title: 'Backend & Database',
      // Ícono de servidor (Heroicon Outline: Server)
      icon: 'M12 4v16m8-8H4m16-4V8a2 2 0 00-2-2H6a2 2 0 00-2 2v4m16 0v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4',
      skills: ['Node.js', 'Express', 'APIs REST', 'NestJS', 'MongoDB', 'PostgreSQL', 'SQL'],
    },
    {
      title: 'Tools & DevOps',
      // Ícono de herramienta (Heroicon Outline: Chip)
      icon: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4',
      skills: [
        'Git & GitHub',
        'NPM/Yarn',
        'CI/CD (GitHub Actions)',
        'Docker',
        'Testing (Jest/Cypress)',
        'Server-Side Rendering (SSR)',
      ],
    },
  ];
}
