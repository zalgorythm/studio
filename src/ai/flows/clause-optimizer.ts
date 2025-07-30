'use server';

/**
 * @fileOverview An AI agent that suggests and optimizes clauses for a trust.
 *
 * - optimizeClause - A function that optimizes the clause for the trust.
 * - OptimizeClauseInput - The input type for the optimizeClause function.
 * - OptimizeClauseOutput - The return type for the optimizeClause function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const OptimizeClauseInputSchema = z.object({
  trustType: z
    .string()
    .describe('The type of trust being created (e.g., revocable, irrevocable).'),
  assetType: z
    .string()
    .describe('The type of asset being managed by the trust (e.g., real estate, stocks).'),
  specificNeeds: z
    .string()
    .describe(
      'Any specific needs or concerns of the trust creator that should be addressed in the clauses.'
    ),
  existingClause: z
    .string()
    .optional()
    .describe('An existing clause that needs to be optimized.'),
  documentContent: z
    .string()
    .optional()
    .describe('The full text content of an existing trust document for context.'),
});
export type OptimizeClauseInput = z.infer<typeof OptimizeClauseInputSchema>;

const OptimizeClauseOutputSchema = z.object({
  optimizedClause: z.string().describe('The suggested or optimized clause for the trust.'),
  explanation: z
    .string()
    .describe('An explanation of why the clause is important and how it addresses the input.'),
});
export type OptimizeClauseOutput = z.infer<typeof OptimizeClauseOutputSchema>;

export async function optimizeClause(input: OptimizeClauseInput): Promise<OptimizeClauseOutput> {
  return optimizeClauseFlow(input);
}

const prompt = ai.definePrompt({
  name: 'optimizeClausePrompt',
  input: {schema: OptimizeClauseInputSchema},
  output: {schema: OptimizeClauseOutputSchema},
  prompt: `You are an expert legal assistant specializing in trust law. Your goal is to suggest and optimize clauses for trusts based on the trust type, asset type, specific needs, and existing clause (if any).

If an existing trust document is provided, use it as the primary context for your suggestions.

Trust Type: {{{trustType}}}
Asset Type: {{{assetType}}}
Specific Needs: {{{specificNeeds}}}
{{#if existingClause}}
Existing Clause to Optimize:
{{{existingClause}}}
{{/if}}
{{#if documentContent}}
Full Trust Document Context:
{{{documentContent}}}
{{/if}}

Based on all the information provided, suggest an optimized clause for the trust and provide a detailed explanation of why the clause is important and how it addresses the user's input. Be as specific and legally sound as possible.
`,
});

const optimizeClauseFlow = ai.defineFlow(
  {
    name: 'optimizeClauseFlow',
    inputSchema: OptimizeClauseInputSchema,
    outputSchema: OptimizeClauseOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
