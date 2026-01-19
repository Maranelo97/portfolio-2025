import { ContactEntranceStrategy } from './contactEntrance';
import { AnimationScope } from '../IAnimationScope';

describe('ContactEntranceStrategy', () => {
  let strategy: ContactEntranceStrategy;
  let mockRefs: {
    header: HTMLElement;
    form: HTMLElement;
    sidebar: HTMLElement;
  };
  let mockScope: AnimationScope;

  beforeEach(() => {
    mockRefs = {
      header: document.createElement('div'),
      form: document.createElement('form'),
      sidebar: document.createElement('aside'),
    };

    const input1 = document.createElement('div');
    input1.className = 'relative group';
    const input2 = document.createElement('div');
    input2.className = 'relative group';
    mockRefs.form.appendChild(input1);
    mockRefs.form.appendChild(input2);

    document.body.appendChild(mockRefs.header);
    document.body.appendChild(mockRefs.form);
    document.body.appendChild(mockRefs.sidebar);

    mockScope = {
      register: jasmine.createSpy('register'),
      cleanup: jasmine.createSpy('cleanup'),
    };
  });

  afterEach(() => {
    if (mockRefs.header.parentElement) {
      document.body.removeChild(mockRefs.header);
    }
    if (mockRefs.form.parentElement) {
      document.body.removeChild(mockRefs.form);
    }
    if (mockRefs.sidebar.parentElement) {
      document.body.removeChild(mockRefs.sidebar);
    }
  });

  it('should create', () => {
    strategy = new ContactEntranceStrategy(mockRefs);
    expect(strategy).toBeTruthy();
  });

  it('should apply animation', () => {
    strategy = new ContactEntranceStrategy(mockRefs);
    expect(() => strategy.apply()).not.toThrow();
  });

  it('should register cleanup with scope if provided', () => {
    strategy = new ContactEntranceStrategy(mockRefs, mockScope);
    strategy.apply();
    expect(mockScope.register).toHaveBeenCalled();
  });

  it('should not throw when scope is undefined', () => {
    strategy = new ContactEntranceStrategy(mockRefs, undefined);
    expect(() => strategy.apply()).not.toThrow();
  });

  it('should animate header, sidebar and form elements', () => {
    strategy = new ContactEntranceStrategy(mockRefs);
    expect(() => strategy.apply()).not.toThrow();

    // Verify all refs are still in DOM
    expect(mockRefs.header.parentElement).toBe(document.body);
    expect(mockRefs.sidebar.parentElement).toBe(document.body);
    expect(mockRefs.form.parentElement).toBe(document.body);
  });

  it('should animate form inputs', () => {
    strategy = new ContactEntranceStrategy(mockRefs);
    const inputs = mockRefs.form.querySelectorAll('.relative.group');
    expect(inputs.length).toBe(2);

    expect(() => strategy.apply()).not.toThrow();
  });

  it('should complete animation sequence', (done) => {
    strategy = new ContactEntranceStrategy(mockRefs);
    strategy.apply();

    setTimeout(() => {
      // Verify elements still exist
      expect(mockRefs.header.parentElement).toBe(document.body);
      expect(mockRefs.form.parentElement).toBe(document.body);
      expect(mockRefs.sidebar.parentElement).toBe(document.body);
      done();
    }, 2000);
  });
});
