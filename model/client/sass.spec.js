var saasClient = require('./saas')('http', 'test-backend.wosai.cn', 80, '/taiji/rpc/store');
var should = require('should');

describe('Saas client impl test:', function () {
    var clientId = "3e7cad629c3942efb576d2962977c35d";
    it('should response client object with "id" and "secret" property', function () {
        saasClient.fetchById(clientId, function (err, client) {
            if (err) {
                return done(err);
            }
            client.should.have.property('id');
            client.should.have.property('secret');
            done();
        });
    });

});

