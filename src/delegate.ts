/**
 * Created by haozi on 12/25/2016.
 */

/**
 *  delegate class
 * @class
 * @export
 */
export default class Delegate {
    /**
     * init delegate
     * @param proto
     * @param target
     * @constructor
     */
    p:any
    t:any
    debug:delegateDebug[]

    constructor (proto:any , target:any) {
        this.p = proto
        this.t = target
        this.debug = []
        if(typeof target == 'string'){
            this.p[<string>name] = this.t = {}
        }
        return this
    }

    /**
     *
     * @method method
     * @param name
     * @returns {Delegate} this
     * @api public
     */
    method (name:string) :Delegate {
        this.p[name] = (...arg) => {
            return this.p[name].apply(this.t , arg)
        }
        this.debug.push({type:delegateType.method,name:name})
        return this
    }

    /**
     *
     * @method
     * @param name
     * @returns {Delegate} this
     * @api public
     */
    access (name:string) {
        return this.getter(name).setter(name)
    }

    /**
     * @method getter
     * @param name
     * @returns {Delegate} this
     */
    getter (name:string) :Delegate{
        this.p.__defineGetter__(name , () =>{
            return this.t[name]
        })
        this.debug.push({type:delegateType.getter,name:name})
        return this
    }

    /**
     * @method setter
     * @param name
     * @returns {Delegate} this
     * @api public
     */
    setter (name:string) :Delegate {
        this.p.__defineSetter__(name ,(val) =>{
            return this.t[name] = val
        })
        this.debug.push({type:delegateType.setter,name:name})
        return this
    }

    /**
     *
     * @method fluent
     * @param name
     * @returns {Delegate} this
     * @api public
     */
    fluent (name:string) :Delegate {
        this.p[name] = (val) => {
            if ('undefined' != typeof val) {
                this.t[name] = val
                return this
            } else {
                return this.t[name]
            }
        }
        this.debug.push({type:delegateType.fluent,name:name})
        return this
    }
}

/**
 * 委托debug对象
 * @interface
 * @export
 * @api public
 */
export interface delegateDebug {
    'type' : delegateType
    'name' : string
}

/**
 * 委托类型
 * @enum
 * @export
 * @api public
 */
export enum delegateType {
    getter,
    setter,
    method,
    fluent
}