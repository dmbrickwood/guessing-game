# zkSync Guess Game

This repository contains the code for the zkSync Guess Game, a simple game where players can guess a secret number and win rewards in ETH and ERC20 tokens. This README provides instructions on how to compile and deploy the contracts, start the game locally, and play the game.

You may interact with the deployed Guess Game here:
- https://zksync-guess-game.netlify.app/

You can view the deployed smart contracts on the zksync block explorer:
- GuessToken contract: https://goerli.explorer.zksync.io/address/0x2bF06422fEbB3e210Cde197781FDE9369789Fd8f
- GuessTheNumber contract: https://goerli.explorer.zksync.io/address/0xd0919075f0190457C63c316De669724F7579EC6B

## Prerequisites

This repository makes use of yarn, nodejs. To install node.js binaries, installers, and source tarballs, please visit https://nodejs.org/en/download/. Once node.js is installed you may proceed to install [`yarn`](https://classic.yarnpkg.com/en/docs/install):

## Project structure

- `contracts/`: This directory contains the Solidity contracts for the game and the ERC20 token used for rewards.
- `deploy/`: This directory contains the deployment and contract interaction scripts. The scripts are written in TypeScript and use Hardhat and @matterlabs/hardhat-zksync-deploy to interact with the zkSync network.
- `hardhat.config.ts`: This file is the configuration file for Hardhat. It contains the settings for compiling, deploying, and testing the contracts.
- `apps/guess`: This directory contains the React / next.js frontend application to play the Guessing game.

## Commands

- `yarn hardhat compile` will compile the contracts.
- `yarn deploy:token` will execute the deployment script `/deploy/deploy-token.ts`. Requires [environment variable setup](#environment-variables). Specifically, this will deploy the GuessToken contract.
- `yarn deploy:game` will execute the deployment script `/deploy/deploy-game.ts`. Requires [environment variable setup](#environment-variables). Specifically, this will deploy the GuessTheNumber contract.

### Environment variables

In order to prevent users to leak private keys, this project includes the `dotenv` package which is used to load environment variables. It's used to load the wallet private key, required to run the deploy script.

To use it, rename `.env.example` to `.env` and enter your private key.

```
WALLET_PRIVATE_KEY=123cde574ccff....
```

### Compiling Contracts

To compile the contracts, we will first install the dependencies:

```
yarn install
```

Next, we will compile the contracts using hardhat:


```
yarn hardhat compile
```

### Deploying Contracts

Before deploying the contracts, make sure you have set up your wallet with enough funds for the deployment and gas fees. To deploy the game contract and token contract, run the following commands:

```
yarn deploy:token
```

You should see the following output if successfully deployed:

```
Running deploy script for the Guess token contract
The deployment is estimated to cost 0.00155026975 ETH
constructor args:0x00000000000000000000000000000000000000000000d3c21bcecceda1000000
GuessToken was deployed to `CONTRACT-ADDRESS`
```

Next, we will update the `deploy-game.ts` script to reference our newly deployed Token contract. Copy the GuessToken contract address from the above output and 
update the `tokenAdress` variable to the GuessToken contract address. For example,

```
const tokenAddress = "0x2bF06422fEbB3e210Cde197781FDE9369789Fd8f";
```

This is required as our GuessTheNumber contract constructor requires the tokenAddress as an argument. Now let's deploy the game contract by running:

```
yarn deploy:game
```

You should see the following output if successfully deployed:

```
Running deploy script for the Guess Game contract
The deployment is estimated to cost 0.0013068275 ETH
Token balance of the GuessTheNumber contract: 1000000.0 GTN
ETH balance of the GuessTheNumber contract: 0.2 ETH
constructor args:0x0000000000000000000000002bf06422febb3e210cde197781fde9369789fd8f
GuessTheNumber was deployed to `CONTRACT-ADDRESS`
```

## Starting the Game Locally

To start the game locally, we will first install the dependencies required in the `apps/guess` directory:

```
cd apps/guess && yarn install 
```

Next, we will start the game:

```
yarn dev
```

This will start the Next.js server on `localhost:3000`.

### Playing the Game
To play the game, navigate to `localhost:3000` in your web browser. Enter a guess and submit it by clicking the "Guess" button. If your guess is correct, you will be rewarded with ETH and ERC20 tokens. If your guess is incorrect, you will lose your guess fee.

Note that the game is currently only deployed on the zkSyncTestnet network, so you will need to have an account on that network and some testnet funds to play. You can also modify the code to deploy the game to a different network or to use a different token for rewards.

## Testing Locally

To run tests locally, you will need to set up the testing environment by following the steps provided in this guide:

- [Installing the Testing Environment](https://era.zksync.io/docs/api/hardhat/testing.html#installing-the-testing-environment)
  
**Note:** Please allow some time for the local zkSync network to set up before running the tests.

Update the `hardhat.config.ts` file to set the `defaultNetwork` as `hardhat`. For example,

```
defaultNetwork: "hardhat",
```

**Run the test suite using the following command:**

```
yarn test
```

## Official Links

- [Website](https://zksync.io/)
- [Documentation](https://v2-docs.zksync.io/dev/)
- [GitHub](https://github.com/matter-labs)
- [Twitter](https://twitter.com/zksync)
- [Discord](https://discord.gg/nMaPGrDDwk)
