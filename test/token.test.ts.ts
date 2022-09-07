import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers, upgrades } from "hardhat";

describe("Upgradeable token", function () {
  async function dep() {
    const [ deployer ] = await ethers.getSigners();
 
    const NFTFactory = await ethers.getContractFactory("MyToken");
    const token = await upgrades.deployProxy(NFTFactory, [], {   // первым аргументом передаем фабрику которая будет использована для деплоя, вторым аргументы деплоя которые передаются как бы в конструктор, которые будут переданы в функцию initialize, которая будет вызвана сразу после деплоя
      initializer: 'initialize', // здесь указывается функция которая будет вызвана после деплоя
    })
    // token - это proxy контракт, который делает delegatecall на имплементацию

    await token.deployed();

    return { token, deployer };
  }
  

  it("works", async function () {
     const { token, deployer } = await loadFixture(dep);

     const mintTx = await token.safeMint(deployer.address, "qwertythb");
     await mintTx.wait();

     expect(await token.balanceOf(deployer.address)).to.eq(1);

     const NFTFactoryV2 = await ethers.getContractFactory("MyTokenV2");
     const token2 = await upgrades.upgradeProxy(token.address, NFTFactoryV2);

     expect(token.address).to.eq(token2.address);


     expect(await token.balanceOf(deployer.address)).to.eq(1);

     expect(await token2.demo()).to.eq(true);

 
  });
});


//   crepeAmount = ((userAmount + estimatedUSDC) * TotalCrepe) / (TotalAccumulated + estimatedUSDC)

//   TotalAccumulated -- how much has the USDC collected at the moment
//   TotalCrepe -- How many Crepe tokens are played in IDO in total
//   userAmount -- How much the user has already invested in IDO at the moment, if the user invests for the first time, the value is zero
//   estimatedUSDC -- How much the user is expected to invest in USDC

// 26 minutes
