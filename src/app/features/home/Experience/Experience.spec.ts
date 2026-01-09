import { Experience } from './Experience';
import { register } from 'swiper/element/bundle';

describe('Experience', () => {
  it('mapToCard maps fields correctly', () => {
    const svc = Object.create(Experience.prototype) as any;
    const exp = {
      company: 'Co',
      position: 'Pos',
      period: 'Now',
      description: 'Desc',
      stack: ['A', 'B'],
    } as any;

    const card = svc.mapToCard(exp);
    expect(card.title).toBe('Pos');
    expect(card.subtitle).toBe('Co');
    expect(card.tags).toEqual(['A', 'B']);
  });

  it('initSwiper returns early when no swiperRef', () => {
    const svc = Object.create(Experience.prototype) as any;
    svc.swiperRef = undefined;
    expect(() => (svc as any).initSwiper()).not.toThrow();
  });

  it('initSwiper initializes swiper element when present', () => {
    const initializeSpy = jasmine.createSpy('initialize');
    const swiperEl: any = {};
    swiperEl.initialize = initializeSpy;

    const svc = Object.create(Experience.prototype) as any;
    svc.swiperRef = { nativeElement: swiperEl } as any;

    (svc as any).initSwiper();

    expect((swiperEl as any).keyboard).toBeDefined();
    expect((swiperEl as any).pagination).toBeDefined();
    expect(initializeSpy).toHaveBeenCalled();
  });
});
it('openDetails sets selectedExperience using mapToCard', () => {
  const svc = Object.create(Experience.prototype) as any;
  svc.selectedExperience = { set: jasmine.createSpy('set') };
  svc.mapToCard = (item: any) => ({ title: item.position });

  const testItem = { position: 'Engineer', company: 'Test Co' };

  svc.openDetails(testItem);

  expect(svc.selectedExperience.set).toHaveBeenCalledWith({ title: 'Engineer' });
});
