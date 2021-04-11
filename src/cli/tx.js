/** 
 * Consolidate
 * 
 * $ npm run tx -- fromPath toAddress amount
 * 
 * EXAMPLE
 * $ npm run tx -- "0'/0/5" 0x74a9fd6cdaac456485b6c675be59845584675ec7 56bc75e2d63100000
 * 
 * */

require('dotenv').load();
const readline = require('readline');
const BN = require('bn.js');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});


const Interface = require('./../currencies').getInterface(process.env.COIN);
const interface = new Interface;


var [_, __,
    fromPath,
    toAddress,
    amount,
] = process.argv;


const BN_amount = new BN(amount, 16);

console.log(`\n`);
console.log(`From Address: ${interface.derivePathToAddress(fromPath)}`);
console.log(`To Address:   ${toAddress}`);
console.log(`Amount:       ${BN_amount.toString(10)}`);
console.log(`\n`);


rl.question((
    `Send ${BN_amount.toString(10)} from ${fromPath} to ${toAddress}?`
), async () => {
    try {
        var r = await interface.createTX({
            fromPath,
            toAddress,
            amount: BN_amount.toString(10),
        });
        console.log(r);
    } catch (err) {
        console.error(err);
    }
});
