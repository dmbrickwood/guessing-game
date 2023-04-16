This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

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
