//SPDX-License-Identifier: MIT

pragma solidity ^0.6.0;

contract AirDrop {
    
    event Transfer(address indexed from, address indexed to, uint256 tokens);

    string private _name;
    string private _symbol;

    uint256 private _totalSupply;
    uint256 private _amount;

    bytes32 private _rootHash;

    mapping (address => bool) checkRedeemed;
    mapping (address => uint256) _balances;

    address private owner;

    constructor() public {
        owner = msg.sender;
    }

    function deployAirdrop (string memory name, string memory symbol, bytes32 rootHash, uint256 totalSupply, uint256 amount) external {
        require(msg.sender == owner, "Can only be accessed by owner");
        _name = name;
        _symbol = symbol;
        _rootHash = rootHash;
        _totalSupply = totalSupply;
        _amount = amount;
    }

    function leafHash(address leaf) private pure returns(bytes32) {
        return keccak256(abi.encodePacked(uint8(0x00), leaf));
    }

    function nodeHash(bytes32 left, bytes32 right) private pure returns(bytes32) {
        return keccak256(abi.encodePacked(uint8(0x01), left, right));
    }

    function getRootHash() external view returns(bytes32 rootHash) {
        return _rootHash;
    }

    function getName() external view returns (string memory name) {
        return _name;
    }

    function getSymbol() external view returns (string memory symbol) {
        return _symbol;
    }

    function getTotalSupply() external view returns (uint256 totalSupply) {
        return _totalSupply;
    }

    function checkBalance(address participant) external view returns(uint256 balance){
        return _balances[participant];
    }

function redeemToken(uint256 path, address recipient, bytes32[] memory witnesses) external {

        require(checkRedeemed[recipient] == false, "Recipient has already redeemed token");
        checkRedeemed[recipient] = true;

        // Compute the merkle root
        bytes32 validator = leafHash(recipient);
        for (uint i; i < witnesses.length; i++) {
              if ((path & 0x01) == 1) {
                validator = nodeHash(witnesses[i], validator);
            } 
           else {
                validator = nodeHash(validator, witnesses[i]);
            }
            path /= 2;
        }
        // Check the merkle proof
        require(validator == _rootHash, "validation failed");

        // Redeem!
        _balances[recipient] += _amount;
        _totalSupply -= _amount;

        emit Transfer(address(0), recipient, _amount);
    }
}