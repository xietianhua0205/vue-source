import { observer } from './observe/index';

export function initState (vm) {
    let ops = vm.$options
    if (ops.props) {
        initProps()
    }
    if (ops.data) {
        initData(vm)
    }
    if (ops.watch) {
        initWatch()
    }
    if (ops.methods) {
        initMethods()
    }
}

function initProps () {
}

function initMethods () {
}

function initData (vm) {
    let data = vm.$options.data
    data = vm._data = typeof data === 'function' ? data.call(vm) : data // 注意改变  this的指向问题
    // data 中的数据进行劫持
    observer(data)
}

function initWatch () {
}
