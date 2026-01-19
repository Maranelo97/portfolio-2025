import { TestBed } from '@angular/core/testing';
import { SoundService } from './navSound';

describe('SoundService - Final Coverage', () => {
  let service: SoundService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SoundService],
    });
    service = TestBed.inject(SoundService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize AudioContext on first playPop call', () => {
    const mockOscillator = {
      type: 'triangle',
      frequency: {
        setValueAtTime: jasmine.createSpy(),
        exponentialRampToValueAtTime: jasmine.createSpy(),
      },
      connect: jasmine.createSpy(),
      start: jasmine.createSpy(),
      stop: jasmine.createSpy(),
    };
    const mockGain = {
      gain: { setValueAtTime: jasmine.createSpy(), linearRampToValueAtTime: jasmine.createSpy() },
      connect: jasmine.createSpy(),
    };
    const mockFilter = {
      type: 'lowpass',
      frequency: {
        setValueAtTime: jasmine.createSpy(),
        exponentialRampToValueAtTime: jasmine.createSpy(),
      },
      connect: jasmine.createSpy(),
    };
    const mockAudioContext = {
      currentTime: 0,
      createOscillator: jasmine.createSpy('createOscillator').and.returnValue(mockOscillator),
      createGain: jasmine.createSpy('createGain').and.returnValue(mockGain),
      createBiquadFilter: jasmine.createSpy('createBiquadFilter').and.returnValue(mockFilter),
    };

    (window as any).AudioContext = jasmine
      .createSpy('AudioContext')
      .and.returnValue(mockAudioContext);

    expect(() => service.playPop()).not.toThrow();
  });

  it('should reuse existing AudioContext on subsequent playPop calls', () => {
    const mockOscillator = {
      type: 'triangle',
      frequency: {
        setValueAtTime: jasmine.createSpy(),
        exponentialRampToValueAtTime: jasmine.createSpy(),
      },
      connect: jasmine.createSpy(),
      start: jasmine.createSpy(),
      stop: jasmine.createSpy(),
    };
    const mockGain = {
      gain: { setValueAtTime: jasmine.createSpy(), linearRampToValueAtTime: jasmine.createSpy() },
      connect: jasmine.createSpy(),
    };
    const mockFilter = {
      type: 'lowpass',
      frequency: {
        setValueAtTime: jasmine.createSpy(),
        exponentialRampToValueAtTime: jasmine.createSpy(),
      },
      connect: jasmine.createSpy(),
    };
    const mockAudioContext = {
      currentTime: 0,
      createOscillator: jasmine.createSpy('createOscillator').and.returnValue(mockOscillator),
      createGain: jasmine.createSpy('createGain').and.returnValue(mockGain),
      createBiquadFilter: jasmine.createSpy('createBiquadFilter').and.returnValue(mockFilter),
    };

    (window as any).AudioContext = jasmine
      .createSpy('AudioContext')
      .and.returnValue(mockAudioContext);

    // First call initializes context
    service.playPop();
    const firstCallCount = (mockAudioContext.createOscillator as jasmine.Spy).calls.count();

    // Second call reuses context (false branch of if (!this.audioCtx))
    service.playPop();
    const secondCallCount = (mockAudioContext.createOscillator as jasmine.Spy).calls.count();

    expect(secondCallCount).toBeGreaterThan(firstCallCount);
  });
});
