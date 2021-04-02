const Token = artifacts.require("MyToken")
const path = require("path");
const expect = require("./setupTest")

const dotenv = require('dotenv');
result = dotenv.config({ path: "./.env" });
if (result.error) {
    console.log("Fail to load .env varilable: test.MyToken.test.js")
    throw result.error
}

const BN = web3.utils.BN

contract("Token Test", async (accounts)=>{

    beforeEach(async ()=>{
        this.myToken = Token.new(process.env.INITIAL_TOKEN)
    })

    it("All tokens should be in my account", async () => {
        let instance = await this.myToken;
        let totalSupply = await instance.totalSupply();
        // let balance = await instance.balanceOf(accounts[0]);
        // assert.equal(balance.valueOf(), initialSupply.valueOf(), "The balance was not the same");
        expect(await instance.balanceOf(accounts[0])).to.be.a.bignumber.equal(totalSupply);
    });

    it("Is possible to send tokens between accounts", async () => {
        const sendTokens = 10;
        let instance = await this.myToken
        let totalSupply = await instance.totalSupply();
        const a = await instance.balanceOf(accounts[0])

        expect(await instance.balanceOf(accounts[0])).to.be.a.bignumber.equal(totalSupply);
        await instance.transfer(accounts[1], sendTokens)
        expect(await instance.balanceOf(accounts[0])).to.be.a.bignumber.equal(totalSupply.sub(new BN(sendTokens)));
        expect(await instance.balanceOf(accounts[1])).to.be.a.bignumber.equal(new BN(sendTokens));
    });

    it("Is not possible to send more tokens than available in total", async ()=>{
        let instance = await this.myToken
        let balanceOfDeployer = await instance.balanceOf(accounts[0]);
        var err = null;
        try {
            await instance.transfer(accounts[0], new BN(balanceOfDeployer+1)) 
        } catch(error) {
            err = error            
        }
        assert.equal(!err, false, "ERROR: sendable token larger than total token")
    });

})