var crypto = require('crypto');

var clientId = '05a6c7f6981a4de3882c064c68e5723d',
    clientSecret = '03f3e38fe70443efa0c9bac96266634a';

var content = '{"id":0,"jsonrpc":"2.0","method":"createVoucherDef","params":[{"deviceId":"4575426b-e1e5-4372-a5fe-f25d2959aae4","page":1,"pageSize":10,"storeId":"54e8b5e5-b53f-4fc5-9a99-361591ce29cc"},{"effectiveDate":1446788002506,"faceValue":24600,"name":"test","status":"Normal","storeId":"54e8b5e5-b53f-4fc5-9a99-361591ce29cc"}]}'
var md5 = crypto.createHash('md5');
md5.update(content + clientSecret, "utf8");
var sign = md5.digest('hex');
console.log(sign);
var basic = new Buffer(clientId + ":" + sign).toString('base64');
var headers = {
    'Content-Type': 'application/json; charset=utf8',
    'Authorization': 'Basic ' + basic
};
console.log(headers);
