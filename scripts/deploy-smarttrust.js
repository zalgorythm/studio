const hre = require("hardhat");
const { parseUnits } = require("ethers");
const keccak256 = require('keccak256');

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  console.log("Deploying SmartTrust contract with the account:", deployer.address);

  // Address of the deployed DecentralizedOracle contract
  const oracleAddress = "0x8721429BF696B0052F8247DAE704CCf0BE3aDA64";
  
  // Event description and hash
  const eventDescription = "Death Certificate Verification";
  const eventHash = '0x' + keccak256(eventDescription).toString('hex');

  const trustFactory = await hre.ethers.getContractFactory("contracts/ContractAlchemyProject-2/contracts/SmartTrust.sol:SmartTrust");
  
  const distributionAmount = parseUnits("100", 18);

  const trust = await trustFactory.deploy(
    oracleAddress,
    eventHash,
    deployer.address, // beneficiary
    distributionAmount,
    "TrustToken",
    "TRST"
  );
  
  await trust.waitForDeployment();

  console.log("SmartTrust deployed to:", await trust.getAddress());
  console.log("Event Hash:", eventHash);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
