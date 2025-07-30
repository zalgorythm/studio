# Decentralized Oracle and Smart Trust Contract

This project implements a decentralized oracle and a Smart Trust contract. The DecentralizedOracle contract allows for secure monitoring of real-world events by trusted sources. Once an event is verified, it triggers the Smart Trust Contract to execute distributions to beneficiaries.

## Contracts

*   **DecentralizedOracle.sol:** This contract manages the verification of real-world events. It allows authorized sources to report events, and the contract owner to verify them.
*   **SmartTrust.sol:** This contract manages the distribution of funds to a beneficiary upon the verification of a specific event by the DecentralizedOracle.

## Scripts

*   **deploy.js:** This script deploys both the DecentralizedOracle and SmartTrust contracts to a Hardhat network.

## Tests

*   **test.js:** This file contains tests for the SmartTrust contract, ensuring that the distribution is triggered correctly after event verification.

## Prettier Configuration

*   **.prettierrc.json:** Configuration file for code formatting using Prettier.

