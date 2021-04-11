/** 
 * Address
 * 
 * Derive a path to an address
 * 
 * $ npm run derive -- path
 * 
 * EXAMPLE
 * $ npm run derive -- "0'/0/1"
 * 
 * */

require('dotenv').load();


(async () => {

    const [_, __, path] = process.argv;
    const Interface = require('./../currencies').getInterface(process.env.COIN);
    console.log(Interface);

    const interface = new Interface;
    const address = await interface.derivePathToAddress(path);


    console.log(address);
})();
