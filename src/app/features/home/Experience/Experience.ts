import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  afterNextRender,
} from '@angular/core';
import { IExperience } from '../../../core/types/IExperience';
import { CardUI } from '../../../shared/components/Card/CardUI';
import { Card } from '../../../shared/components/Card/Card'; // Importamos tu componente Card
import { register } from 'swiper/element/bundle';
import { ZoneService } from '../../../core/services/zone';

@Component({
  selector: 'app-experience',
  standalone: true,
  imports: [CommonModule, Card], // Agregamos Card aquí
  templateUrl: './Experience.html',
  styleUrl: './Experience.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class Experience {
  readonly experiences: IExperience[] = [
    {
      company: 'Megatrans S.A.',
      position: 'Front-End Developer Ssr. | AI & CRM Integrations',
      period: 'Junio 2023 - Presente',
      description:
        'Desarrollo front-end de aplicaciones de geolocalización para flotas de camiones y dispositivos móviles utilizando APIs de Here Maps. Refactorización e integración de proyectos legacy, migrando aplicaciones de Angular 8 a Angular 16. Optimización de integraciones con APIs REST para garantizar un flujo de datos eficiente entre sistemas. Mejora continua de la experiencia UX/UI en plataformas web y mobile, con foco en escalabilidad, rendimiento y usabilidad.',
      stack: ['Angular', 'TypeScript', 'Here Maps API', 'REST APIs', 'RxJS'],
    },
    {
      company: 'Tenaris',
      position: 'Full Stack Developer | React & Angular',
      period: 'Marzo 2024 - Noviembre 2024',
      description:
        'Desarrollo de aplicaciones full-stack para clientes y PYMEs, incluyendo diseño de bases de datos y creación de APIs REST. Implementación de soluciones basadas en stacks M.E.A.N. y M.E.R.N., utilizando Node.js, Express, MongoDB, Angular y React según los requerimientos del proyecto. Participación clave en el desarrollo de una plataforma global para la creación de formularios de inspección de tuberías destinadas a infraestructuras eléctricas, de agua y gas, con despliegues internacionales en Portugal y China.',
      stack: [
        'React',
        'Angular',
        'Node.js',
        'Express',
        'MongoDB',
        'REST APIs',
        'Material UI',
        'PrimeNG',
      ],
    },
    {
      company: 'WeeNovate',
      position: 'Front-End Developer | React Specialist',
      period: 'Mayo 2022 - Marzo 2024',
      description:
        'Desarrollo front-end de sistemas de gestión y aplicaciones bancarias internacionales con soporte para múltiples monedas. Integración de APIs backend con interfaces modernas en React. Diseño e implementación de componentes UI reutilizables utilizando Tailwind CSS y Sass. Participación en procesos de prototipado rápido y experimentación con herramientas de desarrollo asistidas por IA para acelerar la iteración de productos y mejorar la experiencia de usuario.',
      stack: ['React', 'JavaScript', 'Tailwind CSS', 'Sass', 'REST APIs'],
    },
  ];

  constructor() {
    afterNextRender(() => {
      register();

      // Configuración manual de los botones de navegación
      const swiperEl = document.querySelector('swiper-container');
      const params = {
        navigation: {
          nextEl: '.swiper-next-btn',
          prevEl: '.swiper-prev-btn',
        },
        // Opcional: permitir navegación con teclado
        keyboard: {
          enabled: true,
        },
      };

      Object.assign(swiperEl!, params);
      (swiperEl as any).initialize();
    });
  }

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
      variant: 'experience',
      // imageUrl y link no se envían, así que la Card no los renderizará
    };
  }
}
