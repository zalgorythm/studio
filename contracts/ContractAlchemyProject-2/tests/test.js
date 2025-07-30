const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("SmartTrust", function () {
    it("Should trigger distribution after event verification", async function () {
        const [owner, beneficiary, trustedSource] = await ethers.getSigners();

        // Deploy DecentralizedOracle contract
        const Oracle = await ethers.getContractFactory("DecentralizedOracle");
        const oracle = await Oracle.deploy();
        await oracle.deployed();

        // Generate a unique event hash
        const eventDescription = "Death Certificate Verification";
        const eventHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(eventDescription));

        // Add trusted source to the oracle
        await oracle.addTrustedSource(eventHash, trustedSource.address);

        // Deploy SmartTrust contract
        const Trust = await ethers.getContractFactory("SmartTrust");
        const distributionAmount = ethers.utils.parseUnits("100", 18);

        const trust = await Trust.deploy(
            oracle.address,
            eventHash,
            beneficiary.address,
            distributionAmount,
            "TrustToken",
            "TRST"
        );

        await trust.deployed();

        // Report the event by the trusted source
        await oracle.connect(trustedSource).reportEvent(eventHash, eventDescription);

        // Verify the event by the owner (oracle admin)
        await oracle.verifyEvent(eventHash);

        // Trigger distribution by the owner (trust admin)
        await trust.triggerDistribution();

        // Check if the distribution happened
        expect(await trust.balanceOf(beneficiary.address)).to.equal(distributionAmount);
        expect(await trust.isDistributed()).to.equal(true);
    });
});
