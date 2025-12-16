import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormGroup,
  Validators,
  ReactiveFormsModule, // ¡CRUCIAL para Reactive Forms!
  NonNullableFormBuilder,
  AbstractControl,
} from '@angular/forms';
import { of, delay, catchError, finalize } from 'rxjs';
import { IContactForm } from '../../core/types/IContactForm';
import { ToastNotification } from '../../shared/components/ToastNotification/ToastNotification';


@Component({
  selector: 'app-contact',
  imports: [CommonModule, ReactiveFormsModule, ToastNotification],
  templateUrl: './contact.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Contact implements OnInit {
  public contactForm!: FormGroup;

  // Estados para la UX (User Experience)
  public isSubmitting = false;
  public submissionSuccess: boolean | null = null;

  public showToast: boolean = false;
    public toastType: 'success' | 'error' = 'success';
    public toastTitle: string = '';
    public toastMessage: string = '';

  constructor(private fb: NonNullableFormBuilder) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    // El fb.group() está perfecto y crea el grupo no-nulo:
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      subject: ['', Validators.required],
      message: ['', [Validators.required, Validators.minLength(20)]],
    });
  }

  // Getter para un acceso limpio a los controles en el HTML
  get f(): { [key: string]: AbstractControl } {
    return this.contactForm.controls as any;
  }

onSubmit(): void {
    if (this.contactForm.invalid) {
      // Marcar todos los campos como 'touched' para mostrar errores
      this.contactForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.showToast = false; // 👈 Reiniciamos el toast antes de enviar

    // 1. Simulación de Llamada API
    of({ success: true })
      .pipe(
        delay(1500), // Simular latencia de red (1.5 segundos)
        catchError((error) => {
          // Simular que el servidor devuelve un error
          console.error('API Error:', error);
          // 🚀 FIX: Mostrar Toast de ERROR
          this.setToast('error', 'Error de Envío', 'Hubo un problema de conexión. Intenta de nuevo más tarde.');
          return of({ success: false }); // Devolver Observable con éxito=false
        }),
        finalize(() => {
          // Se ejecuta siempre, ya sea éxito o error
          this.isSubmitting = false;
        })
      )
      .subscribe((response) => {
        // response.success es true si todo salió bien, o false si se pasó por catchError
        if (response.success) {
          // 🚀 FIX: Mostrar Toast de ÉXITO
          this.setToast('success', '¡Mensaje Enviado!', 'Gracias por contactarme. Te responderé a la brevedad posible.');
          this.contactForm.reset(); // Limpiar el formulario en caso de éxito
        }
        // Si falló (response.success es false), el toast de error ya fue mostrado en catchError
      });
}

  // Nuevo método para mostrar el toast
    setToast(type: 'success' | 'error', title: string, message: string): void {
        this.toastType = type;
        this.toastTitle = title;
        this.toastMessage = message;
        this.showToast = true;
    }

    // Método que se llama cuando el toast se auto-cierra
    onToastClosed(): void {
        this.showToast = false;
    }
}
