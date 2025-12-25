import { Injectable, signal, effect, inject } from '@angular/core';
import { PlatformService } from './platform';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private platform = inject(PlatformService);
  public darkMode = signal<boolean>(false);

  constructor() {
    this.darkMode.set(this.getInitialTheme());

    effect(() => {
      if (!this.platform.isBrowser) return;
      
      const isDark = this.darkMode();
      // Esto es clave para Tailwind v4 con --variant-dark
      document.documentElement.classList.toggle('dark', isDark);
      localStorage.setItem('user-theme', isDark ? 'dark' : 'light');
    });
  }

  public toggleTheme() {
    this.darkMode.update(v => !v);
  }

  private getInitialTheme(): boolean {
    if (!this.platform.isBrowser) return false;
    const saved = localStorage.getItem('user-theme');
    return saved ? saved === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
}