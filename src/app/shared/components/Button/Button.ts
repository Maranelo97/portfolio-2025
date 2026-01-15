import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'app-button',
  imports: [],
  standalone: true,
  template: `
    <button
      [class]="customStyles()"
      (click)="onClick.emit($event)"
      class="group relative overflow-hidden transition-all duration-300 cursor-pointer">
      <span class="relative z-10">{{ label() }}</span>

      <div
        class="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 blur transition-opacity duration-300"></div>
    </button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Button {
  label = input.required<string>();

  styles = input<string | string[]>([]);

  onClick = output<MouseEvent>();

  customStyles(): string {
    const s = this.styles();
    return Array.isArray(s) ? s.join(' ') : s;
  }
}
