import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, Location, AsyncPipe } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { Observable, filter, map, startWith } from 'rxjs';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CdkDragEnd } from '@angular/cdk/drag-drop';

@Component({
  selector: 'floating-nav',
  standalone: true,
  imports: [CommonModule, AsyncPipe, DragDropModule],
  templateUrl: './floating-nav.html',
})
export class FloatingNav implements OnInit {
  private location = inject(Location);
  private router = inject(Router);

  public isOpen = false;
  public shouldShowBackButton$!: Observable<boolean>;

  public directionX: 'left' | 'right' = 'right';
  public directionY: 'top' | 'bottom' = 'bottom';
  public dirX = 1;
  public dirY = 1;

  ngOnInit(): void {
    this.shouldShowBackButton$ = this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map((event: NavigationEnd) => event.urlAfterRedirects !== '/'),
      startWith(this.router.url !== '/')
    );
  }

  get displacementClasses() {
    return {
      // Eje X
      'translate-x-24': this.isOpen && this.directionX === 'right',
      '-translate-x-24': this.isOpen && this.directionX === 'left',
      'translate-x-16': this.isOpen && this.directionX === 'right', // Para el botón diagonal
      '-translate-x-16': this.isOpen && this.directionX === 'left',

      // Eje Y
      'translate-y-24': this.isOpen && this.directionY === 'bottom',
      '-translate-y-24': this.isOpen && this.directionY === 'top',
      'translate-y-16': this.isOpen && this.directionY === 'bottom',
      '-translate-y-16': this.isOpen && this.directionY === 'top',
    };
  }

  onDragEnded(event: CdkDragEnd) {
    const rect = event.source.getRootElement().getBoundingClientRect();
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    this.dirX = rect.left > centerX ? -1 : 1;
    this.dirY = rect.top > centerY ? -1 : 1;
  }
  toggleMenu() {
    this.isOpen = !this.isOpen;
  }

  goBack(): void {
    this.location.back();
    this.isOpen = false;
  }

  goToHome(): void {
    this.router.navigate(['/']);
    this.isOpen = false;
  }

  downloadCv() {
    const link = document.createElement('a');
    link.href = 'assets/marianoSantosResume.pdf';
    link.download = 'Mariano_Santos_Resume.pdf';
    link.click();
    this.isOpen = false;
  }
}
