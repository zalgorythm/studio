const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  const oracleFactory = await hre.ethers.getContractFactory("DecentralizedOracle");
  const oracle = await oracleFactory.deploy();
  await oracle.waitForDeployment();

  console.log("DecentralizedOracle deployed to:", await oracle.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
