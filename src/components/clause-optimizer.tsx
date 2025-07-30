'use client';

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Sparkles, Loader2, FileText, Lightbulb } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { handleOptimizeClause } from '@/app/actions';
import type { OptimizeClauseOutput } from '@/ai/flows/clause-optimizer';
import { useToast } from '@/hooks/use-toast';

const OptimizeClauseInputSchema = z.object({
  trustType: z.string().min(1, 'Please select a trust type.'),
  assetType: z.string().min(1, 'Please select an asset type.'),
  specificNeeds: z.string().min(10, 'Please describe your specific needs (min. 10 characters).'),
  existingClause: z.string().optional(),
});
type OptimizeClauseInput = z.infer<typeof OptimizeClauseInputSchema>;

export function ClauseOptimizer() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<OptimizeClauseOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<OptimizeClauseInput>({
    resolver: zodResolver(OptimizeClauseInputSchema),
    defaultValues: {
      trustType: '',
      assetType: '',
      specificNeeds: '',
      existingClause: '',
    },
  });

  const onSubmit: SubmitHandler<OptimizeClauseInput> = async (data) => {
    setIsLoading(true);
    setResult(null);

    const { data: optimizationResult, error } = await handleOptimizeClause(data);
    
    setIsLoading(false);

    if (error) {
      toast({
        variant: 'destructive',
        title: 'Optimization Failed',
        description: error,
      });
      return;
    }

    setResult(optimizationResult);
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Clause Optimizer</CardTitle>
          <CardDescription>
            Leverage AI to craft and refine legally-sound clauses for your trust. Fill in the details below to get a customized suggestion.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="trustType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Trust Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a trust type..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Revocable Living Trust">Revocable Living Trust</SelectItem>
                          <SelectItem value="Irrevocable Trust">Irrevocable Trust</SelectItem>
                          <SelectItem value="Special Needs Trust">Special Needs Trust</SelectItem>
                          <SelectItem value="Charitable Trust">Charitable Trust</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="assetType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Primary Asset Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select an asset type..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Real Estate">Real Estate</SelectItem>
                          <SelectItem value="Stocks and Investments">Stocks and Investments</SelectItem>
                          <SelectItem value="Digital Assets (Crypto, NFTs)">Digital Assets (Crypto, NFTs)</SelectItem>
                          <SelectItem value="Family Business">Family Business</SelectItem>
                          <SelectItem value="Mixed Assets">Mixed Assets</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="specificNeeds"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Specific Needs or Goals</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., Provide for a child with special needs, protect assets from creditors, ensure my digital art is passed to my niece..."
                        {...field}
                        rows={4}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="existingClause"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Existing Clause to Optimize (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Paste an existing clause here if you want to improve it."
                        {...field}
                        rows={4}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={isLoading} className="w-full sm:w-auto bg-accent text-accent-foreground hover:bg-accent/90">
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="mr-2 h-4 w-4" />
                )}
                Optimize Clause
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {isLoading && <OptimizationResultSkeleton />}
      {result && <OptimizationResult result={result} />}
    </div>
  );
}

function OptimizationResultSkeleton() {
  return (
    <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary"/> Optimized Clause
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-primary"/> Explanation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </CardContent>
        </Card>
      </div>
  )
}

function OptimizationResult({ result }: { result: OptimizeClauseOutput }) {
  return (
    <div className="space-y-8 animate-in fade-in-50 duration-500">
      <Card className="bg-primary/5 border-primary/20">
        <CardHeader>
          <CardTitle className="font-headline flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary"/>
            Optimized Clause
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="whitespace-pre-wrap leading-relaxed">{result.optimizedClause}</p>
        </CardContent>
      </Card>
      <Card className="bg-primary/5 border-primary/20">
        <CardHeader>
          <CardTitle className="font-headline flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-primary"/>
            Explanation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="whitespace-pre-wrap leading-relaxed">{result.explanation}</p>
        </CardContent>
      </Card>
    </div>
  )
}
