require('dotenv').load();
const { version } = require('./../package');
const createHash = require('create-hash');
const bs58check = require('bs58check');
const express = require('express');
const QRCode = require('qrcode');
const hdkey = require('hdkey');
const http = require('http');

console.log(`* SPOT v${version}`);

const ROOT_PUBLIC_KEY = process.env.ROOT_PUBLIC_KEY;
if (!ROOT_PUBLIC_KEY) throw Error('No ROOT_PUBLIC_KEY');
const root = hdkey.fromExtendedKey(process.env.ROOT_PUBLIC_KEY);
const app = express();

app.get('/api/v1/generate/:account/:chain/:address', (req, res) => {
    const account = req.params.account;
    const chain = req.params.chain;
    const [addr, extension] = req.params.address.split('.');
    var amount = req.query.amount || '';

    // https://gist.github.com/arshbot/95ebc715660e2c6b43ae0e9ae95f3f10
    const addrnode = root.derive(`m/44/${process.env.COIN_TYPE}/${account}/${chain}/${addr}`);
    const step1 = addrnode._publicKey;
    const step2 = createHash('sha256').update(step1).digest();
    const step3 = createHash('rmd160').update(step2).digest();
    var step4 = Buffer.allocUnsafe(21);
    step4.writeUInt8(process.env.VERSION_BYTE, 0);
    step3.copy(step4, 1);
    const address = bs58check.encode(step4);

    switch (extension) {
        case 'png':
            if (amount) amount = `?amount=${amount}`;
            QRCode.toDataURL(`bitcoin:${address}${amount}`, {}, (err, dataURL) => {
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
            QRCode.toString(`bitcoin:${address}${amount}`, { type: 'svg' }, (err, svg) => {
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