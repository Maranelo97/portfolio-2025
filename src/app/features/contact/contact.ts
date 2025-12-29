import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  inject,
  ElementRef,
  ViewChild,
  afterNextRender,
  OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormGroup,
  Validators,
  ReactiveFormsModule,
  NonNullableFormBuilder,
  FormControl,
} from '@angular/forms';
import { IContactForm } from '../../core/types/IContactForm';
import { AnimationService } from '../../core/services/animations';
import { ZoneService } from '../../core/services/zone';
import { ToastNotification } from '../../shared/components/ToastNotification/ToastNotification';
import emailjs from '@emailjs/browser';
import { enviroment } from '../../environments/environment';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ToastNotification],
  templateUrl: './contact.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Contact implements OnInit, OnDestroy {
  // Inyecciones
  private fb = inject(NonNullableFormBuilder);
  private animationService = inject(AnimationService);
  private zoneService = inject(ZoneService);

  // Formulario Tipado Estricto
  public contactForm!: FormGroup<{
    name: FormControl<string>;
    email: FormControl<string>;
    subject: FormControl<string>;
    message: FormControl<string>;
  }>;

  // Animaciones y UI
  @ViewChild('headerSection', { static: false }) headerSection!: ElementRef<HTMLElement>;
  private scope = this.zoneService.createScope('contact-component');

  public isSubmitting = false;
  public showToast = false;
  public toastType: 'success' | 'error' = 'success';
  public toastTitle = '';
  public toastMessage = '';

  constructor() {
    afterNextRender(() => {
      this.startEntryAnimations();
    });
  }

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      subject: ['', [Validators.required]],
      message: ['', [Validators.required, Validators.minLength(20)]],
    });
  }

  // Getter tipado para el HTML
  get f() {
    return this.contactForm.controls;
  }

  async onSubmit(): Promise<void> {
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.showToast = false;

    // Uso de la Interfaz IContactForm
    const formData: IContactForm = this.contactForm.getRawValue();

    const templateParams = {
      from_name: formData.name,
      from_email: formData.email,
      subject: formData.subject,
      message: formData.message,
    };

    try {
      await emailjs.send(
        enviroment.serviceId,
        enviroment.templateId,
        templateParams,
        enviroment.authKey,
      );

      this.setToast(
        'success',
        '¡Mensaje Enviado!',
        'Gracias por contactarme. El correo ha llegado a mi bandeja.',
      );
      this.contactForm.reset();
    } catch (error) {
      console.error('EmailJS Error:', error);
      this.setToast(
        'error',
        'Error de Envío',
        'No pudimos procesar el correo. Por favor, intenta más tarde.',
      );
    } finally {
      this.isSubmitting = false;
    }
  }

  private setToast(type: 'success' | 'error', title: string, message: string): void {
    this.toastType = type;
    this.toastTitle = title;
    this.toastMessage = message;
    this.showToast = true;
  }

  public onToastClosed(): void {
    this.showToast = false;
  }

  private startEntryAnimations(): void {
    // Animación de cabecera usando el scope tipado
    if (this.headerSection) {
      this.animationService.staggerScaleIn(this.headerSection.nativeElement, 0);
    }

    // Animación de los campos del formulario
    const fields = document.querySelectorAll<HTMLElement>('.form-field');
    if (fields.length > 0) {
      this.animationService.slideInStagger(Array.from(fields), 'right');
    }
  }

  ngOnDestroy(): void {
    // Limpieza automática de GSAP y ScrollTriggers
    this.scope.cleanup();
  }
}
