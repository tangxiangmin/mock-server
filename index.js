let path = require('path')
let yargs = require('yargs')
let start = require('./src/server')


yargs.option('p', {
    alias : 'port',
    demand: false,
    default: 7654,
    describe: 'server port',
    type: 'number'
})

yargs.option('f', {
    alias : 'file',
    demand: true,
    default: './_mock.js',
    describe: 'mock template',
    type: 'string'
})

// 默认参数

yargs.alias('f', 'file')
    .alias('p', 'port')

let argv = yargs.argv

let {file, port} = argv

start(path.resolve(file), port);