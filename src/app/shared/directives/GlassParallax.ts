import { Directive, ElementRef, HostListener, inject, OnDestroy } from '@angular/core';
import { gsap } from 'gsap';
import { ZoneService } from '../../core/services/zone';

@Directive({
  selector: '[appGlassParallax]',
  standalone: true
})
export class GlassParallaxDirective implements OnDestroy {
  private el = inject(ElementRef);
  private zoneSvc = inject(ZoneService);
  private bounds: DOMRect | null = null;

@HostListener('mouseenter')
  onMouseEnter() {
    this.bounds = this.el.nativeElement.getBoundingClientRect();
    
    // Seteo inicial para preparar el escenario 3D
    gsap.set(this.el.nativeElement, { 
      transformPerspective: 1500,
      transformStyle: 'preserve-3d'
    });
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(e: MouseEvent) {
    if (!this.bounds) return;

    this.zoneSvc.runOutside(() => {
      const mouseX = e.clientX - this.bounds!.left;
      const mouseY = e.clientY - this.bounds!.top;

      // Porcentajes de -0.5 a 0.5
      const xPct = (mouseX / this.bounds!.width) - 0.5;
      const yPct = (mouseY / this.bounds!.height) - 0.5;

      // Rotación más exagerada (hasta 20 grados)
      const rotateX = yPct * -25; 
      const rotateY = xPct * 25;

      gsap.to(this.el.nativeElement, {
        duration: 0.5,
        rotateX: rotateX,
        rotateY: rotateY,
        scale: 1.05,
        ease: 'power2.out',
        overwrite: 'auto',
        transformStyle: 'preserve-3d', // Permite que los hijos hereden el espacio 3D
        force3D: true
      });

      // El "Glow" o brillo se mueve en dirección opuesta para simular luz física
      const glow = this.el.nativeElement.querySelector('.blur');
      if (glow) {
        gsap.to(glow, {
          duration: 0.4,
          x: xPct * 100, // Movimiento amplio del brillo
          y: yPct * 100,
          opacity: 0.4, // Se ilumina más al mover el mouse
          ease: 'power2.out'
        });
      }
    });
  }

@HostListener('mouseleave')
  onMouseLeave() {
    this.bounds = null;
    gsap.to(this.el.nativeElement, {
      duration: 0.8,
      rotateX: 0,
      rotateY: 0,
      scale: 1,
      ease: 'elastic.out(1, 0.6)',
      // Opción A: Con llaves para no retornar el tween
      onComplete: () => { 
        gsap.set(this.el.nativeElement, { clearProps: 'all' }); 
      }
    });
  }

  ngOnDestroy() {
    gsap.killTweensOf(this.el.nativeElement);
  }
}