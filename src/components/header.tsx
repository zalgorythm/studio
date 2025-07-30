import { Scale } from 'lucide-react';

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex items-center gap-2 h-16">
        <Scale className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold text-foreground font-headline">
          TrustWise
        </h1>
      </div>
    </header>
  );
}
