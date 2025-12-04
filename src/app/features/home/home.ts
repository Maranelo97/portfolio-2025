import {
  Component,
  AfterViewInit, // Importante para manipular el DOM
  ViewChild, 
  ElementRef, // Importante para referenciar elementos HTML
  OnInit
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlatformService } from '../../core/services/platform'; // Asegúrate de que la ruta sea correcta
import { RouterLink } from '@angular/router'; // Añadimos RouterLink para los botones
import { gsap } from 'gsap'; // Importamos GSAP
import { ScrollTrigger } from 'gsap/ScrollTrigger'; // Importamos ScrollTrigger

// Registrar plugins globalmente
gsap.registerPlugin(ScrollTrigger); 

@Component({
  selector: 'app-home',
  standalone: true,
  // Añadimos RouterLink a los imports para que los botones funcionen
  imports: [CommonModule, RouterLink], 
  templateUrl: './home.html'
})
export class Home implements AfterViewInit { // Cambiamos OnInit a AfterViewInit para el DOM

  // Referencias a los elementos del DOM (¡Necesarias para GSAP!)
  @ViewChild('heroContent') heroContent!: ElementRef;
  @ViewChild('ctaButtons') ctaButtons!: ElementRef;
  
  // Información de presentación
  readonly name = 'Mariano Santos';
  readonly title = 'Full-Stack Developer & Angular Specialist.';
  readonly description = 'Transformando ideas complejas en soluciones web de alto rendimiento y escalables.';

  constructor(private platformService: PlatformService) { }

  ngAfterViewInit(): void {
    // 1. Verificar si estamos en el navegador (Obligatorio para SSR)
    if (this.platformService.isBrowser) {
      this.animateHero();
    }
  }

  animateHero(): void {
    const content = this.heroContent.nativeElement;
    const buttons = this.ctaButtons.nativeElement;
    
    // Configuración inicial de los elementos (invisible y desplazado)
    gsap.set(content, { y: 20, opacity: 0 });
    gsap.set(buttons, { opacity: 0 });

    // 2. Crear la línea de tiempo (Timeline) de la animación
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    tl.to(content, {
        opacity: 1,
        y: 0,
        duration: 1.2,
        delay: 0.2 // Pequeño delay para que no aparezca inmediatamente
      })
      .to(buttons, {
        opacity: 1,
        duration: 0.8,
        delay: -0.5 // Empieza antes de que termine el anterior, para un flujo más rápido
      }, '+=0.2'); // Etiqueta para encadenar las animaciones

    // 3. (OPCIONAL) Añadir un efecto ScrollTrigger a la sección
    ScrollTrigger.create({
      trigger: 'section', // El disparador es toda la sección
      start: 'top top',   // Empieza cuando la parte superior de la sección toca la parte superior de la ventana
      end: '+=1000',      // Termina después de 1000px de scroll
      pin: true,          // Fija la sección en su lugar
      pinSpacing: false,  // Quita el espacio extra que deja el pin
      // marcadores para depuración: markers: true
    });
  }

}