const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  console.log("Deploying SmartTrustFactory contract with the account:", deployer.address);

  const factory = await hre.ethers.getContractFactory("contracts/ContractAlchemyProject/contracts/SmartTrustFactory.sol:SmartTrustFactory");
  const smartTrustFactory = await factory.deploy();
  
  await smartTrustFactory.waitForDeployment();

  console.log("SmartTrustFactory deployed to:", await smartTrustFactory.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
