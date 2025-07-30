import { Scale } from 'lucide-react';
import Link from 'next/link';

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex items-center justify-between h-16">
        <div className="flex items-center gap-2">
          <Scale className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold text-foreground font-headline">
            TrustWise
          </h1>
        </div>
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/" className="text-sm font-medium hover:underline underline-offset-4">
            Home
          </Link>
          <Link href="/guide" className="text-sm font-medium hover:underline underline-offset-4">
            Guide
          </Link>
          <Link href="/test-contracts" className="text-sm font-medium hover:underline underline-offset-4">
            Test
          </Link>
        </nav>
      </div>
    </header>
  );
}
