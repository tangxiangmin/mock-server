mock-server
===

为开发环境快速搭建koa服务器，只需要一个mock模板文件即可。

脚本将启动本地服务器，然后匹配mock模板内的url返回对应的数据

## 使用
```
# 全局安装
npm i @shymean/mock-server -g
# 快速启动mock服务器
mock -p 9999 -f ./_mock.js
```
参数说明
* port，服务器端口号，默认7654，简写 -p
* file，mock模板文件路径，默认`./_mock.js`，简写 -f

## mockjs模板语法
使用该工具只需要准备一个mock模板文件，其语法参考
* 内部使用[@shymean/koa-mock`](https://www.npmjs.com/package/@shymean/koa-mock)，这是一个快速搭建koa的mock服务器的中间件
* mock模板使用[mockjs语法](https://www.npmjs.com/package/mockjs)，并扩展了相关的功能

```js
// _mock.js
// 对应的rurl会被中间件拦截，并返回mock数据
// ANY localhost:9999/
Mock.mock('/', {
    data: [],
    msg: "hello mock",
    "code|1-4": 1,
})

// 可以mock指定的请求方法
// POST localhost:9999/test
Mock.mock('/test', 'POST', {
    data: [],
    msg: "hello mock",
    "code|1-4": 1,
})

// 扩展rtype，支持jsonp形式，使用param传入对应的回调名
// GET JSONP localhost:9999/test
Mock.mock('/test', {
    type: 'jsonp',
    param: 'callbackName'
},{
    code: 0,
    msg: 'hello from mock jsonp',
    data: {
        "id|1000-9999": 1,
    }
})

// 默认回调名称 callback
Mock.mock("/test2", "jsonp", {
    code: 0,
    msg: "hello from mock jsonp2",
    data: {
        "id|1000-9999": 1,
    }
});
```

**自定义请求头匹配**

有时候某个相同的url请求，根据业务参数需要返回不同的模拟数据，因此提供了自定义匹配请求url的功能，需要在模板文件中实现`Mock.parseUrl`方法即可，该方法返回一个用于匹配的rurl

```js
Mock.parseUrl = function(ctx){
    // ctx为koa上下文对象
    return 'someUrl'
}

Mock.mock('someUrl', {code: 0})
```

**nginx配置**

为了避免在业务代码中使用localhost域名，最佳实践方案是开发时将业务域名（如`xxx.test.com`）指向本地

```
127.0.0.1 xxx.test.com
```
然后通过nginx配置反向代理到mock服务器
```nginx
server {
    listen 80;
    server_name xxx.test.com;

    # wireless_j项目中的活动接口
    location /j/cn/control/api {
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forward-For $proxy_add_x_forwarded_for;
        proxy_set_header Host $http_host;
        proxy_pass http://127.0.0.1:9999; # mock -p 9999 指令启动的服务器的端口号
    }
}
```

## Feature
* [x] 与mockjs浏览器端共用同一套mock模板，方便迁移和代码维护
* [x] 支持jsonp请求
* [x] 数据模板热更新，修改模板文件后，将自动重启服务器

## Todo
* [ ] 支持映射本地文件，比如样式表、图片等