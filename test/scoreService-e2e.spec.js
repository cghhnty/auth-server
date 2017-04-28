/**
 * @name
 * @description
 *
 * @author xuyuanxiang
 * @date 15/10/26
 */
var
    request = require('supertest'),
    server = require('../proxy.js')('http://dev.wosai.cn:3433'),
    should = require('should'),
    crypto = require('crypto');

describe('Server test:', function () {

    var clientId = '3d0a4890-78c6-11e5-946e-2567429d62b9',
        clientSecret = 'PvYz854QEWFSULjQwyorxw==';


    it('GET "/query/oxbmws63q8Y2rlY57dfCY6Ws9uPA" without BasicAuth Header expect 401', function (done) {
        request(server)
            .get('/query/oxbmws63q8Y2rlY57dfCY6Ws9uPA')
            .set('Content-Type', 'application/json; charset=utf8')
            .expect(401, done);
    });


    it('GET "/query/oxbmws63q8Y2rlY57dfCY6Ws9uPA" with wrong format BasicAuth Header expect 401', function (done) {
        var basicAuth = 'haha';
        request(server)
            .get('/query/oxbmws63q8Y2rlY57dfCY6Ws9uPA')
            .set('Content-Type', 'application/json; charset=utf8')
            .set('Authorization', 'Basic ' + basicAuth)
            .expect(401, done);
    });


    it('GET "/query/oxbmws63q8Y2rlY57dfCY6Ws9uPA" with right clientId expect 200', function (done) {

        var content = '';
        var md5 = crypto.createHash('md5');
        md5.update(content + clientSecret);
        var sign = md5.digest('hex');
        var basicAuth = new Buffer(clientId + ":" + sign, 'ascii').toString('base64');

        request(server)
            .get('/query/oxbmws63q8Y2rlY57dfCY6Ws9uPA')
            .set('Content-Type', 'application/json; charset=utf8')
            .set('Authorization', 'Basic ' + basicAuth)
            .send(content)
            .expect(200)
            .end(function (err, res) {
                if (err) return done(err);
                console.log(res);
                done();
            });

    });

});
