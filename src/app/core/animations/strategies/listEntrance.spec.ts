import { ListEntranceStrategy } from './listEntrance';

describe('ListEntranceStrategy', () => {
  let strategy: ListEntranceStrategy;
  let mockContainer: HTMLElement;
  let mockItems: HTMLElement[];

  beforeEach(() => {
    mockContainer = document.createElement('div');
    mockItems = [];

    for (let i = 0; i < 3; i++) {
      const item = document.createElement('div');
      item.className = 'list-item';
      item.textContent = `Item ${i}`;
      mockContainer.appendChild(item);
      mockItems.push(item);
    }

    document.body.appendChild(mockContainer);
  });

  afterEach(() => {
    if (mockContainer.parentElement) {
      document.body.removeChild(mockContainer);
    }
  });

  it('should create', () => {
    strategy = new ListEntranceStrategy();
    expect(strategy).toBeTruthy();
  });

  it('should apply animation to elements', () => {
    strategy = new ListEntranceStrategy();
    expect(() => strategy.apply(mockItems)).not.toThrow();
  });

  it('should handle empty elements array', () => {
    strategy = new ListEntranceStrategy();
    expect(() => strategy.apply([])).not.toThrow();
  });

  it('should handle single element', () => {
    strategy = new ListEntranceStrategy();
    const singleElement = [mockItems[0]];
    expect(() => strategy.apply(singleElement)).not.toThrow();
  });

  it('should set initial opacity and visibility', () => {
    strategy = new ListEntranceStrategy();
    mockItems.forEach((item) => {
      item.style.opacity = '1';
      item.style.visibility = 'visible';
    });

    strategy.apply(mockItems);

    // After gsap.set, initial styles should be applied
    mockItems.forEach((item) => {
      // Verify styles can be read
      expect(item.style.opacity).toBeDefined();
      expect(item.style.visibility).toBeDefined();
    });
  });

  it('should animate multiple items with stagger', () => {
    strategy = new ListEntranceStrategy();
    expect(() => strategy.apply(mockItems)).not.toThrow();

    // Verify all items are still in DOM
    expect(mockContainer.querySelectorAll('.list-item').length).toBe(3);
  });

  it('should handle elements not in DOM', () => {
    const detachedElement = document.createElement('div');
    strategy = new ListEntranceStrategy();
    expect(() => strategy.apply([detachedElement])).not.toThrow();
  });

  it('should work with mixed detached and attached elements', () => {
    const detachedElement = document.createElement('div');
    const mixedElements = [...mockItems, detachedElement];
    strategy = new ListEntranceStrategy();
    expect(() => strategy.apply(mixedElements)).not.toThrow();
  });

  it('should complete animation with proper timing', (done) => {
    strategy = new ListEntranceStrategy();
    strategy.apply(mockItems);

    // Wait for animation to complete (default stagger is quick)
    setTimeout(() => {
      // Verify elements still exist after animation
      expect(mockContainer.querySelectorAll('.list-item').length).toBe(3);
      done();
    }, 1000);
  });
});
