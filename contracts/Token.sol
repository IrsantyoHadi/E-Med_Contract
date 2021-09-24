// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

// import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/ERC20.sol";

//minting token
contract IRSTKN is ERC20 {
    constructor(uint256 initialSupply) ERC20("IRSTKN", "IRS") {
        _mint(msg.sender, initialSupply);
    }
}

//selling token
contract IRSICO {
    IERC20 token; //reference to the ERC20 interface contract
    address owner;
    uint256 tokensPerEther = 1000;
    uint256 public numTokens;
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function!");
        _;
    }

    constructor(address _token) {
        token = IRSTKN(_token);
        owner = msg.sender;
    }

    function PurchaseTokens() public payable returns (uint256) {
        numTokens = (msg.value / (1 * 10**18)) * tokensPerEther; //handle truncation if exists
        uint256 balance = token.allowance(owner, address(this));
        require(balance >= numTokens, "Not enough tokens to sell to you!");
        token.transferFrom(owner, msg.sender, numTokens);
        return numTokens;
    }
}
