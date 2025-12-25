import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SkeletonService {
  private _isLoading = signal<boolean>(true);

  get isLoading() {
    return this._isLoading();
  }

  setLoading(state: boolean) {
    this._isLoading.set(state);
  }
}
