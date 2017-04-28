var TYPE = process.env.CLIENT_TYPE ? process.env.CLIENT_TYPE : 'saas';
var URL_REGEXP = /(http|https):\/\/([\w\-_]+(?:\.([\w\-_]+))+)(?::([\d]+))*([\w\-\.,@?^=%&amp;:/~\+#]*[\w\-\@?^=%&amp;/~\+#])?/;
var _ = require('lodash');
var config = require('../../config/environment');
var redis = require('../../components/redis');
var async = require('async');
var util = require('util');
var logger = require('../../components/logger')('client');
var ClientImpl = require('./' + TYPE);


var CLIENT_KEY = 'auth-server:client:%s';

function Client(scheme, host, port, path) {
    this.clientImpl = new ClientImpl(scheme, host, port, path);
}

Client.prototype.fetchById = function (clientId, callback) {
    var self = this;

    async.waterfall([
        // redis select index
        function (done) {
            logger.debug('Redis SELECT endpoint.');
            if (config.redis.index) {
                redis.select(config.redis.index, function (err, result) {
                    if (err) {
                        logger.error(err);
                    }
                    logger.debug('Redis use %d index', config.redis.index);
                    done();
                });
            } else {
                logger.debug('Redis use default index.');
		logger.debug(config.redis.host);
                done();
            }
        },

        function (done) {
            var clientKey = util.format(CLIENT_KEY, clientId);
            logger.debug('Redis GET %s endpoint.', clientKey);
            redis.get(clientKey, function (err, stringified) {
                if (err) {
                    logger.error(err);
                }
                logger.debug('Redis GET %s result: \n', clientKey, stringified);
                if (!err && stringified && stringified != "null") {
                    try {
                        var obj = JSON.parse(stringified);
                        return done(null, obj);
                    } catch (e) {
                        done();
                    }
                } else {
                    done();
                }
            });
        },

        function (data, done) {
            if (typeof data !== 'function') {
                return done(null, data);
            }
            if (typeof data === 'function') {
                done = data;
            }
            self.clientImpl.fetchById(clientId, function (err, client) {
                if (err) {
                    return done(err);
                }
                var ttl = new Date().getTime() + config.redis.ttl * 1000;
                redis.setex(util.format(CLIENT_KEY, client.id), ttl, JSON.stringify(client));
                return done(null, client);
            });
        }

    ], callback);
};

module.exports = function (clientProvider) {
    if (clientProvider) {
        var clientProviderParts = clientProvider.match(URL_REGEXP),
            clientScheme = clientProviderParts[1] || 'http',
            clientHost = clientProviderParts[2] || '',
            clientPort = clientProviderParts[4] || (clientScheme === 'https' ? 443 : 80),
            clientPath = clientProviderParts[5] || '';
        return new Client(clientScheme, clientHost, clientPort, clientPath)
    } else {
        return new Client()
    }
};
