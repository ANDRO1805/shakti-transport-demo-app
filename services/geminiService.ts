import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY as string;

if (!apiKey) {
  throw new Error("VITE_GEMINI_API_KEY is missing");
}

const genAI = new GoogleGenerativeAI(apiKey);

/* ================= TEXT CHAT ================= */

export async function chatWithGemini(prompt: string): Promise<string> {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const result = await model.generateContent(prompt);
  const response = await result.response;

  return response.text() || "No response from Gemini";
}

/* ================= IMAGE / EDIT PLACEHOLDER ================= */
/* (Frontend-safe stub so build passes) */

export async function editImageWithGemini(
  _imageBase64: string,
  _prompt: string
): Promise<string> {
  // Gemini image editing requires backend
  return "Image editing requires server-side processing.";
}
