// tests/test.js
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Trust", function () {
  it("Should add an asset and a beneficiary, and execute distribution on date", async function () {
    const [trustee, oracle, beneficiary] = await ethers.getSigners();

    const Trust = await ethers.getContractFactory("Trust");
    const triggerTimestamp = Math.floor(Date.now() / 1000) + 10; // 10 seconds from now
    const trust = await Trust.deploy(trustee.address, oracle.address, 1, triggerTimestamp);
    await trust.deployed();

    await trust.addAsset("House", 100000);
    await trust.addBeneficiary(beneficiary.address, "Alice", 100);

    // Wait for the trigger timestamp to pass
    await new Promise(resolve => setTimeout(resolve, 11000));

    await expect(trust.executeDistribution()).to.emit(trust, "Distribution").withArgs(beneficiary.address, 100000);
    expect(await trust.distributionExecuted()).to.equal(true);
  });

  it("Should only allow the trustee to add assets", async function () {
      const [trustee, otherAccount] = await ethers.getSigners();

      const Trust = await ethers.getContractFactory("Trust");
      const trust = await Trust.deploy(trustee.address, otherAccount.address, 0, 0);
      await trust.deployed();

      await expect(trust.connect(otherAccount).addAsset("Car", 50000)).to.be.revertedWith("Only the trustee can call this function");
  });

  it("Should only allow the Oracle to trigger an Oracle distribution", async function () {
    const [trustee, oracle] = await ethers.getSigners();

    const Trust = await ethers.getContractFactory("Trust");
    const trust = await Trust.deploy(trustee.address, oracle.address, 2, 0);
    await trust.deployed();

    await trust.addAsset("Car", 50000);
    await trust.addBeneficiary(trustee.address, "Beneficiary", 100);

    await expect(trust.connect(trustee).triggerDistribution()).to.be.revertedWith("Only the oracle can call this function");
    await expect(trust.connect(oracle).triggerDistribution()).to.emit(trust, "Triggered");

  });
});
