const fs = require("fs-extra")
const Koa = require("koa")

module.exports = {
    server: null,
    isOpen: false,
    start(file, port) {
        fs.readFile(file, 'utf-8', (err, tpl) => {
            const app = new Koa()

            // 允许跨域
            const cors = require("koa2-cors")
            app.use(cors())

            const mockMiddleware = require("@shymean/koa-mock")

            {
                // 注入相同的Mock对象
                let Mock = mockMiddleware.Mock
                Mock._urls = [] // 重置
                let res = eval(tpl)
            }

            app.use(mockMiddleware());
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

