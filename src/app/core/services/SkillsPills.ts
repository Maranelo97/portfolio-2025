import { Injectable } from '@angular/core';
import { ITech } from '../types/ITech';

@Injectable({ providedIn: 'root' })
export class PillService {
  private readonly technologies = [
    { name: 'Angular', slug: 'angular', color: '#DD0031' },
    { name: 'TypeScript', slug: 'typescript', color: '#3178C6' },
    { name: 'NgRx', slug: 'ngrx', color: '#a829c3' },
    { name: 'Sass', slug: 'sass', color: '#CD6799' },
    { name: 'Node.js', slug: 'node.js', color: '#339933' },
    { name: 'NestJS', slug: 'nestjs', color: '#E0234E' },
    { name: 'GSAP', slug: 'greensock', color: '#88CE02' },
    { name: 'ChartJs', slug: 'chart.js', color: '#3178C6' },
    { name: 'Tailwind', slug: 'tailwindcss', color: '#06B6D4' },
    { name: 'PostgreSQL', slug: 'postgresql', color: '#4169E1' },
    { name: 'MySQL', slug: 'mysql', color: '#4169E1' },
    { name: 'MongoDb', slug: 'mongodb', color: '#96FF00' },
    { name: 'Docker', slug: 'docker', color: '#2496ED' },
    { name: 'Three.Js', slug: 'three.js', color: '#252525' },
    { name: 'Github', slug: 'github', color: '#fff' },
    { name: 'Git', slug: 'git', color: '#F1502F' },
  ];

  getTechIcons(): ITech[] {
    return this.technologies;
  }
}
