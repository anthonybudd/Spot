const supported = {
    ETH: require('./eth'),
    BTC: require('./btc'),
}

module.exports = {
    getInterface: (symbol) => (supported[symbol]),
    ...supported
}