let path = require('path')
let yargs = require('yargs')
let fs = require('fs-extra')


// 启动服务器
import server from './server'
import util from './util'

let app = {
    init() {
        let argv = this.initArgs()
        let {file, port} = argv

        this.file = path.resolve(file)
        this.port = port

        this.listenFile()
        this.startServer()
    },
    // 初始化参数
    initArgs() {
        yargs.option('p', {
            alias: 'port',
            demand: false,
            default: 7654,
            describe: 'server port',
            type: 'number'
        })

        yargs.option('f', {
            alias: 'file',
            demand: true,
            default: './_mock.js',
            describe: 'mock template',
            // type: 'string'
        })

        // 默认参数
        yargs.alias('f', 'file')
            .alias('p', 'port')

        return yargs.argv
    },
    // 监听mock模板文件的变化，并自动重启
    listenFile() {
        let file = this.file
        let handler = (eventType, filename) => {
            // 重启服务
            if (server.isOpen) {
                server.close()
                setTimeout(() => {
                    this.startServer()
                }, 50)
            }
        }

        fs.watch(file, util.debounce(handler, 200));
    },
    // 启动mock服务器
    startServer() {
        let file = this.file,
            port = this.port

        server.start(file, port);
    },
}

app.init()
