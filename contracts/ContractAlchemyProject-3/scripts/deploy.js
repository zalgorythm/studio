// scripts/deploy.js

async function main() {
  const BeneficiaryManager = await hre.ethers.getContractFactory("BeneficiaryManager");
  const beneficiaryManager = await BeneficiaryManager.deploy();

  await beneficiaryManager.deployed();

  console.log("BeneficiaryManager deployed to:", beneficiaryManager.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.  
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
