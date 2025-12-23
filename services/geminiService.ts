import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * Gemini API key from Vite environment variables
 */
const apiKey = import.meta.env.VITE_GEMINI_API_KEY as string;

if (!apiKey) {
  throw new Error("VITE_GEMINI_API_KEY is missing");
}

/**
 * Gemini client
 */
const genAI = new GoogleGenerativeAI(apiKey);

/* ======================================================
   TEXT CHAT (USED BY AiChatbot.tsx)
   ====================================================== */

export async function chatWithGemini(prompt: string): Promise<string> {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const result = await model.generateContent(prompt);
  const response = await result.response;

  return response.text() || "No response from Gemini";
}

/* ======================================================
   IMAGE EDITING (USED BY GeminiEditor.tsx)
   FRONTEND-SAFE STUB
   ====================================================== */

export async function editImageWithGemini(
  _imageBase64: string,
  _prompt: string,
  _options?: unknown
): Promise<string> {
  /**
   * Gemini image editing requires server-side processing.
   * This stub exists so the frontend build passes cleanly.
   */
  return "Image editing requires server-side processing.";
}
