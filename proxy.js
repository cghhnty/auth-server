/**!
 * Main application file
 *
 * @author xuyuanxiang@wosai-inc.com
 * @date 2015/10/31
 */
'use strict';
var URL_REGEXP = /(http|https):\/\/([\w\-_]+(?:\.([\w\-_]+))+)(?::([\d]+))*([\w\-\.,@?^=%&amp;:/~\+#]*[\w\-\@?^=%&amp;/~\+#])?/;
var ENV = process.env.NODE_ENV || 'production';
var TYPE = process.env.CLIENT_TYPE ? process.env.CLIENT_TYPE : 'saas';

var clientProvider = process.env.CLIENT_PROVIDER;

if (!clientProvider && TYPE != 'scoreService')
    throw new Error('Must set CLIENT_PROVIDER environment variable.');


var http = require('http'),
    getRawBody = require('raw-body'),
    StringDecoder = require('string_decoder').StringDecoder,
    async = require('async'),
    _ = require('lodash'),
    Client = require('./model/client')(clientProvider),
    errors = require('./components/errors'),
    sign = require('./tool/sign'),
    config = global.config = require('./config/environment'),
    logger = global.logger = require('./components/logger')();

var WHITE_LIST_REG = config.white_list[TYPE];

var rpcMethodReg = /[{,\s]*['"]method['"]\s*:\s*["'](\w+)["'][,\s}]*/;
var rpcParamsReg = /[{,\s]*['"]params['"]\s*:[\s"']*(\[.+\])[\s"']*[,\s}]*/;
var isRPCReg = /^{(jsonrpc|method|params)}$|/;

function Server(scheme, host, port, path) {
    return http.createServer(function (req, res) {

        var clientId, clientSign, charset, contentType, body,
            proxyRequestTimer, proxyResponseTimer,
            start,
            HOST = req.headers.host;

        //logger.info('from %s, proxy pass to %s:%d/%s.', HOST, host, port, path);

        async.waterfall([
            // Check Content-Type header
            function (done) {
                start = new Date();
                contentType = req.headers['content-type'];

                var charset;
                try {
                    var charset = contentType.match(/charset=.+/)[0].replace('charset=', '') || null;
                } catch (e) {

                }
                if (!charset || !Buffer.isEncoding(charset)) {
                    charset = 'utf8';
                }

                done();
            },

            // Parse request body
            function (done) {
                getRawBody(req, {
                    length: req.headers['content-length'],
                    limit: config.limit,
                    encoding: charset
                }, function (err, content) {
                    if (err) {
                        logger.error('Parse request body#getRawBody | ERROR:', err);
                        return done(err);
                    }
                    body = content.toString(charset);
                    logger.debug('Parsed from request body: %s', body);
                    done();
                });
            },

            // Parse client credentials from BasicAuth header
            function (done) {


                if (!req.headers || !req.headers.authorization) {
                    if (WHITE_LIST_REG && WHITE_LIST_REG.test(body)) {
                        return done();
                    } else {
                        return done(errors[401]('No authorization header passed.'));
                    }
                }

                var pieces = req.headers.authorization.split(' ', 2);
                if (!pieces || pieces.length !== 2) {
                    if (WHITE_LIST_REG && WHITE_LIST_REG.test(body)) {
                        return done();
                    } else {
                        return done(errors[401]('Authorization header is corrupted.'));
                    }
                }
                if (pieces[0] !== 'Basic') {
                    if (WHITE_LIST_REG && WHITE_LIST_REG.test(body)) {
                        return done();
                    } else {
                        return done(errors[401]('Unsupported authorization method: ' + pieces[0]));
                    }
                }
               pieces = new Buffer(pieces[1], 'base64').toString('ascii').split(':', 2);
                if (!pieces || pieces.length !== 2) {
                    if (WHITE_LIST_REG && WHITE_LIST_REG.test(body)) {
                        return done();
                    } else {
                        return done(errors[401]('Authorization header has corrupted data.'));
                    }
                }

                clientId = pieces[0];
                clientSign = pieces[1];
                logger.debug('Client credentials parsed from basic auth header: %s:%s', clientId, clientSign);
                done();
            },

            // Check sign
            function (done) {

                if (WHITE_LIST_REG && WHITE_LIST_REG.test(body)) {
                    return done();
                }

                Client.fetchById(clientId, function (err, client) {
                    if (err) {
                        return done(err);
                    }
                    if (!client || _.isEmpty(client)) {
                        return done(errors[403]('client not exist.'));
                    }
                    var legalSign = sign.createMD5(body, client.secret, charset);

                    if (legalSign === clientSign) {
                        return done();
                    } else {
                        return done(errors[403]('illegal signature ' + clientSign));
                    }
                    //if (sign.constantEquals(legalSign, clientSign)) {
                    //    done(null);
                    //} else {
                    //    logger.error('Check sign | FAILED: Client#%s with signature: [%s]', clientId, clientSign);
                    //    return done(errors[403]('illegal signature.'));
                    //}
                });
            },
            // Proxy
            function (done) {
                var proxyRequestOptions = {
                    host: host,
                    port: port,
                    path: path + req.url,
                    method: req.method,
                    headers: {
                        'Content-Length': Buffer.byteLength(body, charset)
                    }
                };
                if (scheme === 'https') {
                    proxyRequestOptions.rejectUnauthorized = false;
                    proxyRequestOptions.agent = false;
                }

                logger.debug('Proxy %s request options:', scheme, proxyRequestOptions);
                var proxy = require(scheme).request(proxyRequestOptions, function (response) {
                    clearTimeout(proxyRequestTimer);

                    // Response should be finished in 1 minute, or pass an error to next
                    proxyResponseTimer = setTimeout(function () {
                        var resError = new Error('Backend response timeout.');
                        logger.error('Proxy | Client#%s request [%s] response error:', clientId, body, resError);
                        done(resError);
                        response.destroy();
                    }, 60000);

                    var buffer = '';
                    var decoder = new StringDecoder(charset);

                    response.setEncoding(charset);

                    response.on('error', function (error) {
                        logger.error('Proxy | Client#%s request [%s] response error:', clientId, body, error);
                        done(error);
                    });

                    response.on('data', function (chunk) {
                        buffer += decoder.write(chunk)
                    });

                    response.on('end', function () {
                        clearTimeout(proxyResponseTimer);
                        var result = buffer + decoder.end();
                        logger.debug('Proxy response:', result);
                        done(null, result, response);
                    });

                });

                proxy.on('error', function (error) {
                    logger.error('Proxy | Client#%s request [%s] error:', clientId, body, error);
                    done(error);
                });
                proxy.write(body);
                proxy.end();

                // Request should be response in 10s, or pass an error to next
                proxyRequestTimer = setTimeout(function () {
                    proxy.abort();
                    var reqError = new Error('Backend request timeout.');
                    logger.error('Proxy | Client#%s request [%s] error:', clientId, body, reqError);
                    done(reqError);
                }, 10000);

            }
        ], function (err, result, response) {
            if (err) {
                errors.responseError(res, err);
            } else {
                res.writeHead(response.statusCode, response.headers);
                res.end(result, charset);
            }
            try {
                if (isRPCReg.test(body)) {
                    var method = body.match(rpcMethodReg)[1];
                    var params = JSON.parse(body.match(rpcParamsReg)[1]);
                    if (err) {
                        logger.error('Client#%s %s %s RPC %s failed in %sms with params:\n', clientId, req.method, req.url, method, new Date - start, params);
                        logger.error(err);
                    } else {
                        logger.info('Client#%s %s %s RPC %s succeed in %sms.', clientId, req.method, req.url, method, new Date - start);
                    }
                } else {
                    if (err) {
                        logger.error('Client#%s %s %s failed in %sms with body: \n %s', clientId, req.method, req.url, new Date - start, body);
                        logger.error(err);
                    } else {
                        logger.info('Client#%s %s %s succeed in %sms.', clientId, req.method, req.url, new Date - start);
                    }
                }
            } catch (e) {

            }
            method = null;
            params = null;
            cleanUp();
        });

        function cleanUp() {
            clientId = null;
            clientSign = null;
            charset = null;
            contentType = null;
            body = null;
            proxyRequestTimer = null;
            proxyResponseTimer = null;
            start = null;
        }
    });
}


module.exports = function (url) {
    var urlParts = url.match(URL_REGEXP),
        scheme = urlParts[1] || 'http',
        host = urlParts[2] || '',
        port = urlParts[4] || (scheme === 'https' ? 443 : 80),
        path = urlParts[5] || '';
    return new Server(scheme, host, port, path);
};
