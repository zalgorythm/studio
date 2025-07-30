'use client';

import { ClauseOptimizer } from '@/components/clause-optimizer';
import { TrustOverview } from '@/components/trust-overview';
import { Header } from '@/components/header';
import { SmartContracts } from '@/components/smart-contracts';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1 container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2 space-y-8">
            <ClauseOptimizer />
            <SmartContracts />
          </div>
          <div className="lg:col-span-1">
            <TrustOverview />
          </div>
        </div>
      </main>
    </div>
  );
}
