//SPDX-License-Identifier: Unlicense

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

// The GuessToken contract is an ERC20 token with burnable and mintable functionality.
// It inherits from the OpenZeppelin ERC20, ERC20Burnable, and Ownable contracts.
contract GuessToken is ERC20, ERC20Burnable, Ownable {
    // Constructor for the GuessToken.
    // Takes an initialSupply parameter to pre-mint tokens.
    // It initializes the ERC20 contract with the name "Guess" and symbol "GTN".
    constructor(uint256 initialSupply) ERC20("Guess", "GTN") {
        // The _mint function is called to mint the initial supply of tokens
        // and assign them to the deploying address (msg.sender).
        _mint(msg.sender, initialSupply);
    }

    // The mint function allows the contract owner to mint new tokens
    // and send them to a specified address (to) with a specified amount.
    // This function can only be called by the contract owner due to the onlyOwner modifier.
    function mint(address to, uint256 amount) public onlyOwner {
        // The _mint function is called to mint the specified amount of tokens
        // and assign them to the provided address (to).
        _mint(to, amount);
    }
}
