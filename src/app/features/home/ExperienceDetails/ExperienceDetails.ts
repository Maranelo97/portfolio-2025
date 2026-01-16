import { Component, input, output, AfterViewInit, inject, ChangeDetectorRef } from '@angular/core';
import { AnimationService } from '../../../core/services/animations';
import { DrawerEntranceStrategy } from '../../../core/animations/strategies/drawerEntrance';
import { DrawerExitStrategy } from '../../../core/animations/strategies/drawerExit';

@Component({
  selector: 'app-experience-details',
  templateUrl: './ExperienceDetails.html',
  standalone: true,
})
export class ExperienceDetailsComponent implements AfterViewInit {
  data = input.required<any>();
  close = output<void>();

  private animSvc = inject(AnimationService);
  private cdr = inject(ChangeDetectorRef);

  ngAfterViewInit() {
    this.cdr.detectChanges();

    this.animSvc.run([], new DrawerEntranceStrategy('.drawer-panel', '.drawer-backdrop'));
  }

  onClose() {
    this.animSvc.run(
      [],
      new DrawerExitStrategy('.drawer-panel', '.drawer-backdrop', () => this.close.emit()),
    );
  }
}
