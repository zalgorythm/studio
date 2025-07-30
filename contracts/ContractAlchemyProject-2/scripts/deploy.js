// scripts/deploy.js
const hre = require("hardhat");
const { ethers } = require("hardhat");
const keccak256 = require('keccak256');

async function main() {
    const [deployer, trustedSource] = await ethers.getSigners();

    console.log("Deploying contracts with the account:", deployer.address);

    const oracleFactory = await hre.ethers.getContractFactory("DecentralizedOracle");
    const oracle = await oracleFactory.deploy();
    await oracle.waitForDeployment();

    console.log("DecentralizedOracle deployed to:", await oracle.getAddress());

    const eventDescription = "Death Certificate Verification";
    const eventHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(eventDescription));

    // Add a trusted source for the event
    await oracle.addTrustedSource(eventHash, trustedSource.address);

    const trustFactory = await hre.ethers.getContractFactory("SmartTrust");

    const initialSupply = ethers.utils.parseUnits("1000", 18);
    const distributionAmount = ethers.utils.parseUnits("100", 18);


    const trust = await trustFactory.deploy(
        oracle.getAddress(),
        eventHash,
        deployer.address, // beneficiary
        distributionAmount,
        "TrustToken",
        "TRST"
    );
    await trust.waitForDeployment();

    console.log("SmartTrust deployed to:", await trust.getAddress());

    console.log("Event Hash:", eventHash);

    //Verify the contracts
    try {
        await hre.run("verify:verify", {
            address: await oracle.getAddress(),
            constructorArguments: [],
        });
    } catch (e) {
        console.log(e);
    }

    try {
        await hre.run("verify:verify", {
            address: await trust.getAddress(),
            constructorArguments: [
                await oracle.getAddress(),
                eventHash,
                deployer.address, // beneficiary
                distributionAmount,
                "TrustToken",
                "TRST"
            ],
        });
    } catch (e) {
        console.log(e);
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
