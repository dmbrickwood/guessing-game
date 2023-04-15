import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Contract, Web3Provider } from 'zksync-web3';
import { ethers } from 'ethers';

const GUESS_CONTRACT_ABI = require('../contracts/GuessTheNumber.json');
const GUESS_CONTRACT_ADDRESS = '0xc24ef8Dbcc990cfcB30A8E885af83Acf9f56f7D0';

const Home = () => {
  const [signer, setSigner] = useState(null);
  const [contractInstance, setContractInstance] = useState(null);

  useEffect(() => {
    async function initEthers() {
      if (window.ethereum) {
        const provider = new Web3Provider(window.ethereum);
        const signerInstance = provider.getSigner();
        setSigner(signerInstance);

        const contract = new Contract(
          GUESS_CONTRACT_ADDRESS,
          GUESS_CONTRACT_ABI,
          signerInstance
        );
        setContractInstance(contract);
      }
    }

    initEthers();
  }, []);

  const { register, handleSubmit } = useForm();

  const onSubmit = async (data) => {
    if (contractInstance) {
      try {
        const tx = await contractInstance.guess(data.guessNumber, {
          value: ethers.utils.parseEther('0.001'),
        });
        await tx.wait();
        alert('Transaction successful!');
      } catch (error) {
        alert('Transaction failed!');
        console.error(error);
      }
    }
  };

  return (
    <div>
      <h1>Guess The Number</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor="guessNumber">Guess Number:</label>
        <input type="number" id="guessNumber" {...register('guessNumber')} />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default Home;
