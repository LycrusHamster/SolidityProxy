/*
 * NB: since truffle-hdwallet-provider 0.0.5 you must wrap HDWallet providers in a
 * function when declaring them. Failure to do so will cause commands to hang. ex:
 * ```
 * mainnet: {
 *     provider: function() {
 *       return new HDWalletProvider(mnemonic, 'https://mainnet.infura.io/<infura-key>')
 *     },
 *     network_id: '1',
 *     gas: 4500000,
 *     gasPrice: 10000000000,
 *   },
 */

let mnemonic = 'stuff denial chuckle permit shell orbit priority solution dog cool stone blush';
module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  networks: {

    development: {
      host: '127.0.0.1',
      port: 7545,
      network_id: '*', // * for Match any network id
      // gas: 8000000,
      gas: 6721975,
      // gasPrice: 4000000000
      gasPrice: 4000000000
    }
  },
  /*
    logger: {
        log: function(input) {console.log(new Date().toLocaleString() + input)},
    }, */
  compilers: {
    solc: {
      version: '0.5.11', // let's use the native for faster work
      settings: {
        optimizer: {
          enabled: true, // Default: false
          runs: 200     // Default: 200
        },
        evmVersion: "petersburg"  // Default: "byzantium"
      }
    }
  },
  mocha: {
    enableTimeouts: false,
    bail: true
  }
};
