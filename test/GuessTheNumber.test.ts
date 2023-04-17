const { expect } = require("chai");
const { ethers, waffle } = require("hardhat");
const { deployContract } = waffle;

describe("GuessTheNumber", function () {
  let Token, token, GuessTheNumber, guessTheNumber, owner, addr1, addr2;

  beforeEach(async () => {
    Token = await ethers.getContractFactory("GuessToken");
    const initialSupply = ethers.utils.parseEther("10000000");
    token = await Token.deploy(initialSupply);
    await token.deployed();

    GuessTheNumber = await ethers.getContractFactory("GuessTheNumber");
    guessTheNumber = await GuessTheNumber.deploy(token.address);
    await guessTheNumber.deployed();

    const wallets = await ethers.getSigners();
    owner = wallets[0];
    addr1 = wallets[1];
    addr2 = wallets[2];
  });

  describe("Deployment", function () {
    it("Should set the correct token address", async function () {
      expect(await guessTheNumber.token()).to.equal(token.address);
    });
  });

  describe("Guessing", function () {
    it("Should revert if incorrect ETH value is sent", async function () {
      await expect(guessTheNumber.connect(addr1).guess(42, { value: 1e14 })).to.be.revertedWith("Incorrect ETH value");
    });

    it("Should emit a Loser event if the guess is incorrect", async function () {
      await guessTheNumber.connect(owner).setSecretNumber();
      const secretNumber = await guessTheNumber.connect(owner).viewSecretNumber();
      const wrongNumber = secretNumber == 0 ? 1 : 0;

      await expect(guessTheNumber.connect(addr1).guess(wrongNumber, { value: 1e15 }))
        .to.emit(guessTheNumber, "Loser")
        .withArgs(addr1.address);
    });
    });

    it("Should emit a Winner event and transfer rewards if the guess is correct", async function () {
        await guessTheNumber.connect(owner).setSecretNumber();
        const secretNumber = await guessTheNumber.connect(owner).viewSecretNumber();
    
        const tokenReward = ethers.utils.parseEther("100");

        await token.transfer(guessTheNumber.address, ethers.utils.parseEther("1000000"));
        expect(await token.balanceOf(guessTheNumber.address)).to.equal(ethers.utils.parseEther("1000000"));

        await guessTheNumber.connect(addr1).guess(secretNumber, { value: ethers.utils.parseEther("0.001") });    
        expect(await token.balanceOf(addr1.address)).to.equal(tokenReward);

        const contractBalanceAfterGuess = await ethers.provider.getBalance(guessTheNumber.address);
        const contractBalanceIncludingGuess = contractBalanceAfterGuess.add(ethers.utils.parseEther("0.001"));

        const ethReward = (contractBalanceIncludingGuess * 80) / 100;
        await expect(guessTheNumber.connect(addr1).guess(secretNumber, { value: ethers.utils.parseEther("0.001") }))
            .to.emit(guessTheNumber, "Winner")
            .withArgs(addr1.address, ethReward);
    });    
});