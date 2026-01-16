import {
  Component,
  Input,
  OnInit,
  OnDestroy,
  Output,
  EventEmitter,
  inject,
  ChangeDetectorRef,
  ElementRef,
  ViewChild,
  ChangeDetectionStrategy,
} from '@angular/core';
import { ZoneService } from '../../../core/services/zone';
import { AnimationService } from '../../../core/services/animations';
import { StaggerScaleStrategy } from '../../../core/animations/strategies';

@Component({
  selector: 'app-toast-notification',
  standalone: true,
  imports: [],
  template: `
    @if (visible) {
      <div #toastContainer class="fixed top-8 right-8 z-9999 transform pointer-events-auto">
        <div
          class="relative min-w-[320px] rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10">
          <div class="absolute inset-0 backdrop-blur-xl bg-gray-900/80"></div>

          <div
            class="absolute inset-0 opacity-20 bg-linear-to-br"
            [class.from-teal-400]="type === 'success'"
            [class.from-red-400]="type === 'error'"
            class="to-transparent"></div>

          <div class="relative flex items-center gap-4 px-6 py-5">
            <div
              class="shrink-0 w-10 h-10 rounded-xl flex items-center justify-center shadow-lg text-white"
              [class.bg-teal-500]="type === 'success'"
              [class.bg-red-500]="type === 'error'">
              @if (type === 'success') {
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="3"
                    d="M5 13l4 4L19 7"></path>
                </svg>
              } @else {
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="3"
                    d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              }
            </div>

            <div class="flex flex-col flex-1">
              <span class="text-white font-black text-sm uppercase tracking-widest mb-0.5">
                {{ title }}
              </span>
              <span class="text-gray-400 text-sm font-medium leading-tight">{{ message }}</span>
            </div>

            <button (click)="hide()" class="text-white/20 hover:text-white transition-colors p-1">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"></path>
              </svg>
            </button>
          </div>

          <div
            class="absolute bottom-0 left-0 h-[3px] transition-all duration-100 ease-linear"
            [class.bg-teal-500]="type === 'success'"
            [class.bg-red-500]="type === 'error'"
            [style.width.%]="progress"></div>
        </div>
      </div>
    }
  `,
  styles: [
    `
      :host {
        pointer-events: none;
      }

      .fade-out {
        pointer-events: none;
        transition: all 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        opacity: 0;
        transform: translateX(50px) scale(0.9);
        filter: blur(10px);
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToastNotification implements OnInit, OnDestroy {
  @Input() type: 'success' | 'error' = 'success';
  @Input() title: string = '';
  @Input() message: string = '';
  @Input() duration: number = 4500;

  @ViewChild('toastContainer') toastContainer?: ElementRef;
  @Output() closed = new EventEmitter<void>();

  public visible = false;
  public progress = 100;

  private zoneSvc = inject(ZoneService);
  private animSvc = inject(AnimationService);
  private cdr = inject(ChangeDetectorRef);
  private scope = this.zoneSvc.createScope('toast-animation');
  private progressInterval: any;

  ngOnInit(): void {
    if (this.title || this.message) {
      this.show();
    }
  }

  show(): void {
    this.visible = true;
    this.progress = 100;
    this.cdr.detectChanges();

    // 1. Usamos el motor para la animación de entrada
    if (this.toastContainer) {
      this.animSvc.run(this.toastContainer.nativeElement, new StaggerScaleStrategy());
    }

    // 2. La lógica del timer se mantiene aquí porque es lógica de NEGOCIO del Toast
    this.startTimer();
  }

  private startTimer(): void {
    this.zoneSvc.runOutside(() => {
      const startTime = Date.now();
      this.progressInterval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        this.progress = 100 - (elapsed / this.duration) * 100;

        if (this.progress <= 0) {
          this.progress = 0;
          clearInterval(this.progressInterval);
          this.zoneSvc.run(() => this.hide());
        }
        this.cdr.detectChanges();
      }, 16);

      this.scope.register(() => clearInterval(this.progressInterval));
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
    }, 600);

    this.scope.register(() => this.zoneSvc.clearOutsideTimeout(closeId));
  }

  ngOnDestroy(): void {
    if (this.progressInterval) clearInterval(this.progressInterval);
    this.scope.cleanup();
  }
}
