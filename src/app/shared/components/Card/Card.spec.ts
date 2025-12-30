import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Card } from './Card';
import { RouterTestingModule } from '@angular/router/testing';

describe('Card Component', () => {
  let fixture: ComponentFixture<Card>;
  let comp: Card;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Card, RouterTestingModule],
    }).compileComponents();
    fixture = TestBed.createComponent(Card);
    comp = fixture.componentInstance;
  });

  it('renders title and description', () => {
    comp.data = {
      title: 'Test Title',
      description: 'Desc',
      tags: ['A', 'B'],
      footerText: 'Now',
    } as any;
    fixture.detectChanges();
    const el = fixture.nativeElement;
    expect(el.textContent).toContain('Test Title');
    expect(el.textContent).toContain('Desc');
  });

  it('renders image when imageUrl provided', () => {
    comp.data = {
      title: 'Img',
      description: 'has image',
      imageUrl: 'img.jpg',
      tags: [],
      footerText: 'Now',
    } as any;
    fixture.detectChanges();
    const img = fixture.nativeElement.querySelector('img');
    expect(img).toBeTruthy();
    expect(img.getAttribute('src')).toContain('img.jpg');
  });

  it('renders subtitle when provided', () => {
    comp.data = {
      title: 'T',
      description: 'D',
      subtitle: 'SUB',
      tags: [],
      footerText: 'Now',
    } as any;
    fixture.detectChanges();
    const el = fixture.nativeElement;
    expect(el.textContent).toContain('SUB');
  });

  it('renders up to 4 tags only', () => {
    comp.data = {
      title: 'T',
      description: 'D',
      tags: ['a', 'b', 'c', 'd', 'e', 'f'],
      footerText: 'Now',
    } as any;
    fixture.detectChanges();
    const tags = fixture.nativeElement.querySelectorAll('.project-tag');
    expect(tags.length).toBe(4);
  });

  it('adds cursor-pointer class when link provided and not when absent', () => {
    comp.data = {
      title: 'T',
      description: 'D',
      tags: [],
      footerText: 'Now',
      link: ['/projects', 'x'],
    } as any;
    fixture.detectChanges();
    const root = fixture.nativeElement.firstElementChild as HTMLElement;
    expect(root.classList.contains('cursor-pointer')).toBeTrue();

    // now without link on a fresh component
    const fixture2 = TestBed.createComponent(Card);
    const comp2 = fixture2.componentInstance;
    comp2.data = { title: 'T', description: 'D', tags: [], footerText: 'Now' } as any;
    fixture2.detectChanges();
    const root2 = fixture2.nativeElement.firstElementChild as HTMLElement;
    expect(root2.classList.contains('cursor-pointer')).toBeFalse();
  });
});
