import { TestBed } from '@angular/core/testing';
import { ProjectsService } from './projects';

describe('ProjectsService', () => {
  let service: ProjectsService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [ProjectsService] });
    service = TestBed.inject(ProjectsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getAllProjects should return array with projects', (done) => {
    service.getAllProjects().subscribe((data) => {
      expect(Array.isArray(data)).toBeTrue();
      expect(data.length).toBeGreaterThan(0);
      done();
    });
  });

  it('getProjectById should return project or null', (done) => {
    service.getProjectById('ecommerce-fullstack').subscribe((p) => {
      expect(p && p.id).toBe('ecommerce-fullstack');
      service.getProjectById('no-existe').subscribe((x) => {
        expect(x).toBeNull();
        done();
      });
    });
  });

  it('mapProjectToCard should map correctly', () => {
    const proj = {
      id: 'x',
      title: 't',
      shortDescription: 's',
      cardImageUrl: 'img.jpg',
      technologies: ['A'],
      completionDate: 'Now',
      fullDescription: 'f',
    } as any;

    const card = service.mapProjectToCard(proj);
    expect(card.title).toBe('t');
    expect(card.link).toEqual(['/projects', 'x']);
  });

  it('mapProjectToCard should add tech query param when activeTech provided', () => {
    const proj = {
      id: 'x',
      title: 't',
      shortDescription: 's',
      cardImageUrl: 'img.jpg',
      technologies: ['A'],
      completionDate: 'Now',
      fullDescription: 'f',
    } as any;

    const card = service.mapProjectToCard(proj, 'React');
    expect(card.queryParams).toEqual({ tech: 'React' });
  });

  it('mapProjectToCard should have empty query params when activeTech not provided', () => {
    const proj = {
      id: 'x',
      title: 't',
      shortDescription: 's',
      cardImageUrl: 'img.jpg',
      technologies: ['A'],
      completionDate: 'Now',
      fullDescription: 'f',
    } as any;

    const card = service.mapProjectToCard(proj);
    expect(card.queryParams).toEqual({});
  });
});
