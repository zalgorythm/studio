'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ContractService from '@/contracts/contractService';

export default function TestContracts() {
  const [isConnected, setIsConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [contractInfo, setContractInfo] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const contractService = ContractService.getInstance();

  useEffect(() => {
    const init = async () => {
      try {
        await contractService.init();
        setIsConnected(contractService.isConnected());
      } catch (err) {
        setError('Failed to initialize contract service');
        console.error(err);
      }
    };
    
    init();
  }, []);

  const connectWallet = async () => {
    setConnecting(true);
    setError(null);
    try {
      const connected = await contractService.connectWallet();
      setIsConnected(connected);
      
      if (!connected) {
        setError('Failed to connect wallet');
      }
    } catch (err) {
      setError('Error connecting wallet');
      console.error(err);
    } finally {
      setConnecting(false);
    }
  };

  const testContractConnection = async () => {
    try {
      // Test getting contract instances
      const decentralizedOracle = contractService.getDecentralizedOracle();
      const smartTrustFactory = contractService.getSmartTrustFactory();
      const trust = contractService.getTrust();
      const beneficiaryManager = contractService.getBeneficiaryManager();
      const timelock = contractService.getTimelock();

      setContractInfo({
        decentralizedOracle: decentralizedOracle ? 'Connected' : 'Not Available',
        smartTrustFactory: smartTrustFactory ? 'Connected' : 'Not Available',
        trust: trust ? 'Connected' : 'Not Available',
        beneficiaryManager: beneficiaryManager ? 'Connected' : 'Not Available',
        timelock: timelock ? 'Connected' : 'Not Available'
      });
    } catch (err) {
      setError('Error testing contract connection');
      console.error(err);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Contract Connection Test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col space-y-4">
            {!isConnected ? (
              <Button onClick={connectWallet} disabled={connecting}>
                {connecting ? "Connecting..." : "Connect Wallet"}
              </Button>
            ) : (
              <div className="space-y-4">
                <Button onClick={testContractConnection}>
                  Test Contract Connection
                </Button>
                {contractInfo && (
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold">Contract Status:</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Decentralized Oracle: {contractInfo.decentralizedOracle}</li>
                      <li>Smart Trust Factory: {contractInfo.smartTrustFactory}</li>
                      <li>Trust: {contractInfo.trust}</li>
                      <li>Beneficiary Manager: {contractInfo.beneficiaryManager}</li>
                      <li>Timelock: {contractInfo.timelock}</li>
                    </ul>
                  </div>
                )}
              </div>
            )}
            
            {error && (
              <div className="text-red-500 bg-red-50 p-3 rounded">
                Error: {error}
              </div>
            )}
            
            <div className="text-sm text-muted-foreground">
              <p>Make sure you have:</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>MetaMask or another Ethereum wallet installed</li>
                <li>Connected to the Sepolia testnet</li>
                <li>Some Sepolia ETH in your wallet</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
