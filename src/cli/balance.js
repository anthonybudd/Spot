/** 
 * Consolidate
 * 
 * $ npm run balance -- path [rangeLimit]
 * 
 * EXAMPLE
 * $ npm run balance -- "0'/0/0" 
 * $ npm run balance -- "0'/0/0" "0'/0/5" 
 * 
 * */

require('dotenv').load();
const BN = require('bn.js');
const { parsePath } = require('./../helpers');
const Interface = require('./../currencies').getInterface(process.env.COIN);
const interface = new Interface;

var [_, __, path, rangeLimit] = process.argv;

var parsedPath = parsePath(path);
var end = parsedPath.address;
if (rangeLimit) end = parsePath(rangeLimit).address;

console.log("\n");

(async () => {
    for (let i = parseInt(parsedPath.address); i <= parseInt(end); i++) {
        var p = `${parsedPath.account}/${parsedPath.chain}/${i}`
        const address = await interface.derivePathToAddress(p);
        const balance = await interface.getBalance(p);

        console.log("--------------------------");
        console.log(`Path:       `, p);
        console.log(`Address:    `, address);
        console.log(`Balance:    `, balance);
        console.log(`Balance Hex:`, (new BN(balance, 10)).toString(16));
        console.log("\n");
    }
})();
