'use strict';

// Production specific configuration
// =================================
module.exports = {
    redis: {
        port: 6379,
        host: '10.7.111.45',
        ttl: process.env.CLIENT_TTL || 3600, // seconds
        options: {},
        index: 2,
        auth: '9e49ac46ec8d11e4:wosaiAPI2015'
    }
};
