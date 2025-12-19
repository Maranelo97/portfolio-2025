import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { IExperience } from '../../../core/types/IExperience';
import { CardUI } from '../../../shared/components/Card/CardUI';
import { Card } from '../../../shared/components/Card/Card'; // Importamos tu componente Card

@Component({
  selector: 'app-experience',
  standalone: true,
  imports: [CommonModule, Card], // Agregamos Card aquí
  templateUrl: './Experience.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Experience { 

  readonly experiences: IExperience[] = [
    {
      company: 'Tech Solutions Inc.',
      position: 'Senior Full-Stack Developer',
      period: '2022 - Presente',
      description: 'Liderazgo técnico en proyectos Angular, optimización de rendimiento SSR y diseño de arquitecturas escalables.',
      stack: ['Angular', 'Node.js', 'PostgreSQL']
    },
    {
      company: 'Digital Agency',
      position: 'Frontend Developer',
      period: '2020 - 2022',
      description: 'Desarrollo de interfaces dinámicas y optimización de la experiencia de usuario en múltiples plataformas.',
      stack: ['TypeScript', 'RxJS', 'Sass']
    }
  ];

  /**
   * MAPPER: Transforma el modelo de datos de Experiencia 
   * al modelo de interfaz que requiere la Card.
   */
  mapToCard(exp: IExperience): CardUI {
    return {
      title: exp.position,
      subtitle: exp.company,
      description: exp.description,
      tags: exp.stack,
      footerText: exp.period,
      variant: 'experience'
      // imageUrl y link no se envían, así que la Card no los renderizará
    };
  }
}