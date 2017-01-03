/**
 * Created by haozi on 12/25/2016.
 */
import {IncomingMessage,ServerResponse} from 'http'
import request from './req'
import response from './res'
import Application from "./application";


export class Context {

    app:Application
    req:request
    res:response
    state:Object = {}

    constructor (app:Application,req:IncomingMessage,res:ServerResponse) {


        let _req = new request()
        let _res = new response()

        /**
         * 设置引用
         */
        this.app = req.app = res.app = app
        this.req = _req.req = _res.req = req
        this.res = _req.res = _res.res = res
        _req.ctx = _res.ctx = this



    }


    throw (...arg) :void {
        if(arg){
            if(arg[0] instanceof Error)
                throw arg[0]
        }
        throw this.createError.apply(this.ctx , arg)
    }

    /**
     *  创建错误
     * @param error {httpErrorCode}
     * @param message {String}
     */
    createError (error:httpErrorCode|number = 404,message:string = httpErrorCode[error]) :errorTemplet {

        this.status = error
        if(error == httpErrorCode.NotFound)
            message = '(╯‵□′)╯︵┻━┻\n没有给我滚(ノ｀Д)ノ'
        this.body = message
        return {
            code : error,
            message
        }
    }

    /**
     * 404错误
     * @method
     * @api public
     */
    NotFound () {
        this.createError(404)
    }
}

/**
 * 错误模板
 * @interface
 * @api public
 */
interface errorTemplet {
    code :httpErrorCode|number,
    message:string
}

/**
 * http错误枚举
 * @mnum
 */
export enum httpErrorCode {
    BadRequest = 400,
    Unauthorized = 401,
    PaymentRequired = 402,
    Forbidden = 403,
    NotFound = 404,
    MethodNotAllowed = 405,
    NotAcceptable = 406,
    ProxyAuthenticationRequired = 407,
    RequestTimeout = 408,
    Conflict = 409,
    Gone = 410,
    LengthRequired = 411,
    PreconditionFailed = 412,
    PayloadTooLarge = 413,
    URITooLong = 414,
    UnsupportedMediaType = 415,
    RangeNotSatisfiable = 416,
    ExpectationFailed = 417,
    ImATeapot = 418,
    MisdirectedRequest = 421,
    UnprocessableEntity = 422,
    Locked = 423,
    FailedDependency = 424,
    UnorderedCollection = 425,
    UpgradeRequired = 426,
    PreconditionRequired = 428,
    TooManyRequests = 429,
    RequestHeaderFieldsTooLarge = 431,
    UnavailableForLegalReasons = 451,
    InternalServerError = 500,
    NotImplemented = 501,
    BadGateway = 502,
    ServiceUnavailable = 503,
    GatewayTimeout = 504,
    HTTPVersionNotSupported = 505,
    VariantAlsoNegotiates = 506,
    InsufficientStorage = 507,
    LoopDetected = 508,
    BandwidthLimitExceeded = 509,
    NotExtended = 510,
    NetworkAuthenticationRequired = 511
}
