// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract BeneficiaryManager {
    struct Beneficiary {
        address walletAddress;
        bool isActive;
    }

    mapping(bytes32 => Beneficiary) public beneficiaries;
    mapping(address => bytes32) public walletToId;
    address public owner;

    event BeneficiaryAdded(bytes32 indexed beneficiaryId, address walletAddress);
    event BeneficiaryUpdated(bytes32 indexed beneficiaryId, address walletAddress);
    event BeneficiaryDeactivated(bytes32 indexed beneficiaryId);
    event BeneficiaryReactivated(bytes32 indexed beneficiaryId);
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function addBeneficiary(bytes32 beneficiaryId, address walletAddress) public onlyOwner {
        require(beneficiaries[beneficiaryId].walletAddress == address(0), "Beneficiary already exists");
        require(walletToId[walletAddress] == bytes32(0), "Wallet already registered to a beneficiary");

        beneficiaries[beneficiaryId] = Beneficiary(walletAddress, true);
        walletToId[walletAddress] = beneficiaryId;

        emit BeneficiaryAdded(beneficiaryId, walletAddress);
    }

    function updateBeneficiaryWallet(bytes32 beneficiaryId, address newWalletAddress) public onlyOwner {
        require(beneficiaries[beneficiaryId].walletAddress != address(0), "Beneficiary does not exist");
        require(walletToId[newWalletAddress] == bytes32(0), "New wallet already registered to a beneficiary");

        address oldWalletAddress = beneficiaries[beneficiaryId].walletAddress;
        delete walletToId[oldWalletAddress];

        beneficiaries[beneficiaryId].walletAddress = newWalletAddress;
        walletToId[newWalletAddress] = beneficiaryId;

        emit BeneficiaryUpdated(beneficiaryId, newWalletAddress);
    }

    function deactivateBeneficiary(bytes32 beneficiaryId) public onlyOwner {
        require(beneficiaries[beneficiaryId].walletAddress != address(0), "Beneficiary does not exist");
        beneficiaries[beneficiaryId].isActive = false;

        emit BeneficiaryDeactivated(beneficiaryId);
    }

    function reactivateBeneficiary(bytes32 beneficiaryId) public onlyOwner {
        require(beneficiaries[beneficiaryId].walletAddress != address(0), "Beneficiary does not exist");
        beneficiaries[beneficiaryId].isActive = true;

        emit BeneficiaryReactivated(beneficiaryId);
    }

    function isBeneficiaryActive(bytes32 beneficiaryId) public view returns (bool) {
        return beneficiaries[beneficiaryId].isActive;
    }

    function getBeneficiaryWallet(bytes32 beneficiaryId) public view returns (address) {
        return beneficiaries[beneficiaryId].walletAddress;
    }

    function transferOwnership(address newOwner) public onlyOwner {
        require(newOwner != address(0), "New owner cannot be the zero address");
        emit OwnershipTransferred(owner, newOwner);
        owner = newOwner;
    }

    function getBeneficiaryIdByWallet(address walletAddress) public view returns (bytes32) {
        return walletToId[walletAddress];
    }
}
