import { Component, signal, inject } from '@angular/core';
import { ChildrenOutletContexts } from '@angular/router';
import { RouterOutlet } from '@angular/router';
import { FloatingNav } from './shared/components/floating-nav/floating-nav';
import { navAnimation } from './shared/utils/navAnimations';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FloatingNav],
  templateUrl: './app.html',
  styleUrl: './app.css',
  animations: [navAnimation],
  standalone: true,
})
export class App {
  constructor(private contexts: ChildrenOutletContexts) {}
  protected readonly title = signal('Portfolio Mariano Santos');

  getRouteAnimationData() {
    // Esto devuelve un identificador único para cada ruta
    return this.contexts.getContext('primary')?.route?.snapshot?.data?.['animation'];
  }
}
