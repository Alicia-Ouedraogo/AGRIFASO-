import { GoogleGenAI, Type } from "@google/genai";
import { AgriDataPoint, AnalysisReport, PredictionResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const modelName = "gemini-2.5-flash";

export const generateMockData = async (): Promise<AgriDataPoint[]> => {
  const prompt = `
    Generate a JSON dataset representing agricultural data for Burkina Faso from 2013 to 2023.
    Include realistic variations for the Sahel region.
    - Rainfall should vary between 600mm and 1100mm.
    - Average Temperature between 27°C and 30°C.
    - Millet Yield (kg/ha) between 600 and 1200.
    - Sorghum Yield (kg/ha) between 700 and 1500.
    - Maize Yield (kg/ha) between 1000 and 2500.
    Simulate correlations: Higher rainfall generally improves yield up to a point, very high temp reduces yield.
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              year: { type: Type.INTEGER },
              rainfall_mm: { type: Type.NUMBER },
              avg_temp_c: { type: Type.NUMBER },
              millet_yield_kg_ha: { type: Type.INTEGER },
              sorghum_yield_kg_ha: { type: Type.INTEGER },
              maize_yield_kg_ha: { type: Type.INTEGER },
            },
            required: ["year", "rainfall_mm", "avg_temp_c", "millet_yield_kg_ha", "sorghum_yield_kg_ha", "maize_yield_kg_ha"],
          },
        },
      },
    });

    const text = response.text;
    if (!text) return [];
    return JSON.parse(text) as AgriDataPoint[];
  } catch (error) {
    console.error("Error generating data:", error);
    return [];
  }
};

export const analyzeTrends = async (data: AgriDataPoint[]): Promise<AnalysisReport | null> => {
  const dataStr = JSON.stringify(data);
  const prompt = `
    Act as an expert agronomist in West Africa. Analyze this JSON data:
    ${dataStr}

    1. Describe the correlation between rainfall and Millet/Sorghum yields.
    2. Describe the impact of temperature changes.
    3. Summarize the overall agricultural health over the decade.
    4. Provide a strategic recommendation for the next season.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            correlationRainfall: { type: Type.STRING },
            correlationTemp: { type: Type.STRING },
            summary: { type: Type.STRING },
            recommendation: { type: Type.STRING },
          },
        },
      },
    });
    
    const text = response.text;
    if (!text) return null;
    return JSON.parse(text) as AnalysisReport;
  } catch (error) {
    console.error("Error analyzing trends:", error);
    return null;
  }
};

export const predictCropYield = async (
  rainfall: number,
  temp: number,
  crop: string
): Promise<PredictionResult | null> => {
  const prompt = `
    Context: Burkina Faso Agriculture.
    Inputs:
    - Forecasted Seasonal Rainfall: ${rainfall} mm
    - Forecasted Avg Temperature: ${temp} °C
    - Target Crop: ${crop}

    Task: Predict the yield, suggest the best planting month (e.g., June, July), and provide advice.
    Be realistic based on Sahelian agronomy.
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            predictedYield: { type: Type.INTEGER, description: "Predicted yield in kg/ha" },
            optimalPlantingPeriod: { type: Type.STRING },
            confidence: { type: Type.STRING, description: "High, Medium, or Low" },
            advice: { type: Type.STRING },
          },
        },
      },
    });

    const text = response.text;
    if (!text) return null;
    return JSON.parse(text) as PredictionResult;
  } catch (error) {
    console.error("Prediction error:", error);
    return null;
  }
};
