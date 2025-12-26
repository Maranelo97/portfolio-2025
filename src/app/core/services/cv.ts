import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class CvDwnloadService {
  private client = inject(HttpClient);

  getCv() {
    const urlCv = 'assets/marianoSantosResume.pdf';

    return this.client.get(urlCv, {
      responseType: 'blob',
      observe: 'response',
    });
  }
}
