import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  inject,
  ElementRef,
  ViewChild,
  afterNextRender,
  OnDestroy,
} from '@angular/core';
import {
  FormGroup,
  Validators,
  ReactiveFormsModule,
  NonNullableFormBuilder,
  FormControl,
} from '@angular/forms';
import { AnimationService } from '../../core/services/animations';
import { ZoneService } from '../../core/services/zone';
import { ToastNotification } from '../../shared/components/ToastNotification/ToastNotification';
import { EmailService } from '../../core/services/email';
import { ContactEntranceStrategy, ShakeErrorStrategy } from '@strategies';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [ReactiveFormsModule, ToastNotification],
  templateUrl: './contact.html',
  styleUrl: './contact.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Contact implements OnInit, OnDestroy {
  private fb = inject(NonNullableFormBuilder);
  private animSvc = inject(AnimationService);
  private zoneSvc = inject(ZoneService);
  private emailSvc = inject(EmailService);
  private cdr = inject(ChangeDetectorRef);

  public contactForm!: FormGroup<{
    name: FormControl<string>;
    email: FormControl<string>;
    subject: FormControl<string>;
    message: FormControl<string>;
  }>;

  @ViewChild('headerSection') headerSection!: ElementRef<HTMLElement>;
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
      this.triggerEntrance();
    });
  }

  ngOnInit(): void {
    this.initForm();
  }

  private triggerEntrance(): void {
    if (this.headerSection && this.formContainer && this.sidebar) {
      const refs = {
        header: this.headerSection.nativeElement,
        form: this.formContainer.nativeElement,
        sidebar: this.sidebar.nativeElement,
      };
      this.animSvc.run([], new ContactEntranceStrategy(refs, this.scope));
    }
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
      this.animSvc.run(this.formContainer.nativeElement, new ShakeErrorStrategy());
      this.contactForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.cdr.markForCheck();

    try {
      await this.emailSvc.sendContactForm(this.contactForm.getRawValue());

      this.setToast('success', '¡Despegue Exitoso!', 'Tu mensaje está en camino.');
      this.contactForm.reset();
    } catch (error) {
      this.setToast('error', 'Fallo en los motores', 'No pudimos enviar el mensaje.');
    } finally {
      this.isSubmitting = false;
      this.cdr.markForCheck();
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
