/**
 * 劫持Mock.mock，并做一些处理
 */

import * as Mock from 'mockjs'

let mock = Mock.mock

Mock._urls = []

interface baseConfig {
    jsonpCallBack?: string
    fileUrl?: string
}

Mock.mock = function () {
    let args = arguments
    let len = args.length
    let rurl = args[0]

    let method,
        template
    let config: baseConfig = {}
    if (len === 2) {
        template = args[1]
        method = ''
    } else if (len === 3) {
        method = args[1]
        template = args[2]

        if (method instanceof Object) {
            let {type, param} = method
            if (type === 'jsonp') {
                method = 'get'
                config.jsonpCallBack = param
            } else if (type === 'file') {
                method = 'get'
                config.fileUrl = param
            }
        }

        // 处理 jsonp 快捷方式
        if (method === 'jsonp') {
            method = 'get'
            config.jsonpCallBack = 'callback'
        }
    }
    Object.assign(config, {
        rurl,
        method,
        template
    })

    Mock._urls.push(config)

    return mock.apply(Mock, args)
}

export default Mock
