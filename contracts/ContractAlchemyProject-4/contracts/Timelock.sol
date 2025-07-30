// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Timelock {
    uint256 public releaseTime;
    address public beneficiary;
    address public owner;
    bool public released;

    event ReleaseTimeSet(uint256 time);
    event FundsReleased(address to, uint256 amount);

    constructor(address _beneficiary, uint256 _releaseTime) {
        require(_beneficiary != address(0), "Beneficiary address cannot be zero");
        require(_releaseTime > block.timestamp, "Release time must be in the future");
        
        beneficiary = _beneficiary;
        releaseTime = _releaseTime;
        owner = msg.sender;
        released = false;

        emit ReleaseTimeSet(_releaseTime);
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    function setReleaseTime(uint256 _releaseTime) external onlyOwner {
        require(_releaseTime > block.timestamp, "Release time must be in the future");
        releaseTime = _releaseTime;
        emit ReleaseTimeSet(_releaseTime);
    }

    function release() external {
        require(block.timestamp >= releaseTime, "Release time not reached yet");
        require(!released, "Funds already released");
        
        released = true; // Prevent re-entrancy
        uint256 amount = address(this).balance;
        (bool success, ) = beneficiary.call{value: amount}("");
        require(success, "Transfer failed");
        emit FundsReleased(beneficiary, amount);
    }

    function withdrawRemaining() external onlyOwner {
        require(released, "Funds must be released first");
        uint256 amount = address(this).balance;
        (bool success, ) = owner.call{value: amount}("");
        require(success, "Withdrawal failed");
    }

    receive() external payable {}
}
