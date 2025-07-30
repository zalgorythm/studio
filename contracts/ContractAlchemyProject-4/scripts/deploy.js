// scripts/deploy.js
const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  const balance = await deployer.getBalance();
  console.log("Account balance:", balance.toString());

  const beneficiaryAddress = "0xf39Fd6e51aad88F6F4ce6B88Ca59D6c31f03B8F"; // Example address
  const releaseTime = Math.floor(Date.now() / 1000) + 60; // Release in 60 seconds

  const Timelock = await hre.ethers.getContractFactory("Timelock");
  const timelock = await Timelock.deploy(beneficiaryAddress, releaseTime);

  await timelock.deployed();

  console.log("Timelock contract deployed to:", timelock.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });