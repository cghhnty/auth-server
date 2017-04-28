var logger = require('../../components/logger')('client:shouqianba');
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
    logger.debug('SQB RPC getAppKeyByAppId endpoint');
    var content = JSON.stringify({
        id: (new Date()).getTime(),
        method: 'getAppKeyByAppId',
        params: [clientId]
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
            logger.error('SQB RPC getAppKeyByAppId', error);
            return callback(error);
        });

        res.on('end', function () {
            logger.debug('SQB RPC getAppKeyByAppId response:', buffer);
            var json;
            try {
                json = JSON.parse(buffer)
            } catch (e) {
                logger.error(buffer);
            }
            var secret = json ? json.result : null;
            if (secret) {
                var result = {id: clientId, secret: secret};
                logger.info('SQB RPC getAppKeyByAppId: ', result);
                return callback(null, result);
            } else {
                var error = new Error('client not exist.');
                error.status = 403;
                return callback(error);
            }
        });
    });
    logger.debug(content);
    request.on('error', function (error) {
        logger.error('SQB RPC getAppKeyByAppId', error);
        return callback(error);
    });
    request.write(content);
    request.end();
};

module.exports = function (scheme, host, port, path) {
    return new Client(scheme, host, port, path)
};
