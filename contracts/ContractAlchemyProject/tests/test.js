// tests/test.js
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("SmartTrustFactory", function () {
  it("Should deploy a new SmartTrust contract", async function () {
    const SmartTrustFactory = await ethers.getContractFactory("SmartTrustFactory");
    const smartTrustFactory = await SmartTrustFactory.deploy();
    await smartTrustFactory.deployed();

    const deployTrustTx = await smartTrustFactory.createTrustContract();
    await deployTrustTx.wait();

    const deployedTrusts = await smartTrustFactory.getDeployedTrusts();
    expect(deployedTrusts.length).to.equal(1);

    const SmartTrust = await ethers.getContractFactory("SmartTrust");
    const smartTrust = await SmartTrust.attach(deployedTrusts[0]);
    
    const [owner] = await ethers.getSigners();

    const createTrustTx = await smartTrust.createTrust(owner.address, "Some terms");
    await createTrustTx.wait();

    const [beneficiary, terms, isRevoked] = await smartTrust.getTrustDetails(1);
    expect(beneficiary).to.equal(owner.address);
    expect(terms).to.equal("Some terms");
    expect(isRevoked).to.equal(false);
  });
});