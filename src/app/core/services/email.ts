import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { IContactForm } from '../types/IContactForm';
import emailjs from '@emailjs/browser';
@Injectable({ providedIn: 'root' })
export class EmailService {
  constructor() {}

  async sendContactForm(formData: IContactForm): Promise<void> {
    try {
      await emailjs.send(
        environment.serviceId,
        environment.templateId,
        this.mapFormToEmailJS(formData),
        environment.authKey,
      );
    } catch (error) {
      console.error('EmailService Error:', error);
      throw new Error('FAILED_TO_SEND_EMAIL'); // Error semántico
    }
  }

  private mapFormToEmailJS(data: IContactForm) {
    return {
      from_name: data.name,
      from_email: data.email,
      subject: data.subject,
      message: data.message,
    };
  }
}
