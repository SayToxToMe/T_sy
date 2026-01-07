import { GoogleGenAI, Type } from "@google/genai";
import { FoodAnalysis } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Using gemini-3-pro-preview for complex reasoning about ingredients and nutrition
const ANALYSIS_MODEL = "gemini-3-pro-preview";
// Using gemini-3-pro-image-preview (Nano Banana Pro equivalent) for high quality generation
const IMAGE_MODEL = "gemini-3-pro-image-preview";

export const analyzeFoodImage = async (base64Image: string): Promise<FoodAnalysis> => {
  try {
    const prompt = `
      Analyze this image of food. Identify the dish and provide a detailed breakdown.
      1. Name and describe the dish.
      2. Who is the target audience for this meal? (e.g., Athletes, Keto dieters, Kids).
      3. Estimate the nutrition facts per serving (Calories, Fiber, Protein, Carbs, Fat, Sugar, Sodium).
      4. List probable ingredients and explain the specific FUNCTION of each ingredient in the body or dish (e.g., "Chicken: Muscle repair", "Turmeric: Anti-inflammatory").
      5. Provide a short recipe/preparation method.
      6. Estimate the cost of ingredients (Receipt estimation).
    `;

    const response = await ai.models.generateContent({
      model: ANALYSIS_MODEL,
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: base64Image,
            },
          },
          { text: prompt },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            dishName: { type: Type.STRING },
            description: { type: Type.STRING },
            targetAudience: { type: Type.STRING },
            nutrition: {
              type: Type.OBJECT,
              properties: {
                calories: { type: Type.NUMBER },
                protein: { type: Type.STRING },
                carbohydrates: { type: Type.STRING },
                fiber: { type: Type.STRING },
                fat: { type: Type.STRING },
                sugar: { type: Type.STRING },
                sodium: { type: Type.STRING },
              },
              required: ["calories", "protein", "carbohydrates", "fiber", "fat"],
            },
            ingredients: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  quantity: { type: Type.STRING },
                  function: { type: Type.STRING, description: "Health benefit or culinary function of this ingredient" },
                },
                required: ["name", "function"],
              },
            },
            recipeInstructions: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            estimatedCost: { type: Type.STRING, description: "Estimated cost range for these ingredients (e.g. $5 - $8)" },
          },
          required: ["dishName", "nutrition", "ingredients", "targetAudience"],
        },
      },
    });

    const jsonText = response.text || "{}";
    return JSON.parse(jsonText) as FoodAnalysis;
  } catch (error) {
    console.error("Error analyzing food:", error);
    throw error;
  }
};

export const generateIdealizedImage = async (dishName: string, description: string): Promise<string> => {
  try {
    const prompt = `Professional food photography of ${dishName}. ${description}. 
    High resolution, 4k, delicious, appetizing, studio lighting, michelin star plating.`;

    const response = await ai.models.generateContent({
      model: IMAGE_MODEL,
      contents: {
        parts: [{ text: prompt }],
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1",
          imageSize: "1K" // Generating 1K for speed/display balance
        }
      }
    });

    // Extract image from response parts
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData && part.inlineData.data) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    throw new Error("No image data found in response");
  } catch (error) {
    console.error("Error generating image:", error);
    throw error;
  }
};
