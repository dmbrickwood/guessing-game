import React, { useState, useEffect } from "react";
import { Contract, Web3Provider } from "zksync-web3";
import {
  GUESS_CONTRACT_ADDRESS,
  GUESS_CONTRACT_ABI,
} from "../constants/consts";
import GameRules from "./components/GameRules";
import GuessTheNumber from "./components/GuessTheNumber";

const Home = () => {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contractInstance, setContractInstance] = useState(null);

  useEffect(() => {
    async function initEthers() {
      if (window.ethereum) {
        const provider = new Web3Provider(window.ethereum);
        setProvider(provider);
        
        await provider.send('eth_requestAccounts', []);

        const signerInstance = provider.getSigner();
        setSigner(signerInstance);

        const contract = new Contract(
          GUESS_CONTRACT_ADDRESS,
          GUESS_CONTRACT_ABI,
          signerInstance,
        );
        setContractInstance(contract);
      }
    }

    initEthers();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-6xl font-bold mb-4">GUESS MY NUMBER!</h1>
      <h2 className="text-2xl mb-4">A Fun Number Guessing Game</h2>
      <GameRules />
      <GuessTheNumber contractInstance={contractInstance} />
    </div>
  );
};

export default Home;
