module.exports = {
    parsePath: (path) => {
        let [account, chain, address] = path.split('/');
        return { account, chain, address }
    }
}