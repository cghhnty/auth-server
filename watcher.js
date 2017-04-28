/**
 * 运维监控脚本
 */
var crypto = require('crypto');
var https = require('https');

var clientId = 'ef4dbbc9f36c4f9fbeb001830607361c',
    clientSecret = '6ef7768d06c5487ebc74c8539469f3c3';

var request_timer, response_timer;


var content = '{"id":0,"method":"getStoresByParent","params":[{"storeId":"457d878a-aca9-4c6a-bb73-5aa46bc13d40"},"457d878a-aca9-4c6a-bb73-5aa46bc13d40"]}';
var md5 = crypto.createHash('md5');
md5.update(content + clientSecret, "utf8");
var sign = md5.digest('hex');
var basic = new Buffer(clientId + ":" + sign, 'ascii').toString('base64');

var ops = {
    host: '10.7.111.46',
    port: 443,
    path: '/taiji/rpc/store',
    method: 'POST',
    rejectUnauthorized: false,
    headers: {
        'Content-Length': Buffer.byteLength(content, 'utf8'),
        'Content-Type': 'application/json; charset=utf8',
        'Authorization': 'Basic ' + basic
    }
};

var request = https.request(ops, function (res) {
    var buffer = '';
    clearTimeout(request_timer);

    response_timer = setTimeout(function () {
        res.destroy();
        throw new Error('Response timeout.');
    }, 60000);

    res.setEncoding('utf8');

    res.on('data', function (chunk) {
        buffer = buffer + chunk;
    });

    res.on('error', function (error) {
        console.error(error);
        throw new Error('Auth-Server Response error.');
    });

    res.on('end', function () {
        clearTimeout(response_timer);
        try {
            var decoded = JSON.parse(buffer);
            console.log(decoded);
        } catch (e) {
            console.error(buffer);
            throw new Error('Backend Response error.');
        }
    });
});

request.on('error', function (error) {
    console.error(error);
    throw new Error('Auth-Server request error.');
});

request.write(content);
request.end();
request_timer = setTimeout(function () {
    request.abort();
    throw new Error('Request timeout.')
}, 10000);

