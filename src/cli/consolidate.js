/** 
 * Consolidate
 * 
 * $ npm run consolidate -- fromPath fromPathRangeEnd toPath [ limit ]
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
const interface = new Interface;

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

var [_, __,
    fromPath,
    fromPathRangeEnd,
    toPath,
    limit,
] = process.argv;

if (!limit) limit = false;
const BN_limit = new BN(limit, 16);
var BN_total = new BN('0', 10);
var transactions = 0;

const [
    HDaccount,
    HDchain,
    HDaddress,
] = fromPath.split('/');


// $fromPathRangeEnd must be larger than $HDaddress
if (parseInt(HDaddress) >= parseInt(fromPathRangeEnd)) throw Error('Bad address range');


(async () => {

    const toAdress = interface.derivePathToAddress(toPath);
    console.log("\n");
    console.log(`To Path: ${toPath}`);
    console.log(`To Address:`, toAdress);
    if (limit) console.log(`Limit:`, BN_limit.toString(10));
    console.log("\n");


    return rl.question((
        `Consolidate funds in range ${HDaccount}/${HDchain}/{${HDaddress}...${fromPathRangeEnd}} to ${toPath}?`
    ), async () => {
        for (let i = parseInt(HDaddress); i <= parseInt(fromPathRangeEnd); i++) {
            try {
                var path = `${HDaccount}/${HDchain}/${i}`;
                var amount = await interface.getBalance(path);
                var BN_amount = new BN(amount, 10);
                var BN_AT = BN_amount.add(BN_total);
                var limitReached;

                console.log(`\n-----------------`);
                console.log(`Path: ${path}`);
                console.log(`Address:`, interface.derivePathToAddress(path));
                console.log(`Balance: ${amount}`);

                if (BN_amount.isZero()) {
                    console.log(`Amount is 0. Skipping`);
                    continue;
                }

                if (limit) {
                    if (BN_AT.gt(BN_limit)) {
                        console.log('\x1b[31m%s\x1b[0m', 'Limit!');
                        var BN_remainder = BN_limit.sub(BN_total);
                        amount = BN_remainder.toString(10);
                        BN_AT = BN_amount.add(BN_remainder);
                        limitReached = true;
                    }
                }

                await interface.createTX({
                    fromPath: path,
                    toPath,
                    amount,
                });

                transactions++;

                BN_total = BN_AT;

                console.log(`TX: ${amount} from ${path} to ${toPath} \n`);

                if (limitReached) {
                    console.log('Limit reached. Breaking \n')
                    break;
                }
            } catch (err) {
                console.error(err);
            }
        }

        console.log(`\n--------------`);
        console.log(`Total moved: ${BN_total.toString(16)}`);
        console.log(`Total moved: ${BN_total.toString(10)}`);
        console.log(`Transactions: ${transactions}`);
        console.log('\x1b[32m%s\x1b[0m', 'Done!');
        return;
    });
})();
