/**
 * 2019-07-12 14:25
 */

import Mock from './mock'

import * as url from 'url'
import * as fs from 'fs'

// 格式化url
function formatUrl(ctx) {
    // 通过实现parseUrl自定义拦截配置
    if (typeof Mock.parseUrl === 'function') {
        return Mock.parseUrl(ctx)
    } else {
        return url.parse(ctx.url).pathname
    }
}

// 判断请求url与配置url是否匹配
function match(expected, actual = '') {
    if (typeof expected === 'string') {
        return expected.toLowerCase() === actual.toLowerCase()
    }

    if (expected instanceof RegExp) {
        return expected.test(actual)
    }
}

/**
 *
 * @param pageMap Mock.mock收集的数据
 * @param url 请求url
 * @param method 请求方法
 * @return {*} mock配置对象
 */
function getUrlConfig(pageMap, url, method) {
    for (let i = 0, len = pageMap.length; i < len; ++i) {
        let item = pageMap[i]
        if (
            (!item.rurl || match(item.rurl, url)) &&
            (!item.method || match(item.method, method))
        ) {
            return item
        }
    }
}

// 根据配置获取响应数据
function getMockData(config) {
    let {template, jsonpCallBack, fileUrl} = config
    let data = template ? Mock.mock(template) : null

    let response = data
    // 处理jsonp
    if (jsonpCallBack) {
        response = `${jsonpCallBack}(${JSON.stringify(data)});`
    }
    // 处理本地文件
    else if (fileUrl) {
        response = new Promise((resolve, reject) => {
            fs.readFile(fileUrl, 'utf-8', (err, content) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(content)
                }
            })
        })
    }

    return response
}


const middleware = async function (ctx, next) {
    let url = formatUrl(ctx)
    let config = getUrlConfig(Mock._urls, url, ctx.method) // 根据url获取对应的配置数组
    let data

    if (config) {
        data = await getMockData(config)
    }

    if (data) {
        ctx.body = data
    } else {
        await next()
    }
}
export default middleware
