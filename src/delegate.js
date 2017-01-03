/**
 * Created by haozi on 12/25/2016.
 */
"use strict";
/**
 *  delegate class
 * @class
 * @export
 */
var Delegate = (function () {
    function Delegate(proto, target) {
        this.p = proto;
        this.t = target;
        this.debug = [];
        if (typeof target == 'string') {
            this.p[name] = this.t = {};
        }
        return this;
    }
    /**
     *
     * @method method
     * @param name
     * @returns {Delegate} this
     * @api public
     */
    Delegate.prototype.method = function (name) {
        var _this = this;
        this.p[name] = function () {
            var arg = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                arg[_i - 0] = arguments[_i];
            }
            return _this.p[name].apply(_this.t, arg);
        };
        this.debug.push({ type: delegateType.method, name: name });
        return this;
    };
    /**
     *
     * @method
     * @param name
     * @returns {Delegate} this
     * @api public
     */
    Delegate.prototype.access = function (name) {
        return this.getter(name).setter(name);
    };
    /**
     * @method getter
     * @param name
     * @returns {Delegate} this
     */
    Delegate.prototype.getter = function (name) {
        var _this = this;
        this.p.__defineGetter__(name, function () {
            return _this.t[name];
        });
        this.debug.push({ type: delegateType.getter, name: name });
        return this;
    };
    /**
     * @method setter
     * @param name
     * @returns {Delegate} this
     * @api public
     */
    Delegate.prototype.setter = function (name) {
        var _this = this;
        this.p.__defineSetter__(name, function (val) {
            return _this.t[name] = val;
        });
        this.debug.push({ type: delegateType.setter, name: name });
        return this;
    };
    /**
     *
     * @method fluent
     * @param name
     * @returns {Delegate} this
     * @api public
     */
    Delegate.prototype.fluent = function (name) {
        var _this = this;
        this.p[name] = function (val) {
            if ('undefined' != typeof val) {
                _this.t[name] = val;
                return _this;
            }
            else {
                return _this.t[name];
            }
        };
        this.debug.push({ type: delegateType.fluent, name: name });
        return this;
    };
    return Delegate;
}());
exports.__esModule = true;
exports["default"] = Delegate;
/**
 * 委托类型
 * @enum
 * @export
 * @api public
 */
(function (delegateType) {
    delegateType[delegateType["getter"] = 0] = "getter";
    delegateType[delegateType["setter"] = 1] = "setter";
    delegateType[delegateType["method"] = 2] = "method";
    delegateType[delegateType["fluent"] = 3] = "fluent";
})(exports.delegateType || (exports.delegateType = {}));
var delegateType = exports.delegateType;
