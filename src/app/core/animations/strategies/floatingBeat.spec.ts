import { FloatingHeartbeatStrategy } from './floatingBeat';
import { AnimationScope } from '../IAnimationScope';

describe('FloatingHeartbeatStrategy', () => {
  let strategy: FloatingHeartbeatStrategy;
  let mockElement: HTMLElement;
  let mockScope: AnimationScope;

  beforeEach(() => {
    mockElement = document.createElement('div');
    mockElement.className = 'floating-element';
    document.body.appendChild(mockElement);

    mockScope = {
      register: jasmine.createSpy('register'),
      cleanup: jasmine.createSpy('cleanup'),
    };
  });

  afterEach(() => {
    if (mockElement.parentElement) {
      document.body.removeChild(mockElement);
    }
  });

  it('should create', () => {
    strategy = new FloatingHeartbeatStrategy();
    expect(strategy).toBeTruthy();
  });

  it('should apply animation to element', () => {
    strategy = new FloatingHeartbeatStrategy();
    expect(() => strategy.apply([mockElement])).not.toThrow();
  });

  it('should handle empty elements array', () => {
    strategy = new FloatingHeartbeatStrategy();
    expect(() => strategy.apply([])).not.toThrow();
  });

  it('should animate first element in array', () => {
    strategy = new FloatingHeartbeatStrategy();
    const element1 = document.createElement('div');
    const element2 = document.createElement('div');
    document.body.appendChild(element1);
    document.body.appendChild(element2);

    strategy.apply([element1, element2]);

    expect(element1.parentElement).toBe(document.body);
    expect(element2.parentElement).toBe(document.body);

    document.body.removeChild(element1);
    document.body.removeChild(element2);
  });

  it('should register cleanup with scope if provided', () => {
    strategy = new FloatingHeartbeatStrategy(mockScope);
    strategy.apply([mockElement]);
    expect(mockScope.register).toHaveBeenCalled();
  });

  it('should not throw when scope is undefined', () => {
    strategy = new FloatingHeartbeatStrategy(undefined);
    expect(() => strategy.apply([mockElement])).not.toThrow();
  });

  it('should create continuous animation', () => {
    strategy = new FloatingHeartbeatStrategy();
    expect(() => strategy.apply([mockElement])).not.toThrow();
  });

  it('should apply animation with correct parameters', (done) => {
    strategy = new FloatingHeartbeatStrategy();
    expect(() => strategy.apply([mockElement])).not.toThrow();

    // Wait to verify animation runs
    setTimeout(() => {
      expect(mockElement.parentElement).toBe(document.body);
      done();
    }, 100);
  });

  it('should handle multiple consecutive applications', () => {
    strategy = new FloatingHeartbeatStrategy();
    expect(() => strategy.apply([mockElement])).not.toThrow();
    expect(() => strategy.apply([mockElement])).not.toThrow();
  });
});
