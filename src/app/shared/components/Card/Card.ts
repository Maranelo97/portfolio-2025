import { ChangeDetectionStrategy, Component, Input, Output, EventEmitter } from '@angular/core';
import { RouterLink } from '@angular/router'; // Necesario para la navegación
import { CardUI } from './CardUI';
@Component({
  selector: 'app-card',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './Card.html',
  styleUrl: './Card.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Card {
  @Input({ required: true }) data!: CardUI;
  @Output() cardClick = new EventEmitter<void>();

  onHandleClick(event: Event) {
    if (!this.data.link) {
      this.cardClick.emit();
    }
  }
}
