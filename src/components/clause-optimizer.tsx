'use client';

import { useState, useRef, useEffect } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Sparkles, Loader2, FileText, Lightbulb, Upload, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { handleOptimizeClause, handleGenerateSuggestions } from '@/app/actions';
import type { OptimizeClauseOutput } from '@/ai/flows/clause-optimizer';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';

const OptimizeClauseInputSchema = z.object({
  trustType: z.string().min(1, 'Please select a trust type.'),
  assetType: z.string().min(1, 'Please select an asset type.'),
  specificNeeds: z.string().min(10, 'Please describe your specific needs (min. 10 characters).'),
  existingClause: z.string().optional(),
  documentContent: z.string().optional(),
});
type OptimizeClauseInput = z.infer<typeof OptimizeClauseInputSchema>;

export function ClauseOptimizer() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<OptimizeClauseOutput | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isSuggestionsLoading, setIsSuggestionsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const form = useForm<OptimizeClauseInput>({
    resolver: zodResolver(OptimizeClauseInputSchema),
    defaultValues: {
      trustType: '',
      assetType: '',
      specificNeeds: '',
      existingClause: '',
      documentContent: '',
    },
  });

  const trustType = form.watch('trustType');
  const assetType = form.watch('assetType');

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (trustType || assetType) {
        setIsSuggestionsLoading(true);
        const { data } = await handleGenerateSuggestions({ trustType, assetType });
        if (data?.suggestions) {
          setSuggestions(data.suggestions);
        }
        setIsSuggestionsLoading(false);
      } else {
        setSuggestions([]);
      }
    };

    const debounceTimer = setTimeout(() => {
      fetchSuggestions();
    }, 500); // Debounce to avoid rapid firing

    return () => clearTimeout(debounceTimer);
  }, [trustType, assetType]);


  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type === 'text/plain') {
        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target?.result as string;
          form.setValue('documentContent', content);
          setFileName(file.name);
        };
        reader.readAsText(file);
      } else {
        toast({
          variant: 'destructive',
          title: 'Invalid File Type',
          description: 'Please upload a .txt file.',
        });
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    }
  };
  
  const handleRemoveFile = () => {
    form.setValue('documentContent', '');
    setFileName(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

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
            Leverage AI to craft and refine legally-sound clauses for your trust. Fill in the details below or upload an existing document to get a customized suggestion.
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
                        rows={3}
                      />
                    </FormControl>
                    <FormDescription>
                      Need inspiration? Select a trust and asset type, and we'll suggest some starting points.
                    </FormDescription>
                    <div className="pt-2">
                    {isSuggestionsLoading ? (
                      <div className="flex gap-2">
                        <Skeleton className="h-9 w-1/3" />
                        <Skeleton className="h-9 w-1/3" />
                        <Skeleton className="h-9 w-1/3" />
                      </div>
                    ) : (
                      suggestions.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {suggestions.map((suggestion, i) => (
                            <Button
                              key={i}
                              type="button"
                              variant="outline"
                              size="sm"
                              className="text-xs"
                              onClick={() => form.setValue('specificNeeds', suggestion, { shouldValidate: true })}
                            >
                              {suggestion}
                            </Button>
                          ))}
                        </div>
                      )
                    )}
                  </div>
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
                        rows={3}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormItem>
                  <FormLabel>Upload Existing Document (Optional, .txt only)</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type="file"
                        id="file-upload"
                        className="hidden"
                        accept=".txt"
                        onChange={handleFileChange}
                        ref={fileInputRef}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => document.getElementById('file-upload')?.click()}
                      >
                        <Upload className="mr-2 h-4 w-4" />
                        {fileName ? 'Replace Document' : 'Upload Document'}
                      </Button>
                      {fileName && (
                        <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                          <FileText className="h-4 w-4" />
                          <span>{fileName}</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={handleRemoveFile}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>

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
