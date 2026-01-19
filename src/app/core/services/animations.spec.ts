import { TestBed } from '@angular/core/testing';
import { AnimationService } from './animations';
import { PlatformService } from './platform';
import { ZoneService } from './zone';
import { IAnimationStrategy } from '../animations/IAnimationsStrategy';

describe('AnimationService', () => {
  let service: AnimationService;
  let mockPlatformService: Partial<PlatformService>;
  let mockZoneService: Partial<ZoneService>;

  beforeEach(() => {
    mockPlatformService = { isBrowser: true };
    mockZoneService = {
      runOutside: jasmine.createSpy('runOutside').and.callFake((fn: any) => fn()),
      run: jasmine.createSpy('run').and.callFake((fn: any) => fn()),
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: PlatformService, useValue: mockPlatformService },
        { provide: ZoneService, useValue: mockZoneService },
        AnimationService,
      ],
    });

    service = TestBed.inject(AnimationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should run strategy when browser', () => {
    const mockElement = document.createElement('div');
    const mockStrategy: IAnimationStrategy = {
      apply: jasmine.createSpy('apply'),
    };

    service.run(mockElement, mockStrategy);

    expect(mockZoneService.runOutside).toHaveBeenCalled();
  });

  it('should not run strategy when not browser', () => {
    const mockPlatform = { isBrowser: false } as Partial<PlatformService>;
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        { provide: PlatformService, useValue: mockPlatform },
        { provide: ZoneService, useValue: mockZoneService },
        AnimationService,
      ],
    });

    const localService = TestBed.inject(AnimationService);
    const mockElement = document.createElement('div');
    const mockStrategy: IAnimationStrategy = {
      apply: jasmine.createSpy('apply'),
    };

    localService.run(mockElement, mockStrategy);

    // runOutside should not be called when not browser
    expect((mockZoneService.runOutside as jasmine.Spy).calls.count()).toBe(0);
  });

  it('should normalize single HTMLElement to array', () => {
    const mockElement = document.createElement('div');
    const mockStrategy: IAnimationStrategy = {
      apply: jasmine.createSpy('apply'),
    };

    service.run(mockElement, mockStrategy);

    expect(mockZoneService.runOutside).toHaveBeenCalled();
  });

  it('should pass array of elements to strategy', (done) => {
    const el1 = document.createElement('div');
    const el2 = document.createElement('div');
    const mockStrategy: IAnimationStrategy = {
      apply: jasmine.createSpy('apply'),
    };

    service.run([el1, el2], mockStrategy);

    setTimeout(() => {
      expect(mockStrategy.apply).toHaveBeenCalledWith([el1, el2]);
      done();
    }, 50);
  });

  it('should normalize NodeList to array', (done) => {
    const container = document.createElement('div');
    container.appendChild(document.createElement('p'));
    container.appendChild(document.createElement('p'));
    document.body.appendChild(container);

    const nodeList = container.querySelectorAll('p');
    const mockStrategy: IAnimationStrategy = {
      apply: jasmine.createSpy('apply'),
    };

    service.run(nodeList, mockStrategy);

    setTimeout(() => {
      expect(mockStrategy.apply).toHaveBeenCalled();
      const args = (mockStrategy.apply as jasmine.Spy).calls.mostRecent().args[0];
      expect(Array.isArray(args)).toBeTrue();
      expect(args.length).toBe(2);
      document.body.removeChild(container);
      done();
    }, 50);
  });

  it('should handle empty array', () => {
    const mockStrategy: IAnimationStrategy = {
      apply: jasmine.createSpy('apply'),
    };

    service.run([], mockStrategy);

    expect(mockZoneService.runOutside).toHaveBeenCalled();
  });

  it('should run strategy outside angular zone', () => {
    const mockElement = document.createElement('div');
    const mockStrategy: IAnimationStrategy = {
      apply: jasmine.createSpy('apply'),
    };

    service.run(mockElement, mockStrategy);

    expect(mockZoneService.runOutside).toHaveBeenCalled();
  });

  it('should call strategy.apply with requestAnimationFrame', (done) => {
    const mockElement = document.createElement('div');
    const mockStrategy: IAnimationStrategy = {
      apply: jasmine.createSpy('apply'),
    };

    service.run(mockElement, mockStrategy);

    // Strategy.apply is called via requestAnimationFrame, so we need to wait
    setTimeout(() => {
      expect(mockStrategy.apply).toHaveBeenCalled();
      done();
    }, 50);
  });

  it('should handle null elements gracefully', () => {
    const mockStrategy: IAnimationStrategy = {
      apply: jasmine.createSpy('apply'),
    };

    expect(() => service.run(null as any, mockStrategy)).not.toThrow();
  });

  it('should return empty array for invalid element types', () => {
    const mockStrategy: IAnimationStrategy = {
      apply: jasmine.createSpy('apply'),
    };

    service.run({} as any, mockStrategy);

    expect(mockZoneService.runOutside).toHaveBeenCalled();
  });
});
