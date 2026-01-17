import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class DrawerService {
  private activePortal = signal<any>(null);

  readonly portal = this.activePortal.asReadonly();

  open(portal: any) {
    this.activePortal.set(portal);
  }

  close() {
    this.activePortal.set(null);
  }
}
