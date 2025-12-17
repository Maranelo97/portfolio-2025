import { Component, AfterViewInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlatformService } from '../../core/services/platform';
import { RouterLink } from '@angular/router';
import { gsap } from 'gsap';
import { Skills } from './Skills/Skills';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, Skills],
  styleUrl: './home.css',
  templateUrl: './home.html',
})
export class Home implements AfterViewInit, OnDestroy {
  private ctx?: gsap.Context;
  @ViewChild('heroContent') heroContent!: ElementRef;
  @ViewChild('ctaButtons') ctaButtons!: ElementRef;

  readonly name = 'Mariano Santos';
  readonly title = 'Full-Stack Developer & Angular Specialist.';
  readonly description =
    'Transformando ideas complejas en soluciones web de alto rendimiento y escalables.';

  constructor(private platformService: PlatformService) {}

  ngAfterViewInit(): void {
    // Solo ejecutamos animaciones si estamos en el navegador
    if (this.platformService.isBrowser) {
      this.ctx = gsap.context(() => {
        this.animateHero();
      }, this.heroContent.nativeElement);
    }
  }

  // Limpieza de animaciones al destruir el componente
  ngOnDestroy(): void {
  if (this.platformService.isBrowser) {
      this.ctx?.revert(); // 👈 ¡ESTO es la clave! Revierte y limpia TODO automáticamente
    }
  }

  // src/app/features/home/home.ts

  animateHero(): void {
    // 1. Obtenemos TODOS los hijos directos de heroContent (p, h1, h2, p, app-skills, div botones)
    const allElements = Array.from(this.heroContent.nativeElement.children);

    // 2. Usamos fromTo para forzar el estado inicial y final, ignorando conflictos de CSS
    gsap.fromTo(
      allElements,
      {
        opacity: 0,
        y: 40, // Empiezan un poco más abajo
      },
      {
        opacity: 1,
        y: 0,
        duration: 1.2,
        stagger: 0.2, // 👈 Aquí ocurre la cascada (0.2s entre cada elemento)
        ease: 'power4.out',
        delay: 0.4, // Pequeño margen para que la página cargue
        clearProps: 'all', // Vital: limpia los estilos de GSAP al terminar para que Tailwind funcione bien
      }
    );
  }
}
