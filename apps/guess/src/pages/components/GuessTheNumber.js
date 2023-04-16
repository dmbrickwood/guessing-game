import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { ethers } from "ethers";

const GuessTheNumber = ({ contractInstance }) => {
  const [resultMessage, setResultMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    // Check if input is valid
    const guessNumber = parseInt(data.guessNumber);
    if (isNaN(guessNumber) || guessNumber < 0 || guessNumber > 99) {
      setErrorMessage("Please enter a number between 0 and 99.");
      return;
    }
    // Reset error message
    setErrorMessage("");
    const parsedNumber = ethers.utils.parseUnits(
      data.guessNumber.toString(),
      0,
    );
    if (contractInstance) {
      try {
        const filterWinner = contractInstance.filters.Winner();
        const filterLoser = contractInstance.filters.Loser();

        // Get the current gas price from the provider
        const gasPrice = await contractInstance.provider.getGasPrice();

        // Set the gas price for the transaction (adding a buffer to the current gas price)
        const gasPriceWithBuffer = gasPrice.add(
          ethers.utils.parseUnits("1", "gwei"),
        );
        const tx = await contractInstance.guess(parsedNumber, {
          value: ethers.utils.parseEther("0.001"),
          gasPrice: gasPriceWithBuffer, // Set the gas price for the transaction
        });

        const signerAddress = await contractInstance.signer.getAddress();

        contractInstance.on(filterWinner, (player, reward) => {
          if (player === signerAddress) {
            setResultMessage(
              "You've guessed correctly!!! You will be awarded 100 GTN tokens, and 80% of the ETH in the contract!",
            );
            // Reset the secret number
            contractInstance.setSecretNumber();
            contractInstance.off(filterWinner);
          }
        });

        contractInstance.on(filterLoser, (player) => {
          if (player === signerAddress) {
            setResultMessage(
              "You've guessed incorrectly, it will cost you .001 ETH to guess again!",
            );
            contractInstance.off(filterLoser);
          }
        });

        await tx.wait();
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-5/6 md:w-1/2 mx-auto">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <label
            htmlFor="guessNumber"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Guess Number:
          </label>
          <input
            type="tel"
            id="guessNumber"
            {...register("guessNumber", { required: true })}
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
