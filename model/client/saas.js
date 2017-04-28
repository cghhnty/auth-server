var logger = require('../../components/logger')('client:saas');
var _ = require('lodash');

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
    logger.debug('SASS RPC getStoreByClientId endpoint');
    var content = JSON.stringify({
        id: (new Date()).getTime(),
        method: 'getStoreByClientId',
        params: [{}, clientId]
    });
    var requestOpts = _.merge(self.options, {
        method: 'POST',
        headers: {
            'Content-Length': Buffer.byteLength(content, 'utf8')
        }
    });
    if (self.scheme === 'https') {
        requestOpts.rejectUnauthorized = false;
        requestOpts.agent = false;
    }
    logger.debug(requestOpts);
    var request = require(self.scheme).request(requestOpts, function (res) {
        var buffer = '';

        res.setEncoding('utf8');

        res.on('data', function (chunk) {
            buffer = buffer + chunk;
        });

        res.on('error', function (error) {
            logger.error('SASS RPC getStoreByClientId', error);
            return callback(error);
        });

        res.on('end', function () {
            logger.debug('SASS RPC getStoreByClientId response:', buffer);
            var decoded;
            try {
                decoded = JSON.parse(buffer)
            } catch (e) {
                logger.error(buffer);
            }
            var store = decoded ? decoded.result : null;
            var wosaiAuth = store ? store.wosaiAuth : null;
            if (wosaiAuth) {
                logger.info('SASS RPC getStoreByClientId: ', wosaiAuth);
                return callback(null, {
                    id: wosaiAuth.wosaiClientId,
                    secret: wosaiAuth.wosaiClientSecret
                });
            } else {
                var error = new Error('client not exist.');
                error.status = 403;
                return callback(error);
            }
        });
    });
    logger.debug(content);
    request.on('error', function (error) {
        logger.error('SASS RPC getStoreByClientId', error);
        return callback(error);
    });
    request.write(content);
    request.end();
};

module.exports = function (scheme, host, port, path) {
    return new Client(scheme, host, port, path)
};
