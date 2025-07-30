const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  console.log("Deploying Timelock contract with the account:", deployer.address);

  // Example beneficiary address (using deployer address for simplicity)
  const beneficiaryAddress = deployer.address;
  
  // Release in 60 seconds
  const releaseTime = Math.floor(Date.now() / 1000) + 60;

  const factory = await hre.ethers.getContractFactory("contracts/ContractAlchemyProject-4/contracts/Timelock.sol:Timelock");
  const timelock = await factory.deploy(beneficiaryAddress, releaseTime);
  
  await timelock.waitForDeployment();

  console.log("Timelock deployed to:", await timelock.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
