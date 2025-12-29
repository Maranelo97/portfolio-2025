import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CvDwnloadService } from './cv';

describe('CvDwnloadService', () => {
  let service: CvDwnloadService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CvDwnloadService],
    });
    service = TestBed.inject(CvDwnloadService);
    http = TestBed.inject(HttpTestingController);
  });

  it('should request the pdf as blob', () => {
    service.getCv().subscribe((resp) => {
      expect(resp.body).toBeDefined();
    });
    const req = http.expectOne('assets/marianoSantosResume.pdf');
    expect(req.request.responseType).toBe('blob');
    req.flush(new Blob(['x']));
  });

  afterEach(() => http.verify());
});
