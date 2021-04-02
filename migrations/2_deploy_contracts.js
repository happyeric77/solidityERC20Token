const MyToken = artifacts.require("MyToken.sol");
const MyTokenSale = artifacts.require("MyTokenSale.sol")
const KycContract = artifacts.require("KycContract.sol")

const dotenv = require('dotenv')
result = dotenv.config({ path: "../.env" })

if (result.error) {
    console.log("Fail to load .env varilable: migrations.2_deploy_contracts")
    throw result.error
}


module.exports = async function (deployer) {
    const accounts = await web3.eth.getAccounts();
    await deployer.deploy(MyToken, process.env.INITIAL_TOKEN);
    await deployer.deploy(KycContract)
    await deployer.deploy(MyTokenSale, 1, accounts[0], MyToken.address, KycContract.address);
    const instance = await MyToken.deployed();
    await instance.transfer(MyTokenSale.address, process.env.INITIAL_TOKEN)
};
