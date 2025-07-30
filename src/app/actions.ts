'use server';

import { optimizeClause, type OptimizeClauseInput, type OptimizeClauseOutput } from '@/ai/flows/clause-optimizer';
import { generateSuggestions, type GenerateSuggestionsInput, type GenerateSuggestionsOutput } from '@/ai/flows/suggestion-generator';

export async function handleOptimizeClause(
  input: OptimizeClauseInput
): Promise<{ data: OptimizeClauseOutput | null; error: string | null }> {
  try {
    const result = await optimizeClause(input);
    return { data: result, error: null };
  } catch (e) {
    console.error(e);
    const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
    return { data: null, error: `Failed to optimize clause: ${errorMessage}` };
  }
}

export async function handleGenerateSuggestions(
  input: GenerateSuggestionsInput
): Promise<{ data: GenerateSuggestionsOutput | null; error: string | null }> {
  try {
    const result = await generateSuggestions(input);
    return { data: result, error: null };
  } catch (e) {
    console.error(e);
    const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
    return { data: null, error: `Failed to generate suggestions: ${errorMessage}` };
  }
}
