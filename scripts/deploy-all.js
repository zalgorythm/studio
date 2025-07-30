const hre = require("hardhat");
const { parseUnits } = require("ethers");
const keccak256 = require('keccak256');

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  console.log("Deploying all contracts with the account:", deployer.address);
  console.log("");

  // Deploy DecentralizedOracle
  console.log("Deploying DecentralizedOracle...");
  const oracleFactory = await hre.ethers.getContractFactory("contracts/ContractAlchemyProject-2/contracts/DecentralizedOracle.sol:DecentralizedOracle");
  const oracle = await oracleFactory.deploy();
  await oracle.waitForDeployment();
  const oracleAddress = await oracle.getAddress();
  console.log("DecentralizedOracle deployed to:", oracleAddress);
  console.log("");

  // Deploy SmartTrust
  console.log("Deploying SmartTrust...");
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
  const trustAddress = await trust.getAddress();
  console.log("SmartTrust deployed to:", trustAddress);
  console.log("Event Hash:", eventHash);
  console.log("");

  // Deploy SmartTrustFactory
  console.log("Deploying SmartTrustFactory...");
  const factoryFactory = await hre.ethers.getContractFactory("contracts/ContractAlchemyProject/contracts/SmartTrustFactory.sol:SmartTrustFactory");
  const smartTrustFactory = await factoryFactory.deploy();
  await smartTrustFactory.waitForDeployment();
  const smartTrustFactoryAddress = await smartTrustFactory.getAddress();
  console.log("SmartTrustFactory deployed to:", smartTrustFactoryAddress);
  console.log("");

  // Deploy Trust
  console.log("Deploying Trust...");
  const trusteeAddress = deployer.address;
  const trigger = 1; // SPECIFIC_DATE
  const triggerTimestamp = Math.floor(Date.now() / 1000) + 86400; // Tomorrow
  const trustContractFactory = await hre.ethers.getContractFactory("contracts/ContractAlchemyProject-1/contracts/Trust.sol:Trust");
  const trustContract = await trustContractFactory.deploy(trusteeAddress, oracleAddress, trigger, triggerTimestamp);
  await trustContract.waitForDeployment();
  const trustContractAddress = await trustContract.getAddress();
  console.log("Trust deployed to:", trustContractAddress);
  console.log("");

  // Deploy BeneficiaryManager
  console.log("Deploying BeneficiaryManager...");
  const beneficiaryManagerFactory = await hre.ethers.getContractFactory("contracts/ContractAlchemyProject-3/contracts/BeneficiaryManager.sol:BeneficiaryManager");
  const beneficiaryManager = await beneficiaryManagerFactory.deploy();
  await beneficiaryManager.waitForDeployment();
  const beneficiaryManagerAddress = await beneficiaryManager.getAddress();
  console.log("BeneficiaryManager deployed to:", beneficiaryManagerAddress);
  console.log("");

  // Deploy Timelock
  console.log("Deploying Timelock...");
  const timelockBeneficiaryAddress = deployer.address;
  const releaseTime = Math.floor(Date.now() / 1000) + 60; // Release in 60 seconds
  const timelockFactory = await hre.ethers.getContractFactory("contracts/ContractAlchemyProject-4/contracts/Timelock.sol:Timelock");
  const timelock = await timelockFactory.deploy(timelockBeneficiaryAddress, releaseTime);
  await timelock.waitForDeployment();
  const timelockAddress = await timelock.getAddress();
  console.log("Timelock deployed to:", timelockAddress);
  console.log("");

  // Summary
  console.log("=====================================");
  console.log("All contracts deployed successfully!");
  console.log("=====================================");
  console.log("DecentralizedOracle:", oracleAddress);
  console.log("SmartTrust:", trustAddress);
  console.log("SmartTrustFactory:", smartTrustFactoryAddress);
  console.log("Trust:", trustContractAddress);
  console.log("BeneficiaryManager:", beneficiaryManagerAddress);
  console.log("Timelock:", timelockAddress);
  console.log("=====================================");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
