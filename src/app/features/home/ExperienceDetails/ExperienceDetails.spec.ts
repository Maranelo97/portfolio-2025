import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ExperienceDetailsComponent } from './ExperienceDetails';
import { AnimationService } from '../../../core/services/animations';
import { DrawerEntranceStrategy } from '../../../core/animations/strategies/drawerEntrance';
import { DrawerExitStrategy } from '../../../core/animations/strategies/drawerExit';

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

  it('should call run with DrawerEntranceStrategy on ngAfterViewInit', () => {
    spyOn(animSvc, 'run');
    TestBed.runInInjectionContext(() => {
      fixture.componentRef.setInput('data', { title: 'Test' });
      fixture.detectChanges();
      component.ngAfterViewInit();
      expect(animSvc.run).toHaveBeenCalled();
      const args = (animSvc.run as jasmine.Spy).calls.mostRecent().args;
      expect(args[1] instanceof DrawerEntranceStrategy).toBeTrue();
    });
  });

  it('should have data as required input', () => {
    const inputData = { title: 'Experience', company: 'Test Co' };
    TestBed.runInInjectionContext(() => {
      fixture.componentRef.setInput('data', inputData);
      expect(component.data()).toEqual(inputData);
    });
  });

  it('onClose should call run with DrawerExitStrategy with callback', () => {
    spyOn(animSvc, 'run');
    let closeCalled = false;
    component.close.subscribe(() => {
      closeCalled = true;
    });

    component.onClose();

    expect(animSvc.run).toHaveBeenCalled();
    const args = (animSvc.run as jasmine.Spy).calls.mostRecent().args;
    expect(args[1] instanceof DrawerExitStrategy).toBeTrue();
  });

  it('onClose should emit close event after animation', () => {
    const runSpy = spyOn(animSvc, 'run');

    component.onClose();

    expect(runSpy).toHaveBeenCalled();
    const args = runSpy.calls.mostRecent().args;
    expect(args[1]).toBeInstanceOf(DrawerExitStrategy);
  });
});
