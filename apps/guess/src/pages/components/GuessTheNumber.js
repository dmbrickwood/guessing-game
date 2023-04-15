import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Contract, Web3Provider } from 'zksync-web3';
import { ethers } from 'ethers';
import { GUESS_CONTRACT_ADDRESS, GUESS_CONTRACT_ABI } from "../../constants/consts";

const GuessTheNumber = ({ contractInstance }) => {
    const [resultMessage, setResultMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = async (data) => {
        // Check if input is valid
        const guessNumber = parseInt(data.guessNumber);
        if (isNaN(guessNumber) || guessNumber < 0 || guessNumber > 99) {
            setErrorMessage("Please enter a number between 0 and 99.");
            return;
        }
        // Reset error message
        setErrorMessage("");
        const parsedNumber = ethers.utils.parseUnits(data.guessNumber.toString(), 0);
        if (contractInstance) {
            try {
            const tx = await contractInstance.guess(parsedNumber, { value: ethers.utils.parseEther("0.001") });
            const receipt = await tx.wait();
            const winEvent = contractInstance.interface.parseLog(receipt.logs[0]);
            if (winEvent.name === "Winner") {
                setResultMessage("You've guessed correctly!!! You will be awarded 100 GTN tokens, and 80% of the ETH in the contract!");
                // Reset the secret number
                await contractInstance.setSecretNumber();
            } else {
                setResultMessage("You've guessed incorrectly, it will cost you .001 ETH to guess again!");
            }
            } catch (error) {
             console.error(error);
            }
        }
    };

  return (
    <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-5/6 md:w-1/2 mx-auto">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <label htmlFor="guessNumber" className="block text-gray-700 text-sm font-bold mb-2">
            Guess Number:
          </label>
          <input
            type="tel"
            id="guessNumber"
            min="0"
            max="99"
            {...register("guessNumber", { required: true, min: 0, max: 99 })}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        {errorMessage && <p className="text-red-500">{errorMessage}</p>}
        </div>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Guess
        </button>
      </form>
      {resultMessage && <p className="text-blue-800 mt-2">{resultMessage}</p>}
      
    </div>
  );
};

export default GuessTheNumber;
