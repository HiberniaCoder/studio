"use server";

import {
  generateBusinessForecasts,
  type GenerateBusinessForecastsInput,
  type GenerateBusinessForecastsOutput,
} from "@/ai/flows/generate-business-forecasts";

export async function getForecasts(
  input: GenerateBusinessForecastsInput
): Promise<GenerateBusinessForecastsOutput> {
  if (!input.businessDescription || !input.historicalData || !input.marketTrends) {
    throw new Error("All fields are required.");
  }
  
  try {
    const result = await generateBusinessForecasts(input);
    return result;
  } catch (error) {
    console.error("Error generating forecasts:", error);
    throw new Error("Failed to generate business forecasts. Please try again.");
  }
}
