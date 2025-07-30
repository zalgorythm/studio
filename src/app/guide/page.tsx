'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Guide() {
  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Smart Contract Interaction Guide</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Getting Started</h2>
            <p>
              This guide will help you interact with the deployed smart contracts on the Sepolia testnet.
            </p>
            
            <h3 className="text-lg font-semibold">Prerequisites</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>MetaMask or another Ethereum wallet installed</li>
              <li>Connected to the Sepolia testnet</li>
              <li>Some Sepolia ETH in your wallet (get it from a faucet)</li>
            </ul>
            
            <h3 className="text-lg font-semibold">How to Use</h3>
            <ol className="list-decimal pl-5 space-y-2">
              <li>
                Navigate to the <Link href="/" className="text-primary hover:underline">main page</Link> and click "Connect Wallet"
              </li>
              <li>Connect your wallet to the Sepolia testnet</li>
              <li>Use the contract interaction panel to:
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>Create a new trust</li>
                  <li>Add assets to your trust</li>
                  <li>Add beneficiaries to your trust</li>
                  <li>View contract information</li>
                </ul>
              </li>
            </ol>
            
            <h3 className="text-lg font-semibold">Deployed Contracts</h3>
            <p>
              The following contracts have been deployed to the Sepolia testnet:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Smart Trust Factory</li>
              <li>Smart Trust Contract</li>
              <li>Oracle Trigger Contract</li>
              <li>Beneficiary Registry</li>
              <li>Time-lock Contract</li>
            </ul>
            
            <h3 className="text-lg font-semibold">Testing Contract Connections</h3>
            <p>
              You can test the contract connections directly by visiting the{" "}
              <Link href="/test-contracts" className="text-primary hover:underline">
                test contracts page
              </Link>
              .
            </p>
            
            <div className="flex gap-4 pt-4">
              <Button asChild>
                <Link href="/">Go to Main Page</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/test-contracts">Test Contracts</Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
