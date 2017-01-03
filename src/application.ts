/**
 * Created by haozi on 12/25/2016.
 */

/**
 * 依赖
 */
import http from 'http'
import {EventEmitter} from 'events'

import request from './req'
import response from './res'
import {Context} from './context'
import Promise = Promise
import debug from 'debug'


/**
 *  Application class
 *  @extends  Event.EventEmitter
 *  @export
 *  @api public
 */
export default class Application extends EventEmitter {

    public middlewares:Function[]
    public httpServer:http.Server

    /**
     * 构造函数
     *@constructor
     */
    public constructor () {
        super()

        this.middlewares = []
        this.httpServer = null
    }

    /**
     *
     */
    private callback () :Function{

        //将中间件进行组合
        let fn = this.compose(this.middlewares)
        /**
         * 查询是否注册了错误回调，没有的话使用onerror
         */
        if(!super.listeners('error').length)
            super.on('error',this.onerror)
        //返回HTTP Server调用的Callback 用来处理每一次的请求
        return  (req ,res) => {
            res.statusCode = 404
            /**
             * 包装req和res
             * @type {Context}
             */
            let ctx:Context = new Context(this, req, res)
        }
    }

    /**
     * 监听端口
     * @method
     * @param {Mixed} ...
     * @returns {Server}
     * @api public
     */
    public listen (...v) :http.Server{
        this.httpServer = http.createServer(this.callback())
        return this.httpServer.listen.apply(this.httpServer , v)
    }

    /**
     * 注册中间件
     * @method
     * @param fn 回调函数
     * @returns {Application} this
     * @api public
     */
    public use (fn:Function) : Application{
        this.middlewares.push(fn)
        return this
    }

    /**
     * 默认错误处理器
     * @param {Error} err
     * @api private
     */
    private onerror (err:Error) :void{
        console.error('\t---------------------------------------------------------------')
        console.error('\t-------------------服务器出错了  _(:зゝ∠)_----------------------')
        console.error(`\t -> ${err.stack || err.toString()}`)
    }


    private createContext (req: http.IncomingMessage, res: http.ServerResponse):Context{
        return new Context(this, req, res)
    }

    /**
     * 将所有中间件组合起来
     * @param middleware 中间件的数组
     * @returns {(ctx:Context, next?:Promise)=>any}
     * @api private
     */
    private compose (middleware:Function[]):Function {
        return (ctx:Context,next?:Promise) => {
            //定义索引表示执行到了第几个
            let index = 0
            //定义处理函数
            let dispatch:Function = (i:number) => {
            //更新索引
                index = i
            //判断中间件是否存在 否在执行挂起的中间件
                const cb = middleware[i] || next
            // 如果都不存在 就返回一个resolved形态的Promise
                if(!cb){
                    return Promise.resolve()
                }
            //捕获执行过程中的异常 并以rejected形态的Promise对象抛出
                try{
            //Promise.resolve的方法传入一个thenable的对象(可以then的) 返回的promise会跟随这个thenable对象直到返回resolve状态
            //https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise/resolve  mdn参考
            // 当中间件await 的时候 递归执行 dispatch 函数调用下一个中间件
                    return Promise.resolve(cb(ctx, () =>{
                        return dispatch(i + 1)
                    }))
                }catch (err){
                    return Promise.reject(err)
                }
            }
            //执行第一个中间件
            return dispatch(0)
        }
    }
}