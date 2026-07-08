import { GoogleGenAI } from '@google/genai';
import { getMappingSystemPrompt, getMappingUserPrompt } from '../prompts/mappingPrompt';
import { CRMRecord } from '../types/crm';

export class GeminiService {
  private static ai: GoogleGenAI | null = null;

  private static getClient(): GoogleGenAI {
    if (!this.ai) {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error('GEMINI_API_KEY is not configured in the .env file.');
      }
      this.ai = new GoogleGenAI({ apiKey });
    }
    return this.ai;
  }

  /**
   * Sends a batch of raw records to Gemini to map them to GrowEasy CRM records.
   */
  public static async mapRecords(records: Record<string, string>[]): Promise<CRMRecord[]> {
    const ai = this.getClient();
    const systemPrompt = getMappingSystemPrompt();
    const userPrompt = getMappingUserPrompt(records);

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: userPrompt,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error('Empty response received from Gemini API');
    }

    try {
      // Find JSON block if Gemini returned markdown (though we requested plain JSON, sometimes it wraps)
      let cleanedText = text.trim();
      if (cleanedText.startsWith('```json')) {
        cleanedText = cleanedText.substring(7, cleanedText.length - 3).trim();
      } else if (cleanedText.startsWith('```')) {
        cleanedText = cleanedText.substring(3, cleanedText.length - 3).trim();
      }

      const result = JSON.parse(cleanedText);
      
      // Support both { mappedRecords: [...] } and direct array output
      if (result && Array.isArray(result.mappedRecords)) {
        return result.mappedRecords as CRMRecord[];
      }
      if (result && Array.isArray(result)) {
        return result as CRMRecord[];
      }
      
      throw new Error('Unexpected JSON structure: "mappedRecords" array not found.');
    } catch (e: any) {
      console.error('[Gemini Service] Raw response that failed to parse:', text);
      throw new Error(`Failed to parse AI response: ${e.message}`);
    }
  }
}
