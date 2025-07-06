// src/ai/flows/generate-business-forecasts.ts
'use server';
/**
 * @fileOverview Generates AI-driven business forecasts based on historical data and market trends.
 *
 * - generateBusinessForecasts - A function that generates business forecasts.
 * - GenerateBusinessForecastsInput - The input type for the generateBusinessForecasts function.
 * - GenerateBusinessForecastsOutput - The return type for the generateBusinessForecasts function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateBusinessForecastsInputSchema = z.object({
  historicalData: z
    .string()
    .describe('Historical data of the business, including sales, expenses, and other relevant metrics.'),
  marketTrends: z
    .string()
    .describe('Current market trends and analysis for the industry.'),
  businessDescription: z.string().describe('A detailed description of the business and its operations.'),
});
export type GenerateBusinessForecastsInput = z.infer<typeof GenerateBusinessForecastsInputSchema>;

const GenerateBusinessForecastsOutputSchema = z.object({
  prioritizedAreas: z
    .string()
    .describe('Key business areas that need prioritization based on the analysis.'),
  forecasts: z
    .string()
    .describe('AI-driven forecasts for the business, including potential challenges and opportunities.'),
});
export type GenerateBusinessForecastsOutput = z.infer<
  typeof GenerateBusinessForecastsOutputSchema
>;

export async function generateBusinessForecasts(
  input: GenerateBusinessForecastsInput
): Promise<GenerateBusinessForecastsOutput> {
  return generateBusinessForecastsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateBusinessForecastsPrompt',
  input: {schema: GenerateBusinessForecastsInputSchema},
  output: {schema: GenerateBusinessForecastsOutputSchema},
  prompt: `You are an AI assistant that analyzes business data and provides forecasts.

Analyze the provided historical data, market trends, and business description to identify key areas that need prioritization and generate forecasts for the business.

Historical Data: {{{historicalData}}}
Market Trends: {{{marketTrends}}}
Business Description: {{{businessDescription}}}

Based on your analysis, provide the prioritized areas and forecasts in a clear and concise manner.

{{output}}
`,
});

const generateBusinessForecastsFlow = ai.defineFlow(
  {
    name: 'generateBusinessForecastsFlow',
    inputSchema: GenerateBusinessForecastsInputSchema,
    outputSchema: GenerateBusinessForecastsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
