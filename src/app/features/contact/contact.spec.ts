import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Contact } from './contact';
import { ReactiveFormsModule } from '@angular/forms';
import { AnimationService } from '../../core/services/animations';
import { ZoneService } from '../../core/services/zone';
import emailjs from '@emailjs/browser';

describe('Contact Component', () => {
  let component: Contact;
  let fixture: ComponentFixture<Contact>;
  let animSvc: AnimationService;
  let zoneSvc: ZoneService;

  beforeEach(async () => {
    const mockZoneSvc = {
      createScope: () => ({ register: () => {}, cleanup: () => {} }),
      runOutside: (fn: any) => fn(),
    };

    await TestBed.configureTestingModule({
      imports: [Contact, ReactiveFormsModule],
      providers: [AnimationService, { provide: ZoneService, useValue: mockZoneSvc }],
    }).compileComponents();

    fixture = TestBed.createComponent(Contact);
    component = fixture.componentInstance;
    animSvc = TestBed.inject(AnimationService);
    zoneSvc = TestBed.inject(ZoneService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with validators on ngOnInit', () => {
    expect(component.contactForm).toBeDefined();
    expect(component.contactForm.get('name')).toBeDefined();
    expect(component.contactForm.get('email')).toBeDefined();
    expect(component.contactForm.get('subject')).toBeDefined();
    expect(component.contactForm.get('message')).toBeDefined();
  });

  it('should have required validators on form fields', () => {
    const nameControl = component.contactForm.get('name');
    const emailControl = component.contactForm.get('email');
    const subjectControl = component.contactForm.get('subject');
    const messageControl = component.contactForm.get('message');

    expect(nameControl?.hasError('required')).toBeTrue();
    expect(emailControl?.hasError('required')).toBeTrue();
    expect(subjectControl?.hasError('required')).toBeTrue();
    expect(messageControl?.hasError('required')).toBeTrue();
  });

  it('should validate email field', () => {
    const emailControl = component.contactForm.get('email');
    emailControl?.setValue('invalid-email');
    expect(emailControl?.hasError('email')).toBeTrue();

    emailControl?.setValue('valid@email.com');
    expect(emailControl?.hasError('email')).toBeFalse();
  });

  it('should require message minimum length of 20', () => {
    const messageControl = component.contactForm.get('message');
    messageControl?.setValue('short');
    expect(messageControl?.hasError('minlength')).toBeTrue();

    messageControl?.setValue('This is a message with at least twenty characters');
    expect(messageControl?.hasError('minlength')).toBeFalse();
  });

  it('onSubmit should not send if form is invalid', async () => {
    spyOn(emailjs, 'send').and.returnValue(Promise.resolve({} as any));
    spyOn(component.contactForm, 'markAllAsTouched');

    component.contactForm.get('name')?.setValue('');
    await component.onSubmit();

    expect(emailjs.send).not.toHaveBeenCalled();
    expect(component.contactForm.markAllAsTouched).toHaveBeenCalled();
  });

  it('onSubmit should successfully send email when form is valid', async () => {
    spyOn(emailjs, 'send').and.returnValue(Promise.resolve({} as any));

    component.contactForm.patchValue({
      name: 'John Doe',
      email: 'john@test.com',
      subject: 'Test Subject',
      message: 'This is a test message with more than twenty characters',
    });

    component.isSubmitting = false;
    await component.onSubmit();

    expect(emailjs.send).toHaveBeenCalled();
    expect(component.isSubmitting).toBeFalse();
    expect(component.showToast).toBeTrue();
    expect(component.toastType).toBe('success');
    expect(component.toastTitle).toBe('¡Despegue Exitoso!');
  });

  it('onSubmit should handle email send errors', async () => {
    spyOn(emailjs, 'send').and.returnValue(Promise.reject(new Error('Send failed')));

    component.contactForm.patchValue({
      name: 'John Doe',
      email: 'john@test.com',
      subject: 'Test Subject',
      message: 'This is a test message with more than twenty characters',
    });

    component.isSubmitting = false;
    await component.onSubmit();

    expect(emailjs.send).toHaveBeenCalled();
    expect(component.isSubmitting).toBeFalse();
    expect(component.showToast).toBeTrue();
    expect(component.toastType).toBe('error');
    expect(component.toastTitle).toBe('Fallo en los motores');
  });

  it('onSubmit should reset form after successful submission', async () => {
    spyOn(emailjs, 'send').and.returnValue(Promise.resolve({} as any));
    spyOn(component.contactForm, 'reset');

    component.contactForm.patchValue({
      name: 'John Doe',
      email: 'john@test.com',
      subject: 'Test Subject',
      message: 'This is a test message with more than twenty characters',
    });

    await component.onSubmit();

    expect(component.contactForm.reset).toHaveBeenCalled();
  });

  it('onToastClosed should hide the toast', () => {
    component.showToast = true;
    component.onToastClosed();
    expect(component.showToast).toBeFalse();
  });

  it('ngOnDestroy should cleanup scope', () => {
    const scope = (component as any).scope;
    spyOn(scope, 'cleanup');

    component.ngOnDestroy();

    expect(scope.cleanup).toHaveBeenCalled();
  });

  it('should call ngOnDestroy and cleanup scope', () => {
    const scope = (component as any).scope;
    spyOn(scope, 'cleanup');
    component.ngOnDestroy();
    expect(scope.cleanup).toHaveBeenCalled();
  });
});
