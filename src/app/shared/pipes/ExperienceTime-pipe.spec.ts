import { ExperienceTimePipe } from './ExperienceTime-pipe';

describe('ExperienceTimePipe', () => {
  const pipe = new ExperienceTimePipe();

  it('formats years and months correctly', () => {
    const start = '2020-01-01';
    const end = '2022-04-01';
    const res = pipe.transform(start, end);
    expect(res).toContain('2');
    expect(res).toContain('mes');
  });

  it('returns input when invalid date', () => {
    expect(pipe.transform('invalid-date')).toBe('invalid-date');
  });

  it('formats months only correctly', () => {
    const start = '2024-01-01';
    const end = '2024-02-01';
    const res = pipe.transform(start, end);
    expect(res).toContain('1');
    expect(res).toContain('mes');
  });

  it('formats singular year correctly', () => {
    const start = '2023-01-01';
    const end = '2024-01-01';
    const res = pipe.transform(start, end);
    expect(res).toContain('1');
    expect(res).toContain('año');
  });
});
