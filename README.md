# TrustWise Smart Contracts Frontend

This project provides a frontend interface for interacting with the TrustWise smart contracts deployed on the Sepolia testnet.

## Project Structure

```
src/
├── app/                 # Next.js app directory
│   ├── page.tsx         # Main page
│   ├── guide/page.tsx   # User guide
│   └── test-contracts/  # Contract testing page
├── components/          # React components
│   ├── contract-interaction.tsx  # Main contract interaction component
│   ├── smart-contracts.tsx        # Smart contracts display component
│   └── header.tsx                 # Header component
├── contracts/           # Smart contract integration
│   ├── abis/            # Contract ABIs
│   ├── addresses.ts    # Deployed contract addresses
│   └── contractService.ts  # Contract service for interaction
└── lib/                 # Utility functions
```

## Smart Contracts

The following smart contracts have been deployed to the Sepolia testnet:

1. **DecentralizedOracle** - Monitors real-world events to trigger trust distributions
2. **SmartTrustFactory** - Factory for creating new Smart Trust contracts
3. **Trust** - Core trust contract for managing assets and beneficiaries
4. **BeneficiaryManager** - Manages beneficiary identities and wallet addresses
5. **Timelock** - Enforces time-based release conditions

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   PORT=8000 npm run dev
   ```

3. Visit `http://localhost:8000` in your browser

## Contract Interaction

The frontend provides several ways to interact with the deployed contracts:

1. **Main Page** - The contract interaction panel allows you to:
   - Connect your wallet
   - Create trusts
   - Add assets to trusts
   - Add beneficiaries to trusts
   - View contract information

2. **Test Page** - Visit `/test-contracts` to test the contract connections

3. **Guide** - Visit `/guide` for detailed instructions on using the platform

## Prerequisites

To interact with the contracts, you'll need:

1. MetaMask or another Ethereum wallet installed
2. Connected to the Sepolia testnet
3. Some Sepolia ETH in your wallet (get it from a faucet)

## Deployed Contract Addresses

The contract addresses are stored in `src/contracts/addresses.ts`:

- DecentralizedOracle: `0x8721429BF696B0052F8247DAE704CCf0BE3aDA64`
- SmartTrustFactory: `0x1b48eC3EB63333F19b9493556487833c04f1F429`
- Trust: `0xc6d4A6F1D277a75Cb164d47d1066553ef807007E`
- BeneficiaryManager: `0x774761eDdC7e13933E595a74Ca57d675a78Cb1B8`
- Timelock: `0x9f47135AB4d325461544Ffe1b3fC8DE751a0EBA1`

## Development

The contract service in `src/contracts/contractService.ts` provides methods for interacting with all deployed contracts. You can extend this service to add more functionality as needed.
