const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  console.log("Deploying BeneficiaryManager contract with the account:", deployer.address);

  const factory = await hre.ethers.getContractFactory("contracts/ContractAlchemyProject-3/contracts/BeneficiaryManager.sol:BeneficiaryManager");
  const beneficiaryManager = await factory.deploy();
  
  await beneficiaryManager.waitForDeployment();

  console.log("BeneficiaryManager deployed to:", await beneficiaryManager.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
