
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const editImageWithGemini = async (
  base64Image: string,
  prompt: string,
  mimeType: string = "image/png"
): Promise<string | null> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Image,
              mimeType: mimeType,
            },
          },
          {
            text: prompt,
          },
        ],
      },
    });

    if (response.candidates && response.candidates[0].content.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          const base64EncodeString = part.inlineData.data;
          return `data:image/png;base64,${base64EncodeString}`;
        }
      }
    }
    return null;
  } catch (error) {
    console.error("Error editing image with Gemini:", error);
    throw error;
  }
};

export const chatWithGemini = async (userMessage: string): Promise<string> => {
  try {
    // Upgraded model to gemini-3-flash-preview for better reasoning in text tasks
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: userMessage,
      config: {
        systemInstruction: `You are the friendly AI assistant for Shakti Transport, a family-run logistics business in Gujarat, India. 
        
        Key Business Details:
        - Base: Kalol, Gujarat.
        - Owner: Shakti Transport (Phone: 9722229491).
        - Services: We transport NON-FRAGILE, NON-PERISHABLE industrial goods (machinery, PVC, hardware, metal).
        - WE DO NOT TRANSPORT: Glass, electronics, food, hazardous liquids.
        - Fleet: Eicher trucks, Bolero pickups.
        
        Your Goal:
        - Answer questions about what we ship.
        - If asked for a quote, tell them to use the 'Get a Quote' page or call us.
        - If asked to track, ask for their Shipment ID.
        - Be professional, concise, and helpful. 
        - If you don't know something, suggest calling the office.`
      }
    });

    return response.text || "I apologize, I couldn't process that request. Please try again.";
  } catch (error) {
    console.error("Error chatting with Gemini:", error);
    return "System is currently offline. Please call +91 97222 29491 for immediate assistance.";
  }
};
