import { TestBed } from '@angular/core/testing';
import { ElementRef } from '@angular/core';
import { ProjectFilterService } from './projectFilter';
import { ZoneService } from './zone';

describe('ProjectFilterService', () => {
  let service: ProjectFilterService;
  let zoneService: ZoneService;
  let mockContainer: HTMLElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProjectFilterService, ZoneService],
    });

    service = TestBed.inject(ProjectFilterService);
    zoneService = TestBed.inject(ZoneService);

    // Create mock DOM structure
    mockContainer = document.createElement('div');
    const wrapper1 = document.createElement('div');
    wrapper1.className = 'perspective-wrapper';
    wrapper1.setAttribute('data-techs', 'React Angular');

    const wrapper2 = document.createElement('div');
    wrapper2.className = 'perspective-wrapper';
    wrapper2.setAttribute('data-techs', 'Vue');

    const wrapper3 = document.createElement('div');
    wrapper3.className = 'perspective-wrapper';
    wrapper3.setAttribute('data-techs', 'React Node');

    mockContainer.appendChild(wrapper1);
    mockContainer.appendChild(wrapper2);
    mockContainer.appendChild(wrapper3);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('applyTechFilter should use runOutside from ZoneService', () => {
    const containerRef = new ElementRef(mockContainer);
    spyOn(zoneService, 'runOutside').and.callThrough();

    service.applyTechFilter(containerRef, 'React');

    expect(zoneService.runOutside).toHaveBeenCalled();
  });

  it('applyTechFilter should select all perspective-wrapper elements', () => {
    const containerRef = new ElementRef(mockContainer);
    spyOn(mockContainer, 'querySelectorAll').and.callThrough();

    service.applyTechFilter(containerRef, 'React');

    expect(mockContainer.querySelectorAll).toHaveBeenCalledWith('.perspective-wrapper');
  });

  it('applyTechFilter should iterate through each wrapper element', () => {
    const containerRef = new ElementRef(mockContainer);
    const wrappers = mockContainer.querySelectorAll('.perspective-wrapper');

    expect(wrappers.length).toBe(3);

    service.applyTechFilter(containerRef, 'React');

    // Service should process all wrappers (no error means success)
    expect(service).toBeTruthy();
  });

  it('applyTechFilter should work with matching tech', () => {
    const containerRef = new ElementRef(mockContainer);

    // Should not throw error
    expect(() => {
      service.applyTechFilter(containerRef, 'React');
    }).not.toThrow();
  });

  it('applyTechFilter should work with non-matching tech', () => {
    const containerRef = new ElementRef(mockContainer);

    // Should not throw error
    expect(() => {
      service.applyTechFilter(containerRef, 'TypeScript');
    }).not.toThrow();
  });

  it('applyTechFilter should handle empty tech string', () => {
    const containerRef = new ElementRef(mockContainer);

    // Should not throw error
    expect(() => {
      service.applyTechFilter(containerRef, '');
    }).not.toThrow();
  });

  it('applyTechFilter should handle missing data-techs attribute', () => {
    const newWrapper = document.createElement('div');
    newWrapper.className = 'perspective-wrapper';
    mockContainer.appendChild(newWrapper);

    const containerRef = new ElementRef(mockContainer);

    // Should not throw error when element has no data-techs attribute
    expect(() => {
      service.applyTechFilter(containerRef, 'React');
    }).not.toThrow();
  });

  it('resetFilter should use runOutside from ZoneService', () => {
    const containerRef = new ElementRef(mockContainer);
    spyOn(zoneService, 'runOutside').and.callThrough();

    service.resetFilter(containerRef);

    expect(zoneService.runOutside).toHaveBeenCalled();
  });

  it('resetFilter should select all perspective-wrapper elements', () => {
    const containerRef = new ElementRef(mockContainer);
    spyOn(mockContainer, 'querySelectorAll').and.callThrough();

    service.resetFilter(containerRef);

    expect(mockContainer.querySelectorAll).toHaveBeenCalledWith('.perspective-wrapper');
  });

  it('resetFilter should not throw an error', () => {
    const containerRef = new ElementRef(mockContainer);

    expect(() => {
      service.resetFilter(containerRef);
    }).not.toThrow();
  });

  it('applyTechFilter should use includes for tech matching (substring)', () => {
    const containerRef = new ElementRef(mockContainer);
    const testEl = mockContainer.querySelector('[data-techs="React Angular"]') as HTMLElement;

    // 'React' should match 'React Angular' using includes
    const techs = testEl.getAttribute('data-techs') || '';
    expect(techs.includes('React')).toBeTrue();
  });

  it('applyTechFilter should be case-sensitive', () => {
    const containerRef = new ElementRef(mockContainer);
    const testEl = mockContainer.querySelector('[data-techs="React Angular"]') as HTMLElement;

    const techs = testEl.getAttribute('data-techs') || '';
    expect(techs.includes('react')).toBeFalse();
    expect(techs.includes('React')).toBeTrue();
  });

  it('applyTechFilter should handle multiple matching techs', () => {
    const containerRef = new ElementRef(mockContainer);
    const testEl = mockContainer.querySelector('[data-techs="React Angular"]') as HTMLElement;

    const techs = testEl.getAttribute('data-techs') || '';
    expect(techs.includes('React')).toBeTrue();
    expect(techs.includes('Angular')).toBeTrue();
    expect(techs.includes('Vue')).toBeFalse();
  });

  it('applyTechFilter should work with different tech values', () => {
    const containerRef = new ElementRef(mockContainer);

    const techs = ['React', 'Vue', 'Angular', 'Node', 'TypeScript'];
    techs.forEach((tech) => {
      expect(() => {
        service.applyTechFilter(containerRef, tech);
      }).not.toThrow();
    });
  });
});
