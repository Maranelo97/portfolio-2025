import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FloatingNav } from './shared/components/floating-nav/floating-nav';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FloatingNav],
  templateUrl: './app.html',
  styleUrl: './app.css',
  standalone: true,
})
export class App {
  protected readonly title = signal('Portfolio Mariano Santos');
}
