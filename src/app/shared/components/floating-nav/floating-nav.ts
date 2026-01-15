import { Component, OnInit, inject } from '@angular/core';
import { Location, AsyncPipe } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { Observable, filter, map, startWith } from 'rxjs';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CdkDragEnd } from '@angular/cdk/drag-drop';
import { FloatingCalcPositionService } from './floatingCalc';

@Component({
  selector: 'floating-nav',
  standalone: true,
  imports: [AsyncPipe, DragDropModule],
  templateUrl: './floating-nav.html',
  styleUrl: './floating-nav.css',
})
export class FloatingNav implements OnInit {
  private location = inject(Location);
  private router = inject(Router);
  private calcService = inject(FloatingCalcPositionService);

  public isOpen = false;
  public shouldShowBackButton$!: Observable<boolean>;

  public dirX = 1;
  public dirY = 1;

  ngOnInit(): void {
    this.shouldShowBackButton$ = this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map((event: NavigationEnd) => event.urlAfterRedirects !== '/'),
      startWith(this.router.url !== '/'),
    );
  }

  toggleMenu(event: Event): void {
    event.stopPropagation();
    if (document.querySelector('.cdk-drag-dragging')) return;

    this.isOpen = !this.isOpen;
  }

  onDragEnded(event: CdkDragEnd): void {
    const rect = event.source.getRootElement().getBoundingClientRect();
    const directions = this.calcService.calculateDirections(rect);

    this.dirX = directions.dirX;
    this.dirY = directions.dirY;
  }

  goBack(): void {
    this.location.back();
    this.isOpen = false;
  }

  goToHome(): void {
    this.router.navigate(['/']);
    this.isOpen = false;
  }

  downloadCv(): void {
    const link = document.createElement('a');
    link.href = 'assets/marianoSantosResume.pdf';
    link.download = 'Mariano_Santos_Resume.pdf';
    link.click();
    this.isOpen = false;
  }
}
