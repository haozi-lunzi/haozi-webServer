/**
 * Created by haozi on 12/25/2016.
 */
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * 依赖
 */
var http_1 = require('http');
var events_1 = require('events');
var context_1 = require('./context');
var Promise = Promise;
/**
 *  Application class
 *  @extends  Event.EventEmitter
 *  @export
 *  @api public
 */
var Application = (function (_super) {
    __extends(Application, _super);
    /**
     * 构造函数
     *@constructor
     */
    function Application() {
        _super.call(this);
        this.middlewares = [];
        this.httpServer = null;
    }
    /**
     *
     */
    Application.prototype.callback = function () {
        var _this = this;
        //将中间件进行组合
        var fn = this.compose(this.middlewares);
        /**
         * 查询是否注册了错误回调，没有的话使用onerror
         */
        if (!_super.prototype.listeners.call(this, 'error').length)
            _super.prototype.on.call(this, 'error', this.onerror);
        //返回HTTP Server调用的Callback 用来处理每一次的请求
        return function (req, res) {
            res.statusCode = 404;
            /**
             * 包装req和res
             * @type {Context}
             */
            var ctx = new context_1.Context(_this, req, res);
        };
    };
    /**
     * 监听端口
     * @method
     * @param {Mixed} ...
     * @returns {Server}
     * @api public
     */
    Application.prototype.listen = function () {
        var v = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            v[_i - 0] = arguments[_i];
        }
        this.httpServer = http_1["default"].createServer(this.callback());
        return this.httpServer.listen.apply(this.httpServer, v);
    };
    /**
     * 注册中间件
     * @method
     * @param fn 回调函数
     * @returns {Application} this
     * @api public
     */
    Application.prototype.use = function (fn) {
        this.middlewares.push(fn);
        return this;
    };
    /**
     * 默认错误处理器
     * @param {Error} err
     * @api private
     */
    Application.prototype.onerror = function (err) {
        console.error('\t---------------------------------------------------------------');
        console.error('\t-------------------服务器出错了  _(:зゝ∠)_----------------------');
        console.error("\t -> " + (err.stack || err.toString()));
    };
    Application.prototype.createContext = function (req, res) {
        return new context_1.Context(this, req, res);
    };
    /**
     * 将所有中间件组合起来
     * @param middleware 中间件的数组
     * @returns {(ctx:Context, next?:Promise)=>any}
     * @api private
     */
    Application.prototype.compose = function (middleware) {
        return function (ctx, next) {
            //定义索引表示执行到了第几个
            var index = 0;
            //定义处理函数
            var dispatch = function (i) {
                //更新索引
                index = i;
                //判断中间件是否存在 否在执行挂起的中间件
                var cb = middleware[i] || next;
                // 如果都不存在 就返回一个resolved形态的Promise
                if (!cb) {
                    return Promise.resolve();
                }
                //捕获执行过程中的异常 并以rejected形态的Promise对象抛出
                try {
                    //Promise.resolve的方法传入一个thenable的对象(可以then的) 返回的promise会跟随这个thenable对象直到返回resolve状态
                    //https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise/resolve  mdn参考
                    // 当中间件await 的时候 递归执行 dispatch 函数调用下一个中间件
                    return Promise.resolve(cb(ctx, function () {
                        return dispatch(i + 1);
                    }));
                }
                catch (err) {
                    return Promise.reject(err);
                }
            };
            //执行第一个中间件
            return dispatch(0);
        };
    };
    return Application;
}(events_1.EventEmitter));
exports.__esModule = true;
exports["default"] = Application;
