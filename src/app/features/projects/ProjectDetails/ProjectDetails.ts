import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-project-details',
  imports: [],
  template: `<p>ProjectDetails works!</p>`,
  styleUrl: './ProjectDetails.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectDetails { }
