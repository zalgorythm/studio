// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Trust is ReentrancyGuard, Ownable {
    address public trustee;
    address public oracle;
    uint256 public trustCreationTimestamp;

    struct Asset {
        string description;
        uint256 value;
    }

    Asset[] public assets;

    struct Beneficiary {
        address beneficiaryAddress;
        string name;
        uint256 sharePercentage;
    }

    Beneficiary[] public beneficiaries;

    enum DistributionTrigger {
        DEATH,
        SPECIFIC_DATE,
        ORACLE_TRIGGER
    }

    DistributionTrigger public trigger;
    uint256 public triggerTimestamp;
    bool public distributionExecuted = false;

    event AssetAdded(uint256 index, string description, uint256 value);
    event BeneficiaryAdded(uint256 index, address beneficiaryAddress, string name, uint256 sharePercentage);
    event Distribution(address beneficiary, uint256 amount);
    event Triggered(DistributionTrigger triggerType);

    modifier onlyTrustee() {
        require(msg.sender == trustee, "Only the trustee can call this function");
        _;
    }

    modifier onlyOracle() {
        require(msg.sender == oracle, "Only the oracle can call this function");
        _;
    }

    constructor(address _trustee, address _oracle, DistributionTrigger _trigger, uint256 _triggerTimestamp) Ownable(msg.sender) {
        trustee = _trustee;
        oracle = _oracle;
        trigger = _trigger;
        triggerTimestamp = _triggerTimestamp;
        trustCreationTimestamp = block.timestamp;
    }

    function addAsset(string memory _description, uint256 _value) public onlyTrustee {
        require(_value > 0, "Asset value must be greater than 0");
        assets.push(Asset(_description, _value));
        emit AssetAdded(assets.length - 1, _description, _value);
    }

    function addBeneficiary(address _beneficiaryAddress, string memory _name, uint256 _sharePercentage) public onlyTrustee {
        require(_sharePercentage <= 100, "Share percentage must be less than or equal to 100");
        beneficiaries.push(Beneficiary(_beneficiaryAddress, _name, _sharePercentage));
        emit BeneficiaryAdded(beneficiaries.length - 1, _beneficiaryAddress, _name, _sharePercentage);
    }

    function triggerDistribution() public onlyOracle {
        require(!distributionExecuted, "Distribution already executed");
        require(trigger == DistributionTrigger.ORACLE_TRIGGER, "Incorrect Trigger Type");

        _executeDistribution();
    }

    function executeDistribution() public onlyOwner {
        require(!distributionExecuted, "Distribution already executed");
        if (trigger == DistributionTrigger.DEATH) {
            revert("Death Trigger - Requires Oracle");
        } else if (trigger == DistributionTrigger.SPECIFIC_DATE) {
            require(block.timestamp >= triggerTimestamp, "Too early for distribution");
            _executeDistribution();
        } else {
            revert("Oracle Trigger Required");
        }
    }

    function _executeDistribution() internal nonReentrant {
        uint256 totalAssetsValue = 0;
        for (uint256 i = 0; i < assets.length; i++) {
            totalAssetsValue += assets[i].value;
        }

        for (uint256 i = 0; i < beneficiaries.length; i++) {
            uint256 amount = (totalAssetsValue * beneficiaries[i].sharePercentage) / 100;
            payable(beneficiaries[i].beneficiaryAddress).transfer(amount);
            emit Distribution(beneficiaries[i].beneficiaryAddress, amount);
        }

        distributionExecuted = true;
        emit Triggered(trigger);
    }

    function setOracle(address _newOracle) public onlyTrustee {
        oracle = _newOracle;
    }

    function getAssetCount() public view returns (uint256) {
        return assets.length;
    }

    function getBeneficiaryCount() public view returns (uint256) {
        return beneficiaries.length;
    }
}
