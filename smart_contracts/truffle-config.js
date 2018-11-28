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
var HDWalletProvider = require('truffle-hdwallet-provider');

const mnemonic = 'trick core barely fold sample icon display hollow smoke task emotion pepper';
const infura = 'https://rinkeby.infura.io/v3/0b9b105a9d734105978462df3e9ec6b8';

module.exports = {
    networks: {
        development: {
            host: 'localhost',
            port: 8545,
            network_id: "*"
        },
        rinkeby: {
            provider: function() {
                return new HDWalletProvider(mnemonic, infura)
            },
            network_id: 4,
            gas: 4500000,
            gasPrice: 10000000000
        }
    }
};