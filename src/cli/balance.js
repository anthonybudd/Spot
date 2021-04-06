/** 
 * Consolidate
 * 
 * $ npm run balance -- path
 * 
 * EXAMPLE
 * $ npm run balance -- "0'/0/1"
 * 
 * */

require('dotenv').load();
const BN = require('bn.js');


(async () => {

    const [_, __,
        path,
    ] = process.argv;

    const Interface = require('./../currencies').getInterface(process.env.COIN);
    const interface = await (new Interface).init();

    const address = await interface.derivePathToAddress(path);
    // const balance = await interface.getBalance(address);

    console.log("\n");
    console.log(`Path:`, path);
    console.log(`Address:`, address);
    // console.log(`Balance:`, balance);
    // console.log(`Balance Hex:`, (new BN(balance, 10)).toString(16));
    console.log("\n");
})();
