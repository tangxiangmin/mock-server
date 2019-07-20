/**
 * 2019-07-12 14:35
 */



Mock.mock(/index/, {
    code: 200,
    msg: 'success',
    data: {
        count: 0,
    }
})

Mock.mock(/test/,'POST',function(options){
    console.log(options)
    // return options
})

Mock.mock(/req/, (ctx) => {
    return ctx
    let {uid} = ctx.query
    if (uid) {
        return {
            code: 200,
            msg: 'success',
            data: {
                uid
            }
        }
    } else {
        return {
            code: 401,
            msg: 'no uid',
        }
    }
})

Mock.mock(/\//, {
    code: 200,
    msg: 'index msg',
})
