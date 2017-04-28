var config = require('../../config/environment');
var logger = require('../../components/logger')('client');
redisClient = require('redis').createClient(config.redis.port, config.redis.host, config.redis.options);

redisClient.on("error", function (err) {
    logger.error("Redis Client Error:", err);
});

if (config.redis.auth)
    redisClient.auth(config.redis.auth);


module.exports = redisClient;
