import { GoogleGenAI, Type } from "@google/genai";

// Initialize the API client
// Note: We are strictly following the rule to use process.env.API_KEY directly in the constructor
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateProductDetails = async (productName: string, basePrice: number) => {
  try {
    const model = 'gemini-2.5-flash';
    const prompt = `You are a quirky, medieval fantasy shopkeeper.
    A customer is looking at a "${productName}".
    Generate a short, funny description (max 20 words) and a dynamic price based on the base price of ${basePrice} (fluctuate it slightly).
    Return strictly JSON.`;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            description: { type: Type.STRING },
            price: { type: Type.NUMBER },
            salesPitch: { type: Type.STRING }
          },
          required: ["description", "price", "salesPitch"]
        }
      }
    });

    const text = response.text;
    if (!text) return null;
    return JSON.parse(text);

  } catch (error) {
    console.error("Gemini API Error:", error);
    // Fallback if API fails
    return {
      description: "A mysterious item.",
      price: basePrice,
      salesPitch: "Buy it or leave it!"
    };
  }
};
