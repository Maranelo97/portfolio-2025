import { TestBed } from '@angular/core/testing';
import { Contact } from './contact';
import { NonNullableFormBuilder } from '@angular/forms';
import emailjs from '@emailjs/browser';
import { enviroment } from '../../environments/environment';
import { of } from 'rxjs';

describe('Contact Component', () => {
  let comp: any;
  let fb: NonNullableFormBuilder;

  beforeEach(() => {
    const mockFb = {
      group: (cfg: any) => {
        const controls: any = {
          name: {
            value: '',
            setValue(v: any) {
              this.value = v;
            },
            validator: () => {},
          },
          email: {
            value: '',
            setValue(v: any) {
              this.value = v;
            },
          },
          subject: {
            value: '',
            setValue(v: any) {
              this.value = v;
            },
          },
          message: {
            value: '',
            setValue(v: any) {
              this.value = v;
            },
            validator: () => {},
          },
        };
        return {
          controls,
          get invalid() {
            return (
              !controls.name.value ||
              !controls.email.value ||
              !controls.subject.value ||
              (controls.message.value || '').length < 20
            );
          },
          markAllAsTouched() {},
          reset() {
            Object.keys(controls).forEach((k) => (controls[k].value = ''));
          },
          getRawValue() {
            return {
              name: controls.name.value,
              email: controls.email.value,
              subject: controls.subject.value,
              message: controls.message.value,
            };
          },
        };
      },
    } as any;

    TestBed.configureTestingModule({
      providers: [Contact, { provide: NonNullableFormBuilder, useValue: mockFb }],
    });
    fb = TestBed.inject(NonNullableFormBuilder);
    comp = TestBed.inject(Contact) as any;
    comp.animationService = { staggerScaleIn: () => {}, slideInStagger: () => {} } as any;
    comp.zoneService = {
      createScope: () => ({ register: () => {}, cleanup: () => {} }),
      runOutside: (fn: any) => fn(),
      setOutsideTimeout: (fn: any) => fn(),
      clearOutsideTimeout: () => {},
      run: (fn: any) => fn(),
    } as any;
    comp.ngOnInit();
  });

  it('should init form with validators', () => {
    expect(comp.contactForm).toBeDefined();
    expect(comp.contactForm.controls.name).toBeDefined();
    expect(comp.contactForm.controls.message.validator).toBeDefined();
  });

  it('get f should return controls', () => {
    expect(comp.f).toBe(comp.contactForm.controls);
  });

  it('onSubmit invalid should mark touched and not call emailjs', async () => {
    spyOn(emailjs, 'send' as any);
    comp.contactForm.controls.name.setValue('');
    await comp.onSubmit();
    expect((emailjs as any).send).not.toHaveBeenCalled();
  });

  it('onSubmit success should call emailjs and set success toast', async () => {
    spyOn(emailjs, 'send' as any).and.returnValue(Promise.resolve({ status: 200 }));
    comp.contactForm.controls.name.setValue('John');
    comp.contactForm.controls.email.setValue('john@test.com');
    comp.contactForm.controls.subject.setValue('Hi');
    comp.contactForm.controls.message.setValue(
      'This is a long message with more than twenty chars.',
    );

    await comp.onSubmit();

    expect((emailjs as any).send).toHaveBeenCalled();
    expect(comp.showToast).toBeTrue();
    expect(comp.toastType).toBe('success');
  });

  it('onSubmit error should set error toast', async () => {
    spyOn(emailjs, 'send' as any).and.returnValue(Promise.reject('err'));
    comp.contactForm.controls.name.setValue('John');
    comp.contactForm.controls.email.setValue('john@test.com');
    comp.contactForm.controls.subject.setValue('Hi');
    comp.contactForm.controls.message.setValue(
      'This is a long message with more than twenty chars.',
    );

    await comp.onSubmit();

    expect((emailjs as any).send).toHaveBeenCalled();
    expect(comp.showToast).toBeTrue();
    expect(comp.toastType).toBe('error');
  });

  it('onToastClosed should hide toast', () => {
    comp.showToast = true;
    comp.onToastClosed();
    expect(comp.showToast).toBeFalse();
  });

  it('startEntryAnimations should call animationService when header and fields exist', () => {
    const spyStagger = spyOn(comp.animationService, 'staggerScaleIn');
    const spySlide = spyOn(comp.animationService, 'slideInStagger');

    comp.headerSection = { nativeElement: document.createElement('div') } as any;

    const field1 = document.createElement('div');
    field1.className = 'form-field';
    const field2 = document.createElement('div');
    field2.className = 'form-field';
    spyOn(document, 'querySelectorAll').and.returnValue([field1, field2] as any);

    (comp as any).startEntryAnimations();

    expect(spyStagger).toHaveBeenCalled();
    expect(spySlide).toHaveBeenCalled();
  });

  it('startEntryAnimations should do nothing when no header and no fields', () => {
    const spyStagger = spyOn(comp.animationService, 'staggerScaleIn');
    const spySlide = spyOn(comp.animationService, 'slideInStagger');

    comp.headerSection = undefined as any;

    // ensure no .form-field in DOM
    (document.querySelectorAll as any) = () => [];

    (comp as any).startEntryAnimations();

    expect(spyStagger).not.toHaveBeenCalled();
    expect(spySlide).not.toHaveBeenCalled();
  });
});
