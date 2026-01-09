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
  styleUrl: './contact.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Contact implements OnInit, OnDestroy {
  private fb = inject(NonNullableFormBuilder);
  private animSvc = inject(AnimationService);
  private zoneSvc = inject(ZoneService);

  public contactForm!: FormGroup<{
    name: FormControl<string>;
    email: FormControl<string>;
    subject: FormControl<string>;
    message: FormControl<string>;
  }>;

  @ViewChild('headerSection') headerSection!: ElementRef<HTMLElement>;
  // Referencias para las otras partes del grid
  @ViewChild('sidebar') sidebar!: ElementRef<HTMLElement>;
  @ViewChild('formContainer') formContainer!: ElementRef<HTMLElement>;

  private scope = this.zoneSvc.createScope('contact-component');

  public isSubmitting = false;
  public showToast = false;
  public toastType: 'success' | 'error' = 'success';
  public toastTitle = '';
  public toastMessage = '';

  constructor() {
    afterNextRender(() => {
      if (this.headerSection && this.formContainer && this.sidebar) {
        this.animSvc.contactEntrance(
          this.headerSection.nativeElement,
          this.formContainer.nativeElement,
          this.sidebar.nativeElement,
          this.scope,
        );
      }
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

  async onSubmit(): Promise<void> {
    if (this.contactForm.invalid) {
      // Usamos el servicio para la animación de error
      this.animSvc.shakeError('.lg\\:col-span-2');
      this.contactForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    const formData: IContactForm = this.contactForm.getRawValue();

    try {
      await emailjs.send(
        enviroment.serviceId,
        enviroment.templateId,
        {
          from_name: formData.name,
          from_email: formData.email,
          subject: formData.subject,
          message: formData.message,
        },
        enviroment.authKey,
      );

      this.setToast('success', '¡Despegue Exitoso!', 'Tu mensaje está en camino.');
      this.contactForm.reset();
    } catch (error) {
      this.setToast('error', 'Fallo en los motores', 'No pudimos enviar el mensaje.');
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

  ngOnDestroy(): void {
    this.scope.cleanup();
  }
}
