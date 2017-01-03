/**
 * Created by haozi on 12/25/2016.
 */

import {IncomingMessage,ServerResponse} from 'http'
import {Context} from "./context";

export default class request {
    res:ServerResponse
    req:IncomingMessage
    ctx:Context

    constructor () {

    }
}