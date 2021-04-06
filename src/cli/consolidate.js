/** 
 * Consolidate
 * 
 * $ npm run consolidate -- fromPath fromPathRangeEnd sendToPath [ limit ]
 * 
 * EXAMPLE
 * $ npm run consolidate -- "0'/0/1" 5 "0'/0/6" 
 * $ npm run consolidate -- "0'/0/1" 5 "0'/0/6" 82F8BC3F7BBFC0000
 * $ npm run consolidate -- "0'/0/1" ? "0'/0/6" 0xFF
 * 
 * */

require('dotenv').load();
const readline = require('readline');
const BN = require('bn.js');

const Interface = require('./../currencies').getInterface(process.env.COIN);

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const [_, __,
    fromPath,
    fromPathRangeEnd,
    sendToPath,
    limit,
] = process.argv;

if (!limit) limit = false;
const BN_limit = new BN(limit, 16);
var BN_total = new BN('0', 10);

const [
    HDaccount,
    HDchain,
    HDaddress,
] = fromPath.split('/');


// $fromPathRangeEnd must be larger than $HDaddress
if (parseInt(HDaddress) >= parseInt(fromPathRangeEnd)) throw Error('Bad address range');


(async () => {

    const interface = await (new Interface).init();
    const toAdress = interface.derivePathToAddress(sendToPath);
    console.log("\n");
    console.log(`To Path: ${sendToPath}`);
    console.log(`To Address:`, toAdress);
    if (limit) console.log(`Limit:`, BN_limit.toString(10));
    console.log("\n");


    return rl.question((
        `Consolidate funds in range ${HDaccount}/${HDchain}/{${HDaddress}...${fromPathRangeEnd}} to ${sendToPath}?`
    ), async () => {
        for (let i = parseInt(HDaddress); i <= parseInt(fromPathRangeEnd); i++) {

            // Get wallet balance
            var fromPath = `${HDaccount}/${HDchain}/${i}`;
            var address = interface.derivePathToAddress(fromPath);
            var amount = await interface.getBalance(address);
            var BN_amount = new BN(amount, 10);
            var BN_AT = BN_amount.add(BN_total);
            var shouldBreak;

            console.log(`\n -----------------`);
            console.log(`Path: ${fromPath}`);
            console.log(`Address: ${address}`);
            console.log(`Balance: ${amount}`);

            if (BN_amount.isZero()) {
                console.log(`Amount is 0. Skipping`);
                continue;
            }

            if (limit) {
                if (BN_AT.gt(BN_limit)) {
                    console.log(`AT > Limit`);
                    var BN_remainder = BN_limit.sub(BN_total);
                    amount = BN_remainder.toString(10);
                    BN_AT = BN_amount.add(BN_remainder);
                    shouldBreak = true;
                }
            }

            await interface.createTX({
                fromPath,
                toPath: sendToPath,
                amount,
            });

            BN_total = BN_AT;

            console.log(`TX: ${amount} from ${fromPath} to ${sendToPath} \n`);

            if (shouldBreak) {
                console.log('Limit reached. Breaking')
                break;
            }
        }

        return console.log('Done');
    });
})();
