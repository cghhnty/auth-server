/*!
 * @author xuyuanxiang@wosai-inc.com
 * @date 2015/10/31
 */

"use strict";

var crypto = require('crypto');
var _ = require('lodash');

/**
 *  createMD5(source, key)
 *
 *  Generates a MD5 sign.
 *
 * @param {String} source
 * @param {String} key salt
 * @returns {String}
 */
module.exports.createMD5 = function (source, key, charset) {
    if (!_.isString(key)) {
        throw new Error('invalid input parameters: key.')
    }
    if (!_.isString(source)) {
        throw new Error('invalid input parameters: source.')
    }
    if (!charset) {
        charset = 'utf8';
    }
    var md5 = crypto.createHash('md5');
    md5.update(source + key, charset);
    return md5.digest('hex');
};

/**
 * constantEquals(x, y)
 *
 * Compare two strings, x and y with a constant time algorithm to prevent attacks
 * base on timing statistics.
 *
 * @param x
 * @param y
 */
module.exports.constantEquals = function (x, y) {
    var result = true,
        length = (x.length > y.length) ? x.length : y.length,
        i;
    for (i = 0; i < length; i++) {
        if (x.charCodeAt(i) !== y.charCodeAt(i)) {
            return false;
        }
    }
    return result;
};

