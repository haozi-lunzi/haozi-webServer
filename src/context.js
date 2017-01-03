"use strict";
var req_1 = require('./req');
var res_1 = require('./res');
var Context = (function () {
    function Context(app, req, res) {
        this.state = {};
        var _req = new req_1["default"]();
        var _res = new res_1["default"]();
        /**
         * 设置引用
         */
        this.app = req.app = res.app = app;
        this.req = _req.req = _res.req = req;
        this.res = _req.res = _res.res = res;
        _req.ctx = _res.ctx = this;
    }
    Context.prototype.throw = function () {
        var arg = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            arg[_i - 0] = arguments[_i];
        }
        if (arg) {
            if (arg[0] instanceof Error)
                throw arg[0];
        }
        throw this.createError.apply(this.ctx, arg);
    };
    /**
     *  创建错误
     * @param error {httpErrorCode}
     * @param message {String}
     */
    Context.prototype.createError = function (error, message) {
        if (error === void 0) { error = 404; }
        if (message === void 0) { message = httpErrorCode[error]; }
        this.status = error;
        if (error == httpErrorCode.NotFound)
            message = '(╯‵□′)╯︵┻━┻\n没有给我滚(ノ｀Д)ノ';
        this.body = message;
        return {
            code: error,
            message: message
        };
    };
    /**
     * 404错误
     * @method
     * @api public
     */
    Context.prototype.NotFound = function () {
        this.createError(404);
    };
    return Context;
}());
exports.Context = Context;
/**
 * http错误枚举
 * @mnum
 */
(function (httpErrorCode) {
    httpErrorCode[httpErrorCode["BadRequest"] = 400] = "BadRequest";
    httpErrorCode[httpErrorCode["Unauthorized"] = 401] = "Unauthorized";
    httpErrorCode[httpErrorCode["PaymentRequired"] = 402] = "PaymentRequired";
    httpErrorCode[httpErrorCode["Forbidden"] = 403] = "Forbidden";
    httpErrorCode[httpErrorCode["NotFound"] = 404] = "NotFound";
    httpErrorCode[httpErrorCode["MethodNotAllowed"] = 405] = "MethodNotAllowed";
    httpErrorCode[httpErrorCode["NotAcceptable"] = 406] = "NotAcceptable";
    httpErrorCode[httpErrorCode["ProxyAuthenticationRequired"] = 407] = "ProxyAuthenticationRequired";
    httpErrorCode[httpErrorCode["RequestTimeout"] = 408] = "RequestTimeout";
    httpErrorCode[httpErrorCode["Conflict"] = 409] = "Conflict";
    httpErrorCode[httpErrorCode["Gone"] = 410] = "Gone";
    httpErrorCode[httpErrorCode["LengthRequired"] = 411] = "LengthRequired";
    httpErrorCode[httpErrorCode["PreconditionFailed"] = 412] = "PreconditionFailed";
    httpErrorCode[httpErrorCode["PayloadTooLarge"] = 413] = "PayloadTooLarge";
    httpErrorCode[httpErrorCode["URITooLong"] = 414] = "URITooLong";
    httpErrorCode[httpErrorCode["UnsupportedMediaType"] = 415] = "UnsupportedMediaType";
    httpErrorCode[httpErrorCode["RangeNotSatisfiable"] = 416] = "RangeNotSatisfiable";
    httpErrorCode[httpErrorCode["ExpectationFailed"] = 417] = "ExpectationFailed";
    httpErrorCode[httpErrorCode["ImATeapot"] = 418] = "ImATeapot";
    httpErrorCode[httpErrorCode["MisdirectedRequest"] = 421] = "MisdirectedRequest";
    httpErrorCode[httpErrorCode["UnprocessableEntity"] = 422] = "UnprocessableEntity";
    httpErrorCode[httpErrorCode["Locked"] = 423] = "Locked";
    httpErrorCode[httpErrorCode["FailedDependency"] = 424] = "FailedDependency";
    httpErrorCode[httpErrorCode["UnorderedCollection"] = 425] = "UnorderedCollection";
    httpErrorCode[httpErrorCode["UpgradeRequired"] = 426] = "UpgradeRequired";
    httpErrorCode[httpErrorCode["PreconditionRequired"] = 428] = "PreconditionRequired";
    httpErrorCode[httpErrorCode["TooManyRequests"] = 429] = "TooManyRequests";
    httpErrorCode[httpErrorCode["RequestHeaderFieldsTooLarge"] = 431] = "RequestHeaderFieldsTooLarge";
    httpErrorCode[httpErrorCode["UnavailableForLegalReasons"] = 451] = "UnavailableForLegalReasons";
    httpErrorCode[httpErrorCode["InternalServerError"] = 500] = "InternalServerError";
    httpErrorCode[httpErrorCode["NotImplemented"] = 501] = "NotImplemented";
    httpErrorCode[httpErrorCode["BadGateway"] = 502] = "BadGateway";
    httpErrorCode[httpErrorCode["ServiceUnavailable"] = 503] = "ServiceUnavailable";
    httpErrorCode[httpErrorCode["GatewayTimeout"] = 504] = "GatewayTimeout";
    httpErrorCode[httpErrorCode["HTTPVersionNotSupported"] = 505] = "HTTPVersionNotSupported";
    httpErrorCode[httpErrorCode["VariantAlsoNegotiates"] = 506] = "VariantAlsoNegotiates";
    httpErrorCode[httpErrorCode["InsufficientStorage"] = 507] = "InsufficientStorage";
    httpErrorCode[httpErrorCode["LoopDetected"] = 508] = "LoopDetected";
    httpErrorCode[httpErrorCode["BandwidthLimitExceeded"] = 509] = "BandwidthLimitExceeded";
    httpErrorCode[httpErrorCode["NotExtended"] = 510] = "NotExtended";
    httpErrorCode[httpErrorCode["NetworkAuthenticationRequired"] = 511] = "NetworkAuthenticationRequired";
})(exports.httpErrorCode || (exports.httpErrorCode = {}));
var httpErrorCode = exports.httpErrorCode;
