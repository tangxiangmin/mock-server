const fs = require("fs-extra")
const Koa = require('koa')

import middleware from './middleware'
import mock from './mock'

interface Server {
    server: Object,
    isOpen: boolean,
    start: (file: string, port: number) => void,
    close: () => void
}

const server: Server = {
    server: null,
    isOpen: false,
    async start(file, port) {
        const tpl = await fs.readFile(file, 'utf-8')

        const app = new Koa()
        const cors = require("koa2-cors")  // 允许跨域
        app.use(cors())

        try {
            let Mock = mock // 注入相同的Mock对象，方便在_mock模板文件中使用

            Mock._urls = [] // 重置_
            eval(tpl)
        } catch (e) {
            console.log(e)
        }

        app.use(middleware); // 使用mock中间件处理响应

        this.server = app.listen(port);
        console.log(`mock server listen at ${port}`);

        this.isOpen = true
    },
    close() {
        return new Promise((resolve, reject) => {
            this.server.close(function (res) {
                resolve(res)
                this.isOpen = false
            })
        })
    },
}
export default server



