const monerojs = require("monero-javascript");


module.exports = function XMR() {

    // Default
    this.name = 'monero';
    this.coinType = 128;
    this.pathPrefix = `m/44'/${this.coinType}'/`

    this.boot = async () => {
        this.wallet = await monerojs.createWalletFull({
            mnemonic: process.env.XMR_MNEMONIC,
            // password: "supersecretpassword123",
            networkType: "stagenet",
            serverUri: "http://localhost:38081",
            serverUsername: "superuser",
            serverPassword: "abctesting123",
            restoreHeight: process.env.XMR_WALLET_RESTORE_HEIGHT || 0,
        });
    }
    this.boot()



    // Interface Methods
    this.derivePathToAddress = async (path) => {
        path = this.parsePath(path);
        return await this.wallet.getAddress(path.account, path.address);
    };

    this.getBalance = (path) => (this.wallet.getBalance(this.derivePathToAddress(path)));

    this.createTX = async (tx) => {

        var path = this.parsePath(tx.fromPath);

        let createdTx = await this.wallet.createTx({
            accountIndex: path.account,
            subaddressIndex: path.address,
            address: tx.toPath,
            amount: tx.amount, // BN convert to int?
        });

        await walletRpc.relayTx(createdTx); // relay the transaction
    }


    // Methods
    this.parsePath = (path) => {
        let [
            account,
            chain,
            address,
        ] = path.split('/');

        return {
            account,
            chain,
            address,
        }
    };
}