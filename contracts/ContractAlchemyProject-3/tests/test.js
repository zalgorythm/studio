// tests/test.js
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("BeneficiaryManager", function () {
  it("Should add a beneficiary", async function () {
    const BeneficiaryManager = await ethers.getContractFactory("BeneficiaryManager");
    const beneficiaryManager = await BeneficiaryManager.deploy();
    await beneficiaryManager.deployed();

    const beneficiaryId = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("beneficiary1"));
    const [owner, addr1] = await ethers.getSigners();

    await beneficiaryManager.addBeneficiary(beneficiaryId, addr1.address);
    const walletAddress = await beneficiaryManager.getBeneficiaryWallet(beneficiaryId);
    expect(walletAddress).to.equal(addr1.address);
  });
});
