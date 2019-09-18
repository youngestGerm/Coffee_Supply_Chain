var HDWalletProvider = require("truffle-hdwallet-provider");
var mnemonic = 'figure moon return eager carpet brother swing oven stone swarm cabbage enroll'

module.exports = {
  networks: {
    rinkeby: {
      provider: () => {
        return new HDWalletProvider(mnemonic, 'https://rinkeby.infura.io/v3/e12cc82105e143dfba4e81d9b3da432b')
      },
      network_id: 4,
      gas: 4500000,
      gasPrice: 10000000000,
    }
    

  },
  compilers: {
    solc: {
      version: "0.4.24" // ex:  "0.4.20". (Default: Truffle's installed solc)
    }
 }
};