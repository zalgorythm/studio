'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import ContractService from '@/contracts/contractService';

const ethAddressSchema = z.string().regex(/^0x[a-fA-F0-9]{40}$/, {
  message: "Invalid Ethereum address",
});

const createTrustSchema = z.object({
  beneficiary: ethAddressSchema,
  terms: z.string().min(1, { message: "Terms are required" }),
});

const addAssetSchema = z.object({
  assetDescription: z.string().min(1, { message: "Description is required" }),
  assetValue: z.coerce.number().positive({ message: "Value must be positive" }),
});

const addBeneficiarySchema = z.object({
  beneficiaryAddress: ethAddressSchema,
  beneficiaryName: z.string().min(1, { message: "Name is required" }),
  sharePercentage: z.coerce.number().int().min(1).max(100, { message: "Percentage must be between 1 and 100" }),
});

export function ContractInteraction() {
  const { toast } = useToast();
  const [isConnected, setIsConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [contractInfo, setContractInfo] = useState({
    assetCount: 0,
    beneficiaryCount: 0
  });
  const [deployedTrusts, setDeployedTrusts] = useState<string[]>([]);
  const [selectedTrust, setSelectedTrust] = useState<string>('');

  const contractService = ContractService.getInstance();

  const createTrustForm = useForm<z.infer<typeof createTrustSchema>>({
    resolver: zodResolver(createTrustSchema),
    defaultValues: { beneficiary: '', terms: '' },
  });

  const addAssetForm = useForm<z.infer<typeof addAssetSchema>>({
    resolver: zodResolver(addAssetSchema),
    defaultValues: { assetDescription: '', assetValue: 0 },
  });

  const addBeneficiaryForm = useForm<z.infer<typeof addBeneficiarySchema>>({
    resolver: zodResolver(addBeneficiarySchema),
    defaultValues: { beneficiaryAddress: '', beneficiaryName: '', sharePercentage: 0 },
  });

  useEffect(() => {
    const init = async () => {
      await contractService.init();
      setIsConnected(contractService.isConnected());
      if (contractService.isConnected()) {
        fetchDeployedTrusts();
      }
    };
    
    init();
  }, []);

  useEffect(() => {
    if (selectedTrust) {
      refreshContractInfo();
    }
  }, [selectedTrust]);

  const fetchDeployedTrusts = async () => {
    const trusts = await contractService.getDeployedTrusts();
    if (trusts) {
      setDeployedTrusts(trusts);
      if (trusts.length > 0) {
        setSelectedTrust(trusts[0]);
      }
    }
  };

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
        fetchDeployedTrusts();
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

  const handleCreateTrust = async (data: z.infer<typeof createTrustSchema>) => {
    try {
      const txHash = await contractService.createTrust(data.beneficiary, data.terms);
      
      if (txHash) {
        toast({
          title: "Trust Created",
          description: `Transaction hash: ${txHash.substring(0, 20)}...`,
        });
        fetchDeployedTrusts();
        createTrustForm.reset();
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

  const handleAddAsset = async (data: z.infer<typeof addAssetSchema>) => {
    if (!selectedTrust) {
      toast({
        title: "No Trust Selected",
        description: "Please select a trust to add an asset to.",
        variant: "destructive",
      });
      return;
    }
    try {
      const txHash = await contractService.addAsset(selectedTrust, data.assetDescription, data.assetValue);
      
      if (txHash) {
        toast({
          title: "Asset Added",
          description: `Transaction hash: ${txHash.substring(0, 20)}...`,
        });
        
        refreshContractInfo();
        addAssetForm.reset();
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

  const handleAddBeneficiary = async (data: z.infer<typeof addBeneficiarySchema>) => {
    if (!selectedTrust) {
      toast({
        title: "No Trust Selected",
        description: "Please select a trust to add a beneficiary to.",
        variant: "destructive",
      });
      return;
    }
    try {
      const txHash = await contractService.addBeneficiary(
        selectedTrust,
        data.beneficiaryAddress,
        data.beneficiaryName,
        data.sharePercentage
      );
      
      if (txHash) {
        toast({
          title: "Beneficiary Added",
          description: `Transaction hash: ${txHash.substring(0, 20)}...`,
        });
        
        refreshContractInfo();
        addBeneficiaryForm.reset();
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
    if (!selectedTrust) return;
    const assetCount = await contractService.getAssetCount(selectedTrust);
    const beneficiaryCount = await contractService.getBeneficiaryCount(selectedTrust);
    
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
                <CardContent>
                  <Form {...createTrustForm}>
                    <form onSubmit={createTrustForm.handleSubmit(handleCreateTrust)} className="space-y-4">
                      <FormField
                        control={createTrustForm.control}
                        name="beneficiary"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Beneficiary Address</FormLabel>
                            <FormControl>
                              <Input placeholder="0x..." {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={createTrustForm.control}
                        name="terms"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Trust Terms</FormLabel>
                            <FormControl>
                              <Textarea placeholder="Enter the terms of the trust..." {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button type="submit">Create Trust</Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
              
              {deployedTrusts.length > 0 && (
                <div className="space-y-2">
                  <Label htmlFor="selectedTrust">Select a Trust</Label>
                  <select
                    id="selectedTrust"
                    value={selectedTrust}
                    onChange={(e) => setSelectedTrust(e.target.value)}
                    className="w-full p-2 border rounded"
                  >
                    {deployedTrusts.map((trust) => (
                      <option key={trust} value={trust}>
                        {trust}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <Card>
                <CardHeader>
                  <CardTitle>Trust Management</CardTitle>
                  <CardDescription>
                    Selected Trust: {selectedTrust ? `${selectedTrust.substring(0, 10)}...` : 'None'}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Add Asset Form */}
                  <Form {...addAssetForm}>
                    <form onSubmit={addAssetForm.handleSubmit(handleAddAsset)} className="space-y-4">
                      <FormField
                        control={addAssetForm.control}
                        name="assetDescription"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Asset Description</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., Real Estate" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={addAssetForm.control}
                        name="assetValue"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Asset Value (ETH)</FormLabel>
                            <FormControl>
                              <Input type="number" placeholder="0.5" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button type="submit">Add Asset</Button>
                    </form>
                  </Form>

                  {/* Add Beneficiary Form */}
                  <Form {...addBeneficiaryForm}>
                    <form onSubmit={addBeneficiaryForm.handleSubmit(handleAddBeneficiary)} className="space-y-4 pt-4 border-t mt-4">
                      <FormField
                        control={addBeneficiaryForm.control}
                        name="beneficiaryAddress"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Beneficiary Address</FormLabel>
                            <FormControl>
                              <Input placeholder="0x..." {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={addBeneficiaryForm.control}
                        name="beneficiaryName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Beneficiary Name</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., Alice" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={addBeneficiaryForm.control}
                        name="sharePercentage"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Share Percentage</FormLabel>
                            <FormControl>
                              <Input type="number" placeholder="50" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button type="submit">Add Beneficiary</Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
