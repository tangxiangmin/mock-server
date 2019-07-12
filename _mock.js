/**
 * 2019-07-12 14:35
 */

Mock.mock(/\//, {
    code: 200,
    msg: 'index msg',
})

Mock.mock(/index/, {
    code: 200,
    msg: 'success',
    data: {
        count: 0,
    }
})
