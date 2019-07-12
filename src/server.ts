const fs = require("fs-extra")
const Koa = require("koa")

import core from './core/index'

export default {
    server: null,
    isOpen: false,
    start(file, port) {
        fs.readFile(file, 'utf-8', (err, tpl) => {
            const app = new Koa()

            // 允许跨域
            const cors = require("koa2-cors")
            app.use(cors())

            {
                // 注入相同的Mock对象
                let Mock = core.Mock
                Mock._urls = [] // 重置
                let res = eval(tpl)
            }

            app.use(core.middleware());
            this.server = app.listen(port);

            this.isOpen = true
            console.log(`mock server listen at ${port}`);
        })
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

