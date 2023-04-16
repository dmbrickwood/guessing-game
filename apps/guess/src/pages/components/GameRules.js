import React from "react";

const GameRules = () => {
  return (
    <div className="w-1/2 mb-6 p-6 bg-gray-100 rounded-lg shadow-md">
      <h3 className="text-2xl font-bold mb-2">Game Rules:</h3>
      <ol className="list-decimal list-outside pl-5">
        <li className="mb-1">
          Players must guess a secret number between 0 and 99.
        </li>
        <li className="mb-1">
          To make a guess, players need to send a fee of 0.001 ETH.
        </li>
        <li className="mb-1">
          If the guess is correct, the player wins:
          <ol className="list-disc pl-5">
            <li className="mb-1">
              80% of the ETH balance stored in the contract.
            </li>
            <li className="mb-1">100 GTN (ERC20) tokens.</li>
          </ol>
        </li>
        <li className="mb-1">
          If the guess is incorrect, the player loses, and the 0.001 ETH fee
          stays in the contract.
        </li>
      </ol>
    </div>
  );
};

export default GameRules;
