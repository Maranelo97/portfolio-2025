import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  inject,
  ElementRef,
  QueryList,
  ViewChild,
  ViewChildren,
  afterNextRender,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormGroup,
  Validators,
  ReactiveFormsModule,
  NonNullableFormBuilder,
  AbstractControl,
} from '@angular/forms';
import { of, delay, catchError, finalize } from 'rxjs';
import { IContactForm } from '../../core/types/IContactForm';
import { AnimationService } from '../../core/services/animations';
import { ToastNotification } from '../../shared/components/ToastNotification/ToastNotification';
import emailjs from '@emailjs/browser';
import { enviroment } from '../../environments/environment';

@Component({
  selector: 'app-contact',
  imports: [CommonModule, ReactiveFormsModule, ToastNotification],
  templateUrl: './contact.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Contact implements OnInit {
  private fb = inject(NonNullableFormBuilder);
  private animationService = inject(AnimationService);
  public contactForm!: FormGroup;

  @ViewChild('headerSection', { static: false }) headerSection!: ElementRef;
  @ViewChildren('formField') formFields!: QueryList<ElementRef>;

  public isSubmitting = false;
  public submissionSuccess: boolean | null = null;

  public showToast: boolean = false;
  public toastType: 'success' | 'error' = 'success';
  public toastTitle: string = '';
  public toastMessage: string = '';

  constructor() {
    afterNextRender(() => {
      this.startEntryAnimations();
    });
  }

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      subject: ['', Validators.required],
      message: ['', [Validators.required, Validators.minLength(20)]],
    });
  }

  get f(): { [key: string]: AbstractControl } {
    return this.contactForm.controls as any;
  }

  async onSubmit(): Promise<void> {
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.showToast = false;

    const templateParams = {
      from_name: this.contactForm.value.name,
      from_email: this.contactForm.value.email,
      subject: this.contactForm.value.subject,
      message: this.contactForm.value.message,
    };

    try {
      // Envío Real
      await emailjs.send(
        enviroment.serviceId,
        enviroment.templateId,
        templateParams,
        enviroment.authKey
      );

      this.setToast(
        'success',
        '¡Mensaje Enviado!',
        'Gracias por contactarme. El correo ha llegado a mi bandeja.'
      );
      this.contactForm.reset();
    } catch (error) {
      console.error('EmailJS Error:', error);
      this.setToast(
        'error',
        'Error de Envío',
        'No pudimos procesar el correo. Por favor, intenta más tarde.'
      );
    } finally {
      this.isSubmitting = false;
    }
  }

  setToast(type: 'success' | 'error', title: string, message: string): void {
    this.toastType = type;
    this.toastTitle = title;
    this.toastMessage = message;
    this.showToast = true;
  }

  onToastClosed(): void {
    this.showToast = false;
  }

  private startEntryAnimations(): void {
    this.animationService.staggerScaleIn(this.headerSection.nativeElement);
    const fields = document.querySelectorAll('.form-field');
    this.animationService.slideInStagger(Array.from(fields) as HTMLElement[], 'right');
  }
}
