import { Component, signal, inject } from '@angular/core';
import { ChildrenOutletContexts } from '@angular/router';
import { RouterOutlet } from '@angular/router';
import { PortalModule } from '@angular/cdk/portal';
import { DrawerService } from './core/services/drawer';
import { FloatingNav } from './shared/components/floating-nav/floating-nav';
import { navAnimation } from './shared/utils/navAnimations';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FloatingNav, PortalModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
  animations: [navAnimation],
  standalone: true,
})
export class App {
  constructor(private contexts: ChildrenOutletContexts) {}
  protected readonly title = signal('Portfolio Mariano Santos');
  protected drawerSvc = inject(DrawerService);

  getRouteAnimationData() {
    return this.contexts.getContext('primary')?.route?.snapshot?.data?.['animation'];
  }
}
