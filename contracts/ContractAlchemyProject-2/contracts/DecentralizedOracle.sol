// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract DecentralizedOracle is Ownable {
    constructor() Ownable(msg.sender) {}
    struct Event {
        bool isVerified;
        uint256 timestamp;
    }

    mapping(bytes32 => Event) public events;
    mapping(bytes32 => mapping(address => bool)) public isTrustedSource;

    event EventReported(bytes32 indexed eventHash, string eventDescription, address reporter);
    event EventVerified(bytes32 indexed eventHash, address verifier);
    event SourceAdded(bytes32 indexed eventHash, address source);
    event SourceRemoved(bytes32 indexed eventHash, address source);

    modifier onlyTrustedSource(bytes32 eventHash) {
        require(isTrustedSource[eventHash][_msgSender()], "Not a trusted source for this event");
        _;
    }

    function reportEvent(bytes32 eventHash, string memory eventDescription) public onlyTrustedSource(eventHash) {
        require(events[eventHash].timestamp == 0, "Event already reported");
        require(bytes(eventDescription).length <= 256, "Event description too long");
        events[eventHash] = Event(false, block.timestamp);
        emit EventReported(eventHash, eventDescription, _msgSender());
    }

    function verifyEvent(bytes32 eventHash) public onlyOwner {
        require(events[eventHash].timestamp > 0, "Event not reported yet");
        require(!events[eventHash].isVerified, "Event already verified");
        events[eventHash].isVerified = true;
        emit EventVerified(eventHash, _msgSender());
    }

    function addTrustedSource(bytes32 eventHash, address source) public onlyOwner {
        require(source != address(0), "Cannot add the zero address as a trusted source");
        require(!isTrustedSource[eventHash][source], "Source already added");
        isTrustedSource[eventHash][source] = true;
        emit SourceAdded(eventHash, source);
    }

    function removeTrustedSource(bytes32 eventHash, address source) public onlyOwner {
        require(isTrustedSource[eventHash][source], "Source not found");
        delete isTrustedSource[eventHash][source];
        emit SourceRemoved(eventHash, source);
    }

    function isEventVerified(bytes32 eventHash) public view returns (bool) {
        return events[eventHash].isVerified;
    }
}
