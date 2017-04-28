/**
 * @name
 * @description
 *
 * @author xuyuanxiang
 * @date 15/10/26
 */
var
    request = require('supertest'),
    server = require('../proxy.js')('http://backend.test.shouqianba.com'),
    should = require('should'),
    crypto = require('crypto');

describe('Server test:', function () {

    var clientId = '14465408359942194',
        clientSecret = 'e4efe772e1e7e69293799c5aade10537188888888863499',
        requestPath = '/rpc/store';


    it('POST "' + requestPath + '" without BasicAuth Header expect 401', function (done) {
        request(server)
            .post(requestPath)
            .set('Content-Type', 'application/json; charset=utf8')
            .expect(401, done);
    });

    it('POST "' + requestPath + '" with wrong format BasicAuth Header expect 401', function (done) {
        var basicAuth = 'haha';
        request(server)
            .post(requestPath)
            .set('Content-Type', 'application/json; charset=utf8')
            .set('Authorization', 'Basic ' + basicAuth)
            .expect(401, done);
    });


    it('POST "' + requestPath + '" with non-existent clientId expect 403', function (done) {
        var params = {
            method: 'getStore',
            params: ['11']
        };
        var content = JSON.stringify(params, 0);

        var md5 = crypto.createHmac('md5', clientSecret);
        md5.update(content, 'utf-8');
        var sign = md5.digest('hex');
        var basicAuth = new Buffer('wahaha' + ":" + sign, 'ascii').toString('base64');

        request(server)
            .post(requestPath)
            .set('Content-Type', 'application/json; charset=utf8')
            .set('Authorization', 'Basic ' + basicAuth)
            .send(content)
            .expect(403, done);

    });

    it('POST "' + requestPath + '" with wrong signature expect 403', function (done) {
        var params = {
            method: 'getStore',
            params: ['11']
        };
        var content = JSON.stringify(params, 0);

        var basicAuth = new Buffer(clientId + ":" + 'wahaha', 'ascii').toString('base64');

        request(server)
            .post(requestPath)
            .set('Content-Type', 'application/json; charset=utf8')
            .set('Authorization', 'Basic ' + basicAuth)
            .send(content)
            .expect(403, done);

    });

    it('POST "' + requestPath + '" call getStore method all right expect 200', function (done) {
        var params = {
            method: 'getStore',
            params: ['11']
        };
        var content = JSON.stringify(params);

        var md5 = crypto.createHash('md5');
        md5.update(content + clientSecret, 'utf8');
        var sign = md5.digest('hex');
        var basicAuth = new Buffer(clientId + ":" + sign, 'ascii').toString('base64');

        request(server)
            .post(requestPath)
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
