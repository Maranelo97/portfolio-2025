import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, Location, AsyncPipe } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { Observable, filter, map, startWith } from 'rxjs';
import { DragDropModule } from '@angular/cdk/drag-drop';

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

  ngOnInit(): void {
    this.shouldShowBackButton$ = this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map((event: NavigationEnd) => event.urlAfterRedirects !== '/'),
      startWith(this.router.url !== '/')
    );
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
