const fs = require("fs-extra")
const Koa = require("koa")
const app = new Koa()

const bodyParser = require("koa-bodyparser");
app.use(bodyParser());

// 允许跨域
const cors = require("koa2-cors")
app.use(cors())

const mockMiddleware = require("@shymean/koa-mock")

let start = (file, port) => {
    fs.readFile(file, 'utf-8', function (err, tpl) {
        {
            // 注入相同的Mock对象
            let Mock = mockMiddleware.Mock
            let res = eval(tpl)
        }

        app.use(mockMiddleware());
        app.listen(port);

        console.log(`mock server listen at ${port}`);
    })
}

module.exports = start


