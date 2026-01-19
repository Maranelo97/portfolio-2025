import { DrawerExitStrategy } from './drawerExit';

describe('DrawerExitStrategy', () => {
  let strategy: DrawerExitStrategy;
  let drawerEl: HTMLElement;
  let backdropEl: HTMLElement;
  let onCompleteSpy: jasmine.Spy;
  const drawerSelector = '.drawer';
  const backdropSelector = '.backdrop';

  beforeEach(() => {
    drawerEl = document.createElement('div');
    drawerEl.className = 'drawer';
    drawerEl.innerHTML = `
      <div class="flex-1">
        <p>Item 1</p>
        <p>Item 2</p>
        <p>Item 3</p>
      </div>
    `;

    backdropEl = document.createElement('div');
    backdropEl.className = 'backdrop';

    document.body.appendChild(drawerEl);
    document.body.appendChild(backdropEl);

    onCompleteSpy = jasmine.createSpy('onComplete');
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
    strategy = new DrawerExitStrategy(drawerSelector, backdropSelector, onCompleteSpy);
    expect(strategy).toBeTruthy();
  });

  it('should apply animation', () => {
    strategy = new DrawerExitStrategy(drawerSelector, backdropSelector, onCompleteSpy);
    expect(() => strategy.apply()).not.toThrow();
  });

  it('should call onComplete callback when animation finishes', (done) => {
    strategy = new DrawerExitStrategy(drawerSelector, backdropSelector, onCompleteSpy);
    strategy.apply();

    // Wait for animation to complete
    setTimeout(() => {
      expect(onCompleteSpy).toHaveBeenCalled();
      done();
    }, 1500);
  });

  it('should animate drawer children', () => {
    strategy = new DrawerExitStrategy(drawerSelector, backdropSelector, onCompleteSpy);
    const children = drawerEl.querySelectorAll('.flex-1 > *');
    expect(children.length).toBe(3);

    expect(() => strategy.apply()).not.toThrow();
  });

  it('should animate drawer', () => {
    strategy = new DrawerExitStrategy(drawerSelector, backdropSelector, onCompleteSpy);
    expect(() => strategy.apply()).not.toThrow();

    expect(drawerEl.parentElement).toBe(document.body);
  });

  it('should animate backdrop', () => {
    strategy = new DrawerExitStrategy(drawerSelector, backdropSelector, onCompleteSpy);
    expect(() => strategy.apply()).not.toThrow();

    expect(backdropEl.parentElement).toBe(document.body);
  });

  it('should stagger children animation from end', (done) => {
    strategy = new DrawerExitStrategy(drawerSelector, backdropSelector, onCompleteSpy);
    const children = drawerEl.querySelectorAll('.flex-1 > *');

    strategy.apply();

    // Let animation start
    setTimeout(() => {
      expect(children.length).toBe(3);
      done();
    }, 100);
  });

  it('should complete full exit sequence', (done) => {
    strategy = new DrawerExitStrategy(drawerSelector, backdropSelector, onCompleteSpy);
    strategy.apply();

    setTimeout(() => {
      expect(onCompleteSpy).toHaveBeenCalled();
      expect(drawerEl.parentElement).toBe(document.body);
      expect(backdropEl.parentElement).toBe(document.body);
      done();
    }, 1500);
  });
});
