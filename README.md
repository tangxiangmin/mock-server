mock-server
===

为开发环境快速搭建koa服务器，只需要一个mock模板文件即可。

脚本将启动本地服务器，然后匹配mock模板内的url返回对应的数据

## Feature
* [x] 与mockjs浏览器端共用同一套mock模板，方便迁移和代码维护
* [x] 支持jsonp请求
* [x] 数据模板热更新，修改模板文件后，将自动重启服务器

## Todo
* [ ] 支持映射本地文件，比如样式表、图片等


## 使用
```
npm i @shymean/mock-server -g

mock -p 9999 -f ./_mock.js
```
参数说明
* port，服务器端口号，默认7654，简写 -p
* file，mock模板文件路径，默认`./_mock.js`，简写 -f

## 依赖
* 内部使用[@shymean/koa-mock`](https://www.npmjs.com/package/@shymean/koa-mock)
* mock模板使用[mockjs](https://www.npmjs.com/package/mockjs)，相关语法参考文档