'use strict';

var path = require('path');
var _ = require('lodash');
var cluster = require('cluster');

function requiredProcessEnv(name) {
    if (!process.env[name]) {
        throw new Error('You must set the ' + name + ' environment variable');
    }
    return process.env[name];
}

// All configurations will extend these options
// ============================================
var all = {
    env: process.env.NODE_ENV,
    // Root path of server
    root: path.normalize(__dirname + '/../../..'),
    redis: {
        port: null,
        host: null,
        ttl: process.env.CLIENT_TTL || 3600, // seconds
        options: {}
    },
    white_list: {
        'saas': /['"]method['"]\s*:\s*["'](activeLakalaStoreByDeviceKey|getLakalaStoreByDeviceKey|getStore)["']/
    },
    log4js: {
        appenders: [
            {
                type: "console",
                layout: {
                    "type": "pattern",
                    "pattern": "%[%d{yyyy/MM/dd} %r - %x{process}#%x{pid} %p %c -%] %m%n",
                    "tokens": {
                        "process": function () {
                            if (cluster.isMaster) {
                                return 'master';
                            } else {
                                return 'worker';
                            }
                        },
                        "pid": function () {
                            return process.pid;
                        }
                    }
                }
            }
        ],
        replaceConsole: true
    }
};

// Export the config object based on the NODE_ENV
// ==============================================
module.exports = _.merge(
    all,
    require('./' + (process.env.NODE_ENV || 'production') + '.js') || {});
