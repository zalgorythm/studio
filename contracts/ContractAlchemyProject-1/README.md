# Individual Trust Smart Contract

This project implements a Solidity smart contract for managing an individual trust. It allows a trustee to add assets and beneficiaries, and executes the distribution of assets based on predefined triggers.

## Features

-   **Asset Management:** Adding and managing assets within the trust.
-   **Beneficiary Management:** Defining beneficiaries and their share percentages.
-   **Distribution Triggers:** Configurable triggers for asset distribution (Death, Specific Date, Oracle Trigger).
-   **Role-Based Access Control:** Restricting access to functions based on roles (trustee, oracle).
-   **Event Emission:** Emitting events for key actions such as asset addition, beneficiary addition, and distribution.

## Getting Started

1.  Clone the repository.
2.  Install dependencies: `npm install`
3.  Compile the contract: `npx hardhat compile`
4.  Run the tests: `npx hardhat test`
5.  Deploy the contract: `npx hardhat run scripts/deploy.js --network <network>`

## Contract Details

-   **Trustee:** The address authorized to manage the trust (add assets, beneficiaries).
-   **Oracle:** The address authorized to trigger the distribution based on external events.
-   **DistributionTrigger:** An enum defining the types of triggers (DEATH, SPECIFIC_DATE, ORACLE_TRIGGER).
