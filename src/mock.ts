/**
 * 劫持Mock.mock
 */
import {Context} from "koa";

import * as mockjs from 'mockjs'

// 每一个mock路由保存的信息
interface baseConfig {
    jsonpCallBack?: string
    fileUrl?: string,

    rurl: RegExp | string,
    method: string,
    template: Object
}

// 导出Mock
interface MockInterface {
    _originMock: Function // 原始mock方法
    mock: Function
    parseUrl?: (ctx: Context) => RegExp | string, // 配置Mock的解析方式，默认通过url方式解析，
    _urls: Array<baseConfig>, // 保存模板文件中定义的所有mock路由
    _ctx: Context,
}

interface ObjMethod {
    type: string,
    param: string
}

let Mock: MockInterface = mockjs
Mock._urls = []
Mock._originMock = mockjs.mock
// 重写Mock.mock方法，内部调用Mock._originMock
Mock.mock = function (...args): void {
    let len = args.length
    let rurl = args[0]

    let method: string | ObjMethod
    let template: Object;

    let config: baseConfig = {
        rurl: rurl,
        method: '',
        template: null
    }

    // 处理mock入参
    switch (len) {
        case 2:
            // Mock.mock(url, {})形式，不区分请求方式
            template = args[1]
            method = ''
            break
        case 3:
            // Mock.mock(url, method， {})形式，区分请求方式
            method = args[1]
            template = args[2]

            if (method instanceof Object) {
                let {type, param} = method
                // 处理jsonp
                if (type === 'jsonp') {
                    method = 'get'
                    config.jsonpCallBack = param || 'callback'
                } else if (type === 'file') {
                    method = 'get'
                    config.fileUrl = param
                }
            } else if (method === 'jsonp') {
                // 处理 jsonp 快捷方式
                method = 'get'
                config.jsonpCallBack = 'callback'
            }
            break
    }

    // 向模板注入请求ctx上下文
    if (typeof template === 'function') {
        let _originTemplate = template
        template = () => {
            return _originTemplate.call(Mock, Mock._ctx)
        }
    }

    Object.assign(config, {
        method,
        template
    })

    Mock._urls.push(config) // 保留所有的请求

    return Mock._originMock.apply(Mock, args)
}

export default Mock
