import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { Home } from './home';
import { ZoneService } from '../../core/services/zone';
import { AnimationService } from '../../core/services/animations';

describe('Home', () => {
  let component: Home;
  let fixture: ComponentFixture<Home>;
  let router: Router;
  let animSvc: AnimationService;
  let zoneSvc: ZoneService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Home, RouterTestingModule],
      providers: [AnimationService, ZoneService],
    }).compileComponents();

    fixture = TestBed.createComponent(Home);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    animSvc = TestBed.inject(AnimationService);
    zoneSvc = TestBed.inject(ZoneService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have initial properties set correctly', () => {
    expect(component.name).toBe('Mariano Santos');
    expect(component.title).toBe('Full-Stack Developer & Angular Specialist.');
    expect(component.description).toContain('Transformando ideas complejas');
  });

  it('navigateTo should call router.navigate with correct path', () => {
    spyOn(router, 'navigate');

    component.navigateTo('/projects');
    expect(router.navigate).toHaveBeenCalledWith(['/projects']);
  });

  it('navigateTo should work with different routes', () => {
    spyOn(router, 'navigate');

    component.navigateTo('/contact');
    expect(router.navigate).toHaveBeenCalledWith(['/contact']);
  });

  it('ngOnDestroy should call scope cleanup', () => {
    const scope = (component as any).scope;
    spyOn(scope, 'cleanup');

    component.ngOnDestroy();

    expect(scope.cleanup).toHaveBeenCalled();
  });

  it('should initialize animation on afterNextRender when heroContent exists', (done) => {
    spyOn(animSvc, 'heroEntrance');

    fixture.detectChanges();

    setTimeout(() => {
      expect(animSvc.heroEntrance).toHaveBeenCalled();
      done();
    }, 100);
  });
});
