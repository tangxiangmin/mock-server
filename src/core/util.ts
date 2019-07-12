const fs = require('fs')
const url = require('url')

import Mock from './mock'

export default {
    formatUrl(ctx) {
        // 通过实现parseUrl自定义拦截配置
        if (typeof Mock.parseUrl === 'function') {
            return Mock.parseUrl(ctx)
        } else {
            return url.parse(ctx.url).pathname
        }
    },

    match(expected, actual = '') {
        if (typeof expected === 'string') {
            return expected.toLowerCase() === actual.toLowerCase()
        }

        if (expected instanceof RegExp) {
            return expected.test(actual)
        }
    },

    /**
     *
     * @param pageMap Mock.mock收集的数据
     * @param url 请求url
     * @param method 请求方法
     * @return {*} mock配置对象
     */
    getUrlConfig(pageMap, url, method) {
        for (let i = 0, len = pageMap.length; i < len; ++i) {
            let item = pageMap[i]
            if (
                (!item.rurl || this.match(item.rurl, url)) &&
                (!item.method || this.match(item.method, method))
            ) {
                return item
            }
        }
    },
    getMockData(config) {
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
    },
};
