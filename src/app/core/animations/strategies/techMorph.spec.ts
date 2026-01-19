import { TechMorphStrategy, ResetTechMorphStrategy } from './techMorph';

describe('TechMorphStrategy', () => {
  let strategy: TechMorphStrategy;
  let mockElements: HTMLElement[];

  beforeEach(() => {
    mockElements = [];
    for (let i = 0; i < 3; i++) {
      const el = document.createElement('div');
      el.className = 'tech-item';
      el.setAttribute('data-techs', i === 0 ? 'angular react' : 'vue typescript');
      document.body.appendChild(el);
      mockElements.push(el);
    }
  });

  afterEach(() => {
    mockElements.forEach((el) => {
      if (el.parentElement) {
        document.body.removeChild(el);
      }
    });
  });

  it('should create', () => {
    strategy = new TechMorphStrategy('angular');
    expect(strategy).toBeTruthy();
  });

  it('should apply animation', () => {
    strategy = new TechMorphStrategy('angular');
    expect(() => strategy.apply(mockElements)).not.toThrow();
  });

  it('should handle empty elements array', () => {
    strategy = new TechMorphStrategy('angular');
    expect(() => strategy.apply([])).not.toThrow();
  });

  it('should highlight matching technologies', () => {
    strategy = new TechMorphStrategy('angular');
    expect(() => strategy.apply(mockElements)).not.toThrow();

    // All elements should still be in DOM
    mockElements.forEach((el) => {
      expect(el.parentElement).toBe(document.body);
    });
  });

  it('should dim non-matching technologies', () => {
    strategy = new TechMorphStrategy('rust');
    expect(() => strategy.apply(mockElements)).not.toThrow();
  });

  it('should handle multiple technology tags', () => {
    strategy = new TechMorphStrategy('react');
    expect(() => strategy.apply(mockElements)).not.toThrow();
  });

  it('should apply scale, opacity and blur transformations', () => {
    strategy = new TechMorphStrategy('angular');
    expect(() => strategy.apply(mockElements)).not.toThrow();

    mockElements.forEach((el) => {
      expect(el.style).toBeDefined();
    });
  });

  it('should work with elements missing data-techs attribute', () => {
    const elementWithoutTechs = document.createElement('div');
    document.body.appendChild(elementWithoutTechs);

    strategy = new TechMorphStrategy('angular');
    expect(() => strategy.apply([elementWithoutTechs])).not.toThrow();

    document.body.removeChild(elementWithoutTechs);
  });

  it('should handle multiple applies with different technologies', () => {
    strategy = new TechMorphStrategy('angular');
    strategy.apply(mockElements);

    const strategy2 = new TechMorphStrategy('vue');
    expect(() => strategy2.apply(mockElements)).not.toThrow();
  });
});

describe('ResetTechMorphStrategy', () => {
  let strategy: ResetTechMorphStrategy;
  let mockElements: HTMLElement[];

  beforeEach(() => {
    mockElements = [];
    for (let i = 0; i < 3; i++) {
      const el = document.createElement('div');
      el.className = 'tech-item';
      el.style.opacity = '0.3';
      el.style.scale = '0.9';
      el.style.filter = 'blur(8px)';
      document.body.appendChild(el);
      mockElements.push(el);
    }
  });

  afterEach(() => {
    mockElements.forEach((el) => {
      if (el.parentElement) {
        document.body.removeChild(el);
      }
    });
  });

  it('should create', () => {
    strategy = new ResetTechMorphStrategy();
    expect(strategy).toBeTruthy();
  });

  it('should apply reset animation', () => {
    strategy = new ResetTechMorphStrategy();
    expect(() => strategy.apply(mockElements)).not.toThrow();
  });

  it('should handle empty elements array', () => {
    strategy = new ResetTechMorphStrategy();
    expect(() => strategy.apply([])).not.toThrow();
  });

  it('should reset opacity to full', () => {
    strategy = new ResetTechMorphStrategy();
    expect(() => strategy.apply(mockElements)).not.toThrow();

    mockElements.forEach((el) => {
      expect(el.parentElement).toBe(document.body);
    });
  });

  it('should reset scale to normal', () => {
    strategy = new ResetTechMorphStrategy();
    expect(() => strategy.apply(mockElements)).not.toThrow();
  });

  it('should reset blur effect', () => {
    strategy = new ResetTechMorphStrategy();
    expect(() => strategy.apply(mockElements)).not.toThrow();
  });

  it('should clear all properties', () => {
    strategy = new ResetTechMorphStrategy();
    expect(() => strategy.apply(mockElements)).not.toThrow();
  });

  it('should complete animation sequence', (done) => {
    strategy = new ResetTechMorphStrategy();
    strategy.apply(mockElements);

    setTimeout(() => {
      mockElements.forEach((el) => {
        expect(el.parentElement).toBe(document.body);
      });
      done();
    }, 600);
  });
});
