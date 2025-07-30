// scripts/deploy.js

const hre = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  const Trust = await hre.ethers.getContractFactory("Trust");
  const trusteeAddress = deployer.address; // Use deployer as trustee for simplicity
  const oracleAddress = "0xf39Fd6e51aad88F6F4ce6aB88295aF40E651c271"; // Replace with actual oracle address
  const trigger = 1; // Specific Date
  const triggerTimestamp = Math.floor(Date.now() / 1000) + 86400; // Tomorrow

  const trust = await Trust.deploy(trusteeAddress, oracleAddress, trigger, triggerTimestamp);

  await trust.deployed();

  console.log("Trust deployed to:", trust.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
