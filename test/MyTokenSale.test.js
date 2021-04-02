const Token = artifacts.require("MyToken")
const TokenSale = artifacts.require("MyTokenSale")
const KycContract = artifacts.require("KycContract")
const expect = require("./setupTest")

const dotenv = require('dotenv');
const { exec } = require("child_process");
result = dotenv.config({ path: "./.env" });
if (result.error) {
    console.log("Fail to load .env varilable: test.MyToken.test.js")
    throw result.error
}

const BN = web3.utils.BN

contract("TokenSale Test", async (accounts)=>{

    it("Token balance of contract owner account should be ZERO", async () => {
        let instance = await Token.deployed();
        expect(await instance.balanceOf(accounts[0])).to.be.a.bignumber.equal(new BN(0));
    });

    it("All token should be in MyTokenSale contract address by default", async ()=>{
        let instance = await Token.deployed();
        let tokenSaleInstance = await TokenSale.deployed();
        let totalSupply = await instance.totalSupply();
        expect(await instance.balanceOf(tokenSaleInstance.address)).to.be.a.bignumber.equal(totalSupply)
    });

    it("Should be able to buy token with KYC", async () => {
        let instance = await Token.deployed();
        let tokenSaleInstance = await TokenSale.deployed();
        let KycContractInstance = await KycContract.deployed();
        let totalSupply = await instance.totalSupply();
        await KycContractInstance.setKeyCompleted(accounts[0])
        await tokenSaleInstance.sendTransaction({from: accounts[0], value: web3.utils.toWei("1", "wei")})
        expect(await instance.balanceOf(accounts[0])).to.be.a.bignumber.equal(new BN(1));
        expect(await instance.balanceOf(tokenSaleInstance.address)).to.be.a.bignumber.equal(totalSupply.sub(new BN(1)))
    })

    it("Should be able to check the kyc white list", async () => {
        let KycContractInstance = await KycContract.deployed();
        let ok = await KycContractInstance.kycStatus(accounts[0]);
        expect(ok).equal(true)
    })

});