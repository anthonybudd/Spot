const supported = {
    ETH: require('./eth'),
    BTC: require('./btc'),
    XMR: require('./xmr'),
}

module.exports = {
    getInterface: (symbol) => (supported[symbol]),
    ...supported
}