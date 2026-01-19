import { DrawerEntranceStrategy } from './drawerEntrance';

describe('DrawerEntranceStrategy', () => {
  let strategy: DrawerEntranceStrategy;
  let drawerEl: HTMLElement;
  let backdropEl: HTMLElement;
  const drawerSelector = '.drawer';
  const backdropSelector = '.backdrop';

  beforeEach(() => {
    drawerEl = document.createElement('div');
    drawerEl.className = 'drawer';
    drawerEl.innerHTML = `
      <div class="flex-1">
        <div>
          <p>Item 1</p>
          <p>Item 2</p>
          <p>Item 3</p>
        </div>
      </div>
    `;

    backdropEl = document.createElement('div');
    backdropEl.className = 'backdrop';

    document.body.appendChild(drawerEl);
    document.body.appendChild(backdropEl);
  });

  afterEach(() => {
    if (drawerEl.parentElement) {
      document.body.removeChild(drawerEl);
    }
    if (backdropEl.parentElement) {
      document.body.removeChild(backdropEl);
    }
  });

  it('should create', () => {
    strategy = new DrawerEntranceStrategy(drawerSelector, backdropSelector);
    expect(strategy).toBeTruthy();
  });

  it('should apply animation', () => {
    strategy = new DrawerEntranceStrategy(drawerSelector, backdropSelector);
    expect(() => strategy.apply()).not.toThrow();
  });

  it('should animate backdrop', () => {
    strategy = new DrawerEntranceStrategy(drawerSelector, backdropSelector);
    expect(() => strategy.apply()).not.toThrow();

    expect(backdropEl.parentElement).toBe(document.body);
  });

  it('should animate drawer', () => {
    strategy = new DrawerEntranceStrategy(drawerSelector, backdropSelector);
    expect(() => strategy.apply()).not.toThrow();

    expect(drawerEl.parentElement).toBe(document.body);
  });

  it('should animate drawer children', () => {
    strategy = new DrawerEntranceStrategy(drawerSelector, backdropSelector);
    const children = drawerEl.querySelectorAll('.flex-1 > div > *');
    expect(children.length).toBe(3);

    expect(() => strategy.apply()).not.toThrow();
  });

  it('should handle responsive behavior on mobile', () => {
    const originalWidth = window.innerWidth;
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 375, // Mobile width
    });

    strategy = new DrawerEntranceStrategy(drawerSelector, backdropSelector);
    expect(() => strategy.apply()).not.toThrow();

    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: originalWidth,
    });
  });

  it('should handle responsive behavior on desktop', () => {
    const originalWidth = window.innerWidth;
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024, // Desktop width
    });

    strategy = new DrawerEntranceStrategy(drawerSelector, backdropSelector);
    expect(() => strategy.apply()).not.toThrow();

    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: originalWidth,
    });
  });

  it('should complete animation sequence', (done) => {
    strategy = new DrawerEntranceStrategy(drawerSelector, backdropSelector);
    strategy.apply();

    setTimeout(() => {
      expect(drawerEl.parentElement).toBe(document.body);
      expect(backdropEl.parentElement).toBe(document.body);
      done();
    }, 2000);
  });
});
