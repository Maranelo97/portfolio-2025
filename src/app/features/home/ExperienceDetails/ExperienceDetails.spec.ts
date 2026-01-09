import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ExperienceDetailsComponent } from './ExperienceDetails';
import { AnimationService } from '../../../core/services/animations';

describe('ExperienceDetailsComponent', () => {
  let component: ExperienceDetailsComponent;
  let fixture: ComponentFixture<ExperienceDetailsComponent>;
  let animSvc: AnimationService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExperienceDetailsComponent],
      providers: [AnimationService],
    }).compileComponents();

    fixture = TestBed.createComponent(ExperienceDetailsComponent);
    component = fixture.componentInstance;
    animSvc = TestBed.inject(AnimationService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call drawerEntrance on ngAfterViewInit', () => {
    spyOn(animSvc, 'drawerEntrance');
    TestBed.runInInjectionContext(() => {
      fixture.componentRef.setInput('data', { title: 'Test' });
      fixture.detectChanges();
      component.ngAfterViewInit();
      expect(animSvc.drawerEntrance).toHaveBeenCalledWith('.drawer-panel', '.drawer-backdrop');
    });
  });

  it('should have data as required input', () => {
    const inputData = { title: 'Experience', company: 'Test Co' };
    TestBed.runInInjectionContext(() => {
      fixture.componentRef.setInput('data', inputData);
      expect(component.data()).toEqual(inputData);
    });
  });

  it('onClose should call drawerExit with callback', () => {
    spyOn(animSvc, 'drawerExit').and.callFake((sel1, sel2, cb) => {
      cb();
    });
    let closeCalled = false;
    component.close.subscribe(() => {
      closeCalled = true;
    });

    component.onClose();

    expect(animSvc.drawerExit).toHaveBeenCalledWith(
      '.drawer-panel',
      '.drawer-backdrop',
      jasmine.any(Function),
    );
    expect(closeCalled).toBeTrue();
  });

  it('onClose should emit close event after animation', (done) => {
    spyOn(animSvc, 'drawerExit').and.callFake((sel1, sel2, cb) => {
      setTimeout(() => cb(), 10);
    });

    component.close.subscribe(() => {
      expect(true).toBeTrue();
      done();
    });

    component.onClose();
  });
});
