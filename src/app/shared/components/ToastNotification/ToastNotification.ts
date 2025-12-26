import { 
  Component, Input, OnInit, OnDestroy, Output, EventEmitter, 
  inject, ChangeDetectorRef, ElementRef, ViewChild, 
  ChangeDetectionStrategy
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ZoneService } from '../../../core/services/zone';
import { AnimationService } from '../../../core/services/animations';

@Component({
  selector: 'app-toast-notification',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      #toastContainer
      *ngIf="visible"
      class="fixed top-5 right-5 p-4 rounded-lg shadow-2xl z-50 transform pointer-events-auto"
      [ngClass]="{
        'bg-teal-500 text-white': type === 'success',
        'bg-red-500 text-white': type === 'error'
      }"
    >
      <div class="toast-content"> <p class="font-bold text-lg">{{ title }}</p>
        <p class="opacity-90">{{ message }}</p>
      </div>
    </div>
  `,
  styles: [`
    :host { pointer-events: none; }
    /* La transición de salida la manejamos con CSS simple o GSAP */
    .fade-out {
      transition: all 0.5s ease;
      opacity: 0;
      transform: translateX(100%) scale(0.9);
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToastNotification implements OnInit, OnDestroy {
  @Input() type: 'success' | 'error' = 'success';
  @Input() title: string = '';
  @Input() message: string = '';
  @Input() duration: number = 4000;

  @ViewChild('toastContainer') toastContainer?: ElementRef;
  @Output() closed = new EventEmitter<void>();

  public visible = false;
  private zoneSvc = inject(ZoneService);
  private animSvc = inject(AnimationService);
  private cdr = inject(ChangeDetectorRef);
  private scope = this.zoneSvc.createScope('toast-animation');

  ngOnInit(): void {
    if (this.title || this.message) {
      this.show();
    }
  }

  show(): void {
    this.visible = true;
    this.cdr.detectChanges(); // Forzamos render para que ViewChild esté disponible

    // Ejecutamos la animación fuera de la zona para no estresar el main thread
    this.zoneSvc.runOutside(() => {
      if (this.toastContainer) {
        // Seleccionamos los textos internos para el efecto stagger
        const elements = this.toastContainer.nativeElement.querySelectorAll('p');
        
        // Aplicamos tu animación ScaleIn
        this.animSvc.staggerScaleIn(Array.from(elements), 0.1);
        
        // Animamos también el contenedor principal (opcional)
        this.animSvc.staggerScaleIn(this.toastContainer.nativeElement, 0);
      }

      // Programamos el cierre automático
      const hideId = this.zoneSvc.setOutsideTimeout(() => {
        this.hide();
      }, this.duration);
      
      this.scope.register(() => this.zoneSvc.clearOutsideTimeout(hideId));
    });
  }

  hide(): void {
    if (this.toastContainer) {
      this.toastContainer.nativeElement.classList.add('fade-out');
    }

    const closeId = this.zoneSvc.setOutsideTimeout(() => {
      this.zoneSvc.run(() => {
        this.visible = false;
        this.closed.emit();
        this.cdr.markForCheck();
      });
    }, 500); // Tiempo de la transición .fade-out

    this.scope.register(() => this.zoneSvc.clearOutsideTimeout(closeId));
  }

  ngOnDestroy(): void {
    this.scope.cleanup();
  }
}