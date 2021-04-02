const path = require("path");
const HDWallet = require("@truffle/hdwallet-provider");
const mnemonic = "";
const accountIndex = 0;
require("dotenv").config({path: "./.env"})

console.log(path.resolve("./.env"))
console.log(process.env.MNEMONIC)
console.log(path.join(__dirname, "src/"))
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
    }
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