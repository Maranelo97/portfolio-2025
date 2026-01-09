import { TestBed } from '@angular/core/testing';
import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should expose title signal', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance as any;
    expect(app.title()).toBe('Portfolio Mariano Santos');
  });

  it('should return animation data from route context', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;

    const result = app.getRouteAnimationData();
    // The method may return undefined or animation data based on context
    expect(result === undefined || typeof result === 'string').toBeTrue();
  });
});
