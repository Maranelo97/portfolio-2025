import { TestBed } from '@angular/core/testing';
import { TechPills } from './TechPills';
import { PillService } from '../../../core/services/SkillsPills';

describe('TechPills', () => {
  it('should get technologies from PillService', () => {
    const mockPill = { getTechIcons: () => [{ name: 'Angular' }] } as any;
    TestBed.configureTestingModule({
      providers: [{ provide: PillService, useValue: mockPill }, TechPills],
    });
    const comp = TestBed.inject(TechPills) as any;
    expect(comp.technologies.length).toBeGreaterThan(0);
    expect(comp.technologies[0].name).toBe('Angular');
  });
});
