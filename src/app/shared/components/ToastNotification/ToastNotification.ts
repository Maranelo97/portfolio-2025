import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
  OnDestroy,
  Output,
  EventEmitter,
} from '@angular/core';

@Component({
  selector: 'app-toast-notification',
  imports: [CommonModule],
  template: `
    <div
      *ngIf="visible"
      class="fixed top-5 right-5 p-4 rounded-lg shadow-2xl transition-all duration-500 z-50 transform"
      [ngClass]="{
        'bg-teal-500 text-white': type === 'success',
        'bg-red-500 text-white': type === 'error',
        'translate-x-0 opacity-100': visible,
        'translate-x-full opacity-0': !visible
      }"
    >
      <p class="font-bold">{{ title }}</p>
      <p>{{ message }}</p>
    </div>
  `,
  styles: [
    `
      .translate-x-full {
        transform: translateX(150%);
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToastNotification implements OnInit, OnDestroy {
  @Input() type: 'success' | 'error' = 'success';
  @Input() title: string = '';
  @Input() message: string = '';
  @Input() duration: number = 4000; // 4 se

  public visible = false;
  private timeoutId: any;

  @Output() closed = new EventEmitter<void>();

  ngOnInit(): void {
    if (this.title || this.message) {
      this.show();
    }
  }

  show(): void {
    this.visible = true;
    this.timeoutId = setTimeout(() => {
      this.hide();
    }, this.duration);
  }

  hide(): void {
    this.visible = false;
    // Damos tiempo a la animación CSS antes de emitir y eliminarlo
    setTimeout(() => {
      this.closed.emit();
    }, 500);
  }

  ngOnDestroy(): void {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  }
}
