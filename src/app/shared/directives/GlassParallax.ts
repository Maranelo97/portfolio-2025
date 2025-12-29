import {
  AfterViewInit,
  Directive,
  ElementRef,
  inject,
  OnDestroy,
  afterNextRender,
} from '@angular/core';
import { gsap } from 'gsap';
import { ZoneService } from '../../core/services/zone';

@Directive({
  selector: '[appGlassParallax]',
  standalone: true,
})
export class GlassParallaxDirective implements OnDestroy {
  private el = inject(ElementRef);
  private zoneSvc = inject(ZoneService);
  private bounds: DOMRect | null = null;

  private scope = this.zoneSvc.createScope(`parallax-${Math.random()}`);

  constructor() {
    afterNextRender(() => {
      this.executeInitFn();
    });
  }

  private executeInitFn() {
    this.zoneSvc.runOutside(() => {
      const nativeEl = this.el.nativeElement;

      const onEnter = () => this.handleMouseEnter();
      const onMove = (e: MouseEvent) => this.handleMouseMove(e);
      const onLeave = () => this.handleMouseLeave();

      nativeEl.addEventListener('mouseenter', onEnter);
      nativeEl.addEventListener('mousemove', onMove);
      nativeEl.addEventListener('mouseleave', onLeave);
      this.scope.register(() => {
        nativeEl.removeEventListener('mouseenter', onEnter);
        nativeEl.removeEventListener('mousemove', onMove);
        nativeEl.removeEventListener('mouseleave', onLeave);
      });
    });
  }

  private handleMouseEnter() {
    this.bounds = this.el.nativeElement.getBoundingClientRect();
    gsap.set(this.el.nativeElement, {
      transformPerspective: 1500,
      transformStyle: 'preserve-3d',
    });
  }

  private handleMouseMove(e: MouseEvent) {
    if (!this.bounds) return;

    const mouseX = e.clientX - this.bounds.left;
    const mouseY = e.clientY - this.bounds.top;

    const xPct = mouseX / this.bounds.width - 0.5;
    const yPct = mouseY / this.bounds.height - 0.5;

    gsap.to(this.el.nativeElement, {
      duration: 0.5,
      rotateX: yPct * -20, // Reducimos ligeramente de 25 a 20 para evitar colisiones
      rotateY: xPct * 20,
      scale: 1.03, // Reducimos el scale de 1.05 a 1.03
      ease: 'power2.out',
      overwrite: 'auto',
      force3D: true,
      transformOrigin: 'center center', // Asegura que la rotación no se desplace
    });

    const glow = this.el.nativeElement.querySelector('.blur');
    if (glow) {
      gsap.to(glow, {
        duration: 0.4,
        x: xPct * 100,
        y: yPct * 100,
        opacity: 0.4,
        ease: 'power2.out',
      });
    }
  }

  private handleMouseLeave() {
    this.bounds = null;
    gsap.to(this.el.nativeElement, {
      duration: 0.8,
      rotateX: 0,
      rotateY: 0,
      scale: 1,
      ease: 'elastic.out(1, 0.6)',
      onComplete: () => {
        gsap.set(this.el.nativeElement, { clearProps: 'all' });
      },
    });
  }

  ngOnDestroy() {
    gsap.killTweensOf(this.el.nativeElement);
    const glow = this.el.nativeElement.querySelector('.blur');
    if (glow) gsap.killTweensOf(glow);
    this.scope.cleanup();
  }
}
