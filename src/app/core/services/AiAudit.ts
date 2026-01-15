import { Injectable } from '@angular/core';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { IProject } from '../types/IProject';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AiAuditService {
  private genAI = new GoogleGenerativeAI(environment.geminiApiKey);
  private model = this.genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

  async getProjectAudit(tech: string, project: IProject) {
    const prompt = `
      Actúa como un arquitecto de software senior especializado en ${tech}.
      Analiza el proyecto: "${project.title}".
      Descripción: ${project.fullDescription}.
      
      Genera una respuesta estrictamente en formato JSON con la siguiente estructura:
      {
        "insight": "Una frase técnica brillante (máx 140 caracteres) sobre cómo se aplicó ${tech} para optimizar el rendimiento.",
        "blueprint": "Un diagrama de flujo ASCII muy minimalista (ej: A -> B -> C)."
      }
      
      IMPORTANTE: No respondas con nada que no sea el objeto JSON. No uses markdown.
    `;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      let text = response.text();
      if (text.includes('```')) {
        text = text
          .replace(/```json/g, '')
          .replace(/```/g, '')
          .trim();
      }

      return JSON.parse(text);
    } catch (error) {
      console.error('AI Audit Error:', error);
      return {
        insight: `Análisis de ${tech} optimizado para el ecosistema del proyecto.`,
        blueprint: `Client -> [${tech} Logic] -> Render`,
      };
    }
  }

  async executeAuditWithUI(
    tech: string,
    project: IProject,
    callbacks: {
      onLoading: (state: boolean) => void;
      onResult: (result: { insight: string; blueprint: string }) => void;
      onError: () => void;
    },
  ): Promise<void> {
    callbacks.onLoading(true);
    try {
      const response = await this.getProjectAudit(tech, project);
      callbacks.onResult(response);
    } catch (error) {
      callbacks.onError();
    } finally {
      callbacks.onLoading(false);
    }
  }
}
