// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract SmartTrust is ERC721, Ownable, ReentrancyGuard {
    uint256 private _trustCount;

    struct TrustDetails {
        address beneficiary;
        string terms;
        bool isRevoked;
    }

    mapping(uint256 => TrustDetails) public trusts;

    event TrustCreated(uint256 trustId, address creator, address beneficiary, string terms);
    event TrustRevoked(uint256 trustId, address beneficiary);
    event TrustTransferred(uint256 trustId, address from, address to);

    constructor(address initialOwner) ERC721("SmartTrust", "STRST") Ownable(initialOwner) {}

    function createTrust(address _beneficiary, string memory _terms) public onlyOwner returns (uint256) {
        _trustCount++;
        uint256 trustId = _trustCount;

        _mint(msg.sender, trustId);

        trusts[trustId] = TrustDetails(_beneficiary, _terms, false);

        emit TrustCreated(trustId, msg.sender, _beneficiary, _terms);
        return trustId;
    }

    function revokeTrust(uint256 _trustId) public onlyOwner {
        _requireOwned(_trustId);
        require(!trusts[_trustId].isRevoked, "Trust is already revoked");
        trusts[_trustId].isRevoked = true;

        emit TrustRevoked(_trustId, trusts[_trustId].beneficiary);
    }

    function getTrustDetails(uint256 _trustId) public view returns (address, string memory, bool) {
        _requireOwned(_trustId);
        TrustDetails memory trust = trusts[_trustId];
        return (trust.beneficiary, trust.terms, trust.isRevoked);
    }

    function transferTrust(uint256 _trustId, address _to) public nonReentrant {
        _requireOwned(_trustId);
        require(msg.sender == ownerOf(_trustId), "Only the owner can transfer the trust");
        safeTransferFrom(msg.sender, _to, _trustId);
        emit TrustTransferred(_trustId, msg.sender, _to);
    }
}

contract SmartTrustFactory {
    address[] public deployedTrusts;

    event TrustDeployed(address trustAddress);

    function createTrustContract() public returns (address) {
        SmartTrust newTrust = new SmartTrust(msg.sender);
        deployedTrusts.push(address(newTrust));
        emit TrustDeployed(address(newTrust));
        return address(newTrust);
    }

    function getDeployedTrusts() public view returns (address[] memory) {
        return deployedTrusts;
    }
}
