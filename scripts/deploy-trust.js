const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  console.log("Deploying Trust contract with the account:", deployer.address);

  // Use deployer as trustee for simplicity
  const trusteeAddress = deployer.address;
  
  // Use the DecentralizedOracle address we deployed earlier
  const oracleAddress = "0x8721429BF696B0052F8247DAE704CCf0BE3aDA64";
  
  // Trigger type (1 = SPECIFIC_DATE)
  const trigger = 1;
  
  // Tomorrow's timestamp
  const triggerTimestamp = Math.floor(Date.now() / 1000) + 86400;

  const trustFactory = await hre.ethers.getContractFactory("contracts/ContractAlchemyProject-1/contracts/Trust.sol:Trust");
  const trust = await trustFactory.deploy(trusteeAddress, oracleAddress, trigger, triggerTimestamp);
  
  await trust.waitForDeployment();

  console.log("Trust deployed to:", await trust.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
