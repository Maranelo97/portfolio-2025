// src/app/shared/components/floating-nav/floating-nav.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule, Location, AsyncPipe } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router'; // Añadimos NavigationEnd
import { Observable, filter, map } from 'rxjs'; // Importamos operadores RxJS

@Component({
  selector: 'floating-nav',
  standalone: true,
  imports: [CommonModule, AsyncPipe],
  templateUrl: './floating-nav.html',
  styleUrl: './floating-nav.css',
})
export class FloatingNav implements OnInit {
  // Implementamos OnInit

  // Observable que nos dirá si NO estamos en la ruta raíz ('/')
  public shouldShowBackButton$!: Observable<boolean>;

  constructor(private location: Location, private router: Router) {}

  ngOnInit(): void {
    // 1. Nos suscribimos a los eventos del Router
    this.shouldShowBackButton$ = this.router.events.pipe(
      // 2. Filtramos solo los eventos de NavigationEnd (cuando la navegación termina)
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      // 3. Mapeamos el evento para devolver un booleano:
      //    ¿La URL actual es diferente de la raíz ('/')?
      map((event: NavigationEnd) => event.urlAfterRedirects !== '/')
    );
  }

  goBack(): void {
    this.location.back();
  }

  goToHome(): void {
    this.router.navigate(['/']);
  }
}
