/**
 * 2018/7/28 下午11:30
 */

export default {
    // 去抖函数
    debounce(cb: Function, delay: number) {
        let timer = null
        return function () {
            clearTimeout(timer)
            let args = arguments,
                context = this

            timer = setTimeout(() => {
                cb.apply(context, args)
            }, delay);
        }
    }
}
