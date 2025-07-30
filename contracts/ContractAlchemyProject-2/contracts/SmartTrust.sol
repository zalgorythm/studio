// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./DecentralizedOracle.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract SmartTrust is ERC20, Ownable {
    DecentralizedOracle public oracle;
    bytes32 public eventHash;
    address payable public beneficiary;
    uint256 public distributionAmount;
    bool public isDistributed;

    event TrustCreated(address indexed creator, bytes32 indexed eventHash, address indexed beneficiary, uint256 amount);
    event DistributionTriggered(address indexed beneficiary, uint256 amount);

    constructor(DecentralizedOracle _oracle, bytes32 _eventHash, address payable _beneficiary, uint256 _distributionAmount, string memory _name, string memory _symbol) ERC20(_name, _symbol) Ownable(_msgSender()){
        oracle = _oracle;
        eventHash = _eventHash;
        beneficiary = _beneficiary;
        distributionAmount = _distributionAmount;
        isDistributed = false;
        _mint(_msgSender(), _distributionAmount * 2); // Mint tokens for testing, twice the distribution amount

        emit TrustCreated(_msgSender(), _eventHash, _beneficiary, _distributionAmount);
    }

    function triggerDistribution() public onlyOwner {
        require(oracle.isEventVerified(eventHash), "Event is not verified yet");
        require(!isDistributed, "Distribution already triggered");

        _transfer(_msgSender(), beneficiary, distributionAmount);

        isDistributed = true;
        emit DistributionTriggered(beneficiary, distributionAmount);
    }

    // Fallback function to receive ETH
    receive() external payable {}

    // Function to withdraw remaining ERC20 tokens
    function withdrawTokens(address _tokenAddress, address _to, uint256 _amount) public onlyOwner {
        IERC20 token = IERC20(_tokenAddress);
        uint256 balance = token.balanceOf(address(this));
        require(_amount <= balance, "Insufficient balance");
        token.transfer(_to, _amount);
    }

}
