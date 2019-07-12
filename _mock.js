/**
 * 2019-07-12 14:35
 */

console.log('this is inject mock.js')

Mock.mock(/index/, {
    code: 200,
    msg: 'success',
    data: {
        count: 0,
    }
})
