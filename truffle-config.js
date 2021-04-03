const path = require("path");
const HDWallet = require("@truffle/hdwallet-provider");
const mnemonic = "";
const accountIndex = 0;
require("dotenv").config({path: "./.env"})

module.exports = {
  contracts_build_directory: path.join(__dirname, "src/contracts"),
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: 5777 // Match any network id
    },
    ganache_local: {
      provider: function() {
        return new HDWallet(process.env.MNEMONIC, "http://127.0.0.1:7545" , accountIndex)
      },
      network_id: 5777
    },
    gorli_infrua: {
      provider: function() {
        return new HDWallet(process.env.MNEMONIC, "https://goerli.infura.io/v3/6458cbdc12124744a4be937d7d4c8af7" , accountIndex)
      },
      network_id: 5
    },
  },
  compilers: {
    solc: {
      version: "0.8.0",    // Fetch exact version from solc-bin (default: truffle's version)
    },
  },
  solc: {
    optimizer: {
      enabled: true,
      runs: 200
    }
  }
}