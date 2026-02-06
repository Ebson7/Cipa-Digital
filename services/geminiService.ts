
import { GoogleGenAI, Type } from "@google/genai";
import { SafetyTip } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getDailySafetyTip = async (): Promise<SafetyTip> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: "Gere uma dica de segurança do trabalho (CIPA) curta e impactante para hoje. Formato JSON com 'title', 'content' e 'priority' (low, medium, high).",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            content: { type: Type.STRING },
            priority: { type: Type.STRING }
          },
          required: ["title", "content", "priority"]
        }
      }
    });

    return JSON.parse(response.text.trim()) as SafetyTip;
  } catch (error) {
    console.error("Error fetching safety tip:", error);
    return {
      title: "Segurança em Primeiro Lugar",
      content: "O uso correto de EPIs salva vidas. Verifique seus equipamentos antes de iniciar o turno.",
      priority: "high"
    };
  }
};
