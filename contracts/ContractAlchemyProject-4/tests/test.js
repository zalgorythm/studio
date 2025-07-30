// tests/test.js
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Timelock", function () {
  let Timelock;
  let timelock;
  let owner;
  let beneficiary;
  let releaseTime;

  beforeEach(async function () {
    [owner, beneficiary] = await ethers.getSigners();
    releaseTime = Math.floor(Date.now() / 1000) + 60; // Release in 60 seconds

    Timelock = await ethers.getContractFactory("Timelock");
    timelock = await Timelock.deploy(beneficiary.address, releaseTime);
    await timelock.deployed();

    // Send some ether to the contract
    await owner.sendTransaction({ to: timelock.address, value: ethers.utils.parseEther("1.0") });
  });

  it("Should not allow release before releaseTime", async function () {
    await expect(timelock.release()).to.be.revertedWith("Release time not reached yet");
  });

  it("Should allow release after releaseTime", async function () {
    // Increase time to after releaseTime
    await ethers.provider.send("evm_increaseTime", [60]);
    await ethers.provider.send("evm_mine", []);

    await expect(timelock.release())
      .to.emit(timelock, "FundsReleased")
      .withArgs(beneficiary.address, ethers.utils.parseEther("1.0"));
  });

  it("Should not allow release twice", async function () {
        // Increase time to after releaseTime
        await ethers.provider.send("evm_increaseTime", [60]);
        await ethers.provider.send("evm_mine", []);

        await timelock.release();
        await expect(timelock.release()).to.be.revertedWith("Funds already released");
    });

  it("Should allow owner to withdraw remaining funds after release", async function () {
        // Increase time to after releaseTime
        await ethers.provider.send("evm_increaseTime", [60]);
        await ethers.provider.send("evm_mine", []);

        await timelock.release();
        await timelock.withdrawRemaining();

        expect(await ethers.provider.getBalance(timelock.address)).to.equal(0);
    });
});