// Prioritize Business Areas Flow
'use server';

/**
 * @fileOverview This file defines a Genkit flow for prioritizing business areas based on AI analysis.
 *
 * - prioritizeBusinessAreas - A function that orchestrates the prioritization process.
 * - PrioritizeBusinessAreasInput - The input type for the prioritizeBusinessAreas function.
 * - PrioritizeBusinessAreasOutput - The output type for the prioritizeBusinessAreas function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PrioritizeBusinessAreasInputSchema = z.object({
  businessData: z
    .string()
    .describe(
      'Comprehensive data about the client\u0027s business, including but not limited to sales figures, marketing metrics, operational costs, and customer feedback.'
    ),
});
export type PrioritizeBusinessAreasInput = z.infer<typeof PrioritizeBusinessAreasInputSchema>;

const PrioritizeBusinessAreasOutputSchema = z.object({
  prioritizedAreas: z
    .array(z.string())
    .describe(
      'A ranked list of business areas that the client should focus on, based on the AI analysis of the provided business data.'
    ),
  summary: z
    .string()
    .describe(
      'A concise summary of the AI analysis, explaining why the listed business areas are the most critical.'
    ),
});
export type PrioritizeBusinessAreasOutput = z.infer<typeof PrioritizeBusinessAreasOutputSchema>;

export async function prioritizeBusinessAreas(
  input: PrioritizeBusinessAreasInput
): Promise<PrioritizeBusinessAreasOutput> {
  return prioritizeBusinessAreasFlow(input);
}

const prompt = ai.definePrompt({
  name: 'prioritizeBusinessAreasPrompt',
  input: {schema: PrioritizeBusinessAreasInputSchema},
  output: {schema: PrioritizeBusinessAreasOutputSchema},
  prompt: `Analyze the following business data and identify the most critical areas the client should focus on to improve their business performance. Provide a ranked list of these areas and a concise summary of your analysis.

Business Data: {{{businessData}}}

Prioritized Areas: 
Summary:`, //Strictly following the prompt instructions here, so no need for handlebars templating on the output. Output schema descriptions are passed to the LLM
});

const prioritizeBusinessAreasFlow = ai.defineFlow(
  {
    name: 'prioritizeBusinessAreasFlow',
    inputSchema: PrioritizeBusinessAreasInputSchema,
    outputSchema: PrioritizeBusinessAreasOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
