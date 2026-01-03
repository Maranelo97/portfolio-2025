import { TestBed } from '@angular/core/testing';
import { Button } from './Button';

describe('Button', () => {
  it('customStyles joins array styles into string', () => {
    const inst = Object.create(Button.prototype) as any;
    inst.styles = () => ['a', 'b'];
    expect(inst.customStyles()).toBe('a b');
  });

  it('customStyles returns string when a string is provided', () => {
    const inst = Object.create(Button.prototype) as any;
    inst.styles = () => 'solo';
    expect(inst.customStyles()).toBe('solo');
  });

  it('customStyles works on a DI-instantiated component', () => {
    TestBed.configureTestingModule({ providers: [Button] });
    const comp = TestBed.inject(Button) as any;
    comp.styles = () => ['x', 'y'];
    expect(comp.customStyles()).toBe('x y');
  });
});
