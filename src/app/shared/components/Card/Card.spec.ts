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
});
