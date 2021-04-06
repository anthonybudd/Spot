require('dotenv').load();
const Interface = require('./../currencies').getInterface(process.env.COIN);
const { version } = require('./../package');
const express = require('express');
const QRCode = require('qrcode');
const http = require('http');

console.log(`* SPOT v${version}`);

const interface = new Interface;
const app = express();


app.get('/api/v1/generate/:account/:chain/:address', async (req, res) => {

    const account = req.params.account;
    const chain = req.params.chain;
    const [addr, extension] = req.params.address.split('.');
    var amount = req.query.amount || '';

    const address = interface.derivePathToAddress(`${account}'/${chain}/${addr}`);

    switch (extension) {
        case 'png':
            if (amount) amount = `?amount=${amount}`;
            QRCode.toDataURL(`${interface.name}:${address}${amount}`, {}, (err, dataURL) => {
                if (err) throw err;
                var img = Buffer.from(dataURL.replace(/^data:image\/(png);base64,/, ''), 'base64');
                res.writeHead(200, {
                    'Content-Type': 'image/png',
                    'Content-Length': img.length
                });
                return res.end(img);
            });
            break;

        case 'svg':
            if (amount) amount = `?amount=${amount}`;
            QRCode.toString(`${interface.name}:${address}${amount}`, { type: 'svg' }, (err, svg) => {
                if (err) throw err;
                return res.send(svg);
            });
            break;

        case 'json':
        default:
            return res.json({ address });
            break;
    }
});

var port = process.env.PORT || 8888;
http.createServer(app).listen(port, () => console.log(`* Listening: http://localhost:${port}`));
module.exports = app;