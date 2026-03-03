import { GoogleGenAI } from "@google/genai";
import { SYSTEM_PROMPT } from "../constants";

let aiClient: GoogleGenAI | null = null;

const getAiClient = (): GoogleGenAI => {
  if (!aiClient) {
    aiClient = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }
  return aiClient;
};

export const generateStylingAdvice = async (
  userMessage: string, 
  context: string = ""
): Promise<string> => {
  try {
    const ai = getAiClient();
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Context: ${context}\n\nUser Query: ${userMessage}`,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        temperature: 0.7,
      }
    });

    return response.text || "DATA CORRUPTION DETECTED. RETRY.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "CONNECTION LOST. D.P GEMS OFFLINE.";
  }
};

export const logExtraction = async (transactionId: string, amount: number, items: string[]): Promise<void> => {
  try {
    const ai = getAiClient();
    // We fire and forget this log, or await it if strict auditing is needed.
    await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Log this successful transaction extraction.\nID: ${transactionId}\nAmount: ${amount}\nItems: ${items.join(', ')}`,
      config: {
        systemInstruction: "You are a transaction logger for a cyberpunk streetwear brand. Output a single line confirmation log in a retro terminal style.",
      }
    });
  } catch (error) {
    console.error("Failed to log extraction:", error);
  }
};