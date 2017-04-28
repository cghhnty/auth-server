module.exports[401] = function unauthorized(subErr) {
    return makeError(subErr, 401, 'Unauthorized');
};

module.exports[415] = function unSupportMediaType(subErr, req, res) {
    return makeError(subErr, 415, 'Unsupported media type');
};

module.exports[403] = function forbidden(subErr, req, res) {
    return makeError(subErr, 403, 'Forbidden');
};

module.exports[500] = function serverError(subErr, req, res) {
    return makeError(subErr, 500, 'Server error.');
};

module.exports.responseError = function responseError(res, error) {
    res.writeHead(error.status || 500, {'Content-Type': 'text/plain'});
    res.end(error.message);
};

function makeError(subError, status, message) {
    if (subError instanceof Error && subError.message) {
        message = message + ": " + subError.message;
    } else if (typeof subError === 'string') {
        message = message + ": " + subError;
    }
    var error = new Error(message);
    Object.defineProperty(error, 'status', {
        value: status,
        enumerable: true,
        writable: true,
        configurable: true
    });
    return error;
}
