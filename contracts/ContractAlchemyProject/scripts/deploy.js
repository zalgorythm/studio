// scripts/deploy.js
const hre = require("hardhat");

async function main() {
  const SmartTrustFactory = await hre.ethers.getContractFactory("SmartTrustFactory");
  const smartTrustFactory = await SmartTrustFactory.deploy();

  await smartTrustFactory.deployed();

  console.log("SmartTrustFactory deployed to:", smartTrustFactory.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });