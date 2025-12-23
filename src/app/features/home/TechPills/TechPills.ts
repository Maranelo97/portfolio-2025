import { ChangeDetectionStrategy, Component } from '@angular/core';

import { inject } from '@angular/core';
import { PillService } from '../../../core/services/SkillsPills';
import { ITech } from '../../../core/types/ITech';

@Component({
  selector: 'tech-pills',
  standalone: true,
  imports: [],
  templateUrl: './TechPills.html',
  styleUrl: './TechPills.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TechPills {
  private pillService = inject(PillService);
  public readonly technologies: ITech[] = this.pillService.getTechIcons();
}
