import { FloatingCalcPositionService } from './floatingCalc';

describe('FloatingCalcPositionService', () => {
  let svc: FloatingCalcPositionService;
  beforeEach(() => (svc = new FloatingCalcPositionService()));

  it('should calculate directions for rect', () => {
    const rect = { left: 200, top: 200 } as DOMRect;
    (window as any).innerWidth = 100;
    (window as any).innerHeight = 100;
    const res = svc.calculateDirections(rect);
    expect(res.dirX).toBe(-1);
    expect(res.dirY).toBe(-1);
  });

  it('should return positive directions when rect is on left/top', () => {
    const rect = { left: 0, top: 0 } as DOMRect;
    (window as any).innerWidth = 1000;
    (window as any).innerHeight = 800;
    const res = svc.calculateDirections(rect);
    expect(res.dirX).toBe(1);
    expect(res.dirY).toBe(1);
  });
});
