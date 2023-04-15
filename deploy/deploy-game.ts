import { Wallet, Provider } from 'zksync-web3';
import * as ethers from 'ethers';
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { Deployer } from '@matterlabs/hardhat-zksync-deploy';
import * as ContractArtifact from '../artifacts-zk/contracts/GuessToken.sol/GuessToken.json';

// load env file
import dotenv from 'dotenv';
dotenv.config();

// load wallet private key from env file
const PRIVATE_KEY = process.env.WALLET_PRIVATE_KEY || "";

if (!PRIVATE_KEY)
  throw "⛔️ Private key not detected! Add it to the .env file!";

// An example of a deploy script that will deploy and call a simple contract.
export default async function (hre: HardhatRuntimeEnvironment) {
  console.log(`Running deploy script for the Guess Game contract`);

  // Initialize the wallet.
  const wallet = new Wallet(PRIVATE_KEY);
   // @ts-ignore
  const provider = new Provider(hre.userConfig.networks?.zkSyncTestnet?.url);
  const signer = new ethers.Wallet(PRIVATE_KEY, provider);

  // Create deployer object and load the artifact of the contract you want to deploy.
  const deployer = new Deployer(hre, wallet);
  const artifact = await deployer.loadArtifact("GuessTheNumber");

  // Estimate contract deployment fee
  const tokenAddress = "0x5B91e527504BbAbf10a5D0CA8BD45278E6E52Ee2";
  const deploymentFee = await deployer.estimateDeployFee(artifact, [tokenAddress]);

  // Deploy this contract. The returned object will be of a `Contract` type, similarly to ones in `ethers`.
  const parsedFee = ethers.utils.formatEther(deploymentFee.toString());
  console.log(`The deployment is estimated to cost ${parsedFee} ETH`);

  const gameContract = await deployer.deploy(artifact, [tokenAddress]);

  // Initialise contract instance
  const token = new ethers.Contract(tokenAddress, ContractArtifact.abi, signer);
  // send GTN tokens to contract
  token.transfer(gameContract.address, ethers.utils.parseEther("1000000"));
  // send ETH to contract to seed the game
  signer.sendTransaction({ value: ethers.utils.parseEther(".2") });

  // obtain the Constructor Arguments
  console.log(
    "constructor args:" + gameContract.interface.encodeDeploy([tokenAddress])
  );

  // Show the contract info.
  const contractAddress = gameContract.address;
  console.log(`${artifact.contractName} was deployed to ${contractAddress}`);
}
