/**
 * @name
 * @description
 *
 * @author xuyuanxiang
 * @date 15/10/26
 */
var
    request = require('supertest'),
    server = require('../proxy.js')('http://test-backend.wosai.cn'),
    should = require('should'),
    crypto = require('crypto');

describe('Server test:', function () {

    var clientId = 'ef4dbbc9f36c4f9fbeb001830607361c',
        clientSecret = '6ef7768d06c5487ebc74c8539469f3c3';


    it('POST "/taiji/rpc/order" without BasicAuth Header expect 401', function (done) {
        request(server)
            .post('/taiji/rpc/order')
            .set('Content-Type', 'application/json; charset=utf8')
            .expect(401, done);
    });

    it('POST "/taiji/rpc/order" with wrong format BasicAuth Header expect 401', function (done) {
        var basicAuth = 'haha';
        request(server)
            .post('/taiji/rpc/order')
            .set('Content-Type', 'application/json; charset=utf8')
            .set('Authorization', 'Basic ' + basicAuth)
            .expect(401, done);
    });


    it('POST "/taiji/rpc/order" with non-existent clientId expect 403', function (done) {
        var url = '/taiji/rpc/order';
        var params = {
            method: 'getOrders',
            params: ['11']
        };
        var content = JSON.stringify(params, 0);

        var md5 = crypto.createHmac('md5', clientSecret);
        md5.update(content);
        var sign = md5.digest('hex');
        var basicAuth = new Buffer('wahaha' + ":" + sign, 'ascii').toString('base64');

        request(server)
            .post(url)
            .set('Content-Type', 'application/json; charset=utf8')
            .set('Authorization', 'Basic ' + basicAuth)
            .send(content)
            .expect(403, done);

    });

    it('POST "/taiji/rpc/order" with wrong signature expect 403', function (done) {
        var url = '/taiji/rpc/order';
        var params = {
            method: 'getOrders',
            params: ['11']
        };
        var content = JSON.stringify(params, 0);

        var basicAuth = new Buffer(clientId + ":" + 'wahaha', 'ascii').toString('base64');

        request(server)
            .post(url)
            .set('Content-Type', 'application/json; charset=utf8')
            .set('Authorization', 'Basic ' + basicAuth)
            .send(content)
            .expect(403, done);

    });

    it('POST "/taiji/rpc/store" call getStore method all right expect 200', function (done) {
        var url = '/taiji/rpc/store';
        var content = '{"id":0,"method":"getStoresByParent","params":[{"storeId":"457d878a-aca9-4c6a-bb73-5aa46bc13d40"},"457d878a-aca9-4c6a-bb73-5aa46bc13d40"]}';
        var md5 = crypto.createHash('md5');
        md5.update(content + clientSecret, 'utf8');
        var sign = md5.digest('hex');
        var basicAuth = new Buffer(clientId + ":" + sign, 'ascii').toString('base64');

        request(server)
            .post(url)
            .set('Content-Type', 'application/json; charset=utf8')
            .set('Authorization', 'Basic ' + basicAuth)
            .send(content)
            .expect(200)
            .end(function (err, res) {
                if (err) return done(err);
                done();
            });

    });

});
