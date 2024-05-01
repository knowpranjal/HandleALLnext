// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract HandleRegistry is ERC721 {
    struct HandleDID {
        string IPFSHash;
        string did;
    } 

    mapping(bytes32 => string) public IPFSHashToDID; // Mapping using hashes
    mapping(bytes32 => string) public didToIPFSHash; // Mapping using hashes
    mapping(bytes32 => uint256) private didIndex;

    string[] public registeredIPFSHashes;
    string[] public registeredDIDs;

    event HandleRegistered(string indexed _did, string indexed _IPFSHash);
    event HandleTransferred(string indexed _newdid);
    event DIDRetrieved(string indexed _IPFSHash);
    event HandleRetrieved(string indexed _did);

    error HandleAlreadyExists();
    error DIDAlreadyExists();
    error HandleNotFound();
    error DIDNotFound();

    constructor() ERC721("IPFSHashToken", "IPFS") {}

    function startsWith(
        string memory str,
        string memory prefix
    ) internal pure returns (bool) {
        bytes memory strBytes = bytes(str);
        bytes memory prefixBytes = bytes(prefix);
        for (uint i = 0; i < prefixBytes.length; i++) {
            if (strBytes[i] != prefixBytes[i]) {
                return false;
            }
        }
        return true;
    }

    function mintIPFSHash(address _to, string memory _IPFSHash) public {
        require(
            bytes(_IPFSHash).length > 0,
            "IPFS hash cannot be empty"
        );
        bytes32 IPFSHashHash = keccak256(abi.encodePacked(_IPFSHash));
        
        require(bytes(IPFSHashToDID[IPFSHashHash]).length == 0, "IPFS hash already minted");
        
        // Mint NFT
        uint256 tokenId = registeredIPFSHashes.length;
        _mint(_to, tokenId);
        registeredIPFSHashes.push(_IPFSHash);
        
        emit HandleRegistered("", _IPFSHash);
    }

    function registerHandle(string memory _IPFSHash, string memory _did) public {
        require(
            bytes(_IPFSHash).length > 0,
            "IPFS hash cannot be empty"
        );
        require(bytes(_did).length > 0, "DID cannot be empty");

        bytes32 IPFSHashHash = keccak256(abi.encodePacked(_IPFSHash));
        bytes32 didHash = keccak256(abi.encodePacked(_did));

        if (bytes(IPFSHashToDID[IPFSHashHash]).length != 0) {
            revert HandleAlreadyExists();
        }
        if (bytes(didToIPFSHash[didHash]).length != 0) {
            revert DIDAlreadyExists();
        }

        mintIPFSHash(msg.sender, _IPFSHash);

        IPFSHashToDID[IPFSHashHash] = _did;
        didToIPFSHash[didHash] = _IPFSHash;
        didIndex[didHash] = registeredDIDs.length; // Store index of DID
        registeredIPFSHashes.push(_IPFSHash);
        registeredDIDs.push(_did);

        emit HandleRegistered(_did, _IPFSHash);
    }

    function transferHandle(
        string memory _IPFSHash,
        string memory _newDID
    ) public {
        require(bytes(_newDID).length > 0, "New DID cannot be empty");
        require(
            bytes(_IPFSHash).length > 0,
            "IPFS hash cannot be empty"
        );

        bytes32 IPFSHashHash = keccak256(abi.encodePacked(_IPFSHash));
        bytes32 oldDIDHash = keccak256(abi.encodePacked(IPFSHashToDID[IPFSHashHash]));
        bytes32 newDIDHash = keccak256(abi.encodePacked(_newDID));

        if (bytes(IPFSHashToDID[IPFSHashHash]).length == 0) {
            revert HandleNotFound();
        }

        string memory currentDID = IPFSHashToDID[IPFSHashHash];

        if (bytes(didToIPFSHash[newDIDHash]).length != 0) {
            revert DIDAlreadyExists();
        }

        delete didToIPFSHash[oldDIDHash]; 
        IPFSHashToDID[IPFSHashHash] = _newDID;
        didToIPFSHash[newDIDHash] = _IPFSHash;

        uint256 indexToUpdate = didIndex[oldDIDHash]; // Retrieve index directly
        registeredDIDs[indexToUpdate] = _newDID;

        for (uint256 i = 0; i < registeredDIDs.length; i++) {
            if (
                keccak256(abi.encodePacked(registeredDIDs[i])) ==
                keccak256(abi.encodePacked(currentDID))
            ) {
                registeredDIDs[i] = _newDID; // Replace old DID with new one
                break;
            }
        }

        emit HandleTransferred(_newDID);
    }

    function getDIDFromHandle(
        string memory _IPFSHash
    ) public view returns (string memory) {
        bytes32 IPFSHashHash = keccak256(abi.encodePacked(_IPFSHash));
        string memory did = IPFSHashToDID[IPFSHashHash];
        if (bytes(did).length == 0) {
            revert HandleNotFound();
        }
        return did;
    }

    function getHandleFromDID(
        string memory _did
    ) public view returns (string memory) {
        bytes32 didHash = keccak256(abi.encodePacked(_did));
        string memory IPFSHash = didToIPFSHash[didHash];
        if (bytes(IPFSHash).length == 0) {
            revert DIDNotFound();
        }
        return IPFSHash;
    }

    // Simple functions for retrieving indexes
    function getRegisteredHandles() public view returns (string[] memory) {
        return registeredIPFSHashes;
    }

    function getRegisteredDIDs() public view returns (string[] memory) {
        return registeredDIDs;
    }
}
