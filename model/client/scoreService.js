var logger = require('../../components/logger')('client:scoreService');
var _ = require('lodash');
var map = {
    '3d0a4890-78c6-11e5-946e-2567429d62b9': 'PvYz854QEWFSULjQwyorxw==' // 一元云购
};

function Client(scheme, host, port, path) {
    this.options = {
        host: host,
        port: port,
        path: path
    };
    this.scheme = scheme;
}

Client.prototype.fetchById = function (clientId, callback) {
    var self = this;
    if (!clientId) {
        var error = new Error('client not exist.');
        error.status = 403;
        return callback(error);
    }
    var secret = map[clientId];
    if (!secret) {
        var error = new Error('client not exist.');
        error.status = 403;
        return callback(error);
    }
    callback(null, {id: clientId, secret: secret});
};

module.exports = function (scheme, host, port, path) {
    return new Client(scheme, host, port, path)
};
