const { hdkey } = require('ethereumjs-wallet');
const bip39 = require('bip39');
const Web3 = require('web3');


module.exports = function ETH() {

    // Default
    this.name = 'ethereum';
    this.coinType = 60;
    this.pathPrefix = `m/44'/${this.coinType}'/`

    this.web3 = new Web3(process.env.ETH_WEB3_PROVIDER);
    this.root = hdkey.fromMasterSeed(bip39.mnemonicToSeedSync(process.env.ETH_MNEMONIC));


    // Interface Methods
    this.derivePathToAddress = (path) => (this.root.derivePath(this.pathPrefix.concat(path)).getWallet().getAddressString());

    this.getBalance = (path) => (this.web3.eth.getBalance(this.derivePathToAddress(path)))

    this.createTX = (args) => {
        var from = this.derivePathToAddress(args.fromPath);
        var to = args.toAddress || this.derivePathToAddress(args.toPath);
        var value = args.amount;
        var gasPrice = (args.gasPrice || 20000000000);

        return new Promise(async (resolve, reject) => {
            try {
                var tx = {
                    from,
                    to,
                    gasPrice,
                    data: "",
                }
                tx.gas = await this.web3.eth.estimateGas(tx);
                tx.value = (value - (tx.gas * gasPrice));


                var fullPath = this.pathPrefix.concat(args.fromPath);
                const signedTransaction = await this.web3.eth.accounts.signTransaction(tx, this.root.derivePath(fullPath).getWallet().getPrivateKeyString());

                // console.log(signedTransaction);

                this.web3.eth.sendSignedTransaction(signedTransaction.rawTransaction)
                    .on('receipt', (r) => {
                        // console.log(r);
                        resolve(r);
                    });
            } catch (err) {
                return reject(err)
            }
        })
    }


    // Methods

}