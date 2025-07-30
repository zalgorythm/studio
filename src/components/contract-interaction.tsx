'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import ContractService from '@/contracts/contractService';

export function ContractInteraction() {
  const { toast } = useToast();
  const [isConnected, setIsConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [trustData, setTrustData] = useState({
    beneficiary: '',
    terms: '',
    assetDescription: '',
    assetValue: 0,
    beneficiaryAddress: '',
    beneficiaryName: '',
    sharePercentage: 0
  });
  const [contractInfo, setContractInfo] = useState({
    assetCount: 0,
    beneficiaryCount: 0
  });

  const contractService = ContractService.getInstance();

  useEffect(() => {
    const init = async () => {
      await contractService.init();
      setIsConnected(contractService.isConnected());
    };
    
    init();
  }, []);

  const connectWallet = async () => {
    setConnecting(true);
    try {
      const connected = await contractService.connectWallet();
      setIsConnected(connected);
      
      if (connected) {
        toast({
          title: "Wallet Connected",
          description: "You have successfully connected your wallet.",
        });
      } else {
        toast({
          title: "Connection Failed",
          description: "Failed to connect wallet. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Connection Error",
        description: "An error occurred while connecting your wallet.",
        variant: "destructive",
      });
    } finally {
      setConnecting(false);
    }
  };

  const handleCreateTrust = async () => {
    try {
      const txHash = await contractService.createTrust(trustData.beneficiary, trustData.terms);
      
      if (txHash) {
        toast({
          title: "Trust Created",
          description: `Transaction hash: ${txHash.substring(0, 20)}...`,
        });
      } else {
        toast({
          title: "Creation Failed",
          description: "Failed to create trust.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Creation Error",
        description: "An error occurred while creating the trust.",
        variant: "destructive",
      });
    }
  };

  const handleAddAsset = async () => {
    try {
      const txHash = await contractService.addAsset(trustData.assetDescription, trustData.assetValue);
      
      if (txHash) {
        toast({
          title: "Asset Added",
          description: `Transaction hash: ${txHash.substring(0, 20)}...`,
        });
        
        // Refresh contract info
        refreshContractInfo();
      } else {
        toast({
          title: "Add Asset Failed",
          description: "Failed to add asset.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Add Asset Error",
        description: "An error occurred while adding the asset.",
        variant: "destructive",
      });
    }
  };

  const handleAddBeneficiary = async () => {
    try {
      const txHash = await contractService.addBeneficiary(
        trustData.beneficiaryAddress, 
        trustData.beneficiaryName, 
        trustData.sharePercentage
      );
      
      if (txHash) {
        toast({
          title: "Beneficiary Added",
          description: `Transaction hash: ${txHash.substring(0, 20)}...`,
        });
        
        // Refresh contract info
        refreshContractInfo();
      } else {
        toast({
          title: "Add Beneficiary Failed",
          description: "Failed to add beneficiary.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Add Beneficiary Error",
        description: "An error occurred while adding the beneficiary.",
        variant: "destructive",
      });
    }
  };

  const refreshContractInfo = async () => {
    const assetCount = await contractService.getAssetCount();
    const beneficiaryCount = await contractService.getBeneficiaryCount();
    
    setContractInfo({
      assetCount: assetCount || 0,
      beneficiaryCount: beneficiaryCount || 0
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Contract Interaction</CardTitle>
        <CardDescription>
          Connect your wallet and interact with the deployed smart contracts.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {!isConnected ? (
          <div className="flex flex-col items-center justify-center space-y-4">
            <Button onClick={connectWallet} disabled={connecting}>
              {connecting ? "Connecting..." : "Connect Wallet"}
            </Button>
            <p className="text-sm text-muted-foreground">
              Connect your wallet to interact with the smart contracts.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Create Trust</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="beneficiary">Beneficiary Address</Label>
                    <Input
                      id="beneficiary"
                      value={trustData.beneficiary}
                      onChange={(e) => setTrustData({...trustData, beneficiary: e.target.value})}
                      placeholder="0x..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="terms">Trust Terms</Label>
                    <Textarea
                      id="terms"
                      value={trustData.terms}
                      onChange={(e) => setTrustData({...trustData, terms: e.target.value})}
                      placeholder="Enter the terms of the trust..."
                    />
                  </div>
                  <Button onClick={handleCreateTrust}>Create Trust</Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Add Asset</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="assetDescription">Asset Description</Label>
                    <Input
                      id="assetDescription"
                      value={trustData.assetDescription}
                      onChange={(e) => setTrustData({...trustData, assetDescription: e.target.value})}
                      placeholder="e.g., Bitcoin, Real Estate, etc."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="assetValue">Asset Value</Label>
                    <Input
                      id="assetValue"
                      type="number"
                      value={trustData.assetValue}
                      onChange={(e) => setTrustData({...trustData, assetValue: Number(e.target.value)})}
                      placeholder="Enter asset value"
                    />
                  </div>
                  <Button onClick={handleAddAsset}>Add Asset</Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Add Beneficiary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="beneficiaryAddress">Beneficiary Address</Label>
                    <Input
                      id="beneficiaryAddress"
                      value={trustData.beneficiaryAddress}
                      onChange={(e) => setTrustData({...trustData, beneficiaryAddress: e.target.value})}
                      placeholder="0x..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="beneficiaryName">Beneficiary Name</Label>
                    <Input
                      id="beneficiaryName"
                      value={trustData.beneficiaryName}
                      onChange={(e) => setTrustData({...trustData, beneficiaryName: e.target.value})}
                      placeholder="Enter beneficiary name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sharePercentage">Share Percentage</Label>
                    <Input
                      id="sharePercentage"
                      type="number"
                      value={trustData.sharePercentage}
                      onChange={(e) => setTrustData({...trustData, sharePercentage: Number(e.target.value)})}
                      placeholder="Enter share percentage"
                    />
                  </div>
                  <Button onClick={handleAddBeneficiary}>Add Beneficiary</Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Contract Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Asset Count</Label>
                    <div className="text-2xl font-bold">{contractInfo.assetCount}</div>
                  </div>
                  <div className="space-y-2">
                    <Label>Beneficiary Count</Label>
                    <div className="text-2xl font-bold">{contractInfo.beneficiaryCount}</div>
                  </div>
                  <Button onClick={refreshContractInfo}>Refresh Info</Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
