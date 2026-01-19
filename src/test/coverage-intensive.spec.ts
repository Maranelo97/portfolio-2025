import { TestBed } from '@angular/core/testing';
import { ZoneService } from '../app/core/services/zone';
import { SkeletonService } from '../app/core/services/skeleton';
import { ProjectsService } from '../app/core/services/projects';
import { PlatformService } from '../app/core/services/platform';
import { AnimationService } from '../app/core/services/animations';
import { of } from 'rxjs';

describe('Coverage Intensive Tests - Branch Coverage', () => {
  // These tests are designed to reach hard-to-test branches

  it('AnimationService - run should return early when not browser', () => {
    TestBed.configureTestingModule({
      providers: [AnimationService, PlatformService, ZoneService],
    });

    const platformSvc = TestBed.inject(PlatformService) as any;
    platformSvc.isBrowser = false;

    const animSvc = TestBed.inject(AnimationService);
    const mockStrategy = { apply: jasmine.createSpy('apply') };

    animSvc.run([], mockStrategy);

    expect(mockStrategy.apply).not.toHaveBeenCalled();
  });

  it('ZoneService - runOutside should execute function outside Angular zone', () => {
    TestBed.configureTestingModule({
      providers: [ZoneService],
    });

    const zoneSvc = TestBed.inject(ZoneService);
    let executed = false;

    zoneSvc.runOutside(() => {
      executed = true;
    });

    expect(executed).toBeTrue();
  });

  it('PlatformService - isBrowser should return boolean based on environment', () => {
    TestBed.configureTestingModule({
      providers: [PlatformService],
    });

    const platformSvc = TestBed.inject(PlatformService);
    expect(typeof platformSvc.isBrowser).toBe('boolean');
  });

  it('SkeletonService - loading state should toggle', () => {
    TestBed.configureTestingModule({
      providers: [SkeletonService],
    });

    const skeletonSvc = TestBed.inject(SkeletonService);
    const initialState = skeletonSvc.isLoading;

    skeletonSvc.setLoading(!initialState);
    expect(skeletonSvc.isLoading).toBe(!initialState);

    skeletonSvc.setLoading(initialState);
    expect(skeletonSvc.isLoading).toBe(initialState);
  });

  it('ProjectsService - should handle both truthy and falsy activeTech', () => {
    TestBed.configureTestingModule({
      providers: [ProjectsService],
    });

    const projSvc = TestBed.inject(ProjectsService);
    const mockProj = {
      id: 'test',
      title: 'Test',
      shortDescription: 'Test',
      cardImageUrl: 'test.jpg',
      technologies: ['Test'],
      completionDate: 'Now',
      fullDescription: 'Test',
    } as any;

    const card1 = projSvc.mapProjectToCard(mockProj, 'React');
    expect(card1.queryParams?.tech).toBe('React');

    const card2 = projSvc.mapProjectToCard(mockProj, null);
    expect(card2.queryParams).toEqual({});

    const card3 = projSvc.mapProjectToCard(mockProj, undefined);
    expect(card3.queryParams).toEqual({});
  });
});
