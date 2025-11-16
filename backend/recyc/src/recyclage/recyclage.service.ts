import { Injectable } from '@nestjs/common';
import { GoogleGenAI } from '@google/genai';

@Injectable()
export class RecyclageService {
  private aiClient: GoogleGenAI;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY manquante');
    }
    this.aiClient = new GoogleGenAI({ apiKey });
  }

  async getResponse(message: string): Promise<string> {
    try {
      const response = await this.aiClient.models.generateContent({
        model: 'gemini-2.0-flash',  
        contents: message,
      });
      return response.text;
    } catch (err: any) {
      console.error('Erreur Gemini:', err.message || err);
      return 'Erreur lors de la génération de la réponse.';
    }
  }
}
