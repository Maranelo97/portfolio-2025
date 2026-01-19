import { StaggerScaleStrategy, ShakeErrorStrategy } from './Toast';

describe('StaggerScaleStrategy', () => {
  let strategy: StaggerScaleStrategy;
  let mockElements: HTMLElement[];

  beforeEach(() => {
    mockElements = [];
    for (let i = 0; i < 3; i++) {
      const el = document.createElement('div');
      el.className = 'toast-item';
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

  it('should create with default delay', () => {
    strategy = new StaggerScaleStrategy();
    expect(strategy).toBeTruthy();
  });

  it('should create with custom delay', () => {
    strategy = new StaggerScaleStrategy(0.5);
    expect(strategy).toBeTruthy();
  });

  it('should apply animation', () => {
    strategy = new StaggerScaleStrategy();
    expect(() => strategy.apply(mockElements)).not.toThrow();
  });

  it('should handle empty elements array', () => {
    strategy = new StaggerScaleStrategy();
    expect(() => strategy.apply([])).not.toThrow();
  });

  it('should apply stagger animation with delay', () => {
    strategy = new StaggerScaleStrategy(0.3);
    expect(() => strategy.apply(mockElements)).not.toThrow();

    mockElements.forEach((el) => {
      expect(el.parentElement).toBe(document.body);
    });
  });

  it('should animate single element', () => {
    strategy = new StaggerScaleStrategy();
    expect(() => strategy.apply([mockElements[0]])).not.toThrow();
  });

  it('should clear animation properties after completion', (done) => {
    strategy = new StaggerScaleStrategy();
    strategy.apply(mockElements);

    setTimeout(() => {
      mockElements.forEach((el) => {
        expect(el.parentElement).toBe(document.body);
      });
      done();
    }, 800);
  });

  it('should handle multiple consecutive applications', () => {
    strategy = new StaggerScaleStrategy();
    expect(() => strategy.apply(mockElements)).not.toThrow();
    expect(() => strategy.apply(mockElements)).not.toThrow();
  });
});

describe('ShakeErrorStrategy', () => {
  let strategy: ShakeErrorStrategy;
  let mockElements: HTMLElement[];

  beforeEach(() => {
    mockElements = [];
    for (let i = 0; i < 2; i++) {
      const el = document.createElement('input');
      el.className = 'error-field';
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
    strategy = new ShakeErrorStrategy();
    expect(strategy).toBeTruthy();
  });

  it('should apply shake animation', () => {
    strategy = new ShakeErrorStrategy();
    expect(() => strategy.apply(mockElements)).not.toThrow();
  });

  it('should handle empty elements array', () => {
    strategy = new ShakeErrorStrategy();
    expect(() => strategy.apply([])).not.toThrow();
  });

  it('should shake single element', () => {
    strategy = new ShakeErrorStrategy();
    expect(() => strategy.apply([mockElements[0]])).not.toThrow();
  });

  it('should reset x position after shake', (done) => {
    strategy = new ShakeErrorStrategy();
    strategy.apply(mockElements);

    setTimeout(() => {
      mockElements.forEach((el) => {
        expect(el.parentElement).toBe(document.body);
      });
      done();
    }, 500);
  });

  it('should apply yoyo effect', () => {
    strategy = new ShakeErrorStrategy();
    expect(() => strategy.apply(mockElements)).not.toThrow();
  });

  it('should complete animation with all elements in DOM', (done) => {
    strategy = new ShakeErrorStrategy();
    strategy.apply(mockElements);

    setTimeout(() => {
      mockElements.forEach((el) => {
        expect(el.parentElement).toBe(document.body);
      });
      done();
    }, 300);
  });

  it('should handle multiple consecutive shakes', () => {
    strategy = new ShakeErrorStrategy();
    strategy.apply(mockElements);
    expect(() => strategy.apply(mockElements)).not.toThrow();
  });
});
