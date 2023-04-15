//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

// A simple contract to guess a secret number and get rewarded in ETH and ERC20 tokens.
contract GuessTheNumber is Ownable, ReentrancyGuard {
    // Stores the secret number to be guessed
    uint256 private secretNumber;

    // The fee required for each guess, set to 0.001 ETH
    uint256 public constant GUESS_FEE = 1e15;

    // The ERC20 token used for rewards
    IERC20 public token;

    // The reward amount in ERC20 tokens for a correct guess, set to 100 tokens
    uint256 public constant TOKEN_REWARD = 100 * 10**18;

    // Event emitted when a player wins
    event Winner(address indexed player, uint256 reward);

    // Event emitted when a player loses
    event Loser(address indexed player);

    // Constructor to set the initial token contract and generate a secret number
    constructor(IERC20 _token) {
        token = _token;
        secretNumber = generateSecretNumber();
    }

    receive() external payable {}

    // Generates a secret number using the current block timestamp and prevrandao
    function generateSecretNumber() private view returns (uint256) {
        return uint256(keccak256(abi.encodePacked(block.number, block.prevrandao))) % 100;
    }

    // Allows the owner to set a new secret number
    function setSecretNumber() external onlyOwner {
        secretNumber = generateSecretNumber();
    }

     function viewSecretNumber() external view onlyOwner returns (uint256) {
        return secretNumber;
    }

    // Allows players to guess the secret number by sending the required ETH fee
    function guess(uint256 guessNumber) external payable nonReentrant {
        require(msg.value == GUESS_FEE, "Incorrect ETH value");

        // If the guess is correct, reward the player with 80% of the contract's ETH balance and 100 ERC20 tokens
        if (guessNumber == secretNumber) {
            // Calculate the ETH reward, which is 80% of the contract's ETH balance
            uint256 ethReward = (address(this).balance * 80) / 100;
            // Transfer the ETH reward to the player
            (bool success, ) = payable(msg.sender).call{value: ethReward}("");
            require(success, "Transfer failed.");
            // Transfer 100 ERC20 tokens to the player
            token.transfer(msg.sender, TOKEN_REWARD);
            // Emit the Winner event with the player's address and ETH reward
            emit Winner(msg.sender, ethReward);
        } else {
            // Guess is incorrect, the ETH value remains in the contract's balance
            // Guess is incorrect, emit a loser event
            emit Loser(msg.sender);
        }
    }

    // Allows the owner to withdraw any remaining ERC20 tokens from the contract
    function withdrawTokens() external onlyOwner {
        token.transfer(owner(), token.balanceOf(address(this)));
    }
    function withdrawETH() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }
}
