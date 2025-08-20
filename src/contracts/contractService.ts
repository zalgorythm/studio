'use client';

import { ethers } from 'ethers';
import { CONTRACT_ADDRESSES } from './addresses';

// Import contract ABIs
import DecentralizedOracleABI from './abis/DecentralizedOracle.json';
import TrustABI from './abis/Trust.json';
import BeneficiaryManagerABI from './abis/BeneficiaryManager.json';
import TimelockABI from './abis/Timelock.json';
import SmartTrustFactoryABI from './abis/SmartTrustFactory.json';

// Extend the Window interface to include ethereum
declare global {
  interface Window {
    ethereum: any;
  }
}

// Type definitions
interface ContractInfo {
  abi: any;
  address: string;
}

interface Contracts {
  decentralizedOracle: ethers.Contract | null;
  smartTrust: ethers.Contract | null;
  beneficiaryManager: ethers.Contract | null;
  timelock: ethers.Contract | null;
  smartTrustFactory: ethers.Contract | null;
}

class ContractService {
  private static instance: ContractService;
  private provider: ethers.BrowserProvider | null = null;
  private signer: ethers.Signer | null = null;
  private contracts: Contracts = {
    decentralizedOracle: null,
    smartTrust: null,
    beneficiaryManager: null,
    timelock: null,
    smartTrustFactory: null
  };

  private constructor() {}

  public static getInstance(): ContractService {
    if (!ContractService.instance) {
      ContractService.instance = new ContractService();
    }
    return ContractService.instance;
  }

  public async init(): Promise<void> {
    if (typeof window !== 'undefined' && window.ethereum) {
      this.provider = new ethers.BrowserProvider(window.ethereum);
      this.signer = await this.provider.getSigner();
      this.initializeContracts();
    } else {
      console.warn('Ethereum provider not found. Please install MetaMask or another wallet.');
    }
  }

  private initializeContracts(): void {
    if (!this.signer) return;

    this.contracts.decentralizedOracle = new ethers.Contract(
      CONTRACT_ADDRESSES.DecentralizedOracle,
      DecentralizedOracleABI,
      this.signer
    );

    this.contracts.smartTrustFactory = new ethers.Contract(
      CONTRACT_ADDRESSES.SmartTrustFactory,
      SmartTrustFactoryABI,
      this.signer
    );

    this.contracts.beneficiaryManager = new ethers.Contract(
      CONTRACT_ADDRESSES.BeneficiaryManager,
      BeneficiaryManagerABI,
      this.signer
    );

    this.contracts.timelock = new ethers.Contract(
      CONTRACT_ADDRESSES.Timelock,
      TimelockABI,
      this.signer
    );

    // Initialize the main Trust contract
    this.contracts.smartTrust = new ethers.Contract(
      CONTRACT_ADDRESSES.Trust,
      TrustABI,
      this.signer
    );
  }

  public async connectWallet(): Promise<boolean> {
    if (typeof window !== 'undefined' && window.ethereum) {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        this.provider = new ethers.BrowserProvider(window.ethereum);
        this.signer = await this.provider.getSigner();
        this.initializeContracts();
        return true;
      } catch (error) {
        console.error('User denied account access', error);
        return false;
      }
    } else {
      console.error('Ethereum provider not found. Please install MetaMask.');
      return false;
    }
  }

  public isConnected(): boolean {
    return this.signer !== null;
  }

  public getSigner(): ethers.Signer | null {
    return this.signer;
  }

  // Contract getter methods
  public getDecentralizedOracle(): ethers.Contract | null {
    return this.contracts.decentralizedOracle;
  }

  public getSmartTrustFactory(): ethers.Contract | null {
    return this.contracts.smartTrustFactory;
  }

  public getTrust(): ethers.Contract | null {
    return this.contracts.smartTrust;
  }

  public getTrustContract(address: string): ethers.Contract | null {
    if (!this.signer) return null;
    return new ethers.Contract(address, TrustABI, this.signer);
  }

  public getBeneficiaryManager(): ethers.Contract | null {
    return this.contracts.beneficiaryManager;
  }

  public getTimelock(): ethers.Contract | null {
    return this.contracts.timelock;
  }

  // Example contract interaction methods
  public async createTrust(beneficiary: string, terms: string): Promise<string | null> {
    if (!this.contracts.smartTrustFactory) {
      console.error('SmartTrustFactory contract not initialized');
      return null;
    }

    try {
      // The factory creates a new SmartTrust contract (ERC721 version)
      const tx = await this.contracts.smartTrustFactory.createTrustContract();
      const receipt = await tx.wait();

      // Find the event log for TrustDeployed to get the new contract address
      const event = receipt.logs.find((log: any) => log.fragment.name === 'TrustDeployed');
      const newTrustAddress = event?.args[0];

      if (!newTrustAddress) {
        throw new Error("Could not find new trust address in transaction receipt");
      }

      // This is the ABI for the ERC721 SmartTrust contract created by the factory
      const ERC721SmartTrustABI = [
        {
          "inputs": [
            { "internalType": "address", "name": "_beneficiary", "type": "address" },
            { "internalType": "string", "name": "_terms", "type": "string" }
          ],
          "name": "createTrust",
          "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ],
          "stateMutability": "nonpayable",
          "type": "function"
        }
      ];

      // Now, create an instance of the new SmartTrust contract
      const newTrustContract = new ethers.Contract(
        newTrustAddress,
        ERC721SmartTrustABI,
        this.signer
      );

      // Call the createTrust function on the new SmartTrust contract
      const trustTx = await newTrustContract.createTrust(beneficiary, terms);
      const trustReceipt = await trustTx.wait();

      return trustReceipt.hash;
    } catch (error) {
      console.error('Error creating trust:', error);
      return null;
    }
  }

  public async addAsset(trustAddress: string, description: string, value: number): Promise<string | null> {
    const trustContract = this.getTrustContract(trustAddress);
    if (!trustContract) {
      console.error('Trust contract not initialized');
      return null;
    }

    try {
      const tx = await trustContract.addAsset(description, value);
      const receipt = await tx.wait();
      return receipt.hash;
    } catch (error) {
      console.error('Error adding asset:', error);
      return null;
    }
  }

  public async addBeneficiary(trustAddress: string, address: string, name: string, sharePercentage: number): Promise<string | null> {
    const trustContract = this.getTrustContract(trustAddress);
    if (!trustContract) {
      console.error('Trust contract not initialized');
      return null;
    }

    try {
      const tx = await trustContract.addBeneficiary(address, name, sharePercentage);
      const receipt = await tx.wait();
      return receipt.hash;
    } catch (error) {
      console.error('Error adding beneficiary:', error);
      return null;
    }
  }

  public async getTrustDetails(trustAddress: string, trustId: number): Promise<any> {
    const trustContract = this.getTrustContract(trustAddress);
    if (!trustContract) {
      console.error('Trust contract not initialized');
      return null;
    }

    try {
      const details = await trustContract.getTrustDetails(trustId);
      return {
        beneficiary: details[0],
        terms: details[1],
        isRevoked: details[2]
      };
    } catch (error) {
      console.error('Error getting trust details:', error);
      return null;
    }
  }

  public async getAssetCount(trustAddress: string): Promise<number | null> {
    const trustContract = this.getTrustContract(trustAddress);
    if (!trustContract) {
      console.error('Trust contract not initialized');
      return null;
    }

    try {
      const count = await trustContract.getAssetCount();
      return parseInt(count);
    } catch (error) {
      console.error('Error getting asset count:', error);
      return null;
    }
  }

  public async getBeneficiaryCount(trustAddress: string): Promise<number | null> {
    const trustContract = this.getTrustContract(trustAddress);
    if (!trustContract) {
      console.error('Trust contract not initialized');
      return null;
    }

    try {
      const count = await trustContract.getBeneficiaryCount();
      return parseInt(count);
    } catch (error) {
      console.error('Error getting beneficiary count:', error);
      return null;
    }
  }

  public async getDeployedTrusts(): Promise<string[] | null> {
    if (!this.contracts.smartTrustFactory) {
      console.error('SmartTrustFactory contract not initialized');
      return null;
    }

    try {
      const trusts = await this.contracts.smartTrustFactory.getDeployedTrusts();
      return trusts;
    } catch (error) {
      console.error('Error getting deployed trusts:', error);
      return null;
    }
  }
}

export default ContractService;
