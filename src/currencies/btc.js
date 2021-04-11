const bitcoinJS = require('bitcoinjs-lib');
const bip39 = require('bip39');
const bip32 = require('bip32');


module.exports = function BTC() {

    // Default
    this.name = 'bitcoin';
    this.coinType = 0;
    this.pathPrefix = `m/44'/${this.coinType}'/`

    // Extra
    this.root = bip32.fromSeed(bip39.mnemonicToSeedSync(process.env.BTC_MNEMONIC));



    // Interface Methods
    this.derivePathToAddress = async (path) => {
        var node = await this.root.derivePath(this.pathPrefix.concat(path))
        return await bitcoinJS.payments.p2pkh({ pubkey: node.publicKey }).address
    };

    this.getBalance = (path) => {

    };

    this.createTX = (tx) => { }


    // Methods
}