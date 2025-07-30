'use server';

/**
 * @fileOverview An AI agent that suggests example needs for a trust.
 *
 * - generateSuggestions - A function that generates suggestions.
 * - GenerateSuggestionsInput - The input type for the generateSuggestions function.
 * - GenerateSuggestionsOutput - The return type for the generateSuggestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateSuggestionsInputSchema = z.object({
  trustType: z
    .string()
    .describe('The type of trust being created (e.g., revocable, irrevocable).'),
  assetType: z
    .string()
    .describe('The type of asset being managed by the trust (e.g., real estate, stocks).'),
});
export type GenerateSuggestionsInput = z.infer<typeof GenerateSuggestionsInputSchema>;

const GenerateSuggestionsOutputSchema = z.object({
  suggestions: z.array(z.string()).length(3).describe('An array of three distinct, concise suggestions for the user\'s specific needs.'),
});
export type GenerateSuggestionsOutput = z.infer<typeof GenerateSuggestionsOutputSchema>;

export async function generateSuggestions(input: GenerateSuggestionsInput): Promise<GenerateSuggestionsOutput> {
  return generateSuggestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateSuggestionsPrompt',
  input: {schema: GenerateSuggestionsInputSchema},
  output: {schema: GenerateSuggestionsOutputSchema},
  prompt: `You are an expert legal assistant specializing in trust law. Your goal is to suggest three brief, distinct, and insightful examples for a user's "Specific Needs or Goals" based on their selected trust and asset types.

Do not add prefixes like "1. ", "e.g.,", or "-". Just provide the raw text for the suggestion. Each suggestion should be a short phrase, not a full sentence.

Trust Type: {{{trustType}}}
Asset Type: {{{assetType}}}

Generate three diverse and relevant examples. For instance, if the user selects "Special Needs Trust", you could suggest things like "Supplement government benefits", "Pay for medical expenses", or "Fund personal care assistant".
`,
});

const generateSuggestionsFlow = ai.defineFlow(
  {
    name: 'generateSuggestionsFlow',
    inputSchema: GenerateSuggestionsInputSchema,
    outputSchema: GenerateSuggestionsOutputSchema,
  },
  async input => {
    // Return empty suggestions if inputs are empty, saves an LLM call.
    if (!input.trustType && !input.assetType) {
        return {suggestions: []};
    }
    const {output} = await prompt(input);
    return output!;
  }
);
