/** 
 * Create State
 * 
 * $ npm run createState -- [ path ]
 *
 * */

const fs = require('fs');

let path = process.argv[2] || '.spot-state';

let defaultState = {
    i: 1
};

fs.exists(path, (exists) => {
    if (!exists) {
        fs.writeFile(path, JSON.stringify(defaultState), (err) => {
            if (err) throw err;
            console.log(`State file created at ${path} \n`);
        });
    } else {

        fs.readFile(path, 'utf8', (err, data) => {
            if (err) throw err;

            try {
                var state = JSON.parse(data);
                console.log(`State file already exists at ${path} \n`);
            } catch (err) {
                console.error(`State file could not be parsed \n`);
                throw err;
            }
        })
    }
});