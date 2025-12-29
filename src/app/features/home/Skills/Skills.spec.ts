import { Skills } from './Skills';

describe('Skills Component', () => {
  it('should expose domains and include Frontend Development', () => {
    const sk = new Skills();
    expect(sk.domains.length).toBeGreaterThan(0);
    expect(sk.domains.some((d) => d.title === 'Frontend Development')).toBeTrue();
  });
});
