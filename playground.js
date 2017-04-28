/**
 * 测试同时发起250个请求
 */

var crypto = require('crypto');
var https = require('http');
var _ = require('lodash');
var async = require('async');

var clientId = '05a6c7f6981a4de3882c064c68e5723d',
    clientSecret = '03f3e38fe70443efa0c9bac96266634a';

console.log('ClientId:\n %s', clientId);
console.log('ClientSecret:\n %s', clientSecret);

var parallelRequestNums = 1;
var parallelRequests = [];

for (var i = 0; i < parallelRequestNums; i++) {
    parallelRequests.push(function (done) {
        var content = '{"id":0,"method":"getStore","params":["536823e6-40cd-4ed3-90d8-b937573449fc"]}';
        var md5 = crypto.createHash('md5');
        md5.update(content + clientSecret, "utf8");
        var sign = md5.digest('hex');
        var basic = new Buffer(clientId + ":" + sign, 'ascii').toString('base64');
        var ops = {
            //host: 'auth.test.wosai.cn',
            host: 'localhost',
            port: 8080,
            path: '/taiji/rpc/store',
            method: 'POST',
            headers: {
                'Content-Length': Buffer.byteLength(content, 'utf8'),
                'Content-Type': 'application/json; charset=utf8',
                'Authorization': 'Basic ' + basic
            }
        };
        var request = https.request(ops, onComplete);
        request.write(content);
        request.end();

        function onComplete(res) {
            var buffer = '';

            res.setEncoding('utf8');

            res.on('data', function (chunk) {
                buffer = buffer + chunk;
            });

            res.on('error', function (error) {
                done(error);
            });

            res.on('end', function () {
                try {
                    var decoded = JSON.parse(buffer);
                    //console.log('Response:\n', decoded);
                } catch (e) {
                    //console.log(buffer);
                    decoded = buffer;
                }
                done(null, decoded);
            });
        }
    });
}

console.time('parallel');
async.parallel(parallelRequests, function (err, results) {
    if (err) {
        throw err;
    }
    console.log('success:', results.length);
    console.timeEnd('parallel');
});

