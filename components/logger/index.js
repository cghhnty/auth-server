var log4js = require('log4js');
var config = require('../../config/environment');
var pkg = require('../../package.json');
log4js.configure(config.log4js);

module.exports = function (category) {
    var logger = log4js.getLogger(pkg.name + '-v' + pkg.version + (category ? ':' + category : ''));

    if (config.env === "development") {
        logger.setLevel(log4js.levels.ALL);
    } else {
        logger.setLevel(log4js.levels.INFO);
    }
    return logger;
};
