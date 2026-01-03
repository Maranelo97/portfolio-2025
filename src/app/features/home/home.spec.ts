import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { Home } from './home';

describe('Home', () => {
  let component: Home;
  let fixture: ComponentFixture<Home>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Home, RouterTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(Home);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('initAnimations should call animation service methods when elements present', () => {
    const animSvc = TestBed.inject(
      (require('../../core/services/animations') as any).AnimationService,
    );
    spyOn(animSvc as any, 'fadeInStagger');
    spyOn(animSvc as any, 'staggerScaleIn');
    spyOn(animSvc as any, 'scrollReveal');
    spyOn(animSvc as any, 'applyParallax');

    const parent = document.createElement('div');
    const div1 = document.createElement('div');
    parent.appendChild(div1);
    const tech = document.createElement('tech-pills');
    parent.appendChild(tech);
    const experience = document.createElement('app-experience');
    parent.appendChild(experience);
    const cta = document.createElement('div');
    parent.appendChild(cta);

    component.heroContent = { nativeElement: parent } as any;
    component.ctaButtons = { nativeElement: cta } as any;

    (component as any).initAnimations();

    expect((animSvc as any).fadeInStagger).toHaveBeenCalled();
    expect((animSvc as any).staggerScaleIn).toHaveBeenCalledWith(tech, 0.6);
    expect((animSvc as any).scrollReveal).toHaveBeenCalledWith(experience, 'left', true);
    expect((animSvc as any).applyParallax).toHaveBeenCalledWith('.experience-item');
  });

  it('initAnimations should not call optional animations when elements are absent', () => {
    const animSvc = TestBed.inject(
      (require('../../core/services/animations') as any).AnimationService,
    );
    spyOn(animSvc as any, 'staggerScaleIn');
    spyOn(animSvc as any, 'scrollReveal');

    const parent = document.createElement('div');
    parent.appendChild(document.createElement('div'));

    component.heroContent = { nativeElement: parent } as any;
    component.ctaButtons = { nativeElement: document.createElement('div') } as any;

    (component as any).initAnimations();

    expect((animSvc as any).staggerScaleIn).not.toHaveBeenCalled();
    expect((animSvc as any).scrollReveal).not.toHaveBeenCalled();
  });

  it('initAnimations should return early when heroContent is missing', () => {
    const animSvc = TestBed.inject(
      (require('../../core/services/animations') as any).AnimationService,
    );

    // ensure heroContent is undefined and reset ctx
    (component as any).heroContent = undefined;
    (component as any).ctx = undefined;

    // calling should just return and not set ctx
    (component as any).initAnimations();

    expect((component as any).ctx).toBeUndefined();
  });

  it('navigateTo should call router.navigate', () => {
    const r = TestBed.inject((require('@angular/router') as any).Router) as any;
    spyOn(r, 'navigate');

    component.navigateTo('/about');
    expect(r.navigate).toHaveBeenCalledWith(['/about']);
  });
});
