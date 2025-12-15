import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router'; // Necesario para la navegación
import { IProject } from '../../../core/types/IProject';
@Component({
  selector: 'app-card',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './Card.html',
  styleUrl: './Card.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Card {
  @Input({ required: true }) project!: IProject;

  get projectDetailLink(): string[] {
    return ['/projects', this.project.id];
  }
}
