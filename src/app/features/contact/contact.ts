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
import { gsap } from 'gsap'; // Importamos GSAP directamente para el control total

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ToastNotification],
  templateUrl: './contact.html',
  styleUrl: './contact.css', // No olvides vincular el CSS
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Contact implements OnInit, OnDestroy {
  private fb = inject(NonNullableFormBuilder);
  private animationService = inject(AnimationService);
  private zoneService = inject(ZoneService);

  public contactForm!: FormGroup<{
    name: FormControl<string>;
    email: FormControl<string>;
    subject: FormControl<string>;
    message: FormControl<string>;
  }>;

  @ViewChild('headerSection') headerSection!: ElementRef<HTMLElement>;
  private scope = this.zoneService.createScope('contact-component');
  private ctx?: gsap.Context;

  public isSubmitting = false;
  public showToast = false;
  public toastType: 'success' | 'error' = 'success';
  public toastTitle = '';
  public toastMessage = '';

  constructor() {
    afterNextRender(() => {
      this.zoneService.runOutside(() => {
        this.initGsapAnimations();
      });
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

  get f() {
    return this.contactForm.controls;
  }

  private initGsapAnimations(): void {
    this.ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

      // 1. Entrada del Header (Título y subtítulo)
      tl.to(this.headerSection.nativeElement, {
        opacity: 1,
        y: 0,
        duration: 1.2,
      });

      // 2. Animación de los campos con efecto "Floating"
      // Usamos el selector de los grupos de input que definimos en el HTML
      tl.from(
        '.relative.group',
        {
          opacity: 0,
          y: 30,
          duration: 0.8,
          stagger: 0.1,
          clearProps: 'all', // Limpia los estilos para no interferir con el CSS hover
        },
        '-=0.8',
      );

      // 3. Entrada del panel de información lateral
      tl.from(
        '.lg\\:col-span-1',
        {
          opacity: 0,
          x: -40,
          duration: 1,
          ease: 'expo.out',
        },
        '-=1',
      );
    }, this.headerSection.nativeElement); // Scope de GSAP
  }

  async onSubmit(): Promise<void> {
    if (this.contactForm.invalid) {
      this.animateError(); // Pequeño feedback visual de error
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

  // Micro-interacción: Shake de error si el form es inválido
  private animateError(): void {
    gsap.to('.lg\\:col-span-2', {
      x: -10,
      duration: 0.1,
      repeat: 3,
      yoyo: true,
      ease: 'power1.inOut',
      // Usamos llaves para asegurar que la función devuelva void
      onComplete: () => {
        gsap.set('.lg\\:col-span-2', { x: 0 });
      },
    });
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
    this.ctx?.revert(); // Revierte todas las animaciones de GSAP
    this.scope.cleanup();
  }
}
