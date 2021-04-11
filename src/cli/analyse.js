/** 
 * Consolidate
 * 
 * $ npm run analyse -- startPath endPath
 * 
 * EXAMPLE
 * $ npm run analyse -- "0'/0/0" "0'/0/9" 
 * 
 * */

require('dotenv').load();
const BN = require('bn.js');
const { parsePath } = require('./../helpers');
const Interface = require('./../currencies').getInterface(process.env.COIN);
const interface = new Interface;

var [_, __, startPath, endPath] = process.argv;

var parsedStartPath = parsePath(startPath);
var parsedEndPath = parsePath(endPath);

console.log("\n");

console.log(`${interface.pathPrefix}...`);
console.log(`│  `);
console.log(`└─── Account: ${interface.pathPrefix}${parsedStartPath.account}/...`);
console.log(`    └─── Chain: ${interface.pathPrefix}${parsedStartPath.account}/${parsedStartPath.chain}/...`);

(async () => {
    for (let i = parseInt(parsedStartPath.address); i <= parseInt(parsedEndPath.address); i++) {
        var p = `${parsedStartPath.account}/${parsedStartPath.chain}/${i}`
        const address = await interface.derivePathToAddress(p);
        const balance = await interface.getBalance(p);

        console.log(`        │   Address: ${i}: ${address}`);
        if (balance != '0') {
            console.log(`        │   └─ Path:        ${interface.pathPrefix}${p}`);
            console.log(`        │   └─ Balance:     \x1b[32m${balance}\x1b[0m`);
            console.log(`        │   └─ Balance Hex: \x1b[32m${(new BN(balance, 10)).toString(16)}\x1b[0m`);
        }
        if (i != parseInt(parsedEndPath.address)) console.log(`        │`);
    }
    console.log(``);
})();
