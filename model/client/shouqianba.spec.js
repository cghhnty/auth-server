var shouqianbaClient = require('./shouqianba')('http', 'backend.test.shouqianba.com', 80, '/rpc/channel');
var should = require('should');

describe('Shouqianba client impl test:', function () {
    var clientId = "14482669783589542";

    it('should response client object with "id" and "secret" property', function (done) {
        shouqianbaClient.fetchById(clientId, function (err, client) {
            if (err) {
                return done(err);
            }
            client.should.have.property('id');
            client.should.have.property('secret');
            done();
        });
    });

});





