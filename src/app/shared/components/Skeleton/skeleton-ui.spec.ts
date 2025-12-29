import { TestBed } from '@angular/core/testing';
import { SkeletonUI } from './Skeleton';

describe('SkeletonUI', () => {
  it('should create and render skeleton structure', async () => {
    await TestBed.configureTestingModule({ imports: [SkeletonUI] }).compileComponents();
    const fixture = TestBed.createComponent(SkeletonUI as any);
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('.animate-pulse')).toBeTruthy();
    expect(el.querySelector('.h-48')).toBeTruthy();
  });
});
