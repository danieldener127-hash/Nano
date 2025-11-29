import { GoogleGenAI } from "@google/genai";
import { AspectRatio } from "../types";

// The model mapping for "Nano Banana" / Gemini 2.5 Flash Image
const IMAGE_MODEL_NAME = 'gemini-2.5-flash-image';
// The model for text generation (Bot code)
const TEXT_MODEL_NAME = 'gemini-2.5-flash';

// Initialize the API client
const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found in environment variables.");
  }
  return new GoogleGenAI({ apiKey });
};

export const generateImage = async (
  prompt: string, 
  aspectRatio: AspectRatio
): Promise<string> => {
  const ai = getAiClient();

  try {
    const response = await ai.models.generateContent({
      model: IMAGE_MODEL_NAME,
      contents: {
        parts: [{ text: prompt }],
      },
      config: {
        imageConfig: {
          aspectRatio: aspectRatio,
        },
      },
    });

    // Parse response for image data
    if (response.candidates && response.candidates.length > 0) {
      const parts = response.candidates[0].content.parts;
      for (const part of parts) {
        if (part.inlineData && part.inlineData.data) {
          const mimeType = part.inlineData.mimeType || 'image/png';
          return `data:${mimeType};base64,${part.inlineData.data}`;
        }
      }
    }

    throw new Error("No image generated. The model might have blocked the request or failed to produce an output.");
  } catch (error: any) {
    console.error("Gemini API Error (Image):", error);
    throw new Error(error.message || "Failed to generate image");
  }
};

export const generateBotCode = async (
  botName: string,
  description: string
): Promise<string> => {
  const ai = getAiClient();

  const prompt = `
    You are an expert Python developer specialized in 'python-telegram-bot' library (version 20+ async/await).
    
    Task: Write a complete, single-file Python script for a Telegram Bot.
    
    Bot Name: ${botName}
    Bot Functionality: ${description}
    
    Requirements:
    1. Use 'python-telegram-bot' ApplicationBuilder.
    2. Include a /start command and a /help command.
    3. Include handlers relevant to the functionality described.
    4. Add comments explaining how to get the TOKEN from @BotFather.
    5. The code must be robust and handle errors gracefully.
    6. Return ONLY the python code inside markdown code blocks. Do not add conversational text before or after.
  `;

  try {
    const response = await ai.models.generateContent({
      model: TEXT_MODEL_NAME,
      contents: prompt,
    });

    const text = response.text;
    if (!text) throw new Error("No code generated.");
    
    // Clean up markdown code blocks if present
    return text.replace(/```python/g, '').replace(/```/g, '').trim();

  } catch (error: any) {
    console.error("Gemini API Error (Text):", error);
    throw new Error(error.message || "Failed to generate bot code");
  }
};